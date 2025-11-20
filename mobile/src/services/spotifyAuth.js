/**
 * Spotify Web API Authentication Service
 * Uses Client Credentials flow for server-to-server auth
 */

import { getSpotifyConfig } from '../config/spotifyConfig';

let accessToken = null;
let tokenExpiresAt = null;

let CLIENT_ID = '';
let CLIENT_SECRET = '';

// Initialize credentials
function initCredentials() {
  const config = getSpotifyConfig();
  CLIENT_ID = config.clientId;
  CLIENT_SECRET = config.clientSecret;
}

/**
 * Get a valid access token, refreshing if needed
 */
export async function getSpotifyAccessToken() {
  initCredentials();

  // Validate credentials
  if (!CLIENT_ID || CLIENT_ID === 'your_client_id_here') {
    throw new Error('Spotify Client ID not configured. Please set REACT_APP_SPOTIFY_CLIENT_ID.');
  }
  if (!CLIENT_SECRET || CLIENT_SECRET === 'your_client_secret_here') {
    throw new Error('Spotify Client Secret not configured. Please set REACT_APP_SPOTIFY_CLIENT_SECRET.');
  }

  // Return cached token if still valid
  if (accessToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Spotify auth failed: ${response.statusText}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 min before expiry

    console.log('Spotify token obtained:', accessToken.substring(0, 10) + '...');
    return accessToken;
  } catch (error) {
    console.error('Failed to get Spotify access token:', error);
    throw error;
  }
}

/**
 * Set custom credentials (useful for testing or manual config)
 */
export function setSpotifyCredentials(clientId, clientSecret) {
  CLIENT_ID = clientId;
  CLIENT_SECRET = clientSecret;
  accessToken = null;
  tokenExpiresAt = null;
}
