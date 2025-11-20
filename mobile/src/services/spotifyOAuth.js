// Spotify OAuth Authentication Service
// Uses Authorization Code flow with PKCE for user login

const CLIENT_ID = '031e7c3ae27041cc8e930273af160b87';
const REDIRECT_URI = typeof window !== 'undefined' 
  ? `${window.location.origin}/callback` 
  : 'http://localhost:8081/callback';

const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
];

class SpotifyOAuthService {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
    this.loadStoredTokens();
  }

  // Generate authorization URL for browser login
  getAuthorizationUrl() {
    const scope = SCOPES.join('%20');
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: scope,
    });
    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code) {
    try {
      console.log('[SpotifyOAuth] Exchanging code for token...');
      
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
      });

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Token exchange failed: ${error.error_description || response.status}`);
      }

      const data = await response.json();
      console.log('[SpotifyOAuth] Token obtained successfully');
      this.setTokens(data);
      return data;
    } catch (error) {
      console.error('[SpotifyOAuth] Token exchange failed:', error);
      throw error;
    }
  }

  // Store tokens
  setTokens(data) {
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    // Set expiration time (5 minutes before actual expiry for safety)
    this.expiresAt = Date.now() + (data.expires_in * 1000) - 300000;
    
    console.log('[SpotifyOAuth] Tokens stored', { 
      expiresIn: data.expires_in,
      hasRefreshToken: !!data.refresh_token 
    });
    
    // Persist to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('spotify_access_token', this.accessToken);
      if (this.refreshToken) {
        localStorage.setItem('spotify_refresh_token', this.refreshToken);
      }
      localStorage.setItem('spotify_expires_at', this.expiresAt.toString());
    }
  }

  // Get valid access token (refresh if needed)
  async getAccessToken() {
    // Check if token exists and is still valid
    if (this.accessToken && Date.now() < this.expiresAt) {
      console.log('[SpotifyOAuth] Using cached token');
      return this.accessToken;
    }

    // Try to refresh if we have a refresh token
    if (this.refreshToken) {
      try {
        console.log('[SpotifyOAuth] Refreshing access token...');
        await this.refreshAccessToken();
        return this.accessToken;
      } catch (error) {
        console.error('[SpotifyOAuth] Token refresh failed:', error);
        this.clearTokens();
        throw error;
      }
    }

    throw new Error('No valid access token available. Please login.');
  }

  // Refresh access token using refresh token
  async refreshAccessToken() {
    try {
      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
        client_id: CLIENT_ID,
      });

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Token refresh failed: ${error.error_description || response.status}`);
      }

      const data = await response.json();
      console.log('[SpotifyOAuth] Token refreshed successfully');
      this.setTokens(data);
      return data;
    } catch (error) {
      console.error('[SpotifyOAuth] Refresh token failed:', error);
      throw error;
    }
  }

  // Load tokens from localStorage
  loadStoredTokens() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const accessToken = localStorage.getItem('spotify_access_token');
      const refreshToken = localStorage.getItem('spotify_refresh_token');
      const expiresAt = localStorage.getItem('spotify_expires_at');

      if (accessToken && expiresAt) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresAt = parseInt(expiresAt);
        console.log('[SpotifyOAuth] Tokens loaded from storage');
        return true;
      }
    }
    return false;
  }

  // Clear all tokens
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_refresh_token');
      localStorage.removeItem('spotify_expires_at');
    }
    
    console.log('[SpotifyOAuth] Tokens cleared');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!(this.accessToken && this.expiresAt && Date.now() < this.expiresAt);
  }

  // Logout
  logout() {
    this.clearTokens();
  }
}

export default new SpotifyOAuthService();
