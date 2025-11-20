/**
 * Spotify User API
 * Acessar dados pessoais: top tracks, liked songs, playlists, etc
 * 
 * Requer Authorization Code Flow (spotifyUserAuth.js)
 */

import { getUserToken } from './spotifyUserAuth';

const SPOTIFY_API = 'https://api.spotify.com/v1';

/**
 * Fazer requisição autenticada com token do usuário
 */
async function spotifyUserRequest(endpoint, params = {}) {
  try {
    const token = await getUserToken();

    if (!token) {
      throw new Error('User not logged in. Please login first.');
    }

    // Build query string
    const queryString = new URLSearchParams(params).toString();
    const url = `${SPOTIFY_API}${endpoint}${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      // Token expirou, tenta refresh
      throw new Error('Token expired');
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Spotify user API error: ${endpoint}`, error);
    throw error;
  }
}

// ============================================
// USER INFO
// ============================================

/**
 * Obter perfil do usuário
 */
export async function getUserProfile() {
  const data = await spotifyUserRequest('/me');
  return {
    id: data.id,
    name: data.display_name,
    email: data.email,
    image: data.images?.[0]?.url,
    followers: data.followers?.total,
    external_url: data.external_urls?.spotify,
  };
}

// ============================================
// TOP TRACKS & ARTISTS
// ============================================

/**
 * Obter top tracks do usuário
 * 
 * @param {string} timeRange - 'long_term', 'medium_term', 'short_term'
 * @param {number} limit - Quantidade de tracks (máx 50)
 */
export async function getUserTopTracks(timeRange = 'long_term', limit = 20) {
  const data = await spotifyUserRequest('/me/top/tracks', {
    time_range: timeRange,
    limit,
  });

  return data.items.map(track => ({
    id: track.id,
    name: track.name,
    artist: track.artists[0]?.name || 'Unknown Artist',
    artists: track.artists.map(a => a.name),
    image: track.album.images[0]?.url,
    duration: formatDuration(track.duration_ms),
    audio: track.preview_url,
    uri: track.uri,
    album: track.album.name,
    popularity: track.popularity,
  }));
}

/**
 * Obter top artistas do usuário
 */
export async function getUserTopArtists(timeRange = 'long_term', limit = 20) {
  const data = await spotifyUserRequest('/me/top/artists', {
    time_range: timeRange,
    limit,
  });

  return data.items.map(artist => ({
    id: artist.id,
    name: artist.name,
    image: artist.images[0]?.url,
    followers: artist.followers.total,
    popularity: artist.popularity,
    genres: artist.genres,
    uri: artist.uri,
  }));
}

// ============================================
// LIBRARY / LIKED SONGS
// ============================================

/**
 * Obter saved tracks (músicas curtidas)
 */
export async function getUserSavedTracks(limit = 20, offset = 0) {
  const data = await spotifyUserRequest('/me/tracks', {
    limit,
    offset,
  });

  return {
    total: data.total,
    tracks: data.items.map(item => {
      const track = item.track;
      return {
        id: track.id,
        name: track.name,
        artist: track.artists[0]?.name,
        artists: track.artists.map(a => a.name),
        image: track.album.images[0]?.url,
        duration: formatDuration(track.duration_ms),
        audio: track.preview_url,
        uri: track.uri,
        album: track.album.name,
        addedAt: item.added_at,
      };
    }),
  };
}

/**
 * Check if track is saved by user
 */
export async function isTrackSaved(trackIds) {
  // trackIds pode ser string ou array
  const ids = Array.isArray(trackIds) ? trackIds.join(',') : trackIds;
  const data = await spotifyUserRequest('/me/tracks/contains', {
    ids,
  });

  return data;
}

/**
 * Save track para o usuário
 */
export async function saveTrack(trackId) {
  const token = await getUserToken();
  if (!token) throw new Error('User not logged in');

  const response = await fetch(`${SPOTIFY_API}/me/tracks`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ids: [trackId],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save track: ${response.statusText}`);
  }
}

/**
 * Remove saved track
 */
export async function removeTrack(trackId) {
  const token = await getUserToken();
  if (!token) throw new Error('User not logged in');

  const response = await fetch(`${SPOTIFY_API}/me/tracks`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ids: [trackId],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to remove track: ${response.statusText}`);
  }
}

// ============================================
// PLAYLISTS
// ============================================

/**
 * Obter playlists do usuário
 */
export async function getUserPlaylists(limit = 20) {
  const data = await spotifyUserRequest('/me/playlists', {
    limit,
  });

  return data.items.map(playlist => ({
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    image: playlist.images[0]?.url,
    tracks: playlist.tracks.total,
    uri: playlist.uri,
    owner: playlist.owner.display_name,
    public: playlist.public,
  }));
}

/**
 * Obter tracks de uma playlist
 */
export async function getPlaylistTracks(playlistId, limit = 50) {
  const data = await spotifyUserRequest(`/playlists/${playlistId}/tracks`, {
    limit,
  });

  return {
    total: data.total,
    tracks: data.items.map(item => {
      const track = item.track;
      return {
        id: track.id,
        name: track.name,
        artist: track.artists[0]?.name,
        image: track.album.images[0]?.url,
        duration: formatDuration(track.duration_ms),
        audio: track.preview_url,
        uri: track.uri,
      };
    }),
  };
}

// ============================================
// CURRENTLY PLAYING
// ============================================

/**
 * Obter música atualmente tocando
 */
