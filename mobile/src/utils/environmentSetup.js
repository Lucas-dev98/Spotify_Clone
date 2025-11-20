/**
 * Environment Setup for Expo
 * 
 * This file loads .env.local variables for Expo/React Native
 * Must be imported at the very beginning of App.js
 */

import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Load environment variables from .env.local
 * Call this at the very start of your app!
 */
export function setupEnvironment() {
  try {
    // Try to read .env.local
    const envPath = join(__dirname, '../../.env.local');
    const envContent = readFileSync(envPath, 'utf8');
    
    // Parse .env format
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      // Skip empty lines and comments
      if (!line.trim() || line.trim().startsWith('#')) {
        continue;
      }
      
      // Parse KEY=VALUE
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      
      // Remove quotes if present
      const cleanValue = value.replace(/^["']|["']$/g, '');
      
      // Set as process.env
      if (key && key.trim()) {
        process.env[key.trim()] = cleanValue;
        console.log(`✅ Loaded env: ${key.trim()}`);
      }
    }
  } catch (error) {
    // If on web/Expo, environment variables might be loaded differently
    console.warn('Note: .env.local might not be readable in Expo environment');
    console.warn('Make sure to set environment variables via Expo configuration');
  }
}

/**
 * Alternative: Use Expo's built-in env support
 * Add to app.json:
 * 
 * {
 *   "expo": {
 *     "extra": {
 *       "SPOTIFY_CLIENT_ID": "your_id",
 *       "SPOTIFY_CLIENT_SECRET": "your_secret"
 *     }
 *   }
 * }
 * 
 * Then access via:
 * import Constants from 'expo-constants';
 * const { SPOTIFY_CLIENT_ID } = Constants.expoConfig?.extra;
 */

export function getExpoConfig() {
  try {
    const Constants = require('expo-constants').default;
    return Constants.expoConfig?.extra || {};
  } catch (error) {
    return {};
  }
}
