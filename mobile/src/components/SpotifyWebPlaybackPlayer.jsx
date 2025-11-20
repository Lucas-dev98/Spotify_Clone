import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import theme from '../theme';

// Skip constants (in milliseconds)
const SKIP_FORWARD = 10000;  // 10 seconds
const SKIP_BACKWARD = 10000; // 10 seconds

/**
 * SpotifyWebPlaybackPlayer
 * Uses Spotify Web Playback SDK for full track playback
 * Requires: Spotify Premium OR Spotify app installed + URI format
 */
export default function SpotifyWebPlaybackPlayer({ source, title }) {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const positionIntervalRef = useRef(null);

  // Log when source changes
  useEffect(() => {
    console.log('[SpotifyWebPlayback] Source changed:', source);
  }, [source]);

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    
    initializeSpotifyPlayer();
    
    return () => {
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
      }
    };
  }, []);

  // Load track when source changes
  useEffect(() => {
    if (!source || !playerRef.current || !isReady) return;
    
    loadTrack();
  }, [source, isReady]);

  // Update position
  useEffect(() => {
    if (!isPlaying) return;

    positionIntervalRef.current = setInterval(() => {
      if (playerRef.current) {
        playerRef.current.getCurrentState().then(state => {
          if (state) {
            setPosition(state.position);
            setDuration(state.duration);
          }
        });
      }
    }, 500);

    return () => {
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
      }
    };
  }, [isPlaying]);

  async function initializeSpotifyPlayer() {
    try {
      setError(null);
      
      // Check if Web Playback SDK is available
      if (!window.Spotify) {
        console.log('[SpotifyWebPlayback] Loading Spotify Web Playback SDK...');
        
        // Load SDK script
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.onload = setupPlayer;
        document.head.appendChild(script);
      } else {
        setupPlayer();
      }
    } catch (e) {
      console.error('[SpotifyWebPlayback] Init error:', e);
      setError('Erro ao inicializar player');
    }
  }

  function setupPlayer() {
    try {
      window.onSpotifyWebPlaybackSDKReady = () => {
        console.log('[SpotifyWebPlayback] SDK ready, initializing player...');
        
        // Get access token from Spotify API
        fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa('031e7c3ae27041cc8e930273af160b87:181c195a47754e6e88e8ad6e1f7cda6a'),
          },
          body: 'grant_type=client_credentials',
        })
          .then(response => response.json())
          .then(data => {
            const token = data.access_token;
            
            const player = new Spotify.Player({
              name: 'Spotify Clone Player',
              getOAuthToken: callback => callback(token),
              volume: 0.5,
            });

            // Player ready
            player.addListener('player_state_changed', state => {
              console.log('[SpotifyWebPlayback] State changed:', state);
              if (state) {
                setIsPlaying(!state.paused);
                setPosition(state.position);
                setDuration(state.duration);

                if (state.paused && state.position === state.duration) {
                  console.log('[SpotifyWebPlayback] Track ended');
                }
              }
            });

            player.addListener('initialization_error', ({ message }) => {
              console.error('[SpotifyWebPlayback] Init error:', message);
              setError(message);
            });

            player.addListener('authentication_error', ({ message }) => {
              console.error('[SpotifyWebPlayback] Auth error:', message);
              setError('Erro de autenticação: ' + message);
            });

            player.addListener('account_error', ({ message }) => {
              console.error('[SpotifyWebPlayback] Account error:', message);
              setError('Erro de conta: ' + message);
            });

            player.addListener('playback_error', ({ message }) => {
              console.error('[SpotifyWebPlayback] Playback error:', message);
              setError('Erro de reprodução: ' + message);
            });

            // Connect and store reference
            player.connect().then(success => {
              if (success) {
                console.log('[SpotifyWebPlayback] Player connected!');
                playerRef.current = player;
                setIsReady(true);
              } else {
                console.error('[SpotifyWebPlayback] Failed to connect player');
                setError('Falha ao conectar player. Verifique Premium ou Spotify App');
              }
            });
          })
          .catch(e => {
            console.error('[SpotifyWebPlayback] Token error:', e);
            setError('Erro ao obter token');
          });
      };
    } catch (e) {
      console.error('[SpotifyWebPlayback] Setup error:', e);
      setError('Erro ao configurar player');
    }
  }

  async function loadTrack() {
    try {
      if (!source.startsWith('spotify:track:')) {
        setError('URI inválido. Deve ser: spotify:track:xxxxx');
        return;
      }

      console.log('[SpotifyWebPlayback] Loading track:', source);
      
      // Get current player token
      playerRef.current.getCurrentState().then(async state => {
        if (state) {
          // Play track
          const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${state.token}`,
            },
            body: JSON.stringify({
              uris: [source],
              position_ms: 0,
            }),
          });

          if (response.ok) {
            console.log('[SpotifyWebPlayback] Track loaded and playing');
            setIsPlaying(true);
            setError(null);
          } else {
            const errorData = await response.json();
            console.error('[SpotifyWebPlayback] Play error:', errorData);
            setError('Erro ao reproduzir: ' + errorData.error.message);
          }
        }
      });
    } catch (e) {
      console.error('[SpotifyWebPlayback] Load error:', e);
      setError('Erro ao carregar música');
    }
  }

  async function toggle() {
    if (!playerRef.current) {
      setError('Player não está pronto');
      return;
    }

    try {
      if (isPlaying) {
        await playerRef.current.pause();
      } else {
        await playerRef.current.resume();
      }
    } catch (e) {
      console.error('[SpotifyWebPlayback] Toggle error:', e);
      setError('Erro ao alternar reprodução');
    }
  }

  async function skipForward() {
    if (!playerRef.current) return;
    
    try {
      const state = await playerRef.current.getCurrentState();
      if (state) {
        const newPosition = Math.min(state.position + SKIP_FORWARD, state.duration);
        await playerRef.current.seek(newPosition);
        setPosition(newPosition);
      }
    } catch (e) {
      console.warn('[SpotifyWebPlayback] Skip forward error:', e);
    }
  }

  async function skipBackward() {
    if (!playerRef.current) return;
    
    try {
      const state = await playerRef.current.getCurrentState();
      if (state) {
        const newPosition = Math.max(state.position - SKIP_BACKWARD, 0);
        await playerRef.current.seek(newPosition);
        setPosition(newPosition);
      }
    } catch (e) {
      console.warn('[SpotifyWebPlayback] Skip backward error:', e);
    }
  }

  function formatTime(ms) {
    if (!ms) return '0:00';
    const secs = Math.floor(ms / 1000);
    const mins = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${mins}:${seconds.toString().padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      {/* Info Section */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          🎵 {title || 'Spotify Playback'}
        </Text>
        <Text style={styles.time}>
          {formatTime(position)} / {formatTime(duration)}
        </Text>
        {!isReady && (
          <Text style={styles.status}>Conectando ao Spotify...</Text>
        )}
        {error && (
          <Text style={styles.error}>⚠️ {error}</Text>
        )}
      </View>

      {/* Controls */}
      {isReady ? (
        <View style={styles.controlsContainer}>
          {/* Skip Backward */}
          <TouchableOpacity
            onPress={skipBackward}
            style={[styles.controlButton]}
          >
            <Text style={styles.controlButtonText}>⏮️</Text>
          </TouchableOpacity>

          {/* Play/Pause */}
          <TouchableOpacity
            onPress={toggle}
            style={[styles.playButton]}
          >
            <Text style={styles.playButtonText}>
              {isPlaying ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>

          {/* Skip Forward */}
          <TouchableOpacity
            onPress={skipForward}
            style={[styles.controlButton]}
          >
            <Text style={styles.controlButtonText}>⏭️</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loadingButton}>
          <Text style={styles.loadingText}>⟳</Text>
        </View>
      )}
    </View>
  );
}

const { colors } = require('../theme/colors');
const { typography } = require('../theme/typography');
const { spacing } = require('../theme/spacing');
const theme_imported = require('../theme').default;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surfaceLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  
  info: {
    flex: 1,
    marginRight: spacing.lg,
  },
  
  title: {
    ...typography.bodyMedium,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  
  time: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  
  status: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  
  error: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: spacing.xs,
  },

  // Controls
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  controlButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: theme_imported.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 45,
    minHeight: 45,
  },

  controlButtonText: {
    fontSize: 18,
  },

  playButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: theme_imported.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 55,
    minHeight: 55,
  },

  playButtonText: {
    fontSize: 20,
  },

  loadingButton: {
    backgroundColor: colors.disabled,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: theme_imported.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 55,
    minHeight: 55,
    opacity: 0.6,
  },

  loadingText: {
    fontSize: 20,
  },
});