export async function getCurrentlyPlaying() {
  try {
    const data = await spotifyUserRequest('/me/player/currently-playing');

    if (!data.item) {
      return null;
    }

    const track = data.item;
    return {
      id: track.id,
      name: track.name,
      artist: track.artists[0]?.name,
      image: track.album.images[0]?.url,
      duration: formatDuration(track.duration_ms),
      progress: data.progress_ms,
      isPlaying: data.is_playing,
      uri: track.uri,
    };
  } catch (error) {
    console.error('Could not get currently playing:', error);
    return null;
  }
}

/**
 * Obter recent played tracks
 */
export async function getRecentlyPlayed(limit = 20) {
  const data = await spotifyUserRequest('/me/player/recently-played', {
    limit,
  });

  return data.items.map(item => {
    const track = item.track;
    return {
      id: track.id,
      name: track.name,
      artist: track.artists[0]?.name,
      image: track.album.images[0]?.url,
      duration: formatDuration(track.duration_ms),
      audio: track.preview_url,
      playedAt: item.played_at,
      uri: track.uri,
    };
  });
}

// ============================================
// PLAYLIST CREATION & MODIFICATION
// ============================================

/**
 * Criar nova playlist
 */
export async function createPlaylist(name, description = '', isPublic = false) {
  try {
    const token = await getUserToken();
    if (!token) throw new Error('User not logged in');

    // Obter user ID
    const userResponse = await fetch(`${SPOTIFY_API}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const user = await userResponse.json();
    const userId = user.id;

    // Criar playlist
    const playlistResponse = await fetch(
      `${SPOTIFY_API}/users/${userId}/playlists`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          public: isPublic,
        }),
      }
    );

    if (!playlistResponse.ok) {
      throw new Error(`Failed to create playlist: ${playlistResponse.statusText}`);
    }

    const playlist = await playlistResponse.json();

    return {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      image: playlist.images[0]?.url,
      uri: playlist.uri,
      url: playlist.external_urls?.spotify,
    };
  } catch (error) {
    console.error('Create playlist failed:', error);
    throw error;
  }
}

/**
 * Adicionar tracks à playlist
 * 
 * @param {string} playlistId - ID da playlist
 * @param {array|string} trackUris - URI(s) de track (ex: 'spotify:track:xxx' ou array)
 */
export async function addTracksToPlaylist(playlistId, trackUris) {
  try {
    const token = await getUserToken();
    if (!token) throw new Error('User not logged in');

    // Converter para array se for string
    const uris = Array.isArray(trackUris) ? trackUris : [trackUris];

    // Spotify tem limite de 100 tracks por request
    const chunks = [];
    for (let i = 0; i < uris.length; i += 100) {
      chunks.push(uris.slice(i, i + 100));
    }

    // Adicionar cada chunk
    for (const chunk of chunks) {
      const response = await fetch(
        `${SPOTIFY_API}/playlists/${playlistId}/tracks`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uris: chunk,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add tracks: ${response.statusText}`);
      }
    }

    return { success: true, tracksAdded: uris.length };
  } catch (error) {
    console.error('Add tracks to playlist failed:', error);
    throw error;
  }
}

/**
 * Remover tracks de playlist
 */
export async function removeTracksFromPlaylist(playlistId, trackUris) {
  try {
    const token = await getUserToken();
    if (!token) throw new Error('User not logged in');

    const uris = Array.isArray(trackUris) ? trackUris : [trackUris];

    const response = await fetch(
      `${SPOTIFY_API}/playlists/${playlistId}/tracks`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to remove tracks: ${response.statusText}`);
    }

    return { success: true, tracksRemoved: uris.length };
  } catch (error) {
    console.error('Remove tracks from playlist failed:', error);
    throw error;
  }
}

/**
 * Renomear playlist
 */
export async function updatePlaylist(playlistId, name, description = null, isPublic = null) {
  try {
    const token = await getUserToken();
    if (!token) throw new Error('User not logged in');

    const body = { name };
    if (description !== null) body.description = description;
    if (isPublic !== null) body.public = isPublic;

    const response = await fetch(
      `${SPOTIFY_API}/playlists/${playlistId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update playlist: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Update playlist failed:', error);
    throw error;
  }
}

/**
 * Deletar playlist
 */
export async function deletePlaylist(playlistId) {
  try {
    const token = await getUserToken();
    if (!token) throw new Error('User not logged in');

    const response = await fetch(
      `${SPOTIFY_API}/playlists/${playlistId}/followers`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete playlist: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Delete playlist failed:', error);
    throw error;
  }
}

// ============================================
// PLAYBACK CONTROL
// ============================================

/**
 * Pausar playback
 */
export async function pausePlayback() {
  const token = await getUserToken();
  if (!token) throw new Error('User not logged in');

  const response = await fetch(`${SPOTIFY_API}/me/player/pause`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok && response.status !== 204) {
    throw new Error('Failed to pause playback');
  }
}

/**
 * Tocar música
 */
export async function playTrack(uri) {
  const token = await getUserToken();
  if (!token) throw new Error('User not logged in');

  const response = await fetch(`${SPOTIFY_API}/me/player/play`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uris: [uri],
    }),
  });

  if (!response.ok && response.status !== 204) {
    throw new Error('Failed to play track');
  }
}

/**
 * Skip para próxima música
 */
export async function skipToNext() {
  const token = await getUserToken();
  if (!token) throw new Error('User not logged in');

  const response = await fetch(`${SPOTIFY_API}/me/player/next`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok && response.status !== 204) {
    throw new Error('Failed to skip');
  }
}

// ============================================
// UTILITIES
// ============================================

/**
 * Formatar duração de ms para MM:SS
 */
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export { getUserToken } from './spotifyUserAuth';
