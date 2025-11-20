import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import theme from '../theme';
import { getOAuthTokenForWebPlayback, refreshUserToken } from '../services/spotifyUserAuth';

const CLIENT_ID = '031e7c3ae27041cc8e930273af160b87';

export default function SpotifyWebPlaybackPlayer({ source, title, userToken }) {
  const playerRef = useRef(null);
  const deviceIdRef = useRef(null);
  const tokenRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isSeeking, setIsSeeking] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [disallows, setDisallows] = useState({});
  const [isAd, setIsAd] = useState(false);
  const [nextTracks, setNextTracks] = useState([]);
  const [errorType, setErrorType] = useState(null); // 'init', 'auth', 'account', 'playback'
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef(null);

  // Initialize SDK once
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    log('info', 'Initializing SDK...');
    initializeSdk();

    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        log('info', 'Disconnecting player');
        playerRef.current.disconnect().catch(e => log('warn', 'Disconnect failed', e));
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
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
        if (state && !isSeeking) {
          setPosition(state.position);
          setDuration(state.duration);
          setRepeatMode(state.repeat_mode || 0);
          setShuffle(state.shuffle || false);
        }
      }).catch(() => {});
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, isSeeking]);

  // Structured logging
  function log(level, message, data = null) {
    const timestamp = new Date().toLocaleTimeString();
    const context = data ? ` - ${JSON.stringify(data)}` : '';
    console.log(`[${timestamp}] [WebPlayback/${level.toUpperCase()}] ${message}${context}`);
  }

  // Handle SDK errors with user-friendly messages
  function handleError(type, message, data) {
    let userMessage = message;
    let shouldRetry = false;
    
    switch (type) {
      case 'initialization_error':
        setErrorType('init');
        userMessage = '❌ Navegador não suporta reprodução. Tente outro navegador (Chrome, Firefox, Safari).';
        log('error', 'Initialization failed', { message, data });
        break;
        
      case 'authentication_error':
        setErrorType('auth');
        userMessage = '🔐 Erro de autenticação. Tente fazer login novamente.';
        shouldRetry = retryCount < 3;
        log('error', 'Authentication failed', { message, data, retryCount });
        break;
        
      case 'account_error':
        setErrorType('account');
        userMessage = '🎵 Spotify Premium requerido. Faça upgrade para reproduzir músicas completas.';
        log('error', 'Premium account required', { message, data });
        break;
        
      case 'playback_error':
        setErrorType('playback');
        userMessage = '⚠️ Erro ao reproduzir. Tente outra música.';
        shouldRetry = retryCount < 2;
        log('error', 'Playback failed', { message, data, retryCount });
        break;
        
      case 'not_ready':
        userMessage = '📡 Sem conexão com o player. Verifique sua conexão.';
        log('warn', 'Player not ready', { message, data });
        break;
        
      case 'autoplay_failed':
        userMessage = '▶️ Clique no botão play para começar (navegador bloqueou autoplay).';
        log('warn', 'Autoplay blocked by browser', data);
        break;
        
      default:
        log('error', `Unknown error: ${type}`, { message, data });
    }
    
    setError(userMessage);
    
    // Retry logic
    if (shouldRetry) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      log('info', `Retrying in ${delay}ms`, { attempt: retryCount + 1 });
      
      retryTimeoutRef.current = setTimeout(() => {
        setRetryCount(retryCount + 1);
        if (type === 'authentication_error') {
          setupPlayer();
        } else if (type === 'playback_error') {
          playTrack();
        }
      }, delay);
    }
  }

  function initializeSdk() {
    try {
      setError(null);
      setErrorType(null);
      setRetryCount(0);

      // Define callback BEFORE loading SDK
      window.onSpotifyWebPlaybackSDKReady = () => {
        log('info', 'SDK ready callback triggered');
        setupPlayer();
      };

      if (!window.Spotify) {
        log('info', 'Loading SDK script');
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.head.appendChild(script);
      } else {
        log('info', 'SDK already loaded, setting up player');
        setupPlayer();
      }
    } catch (e) {
      log('error', 'Initialization failed', { message: e.message });
      handleError('initialization_error', e.message, e);
    }
  }

  async function setupPlayer() {
    try {
      log('info', 'Setting up player');

      // Use user's OAuth token (required for Web Playback SDK)
      if (!userToken) {
        throw new Error('User token not available. Please login first.');
      }

      tokenRef.current = userToken;
      log('info', 'Using user OAuth token for Web Playback SDK');

      // Create player with getOAuthToken callback
      const player = new Spotify.Player({
        name: 'Spotify Clone',
        getOAuthToken: async (callback) => {
          log('debug', 'OAuth token requested by SDK');
          try {
            // Try to get a fresh token
            const freshToken = await refreshUserToken();
            if (freshToken) {
              tokenRef.current = freshToken;
              callback(freshToken);
            } else {
              callback(tokenRef.current);
            }
          } catch (e) {
            log('warn', 'Token refresh failed, using cached token', { message: e.message });
            callback(tokenRef.current);
          }
        },
        volume: 0.5,
      });

      // Ready event
      player.addListener('ready', ({ device_id }) => {
        log('success', 'Player ready!', { device_id });
        deviceIdRef.current = device_id;
        playerRef.current = player;
        setIsReady(true);

        // Activate element to allow playback from state transfer
        player.activateElement().catch(e => log('warn', 'Activate failed', e));
      });

      // Not ready event
      player.addListener('not_ready', ({ device_id }) => {
        log('warn', 'Player not ready', { device_id });
        setError('Player não está pronto');
      });

      // State changed
      player.addListener('player_state_changed', state => {
        if (state) {
          console.log('[WebPlayback] State changed - paused:', state.paused);
          console.log('[WebPlayback] Duration:', state.duration);
          console.log('[WebPlayback] Position:', state.position);
          console.log('[WebPlayback] Disallows:', state.disallows);
          
          if (state.track_window && state.track_window.current_track) {
            const track = state.track_window.current_track;
            console.log('[WebPlayback] Track:', track.name);
            console.log('[WebPlayback] Type:', track.type); // "track", "episode", "ad"
            setIsAd(track.type === 'ad');
            setNextTracks(state.track_window.next_tracks || []);
          }
          
          setIsPlaying(!state.paused);
          setPosition(state.position);
          setDuration(state.duration);
          setRepeatMode(state.repeat_mode || 0);
          setShuffle(state.shuffle || false);
          setDisallows(state.disallows || {});
        }
      });

      // Errors
      player.addListener('initialization_error', ({ message }) => {
        handleError('initialization_error', message);
      });

      player.addListener('authentication_error', ({ message }) => {
        handleError('authentication_error', message);
      });

      player.addListener('account_error', ({ message }) => {
        handleError('account_error', message);
      });

      player.addListener('playback_error', ({ message }) => {
        handleError('playback_error', message);
      });

      player.addListener('not_ready', ({ device_id }) => {
        handleError('not_ready', 'Device not ready', { device_id });
      });

      player.addListener('autoplay_failed', () => {
        handleError('autoplay_failed', 'Autoplay blocked');
      });

      // Connect
      log('info', 'Connecting player');
      const success = await player.connect();
      if (success) {
        log('success', 'Player connected');
      } else {
        handleError('connection_failed', 'Failed to connect to Spotify', { attempted: 'connection' });
      }
    } catch (e) {
      log('error', 'Setup failed', { message: e.message, stack: e.stack });
      handleError('setup_error', 'Setup error: ' + e.message, e);
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

      log('debug', 'Play API response', { status: response.status });

      if (response.status === 204) {
        log('success', 'Track started playing');
        setError(null);
      } else if (response.status === 401) {
        handleError('playback_error', 'Token expirado - tente recarregar', { status: 401 });
      } else if (response.status === 403) {
        const data = await response.json();
        handleError('playback_error', 'Device ou Premium inválido', { status: 403, data });
      } else {
        handleError('playback_error', `API error ${response.status}`, { status: response.status });
      }
    } catch (e) {
      log('error', 'Play request failed', { message: e.message });
      handleError('playback_error', e.message, e);
    }
  }

  async function toggle() {
    if (!playerRef.current) return;
    try {
      log('debug', 'Toggle play/pause');
      // Use togglePlay() if available, otherwise use pause/resume
      if (playerRef.current.togglePlay) {
        await playerRef.current.togglePlay();
      } else if (isPlaying) {
        await playerRef.current.pause();
      } else {
        await playerRef.current.resume();
      }
    } catch (e) {
      log('error', 'Toggle failed', { message: e.message });
      handleError('playback_error', 'Erro ao alternar: ' + e.message, e);
    }
  }

  async function skipForward() {
    if (!playerRef.current) return;
    try {
      log('debug', 'Skip to next track');
      await playerRef.current.nextTrack();
    } catch (e) {
      log('warn', 'Next track failed', { message: e.message });
    }
  }

  async function skipBackward() {
    if (!playerRef.current) return;
    try {
      log('debug', 'Skip to previous track');
      await playerRef.current.previousTrack();
    } catch (e) {
      log('warn', 'Previous track failed', { message: e.message });
    }
  }

  async function getVolumeLevel() {
    if (!playerRef.current) return;
    try {
      const vol = await playerRef.current.getVolume();
      log('debug', 'Current volume fetched', { volume: vol });
      setVolume(vol);
    } catch (e) {
      log('warn', 'Get volume failed', { message: e.message });
    }
  }

  async function setVolumeLevel(newVolume) {
    if (!playerRef.current) return;
    try {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      log('debug', 'Setting volume', { volume: clampedVolume });
      await playerRef.current.setVolume(clampedVolume);
      setVolume(clampedVolume);
    } catch (e) {
      console.warn('[WebPlayback] Set volume error:', e);
    }
  }

  async function seek(positionMs) {
    if (!playerRef.current) return;
    try {
      const clampedPosition = Math.max(0, Math.min(positionMs, duration));
      log('debug', 'Seeking', { position: clampedPosition, duration });
      await playerRef.current.seek(clampedPosition);
      setPosition(clampedPosition);
    } catch (e) {
      log('warn', 'Seek failed', { message: e.message });
    }
  }

  async function toggleRepeat() {
    try {
      // repeatMode: 0 -> off, 1 -> context, 2 -> track
      const nextMode = (repeatMode + 1) % 3;
      const repeatValue = nextMode === 0 ? 'off' : nextMode === 1 ? 'context' : 'track';
      
      log('debug', 'Toggle repeat', { nextMode, repeatValue });
      
      const response = await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${repeatValue}&device_id=${deviceIdRef.current}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + tokenRef.current,
        },
      });
      
      if (!response.ok) {
        log('warn', 'Repeat toggle failed', { status: response.status });
      } else {
        log('success', 'Repeat mode changed', { repeatValue });
      }
    } catch (e) {
      log('warn', 'Toggle repeat failed', { message: e.message });
    }
  }

  async function toggleShuffle() {
    try {
      const newShuffle = !shuffle;
      log('debug', 'Toggle shuffle', { newShuffle });
      
      const response = await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${newShuffle}&device_id=${deviceIdRef.current}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + tokenRef.current,
        },
      });
      
      if (!response.ok) {
        log('warn', 'Shuffle toggle failed', { status: response.status });
      } else {
        log('success', 'Shuffle mode changed', { shuffle: newShuffle });
      }
    } catch (e) {
      log('warn', 'Toggle shuffle failed', { message: e.message });
    }
  }

  function formatTime(ms) {
    if (!ms) return '0:00';
    const secs = Math.floor(ms / 1000);
    const mins = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${mins}:${sec.toString().padStart(2, '0')}`;
  }

  function getRepeatIcon() {
    switch (repeatMode) {
      case 0: return '🔁';  // Off
      case 1: return '🔁';  // Context repeat
      case 2: return '🔂';  // Track repeat
      default: return '🔁';
    }
  }

  // Next tracks queue component
  function renderQueue() {
    if (!nextTracks || nextTracks.length === 0) return null;
    
    return (
      <View style={styles.queueContainer}>
        <Text style={styles.queueTitle}>Próximas</Text>
        {nextTracks.slice(0, 3).map((track, index) => (
          <View key={index} style={styles.queueItem}>
            <Text style={styles.queueItemNumber}>{index + 1}</Text>
            <View style={styles.queueItemInfo}>
              <Text style={styles.queueItemName} numberOfLines={1}>
                {track.name}
              </Text>
              <Text style={styles.queueItemArtist} numberOfLines={1}>
                {track.artists?.[0]?.name || 'Desconhecido'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  }

  // Volume bar component (simple steps 0-10)
  function renderVolumeBar() {
    const volumeSteps = 10;
    const currentStep = Math.round(volume * volumeSteps);
    
    return (
      <View style={styles.volumeContainer}>
        <Text style={styles.volumeIcon}>🔊</Text>
        <View style={styles.volumeBar}>
          {Array.from({ length: volumeSteps }).map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setVolumeLevel((index + 1) / volumeSteps)}
              style={[
                styles.volumeStep,
                index < currentStep && styles.volumeStepActive,
              ]}
            />
          ))}
        </View>
        <Text style={styles.volumePercent}>{Math.round(volume * 100)}%</Text>
      </View>
    );
  }

  // Progress bar component
  function renderProgressBar() {
    const progressPercent = duration ? (position / duration) * 100 : 0;
    
    return (
      <View style={styles.progressContainer}>
        <Text style={styles.timeLabel}>{formatTime(position)}</Text>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progressPercent}%` }
            ]} 
          />
          <TouchableOpacity
            onPress={(e) => {
              const touchX = e.nativeEvent.locationX;
              const barWidth = 200; // approximate
              const newPosition = (touchX / barWidth) * duration;
              handleSeekEnd(newPosition);
            }}
            style={styles.progressBarTouchable}
          />
        </View>
        
        <Text style={styles.timeLabel}>{formatTime(duration)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>🎵 {title}</Text>
        {!isReady && <Text style={styles.status}>Conectando...</Text>}
        {error && <Text style={styles.error}>⚠️ {error}</Text>}
      </View>

      {isReady && duration > 0 && renderProgressBar()}
      
      {isReady ? (
        <ScrollView style={styles.playerContent}>
          <View style={styles.controls}>
            <TouchableOpacity 
              onPress={skipBackward} 
              style={[styles.btn, disallows.skipping_prev && styles.btnDisabled]}
              disabled={disallows.skipping_prev}
            >
              <Text style={styles.btnText}>⏮️</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={toggle} 
              style={[styles.playBtn, isAd && styles.btnDisabled]}
              disabled={isAd}
            >
              <Text style={styles.playBtnText}>{isPlaying ? '⏸️' : '▶️'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={skipForward} 
              style={[styles.btn, disallows.skipping_next && styles.btnDisabled]}
              disabled={disallows.skipping_next}
            >
              <Text style={styles.btnText}>⏭️</Text>
            </TouchableOpacity>
          </View>
          
          {renderVolumeBar()}
          
          <View style={styles.extras}>
            <TouchableOpacity 
              style={[styles.extraBtn, shuffle && styles.extraBtnActive]}
              onPress={toggleShuffle}
            >
              <Text style={styles.extraBtnText}>🔀</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.extraBtn, repeatMode > 0 && styles.extraBtnActive]}
              onPress={toggleRepeat}
            >
              <Text style={styles.extraBtnText}>{getRepeatIcon()}</Text>
            </TouchableOpacity>
          </View>
          
          {isAd && (
            <View style={styles.adContainer}>
              <Text style={styles.adText}>📢 Anúncio em reprodução</Text>
            </View>
          )}
          
          {renderQueue()}
        </ScrollView>
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
    gap: spacing.md,
    maxHeight: 500,
  },
  playerContent: {
    gap: spacing.md,
  },
  info: {
    gap: spacing.xs,
  },
  title: {
    ...typography.bodyMedium,
    fontWeight: '600',
    color: colors.text.primary,
  },
  status: {
    ...typography.bodySmall,
    color: colors.primary,
  },
  error: {
    ...typography.bodySmall,
    color: colors.error,
  },
  
  // Progress bar
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginVertical: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressBarTouchable: {
    position: 'absolute',
    width: '100%',
    height: 24,
    top: -10,
  },
  timeLabel: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    minWidth: 40,
    textAlign: 'center',
  },
  
  // Volume bar
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: themeObj.borderRadius.sm,
  },
  volumeIcon: {
    fontSize: 16,
    minWidth: 24,
  },
  volumeBar: {
    flex: 1,
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  volumeStep: {
    flex: 1,
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 1.5,
  },
  volumeStepActive: {
    backgroundColor: colors.primary,
  },
  volumePercent: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    minWidth: 35,
    textAlign: 'right',
  },
  
  // Controls
  controls: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
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
  btnDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.5,
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
  
  // Extras (shuffle, repeat)
  extras: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  extraBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: themeObj.borderRadius.sm,
    backgroundColor: colors.surface,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraBtnActive: {
    backgroundColor: colors.primary,
  },
  extraBtnText: {
    fontSize: 16,
  },
  
  // Ad indicator
  adContainer: {
    backgroundColor: colors.error,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: themeObj.borderRadius.sm,
    alignItems: 'center',
  },
  adText: {
    ...typography.bodySmall,
    color: colors.text.onDark,
    fontWeight: '600',
  },
  
  // Queue
  queueContainer: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  queueTitle: {
    ...typography.bodyMedium,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  queueItemNumber: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    minWidth: 24,
    textAlign: 'center',
  },
  queueItemInfo: {
    flex: 1,
  },
  queueItemName: {
    ...typography.bodySmall,
    color: colors.text.primary,
    fontWeight: '500',
  },
  queueItemArtist: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    fontSize: 12,
  },
  
  // Loading
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
