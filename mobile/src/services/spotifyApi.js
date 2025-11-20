/**
 * Spotify Web API Service
 * Provides methods to search and fetch data from Spotify
 */

import { getSpotifyAccessToken } from './spotifyAuth';
import { getPlayablePreviewUrl } from './audioSource';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

/**
 * Make authenticated request to Spotify API
 */
async function spotifyRequest(endpoint, params = {}) {
  try {
    const token = await getSpotifyAccessToken();
    
    // Build query string
    const queryString = new URLSearchParams(params).toString();
    const url = `${SPOTIFY_API_BASE}${endpoint}${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Spotify API request failed: ${endpoint}`, error);
    throw error;
  }
}

/**
 * Search for tracks
 */
export async function searchTracks(query, limit = 20) {
  if (!query || query.trim() === '') {
    throw new Error('Search query cannot be empty');
  }

  try {
    const data = await spotifyRequest('/search', {
      q: query,
      type: 'track',
      limit: 50,
      market: 'US',
    });

    // Map all tracks and try to find audio from alternative sources
    let tracks = data.tracks.items.map(track => {
      // Use preview_url if available, otherwise will try to fetch from alternative source
      return {
        id: track.id,
        name: track.name,
        artist: track.artists[0]?.name || 'Unknown Artist',
        image: track.album.images[0]?.url || null,
        duration: formatDuration(track.duration_ms),
        audio: track.preview_url || null, // Will be fetched asynchronously if null
        album: track.album.name,
        uri: track.uri,
        previewUrl: track.preview_url || null,
      };
    });
    
    const withPreview = tracks.filter(t => t.audio).length;
    console.log(`[searchTracks] Query: "${query}" - Found ${tracks.length} total, ${withPreview} with Spotify preview URLs`);

    // Fetch missing audio from alternative sources in parallel
    const audioPromises = tracks.map(async (track, index) => {
      if (!track.audio) {
        try {
          const url = await getPlayablePreviewUrl(track.name, track.artist, track.id);
          if (url) {
            tracks[index].audio = url;
            tracks[index].previewUrl = url;
            console.log(`[searchTracks] Found alternative audio for: ${track.name}`);
          }
        } catch (e) {
          console.log('[searchTracks] Could not find alternative audio for:', track.name);
        }
      }
      return tracks[index];
    });

    // Wait for all audio fetches to complete before returning
    await Promise.allSettled(audioPromises);
    return tracks.slice(0, limit);
  } catch (e) {
    console.error('[searchTracks] Error:', e);
    throw e;
  }
}

/**
 * Get featured playlists
 */
export async function getFeaturedPlaylists(limit = 10) {
  const data = await spotifyRequest('/browse/featured-playlists', { limit });
  return data.playlists.items.map(playlist => ({
    id: playlist.id,
    name: playlist.name,
    image: playlist.images[0]?.url || null,
    description: playlist.description,
    uri: playlist.uri,
    tracks: playlist.tracks.total,
  }));
}

/**
 * Get new releases
 */
export async function getNewReleases(limit = 20) {
  const data = await spotifyRequest('/browse/new-releases', { limit });
  return data.albums.items.map(album => ({
    id: album.artists[0]?.id || null, // Artist ID, not album ID
    name: album.name,
    artist: album.artists[0]?.name || 'Unknown Artist',
    image: album.images[0]?.url || null,
    uri: album.uri,
    releaseDate: album.release_date,
    albumId: album.id,
  }));
}

/**
 * Get top tracks
 */
export async function getTopTracks(limit = 20) {
  const data = await spotifyRequest('/browse/featured-playlists', { limit });
  // This endpoint returns playlists, we'll fetch tracks from a popular playlist
  
  // Fallback: search for popular tracks
  return searchTracks('top tracks', limit);
}

/**
 * Get tracks from a playlist
 */
export async function getPlaylistTracks(playlistId, limit = 50) {
  const data = await spotifyRequest(`/playlists/${playlistId}/tracks`, { limit });
  
  return data.items
    .map(item => {
      const track = item.track;
      if (!track) return null;
      const previewUrl = track.preview_url || getAlternativePreviewUrl(track.id, track.name, track.artists[0]?.name);
      return {
        id: track.id,
        name: track.name,
        artist: track.artists[0]?.name || 'Unknown Artist',
        image: track.album.images[0]?.url || null,
        duration: formatDuration(track.duration_ms),
        audio: previewUrl,
        uri: track.uri,
        previewUrl: previewUrl,
      };
    })
    .filter(t => t !== null);
}

/**
 * Get artist info
 */
export async function getArtist(artistId) {
  const data = await spotifyRequest(`/artists/${artistId}`);
  return {
    id: data.id,
    name: data.name,
    image: data.images[0]?.url || null,
    followers: data.followers.total,
    popularity: data.popularity,
    uri: data.uri,
  };
}

/**
 * Get artist's top tracks
 */
export async function getArtistTopTracks(artistId, limit = 20) {
  try {
    const data = await spotifyRequest(`/artists/${artistId}/top-tracks`, {
      market: 'US',
      limit: Math.max(limit, 50),
    });

    // Map ALL tracks and try to find audio from alternative sources
    const tracks = data.tracks.map(track => {
      return {
        id: track.id,
        name: track.name,
        artist: track.artists[0]?.name || 'Unknown Artist',
        image: track.album.images[0]?.url || null,
        duration: formatDuration(track.duration_ms),
        audio: track.preview_url || null, // Will be fetched asynchronously if null
        uri: track.uri,
        previewUrl: track.preview_url || null,
      };
    });

    const withPreview = tracks.filter(t => t.audio).length;
    console.log(`[getArtistTopTracks] Artist: ${artistId} - Found ${tracks.length} total, ${withPreview} with preview`);

    // Fetch missing audio from alternative sources in parallel
    const audioPromises = tracks.map(async (track, index) => {
      if (!track.audio) {
        try {
          const url = await getPlayablePreviewUrl(track.name, track.artist, track.id);
          if (url) {
            tracks[index].audio = url;
            tracks[index].previewUrl = url;
            console.log(`[getArtistTopTracks] Found alternative audio for: ${track.name}`);
          }
        } catch (e) {
          console.log('[getArtistTopTracks] Could not find alternative audio for:', track.name);
        }
      }
      return tracks[index];
    });

    // Wait for all audio fetches to complete before returning
    await Promise.allSettled(audioPromises);
    return tracks.slice(0, limit);
  } catch (e) {
    console.error('[getArtistTopTracks] Error:', e);
    throw e;
  }
}

/**
 * Format duration from milliseconds to MM:SS
 */
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Convert Spotify preview URL to downloadable format if needed
 */
export function getAudioUrl(previewUrl) {
  // Spotify preview URLs are direct MP3 URLs, can be used with expo-audio

  return previewUrl;
}

/**
 * Get alternative preview URL when Spotify doesn't provide one
 * Returns a Spotify Web URL for the track
 */
// Removed - now using audioSource.js for alternative sources


/**
 * Get playlist info (name, description, images, owner, track count)
 */
export async function getPlaylistInfo(playlistId) {
  if (!playlistId) {
    throw new Error('Playlist ID is required');
  }

  const data = await spotifyRequest(`/playlists/${playlistId}`);
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    images: data.images,
    owner: data.owner,
    tracks: data.tracks,
    external_urls: data.external_urls,
    uri: data.uri,
    url: data.external_urls?.spotify,
  };
}

