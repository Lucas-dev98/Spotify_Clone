/**
 * Audio Source Service
 * Provides alternative audio sources when Spotify previews aren't available
 */

/**
 * Try to find playable audio from various sources
 */
export async function findAudioUrl(trackName, artist, trackId) {
  // Try different strategies in order of preference
  
  // 1. Try YouTube via a public API
  const youtubeUrl = await tryYouTubeAudio(trackName, artist);
  if (youtubeUrl) return youtubeUrl;
  
  // 2. Try Deezer API
  const deezerUrl = await tryDeezerAudio(trackName, artist);
  if (deezerUrl) return deezerUrl;
  
  // 3. Try Last.fm or other services
  // Would be added here
  
  return null;
}

/**
 * Get audio from YouTube using YouTube Data API alternative
 * Uses a proxy service to fetch video info
 */
async function tryYouTubeAudio(trackName, artist) {
  try {
    const query = encodeURIComponent(`${artist} ${trackName}`);
    
    // Try using a YouTube proxy that provides audio streams
    // Using yt-dlp compatible endpoint
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/results?search_query=${query}&format=json`,
      { mode: 'cors' }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('[YouTube] Found video:', data);
      // This endpoint doesn't give us stream URL, need alternative approach
    }
  } catch (e) {
    console.log('[YouTube] Search failed:', e.message);
  }
  
  return null;
}

/**
 * Get audio from Deezer API via backend proxy (handles CORS)
 */
async function tryDeezerAudio(trackName, artist) {
  try {
    const query = encodeURIComponent(`${artist} ${trackName}`);
    
    // Call backend proxy instead of Deezer directly
    // This bypasses CORS restrictions
    const proxyUrl = `http://localhost:3000/api/audio?q=${query}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`[Deezer] No preview found for: ${trackName}`);
        return null;
      }
      throw new Error(`Proxy returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.url) {
      console.log('[Deezer] Found preview:', data.title, 'by', data.artist);
      return data.url;
    }
  } catch (e) {
    console.log('[Deezer] Search failed:', e.message);
  }
  
  return null;
}

/**
 * Get audio using a music recognition/streaming aggregator
 */
export async function getUniversalAudio(trackName, artist, trackId) {
  // Try multiple services in parallel for faster response
  const promises = [
    tryDeezerAudio(trackName, artist),
    // Add more services here
  ];
  
  const results = await Promise.allSettled(promises);
  
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      return result.value;
    }
  }
  
  return null;
}

/**
 * Get a working preview URL from any available source
 */
export async function getPlayablePreviewUrl(trackName, artist, trackId) {
  console.log(`[AudioSource] Finding audio for: ${artist} - ${trackName}`);
  
  try {
    // First try to find from alternative services
    const audioUrl = await findAudioUrl(trackName, artist, trackId);
    
    if (audioUrl) {
      console.log('[AudioSource] Found playable URL:', audioUrl);
      return audioUrl;
    }
  } catch (e) {
    console.error('[AudioSource] Error finding audio:', e);
  }
  
  return null;
}
