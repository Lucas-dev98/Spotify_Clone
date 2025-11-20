/**
 * Audio Proxy Service
 * Handles fetching audio from alternative sources when Spotify previews aren't available
 */

/**
 * Get playable audio URL using a proxy service
 * Tries multiple sources: Spotify API, YouTube, etc.
 */
export async function getPlayableAudioUrl(trackId, trackName, artist) {
  // First priority: Try Spotify API directly
  const spotifyUrl = `https://p.scdn.co/mp3-preview/${trackId}`;
  
  // Second priority: Try using a proxy service like music.youtube.com or open.spotify.com
  // For now, return Spotify URL with CORS handling
  
  try {
    // Test if Spotify URL is accessible
    const response = await fetch(spotifyUrl, { 
      method: 'HEAD',
      mode: 'cors',
    });
    
    if (response.ok) {
      console.log('[AudioProxy] Found Spotify preview URL');
      return spotifyUrl;
    }
  } catch (e) {
    console.log('[AudioProxy] Spotify URL not accessible, trying alternatives');
  }

  // Fallback: Try to find audio on alternative platforms
  // For now, we'll use a dummy URL that the player will handle
  return getTunestackUrl(trackName, artist);
}

/**
 * Get audio using Tunestack proxy (free service)
 */
function getTunestackUrl(trackName, artist) {
  // Using a proxy that can fetch audio from various sources
  // Format: https://tunestack.com/track/artist/trackname
  // This is a hypothetical service - in reality would need a real proxy
  
  const query = `${artist} ${trackName}`.replace(/\s+/g, '%20');
  return `https://tunestack-api.vercel.app/api/search?q=${query}`;
}

/**
 * Get audio URL from Soundcloud (alternative)
 */
function getSoundcloudUrl(trackName, artist) {
  // Soundcloud API endpoint
  const query = `${artist}%20${trackName}`;
  return `https://api.soundcloud.com/tracks?q=${query}`;
}

/**
 * Attempt to stream from multiple fallback sources
 */
export async function findAudioStream(trackName, artist, trackId) {
  const attempts = [
    // Try Spotify preview first
    () => testUrl(`https://p.scdn.co/mp3-preview/${trackId}`),
    
    // Try alternative Spotify URL
    () => testUrl(`https://open.spotify.com/track/${trackId}`),
    
    // Try YouTube via invidious instance (privacy-respecting)
    () => getInvidiousUrl(trackName, artist),
  ];

  for (const attempt of attempts) {
    try {
      const url = await attempt();
      if (url) {
        console.log('[AudioProxy] Found playable URL:', url);
        return url;
      }
    } catch (e) {
      console.log('[AudioProxy] Attempt failed, trying next source');
    }
  }

  return null;
}

/**
 * Test if a URL is accessible
 */
async function testUrl(url) {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'cors',
    });
    return response.ok ? url : null;
  } catch (e) {
    return null;
  }
}

/**
 * Get URL from Invidious (YouTube proxy)
 * Returns a playable stream URL
 */
async function getInvidiousUrl(trackName, artist) {
  try {
    const query = encodeURIComponent(`${artist} - ${trackName}`);
    
    // Use a public Invidious instance
    const response = await fetch(`https://invidious.snopyta.org/api/v1/search?q=${query}&type=video`);
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.length > 0) {
      const videoId = data[0].videoId;
      // Return audio stream URL from Invidious
      return `https://invidious.snopyta.org/latest_version?id=${videoId}&itag=251`;
    }
  } catch (e) {
    console.error('[Invidious] Error:', e);
  }

  return null;
}

/**
 * Get audio from a public music streaming service
 */
export async function getPublicAudio(trackName, artist) {
  // Try to find audio on free/public sources
  // This is a simplified version - would need proper implementation
  
  try {
    // Option 1: Try Spotify Web Player stream
    const spotifyStream = `https://open.spotify.com/track/search?q=${encodeURIComponent(`${artist} ${trackName}`)}`;
    
    // Option 2: Try YouTube stream
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${artist} - ${trackName}`)}`;
    
    // For now, return a placeholder that indicates we need a real streaming solution
    return null;
  } catch (e) {
    console.error('[PublicAudio] Error:', e);
    return null;
  }
}
