/**
 * Spotify Web API - Authorization Code Flow
 * Para acessar dados pessoais do usuário (top tracks, liked songs, etc)
 * 
 * Fluxo:
 * 1. User clica "Login com Spotify"
 * 2. Redireciona para Spotify (autoriza app)
 * 3. Spotify redireciona com authorization code
 * 4. Trocamos code por access token
 * 5. Usamos token para acessar dados pessoais
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID || 'your_client_id_here';
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI || 'com.spotifyapp://callback';
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-library-read',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
];

let userToken = null;
let tokenExpiresAt = null;

/**
 * Construir URL de autorização do Spotify
 */
export function getAuthorizationUrl() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(' '),
    state: Math.random().toString(36).substring(7), // Para segurança CSRF
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/**
 * Fazer login com Spotify (web)
 * Usado em SPA/Web
 */
export async function loginWithSpotifyWeb() {
  try {
    const authUrl = getAuthorizationUrl();
    const result = await WebBrowser.openBrowserAsync(authUrl);

    if (result.type === 'success') {
      const url = result.url;
      // Extrair code da URL
      const code = new URL(url).searchParams.get('code');
      if (code) {
        return await exchangeCodeForToken(code);
      }
    }
    throw new Error('Login cancelled');
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

/**
 * Fazer login com Spotify (React Native usando Expo AuthSession)
 * Mais seguro para mobile
 */
export async function loginWithSpotifyMobile() {
  try {
    // Configurar OAuth
    const redirectUrl = AuthSession.getRedirectUrl();
    console.log('[SpotifyAuth] Redirect URL:', redirectUrl);

    const discovery = {
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      tokenEndpoint: 'https://accounts.spotify.com/api/token',
    };

    const result = await AuthSession.startAsync({
      discovery,
      clientId: CLIENT_ID,
      // Sem clientSecret para web/mobile (inseguro)
      scopes: SCOPES,
      redirectUrl,
    });

    if (result.type === 'success') {
      userToken = result.params.access_token;
      const expiresIn = result.params.expires_in || 3600;
      tokenExpiresAt = Date.now() + expiresIn * 1000;

      // Salvar em secure storage
      await saveToken(userToken, expiresIn);
      console.log('[SpotifyAuth] Mobile login successful');
      return userToken;
    } else if (result.type === 'error') {
      throw new Error(`Auth error: ${result.params?.error}`);
    } else {
      throw new Error('Auth cancelled');
    }
  } catch (error) {
    console.error('[SpotifyAuth] Mobile login failed:', error);
    throw error;
  }
}

/**
 * Trocar authorization code por access token
 * WEB ONLY - Não use client_secret na web (é inseguro)
 * Para produção, use um backend proxy
 */
async function exchangeCodeForToken(code) {
  try {
    console.log('[SpotifyAuth] Exchanging code for token...');
    
    // Na web, NÃO enviamos secret (evita exposição)
    // Use um backend para isso em produção
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        // NÃO incluir client_secret aqui para web
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[SpotifyAuth] Token exchange failed:', error);
      throw new Error(`Token exchange failed: ${error.error_description || response.statusText}`);
    }

    const data = await response.json();
    console.log('[SpotifyAuth] Token obtained successfully');
    userToken = data.access_token;
    const expiresIn = data.expires_in || 3600;
    tokenExpiresAt = Date.now() + expiresIn * 1000;

    // Salvar token
    await saveToken(userToken, expiresIn, data.refresh_token);

    return userToken;
  } catch (error) {
    console.error('[SpotifyAuth] Code exchange failed:', error);
    throw error;
  }
}

/**
 * Refresh token quando expirar
 * WEB ONLY - Sem client_secret (inseguro na web)
 */
export async function refreshUserToken() {
  try {
    console.log('[SpotifyAuth] Refreshing token...');
    const refreshToken = await AsyncStorage.getItem('spotify_refresh_token');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
        // Sem client_secret para web
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[SpotifyAuth] Refresh failed:', error);
      throw new Error(`Token refresh failed: ${error.error_description || response.statusText}`);
    }

    const data = await response.json();
    console.log('[SpotifyAuth] Token refreshed successfully');
    userToken = data.access_token;
    const expiresIn = data.expires_in || 3600;
    tokenExpiresAt = Date.now() + expiresIn * 1000;

    // Salvar novo token
    await saveToken(userToken, expiresIn, refreshToken);

    return userToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Se refresh falhar, logout
    await logoutSpotify();
    throw error;
  }
}

/**
 * Obter token válido (refresha se necessário)
 */
export async function getUserToken() {
  // Se temos token em cache e ainda é válido
  if (userToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return userToken;
  }

  // Tentar carregar do storage
  const saved = await AsyncStorage.getItem('spotify_user_token');
  if (saved) {
    userToken = saved;
    const expiresAt = await AsyncStorage.getItem('spotify_token_expires_at');
    if (expiresAt) {
      tokenExpiresAt = parseInt(expiresAt);
    }

    // Se ainda válido
    if (tokenExpiresAt && Date.now() < tokenExpiresAt) {
      return userToken;
    }

    // Se expirado, tentar refresh
    try {
      return await refreshUserToken();
    } catch (error) {
      console.warn('Could not refresh token:', error);
      return null;
    }
  }

  return null;
}

/**
 * Salvar token securely
 */
async function saveToken(token, expiresIn, refreshToken = null) {
  try {
    // Em mobile, usar SecureStore (mais seguro)
    // Em web, usar AsyncStorage (funciona em tudo)
    if (SecureStore.isAvailableAsync) {
      await SecureStore.setItemAsync('spotify_user_token', token);
      if (refreshToken) {
        await SecureStore.setItemAsync('spotify_refresh_token', refreshToken);
      }
    } else {
      await AsyncStorage.setItem('spotify_user_token', token);
      if (refreshToken) {
        await AsyncStorage.setItem('spotify_refresh_token', refreshToken);
      }
    }

    const expiresAt = Date.now() + expiresIn * 1000;
    await AsyncStorage.setItem('spotify_token_expires_at', expiresAt.toString());

    console.log('Token saved successfully');
  } catch (error) {
    console.error('Failed to save token:', error);
  }
}

/**
 * Fazer logout
 */
export async function logoutSpotify() {
  try {
    userToken = null;
    tokenExpiresAt = null;

    // Limpar storage
    if (SecureStore.isAvailableAsync) {
      try {
        await SecureStore.deleteItemAsync('spotify_user_token');
        await SecureStore.deleteItemAsync('spotify_refresh_token');
      } catch (e) {
        // SecureStore pode não estar disponível em web
      }
    }

    await AsyncStorage.removeItem('spotify_user_token');
    await AsyncStorage.removeItem('spotify_refresh_token');
    await AsyncStorage.removeItem('spotify_token_expires_at');

    console.log('Logout successful');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

/**
 * Verificar se usuário está logado
 */
export async function isUserLoggedIn() {
  const token = await getUserToken();
  return !!token;
}

/**
 * Obter user info
 */
export async function getCurrentUser() {
  try {
    const token = await getUserToken();
    if (!token) {
      throw new Error('User not logged in');
    }

    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get user info failed:', error);
    throw error;
  }
}

/**
 * Get OAuth token for Web Playback SDK
 * Wrapper para o Web Playback Player obter token válido
 */
export async function getOAuthTokenForWebPlayback() {
  return await getUserToken();
}
