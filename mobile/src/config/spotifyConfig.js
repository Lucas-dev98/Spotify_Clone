/**
 * Spotify Configuration
 * 
 * Set your Spotify Developer credentials here:
 * 1. Go to https://developer.spotify.com/dashboard
 * 2. Create an app
 * 3. Copy your Client ID and Client Secret
 * 4. Update app.json with your credentials in the "extra" section
 */

import Constants from 'expo-constants';

// Get credentials from Expo config
const expoConfig = Constants.expoConfig?.extra || {};

// Fallback credentials (from your app.json)
const FALLBACK_CLIENT_ID = '031e7c3ae27041cc8e930273af160b87';
const FALLBACK_CLIENT_SECRET = '181c195a47754e6e88e8ad6e1f7cda6a';

export const SPOTIFY_CONFIG = {
  // Get from app.json extra section, with fallback
  clientId: expoConfig.SPOTIFY_CLIENT_ID || process.env.REACT_APP_SPOTIFY_CLIENT_ID || FALLBACK_CLIENT_ID,
  clientSecret: expoConfig.SPOTIFY_CLIENT_SECRET || process.env.REACT_APP_SPOTIFY_CLIENT_SECRET || FALLBACK_CLIENT_SECRET,
};

/**
 * Get credentials from various sources:
 * 1. app.json (extra section) - Recommended for Expo
 * 2. Environment variables (.env file)
 * 3. Hardcoded values in this file (not recommended)
 * 4. Runtime configuration
 */
export function getSpotifyConfig() {
  const config = {
    clientId: SPOTIFY_CONFIG.clientId,
    clientSecret: SPOTIFY_CONFIG.clientSecret,
  };

  // Validate
  if (!config.clientId || config.clientId === 'your_client_id_here') {
    throw new Error(
      'Spotify Client ID not configured. ' +
      'Update app.json extra.SPOTIFY_CLIENT_ID or ' +
      'set REACT_APP_SPOTIFY_CLIENT_ID environment variable'
    );
  }

  if (!config.clientSecret || config.clientSecret === 'your_client_secret_here') {
    throw new Error(
      'Spotify Client Secret not configured. ' +
      'Update app.json extra.SPOTIFY_CLIENT_SECRET or ' +
      'set REACT_APP_SPOTIFY_CLIENT_SECRET environment variable'
    );
  }

  return config;
}

export default SPOTIFY_CONFIG;
