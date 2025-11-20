import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import theme from '../theme';

const SKIP_FORWARD = 10000;
const SKIP_BACKWARD = 10000;
const CLIENT_ID = '031e7c3ae27041cc8e930273af160b87';
const CLIENT_SECRET = '181c195a47754e6e88e8ad6e1f7cda6a';

export default function SpotifyWebPlaybackPlayer({ source, title }) {
  const playerRef = useRef(null);
  const deviceIdRef = useRef(null);
  const tokenRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // Initialize SDK once
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    console.log('[WebPlayback] Initializing...');
    initializeSdk();

    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        console.log('[WebPlayback] Disconnecting player...');
        playerRef.current.disconnect().catch(e => console.warn('[WebPlayback] Disconnect failed:', e));
      }
    };
  }, []);

  // Load track when source or player ready changes
  useEffect(() => {
    if (!source || !isReady || !playerRef.current) return;
    console.log('[WebPlayback] Loading track:', source);
    playTrack();
  }, [source, isReady]);

  // Update position while playing
  useEffect(() => {
    if (!isPlaying || !playerRef.current) return;

    const interval = setInterval(() => {
      playerRef.current.getCurrentState().then(state => {
        if (state) {
          setPosition(state.position);
          setDuration(state.duration);
        }
      }).catch(() => {});
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  function initializeSdk() {
    try {
      setError(null);

      // Define callback BEFORE loading SDK
      window.onSpotifyWebPlaybackSDKReady = () => {
        console.log('[WebPlayback] SDK ready callback');
        setupPlayer();
      };

      if (!window.Spotify) {
        console.log('[WebPlayback] Loading SDK...');
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.head.appendChild(script);
      } else {
        console.log('[WebPlayback] SDK already loaded');
        setupPlayer();
      }
    } catch (e) {
      console.error('[WebPlayback] Init error:', e);
      setError('Erro na inicialização');
    }
  }

  async function setupPlayer() {
    try {
      console.log('[WebPlayback] Setting up player...');

      // Get token
      const auth = btoa(CLIENT_ID + ':' + CLIENT_SECRET);
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + auth,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get token: ' + tokenResponse.status);
      }

      const tokenData = await tokenResponse.json();
      tokenRef.current = tokenData.access_token;
      console.log('[WebPlayback] Token obtained');

      // Create player
      const player = new Spotify.Player({
        name: 'Spotify Clone',
        getOAuthToken: callback => {
          console.log('[WebPlayback] OAuth token requested');
          callback(tokenRef.current);
        },
        volume: 0.5,
      });

  // Ready event
      player.addListener('ready', ({ device_id }) => {
        console.log('[WebPlayback] Ready! Device ID:', device_id);
        deviceIdRef.current = device_id;
        playerRef.current = player;
        setIsReady(true);

        // Activate element to allow playback from state transfer
        player.activateElement().catch(e => console.warn('[WebPlayback] Activate failed:', e));
      });

      // Not ready event
      player.addListener('not_ready', ({ device_id }) => {
        console.error('[WebPlayback] Not ready:', device_id);
        setError('Player não está pronto');
      });

      // State changed
      player.addListener('player_state_changed', state => {
        if (state) {
          console.log('[WebPlayback] State changed - paused:', state.paused);
          console.log('[WebPlayback] Duration:', state.duration);
          console.log('[WebPlayback] Position:', state.position);
          
          if (state.track_window && state.track_window.current_track) {
            console.log('[WebPlayback] Track:', state.track_window.current_track.name);
          }
          
          setIsPlaying(!state.paused);
          setPosition(state.position);
          setDuration(state.duration);
        }
      });

      // Errors
      player.addListener('initialization_error', ({ message }) => {
        console.error('[WebPlayback] Init error:', message);
        setError('Inicialização: ' + message);
      });

      player.addListener('authentication_error', ({ message }) => {
        console.error('[WebPlayback] Auth error:', message);
        setError('Autenticação: ' + message);
      });

      player.addListener('account_error', ({ message }) => {
        console.error('[WebPlayback] Account error:', message);
        setError('Premium requerido: ' + message);
      });

      player.addListener('playback_error', ({ message }) => {
        console.error('[WebPlayback] Playback error:', message);
        setError('Reprodução: ' + message);
      });

      player.addListener('autoplay_failed', () => {
        console.warn('[WebPlayback] Autoplay failed - user needs to interact');
        setError('Clique para reproduzir (autoplay bloqueado)');
      });

      // Connect
      console.log('[WebPlayback] Connecting...');
      const success = await player.connect();
      if (success) {
        console.log('[WebPlayback] Player connected!');
      } else {
        console.error('[WebPlayback] Failed to connect');
        setError('Falha ao conectar. Verificar Premium?');
      }
    } catch (e) {
      console.error('[WebPlayback] Setup error:', e);
      setError('Erro: ' + e.message);
    }
  }

  async function playTrack() {
    try {
      if (!source.startsWith('spotify:track:')) {
        setError('URI inválido');
        return;
      }

      console.log('[WebPlayback] Playing:', source);

      const response = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + tokenRef.current,
        },
        body: JSON.stringify({
          device_id: deviceIdRef.current,
          uris: [source],
        }),
      });

      console.log('[WebPlayback] Play response:', response.status);

      if (response.status === 204) {
        console.log('[WebPlayback] Playing!');
        setError(null);
      } else if (response.status === 401) {
        setError('Token expirado');
      } else if (response.status === 403) {
        const data = await response.json();
        setError('Premium ou device inválido');
      } else {
        setError('Erro: ' + response.status);
      }
    } catch (e) {
      console.error('[WebPlayback] Play error:', e);
      setError('Erro ao reproduzir');
    }
  }

  async function toggle() {
    if (!playerRef.current) return;
    try {
      console.log('[WebPlayback] Toggle play/pause');
      // Use togglePlay() if available, otherwise use pause/resume
      if (playerRef.current.togglePlay) {
        await playerRef.current.togglePlay();
      } else if (isPlaying) {
        await playerRef.current.pause();
      } else {
        await playerRef.current.resume();
      }
    } catch (e) {
      console.error('[WebPlayback] Toggle error:', e);
      setError('Erro ao alternar: ' + e.message);
    }
  }

  async function skipForward() {
    if (!playerRef.current) return;
    try {
      console.log('[WebPlayback] Skip to next track');
      await playerRef.current.nextTrack();
    } catch (e) {
      console.warn('[WebPlayback] Next track error:', e);
    }
  }

  async function skipBackward() {
    if (!playerRef.current) return;
    try {
      console.log('[WebPlayback] Skip to previous track');
      await playerRef.current.previousTrack();
    } catch (e) {
      console.warn('[WebPlayback] Previous track error:', e);
    }
  }

  async function getVolumeLevel() {
    if (!playerRef.current) return;
    try {
      const vol = await playerRef.current.getVolume();
      console.log('[WebPlayback] Current volume:', vol);
      setVolume(vol);
    } catch (e) {
      console.warn('[WebPlayback] Get volume error:', e);
    }
  }

  async function setVolumeLevel(newVolume) {
    if (!playerRef.current) return;
    try {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      console.log('[WebPlayback] Setting volume to:', clampedVolume);
      await playerRef.current.setVolume(clampedVolume);
      setVolume(clampedVolume);
    } catch (e) {
      console.warn('[WebPlayback] Set volume error:', e);
    }
  }

  function formatTime(ms) {
    if (!ms) return '0:00';
    const secs = Math.floor(ms / 1000);
    const mins = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${mins}:${sec.toString().padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>🎵 {title}</Text>
        <Text style={styles.time}>
          {formatTime(position)} / {formatTime(duration)}
        </Text>
        {!isReady && <Text style={styles.status}>Conectando...</Text>}
        {error && <Text style={styles.error}>⚠️ {error}</Text>}
      </View>

      {isReady ? (
        <View style={styles.controls}>
          <TouchableOpacity onPress={skipBackward} style={styles.btn}>
            <Text style={styles.btnText}>⏮️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggle} style={styles.playBtn}>
            <Text style={styles.playBtnText}>{isPlaying ? '⏸️' : '▶️'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={skipForward} style={styles.btn}>
            <Text style={styles.btnText}>⏭️</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loadingBtn}>
          <Text style={styles.loadingText}>⟳</Text>
        </View>
      )}
    </View>
  );
}

const { colors } = require('../theme/colors');
const { typography } = require('../theme/typography');
const { spacing } = require('../theme/spacing');
const themeObj = require('../theme').default;

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
  },
  error: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  btn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: themeObj.borderRadius.md,
    minWidth: 45,
    minHeight: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 18,
  },
  playBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: themeObj.borderRadius.md,
    minWidth: 55,
    minHeight: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtnText: {
    fontSize: 20,
  },
  loadingBtn: {
    backgroundColor: colors.disabled,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: themeObj.borderRadius.md,
    minWidth: 55,
    minHeight: 55,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  loadingText: {
    fontSize: 20,
  },
});
