/**
 * Login Component - Spotify Authorization
 * Permite usuário fazer login com Spotify para acessar dados pessoais
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { loginWithSpotifyWeb, loginWithSpotifyMobile, logoutSpotify, isUserLoggedIn, getCurrentUser } from '../services/spotifyUserAuth';
import { getUserProfile } from '../services/spotifyUserApi';

export default function SpotifyLogin({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Verificar se já está logado ao montar
  React.useEffect(() => {
    checkLoginStatus();
  }, []);

  async function checkLoginStatus() {
    try {
      const loggedIn = await isUserLoggedIn();
      if (loggedIn) {
        const profile = await getUserProfile();
        setUser(profile);
      }
    } catch (err) {
      console.error('Check login status failed:', err);
    }
  }

  async function handleLogin() {
    setLoading(true);
    setError(null);
    try {
      // Detectar plataforma
      let token;
      if (typeof window !== 'undefined') {
        // Web
        token = await loginWithSpotifyWeb();
      } else {
        // Mobile (React Native)
        token = await loginWithSpotifyMobile();
      }

      if (token) {
        // Obter perfil do usuário
        const profile = await getUserProfile();
        setUser(profile);

        // Callback para notificar app
        if (onLoginSuccess) {
          onLoginSuccess(profile);
        }
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await logoutSpotify();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout failed:', err);
      setError(err.message);
    }
  }

  // Se não está logado, mostrar botão de login
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>🎵 Spotify</Text>
          <Text style={styles.subtitle}>Faça login para acessar:</Text>
          <View style={styles.features}>
            <Text style={styles.feature}>✓ Suas top tracks</Text>
            <Text style={styles.feature}>✓ Artistas favoritos</Text>
            <Text style={styles.feature}>✓ Músicas curtidas</Text>
            <Text style={styles.feature}>✓ Suas playlists</Text>
            <Text style={styles.feature}>✓ Recentemente tocadas</Text>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>❌ {error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>🎧 Login com Spotify</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.hint}>
            Você será redirecionado para autorizar o acesso
          </Text>
        </View>
      </View>
    );
  }

  // Se está logado, mostrar perfil
  return (
    <ScrollView contentContainerStyle={styles.profileContainer}>
      <View style={styles.profileCard}>
        <Text style={styles.profileTitle}>👤 Perfil do Spotify</Text>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.name || 'Usuário'}</Text>
          {user.email && <Text style={styles.profileEmail}>{user.email}</Text>}
          {user.followers !== undefined && (
            <Text style={styles.profileFollowers}>
              👥 {user.followers.toLocaleString()} seguidores
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 16,
  },
  card: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#b3b3b3',
    marginBottom: 20,
  },
  features: {
    width: '100%',
    backgroundColor: '#1db954',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  feature: {
    color: '#fff',
    fontSize: 14,
    marginVertical: 6,
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: '#e22134',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: '#1db954',
  },
  logoutButton: {
    backgroundColor: '#e22134',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    color: '#b3b3b3',
    textAlign: 'center',
  },
  profileContainer: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  profileInfo: {
    width: '100%',
    backgroundColor: '#1db954',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 14,
    color: '#e8e8e8',
    marginBottom: 8,
  },
  profileFollowers: {
    fontSize: 14,
    color: '#e8e8e8',
  },
});
