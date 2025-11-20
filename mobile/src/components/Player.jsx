import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
// Only import Audio for native platforms
const Audio = Platform.OS !== 'web' ? require('expo-audio').Audio : null;

export default function Player({ source, title }) {
  const sound = useRef(null);
  const audioElement = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // On web, use HTML5 audio
    if (Platform.OS === 'web') {
      setupWebAudio();
    } else {
      load();
    }

    return () => {
      if (Platform.OS === 'web') {
        if (audioElement.current) {
          audioElement.current.pause();
          audioElement.current = null;
        }
      } else {
        unload();
      }
    };
  }, [source]);

  // Update progress
  useEffect(() => {
    if (!isPlaying) return;

    if (Platform.OS === 'web' && audioElement.current) {
      const interval = setInterval(() => {
        setPosition(audioElement.current.currentTime * 1000);
      }, 500);
      return () => clearInterval(interval);
    } else if (sound.current) {
      const interval = setInterval(async () => {
        try {
          const status = await sound.current.getStatusAsync();
          setPosition(status.positionMillis);
        } catch (e) {}
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  function setupWebAudio() {
    try {
      setIsLoading(true);
      setError(null);

      if (!source) {
        console.warn('[Player] No source provided');
        setError('Nenhuma URL de áudio disponível');
        setIsLoading(false);
        return;
      }

      console.log('[Player Web] Loading audio from:', source);

      // Handle different source types
      if (source.startsWith('spotify:')) {
        // Spotify URI - can't play without Web Playback SDK
        console.warn('[Player] Spotify URI requires Spotify app or Premium subscription');
        setError('Abra no Spotify para ouvir');
        setIsLoading(false);
        return;
      }

      // Use native HTML5 Audio API for HTTP/HTTPS URLs
      const audio = typeof window !== 'undefined' ? new window.Audio() : new (require('react-native').Audio)();
      audio.crossOrigin = 'anonymous';
      audio.src = source;

      audio.onloadedmetadata = () => {
        console.log('[Player Web] Audio loaded. Duration:', audio.duration);
        setDuration(audio.duration * 1000);
        setIsLoading(false);
        setError(null);
      };

      audio.onplay = () => {
        console.log('[Player Web] Playing');
        setIsPlaying(true);
      };
      
      audio.onpause = () => {
        console.log('[Player Web] Paused');
        setIsPlaying(false);
      };
      
      audio.onended = () => {
        console.log('[Player Web] Ended');
        setIsPlaying(false);
      };

      audio.onerror = (e) => {
        console.error('[Player Web] Audio error:', audio.error, e);
        if (audio.error && audio.error.code === 4) {
          setError('Formato não suportado ou URL inválida');
        } else {
          setError('Erro ao carregar áudio');
        }
        setIsLoading(false);
      };

      audioElement.current = audio;
    } catch (e) {
      console.error('[Player Web] Error:', e);
      setError('Erro ao carregar áudio');
      setIsLoading(false);
    }
  }

  async function load() {
    try {
      setIsLoading(true);
      setError(null);
      
      if (sound.current) {
        await sound.current.unloadAsync();
        sound.current = null;
      }
      
      if (!source) {
        console.warn('[Player] No source provided');
        setError('Nenhuma URL de áudio disponível');
        setIsLoading(false);
        return;
      }

      console.log('[Player] Loading audio from:', source);
      console.log('[Player] Source type:', typeof source);
      console.log('[Player] Source is valid URL:', typeof source === 'string' && source.startsWith('http'));
      
      const { sound: s } = await Audio.Sound.createAsync(
        { uri: source },
        { shouldPlay: false }
      );
      
      sound.current = s;
      const status = await sound.current.getStatusAsync();
      console.log('[Player] Audio loaded successfully. Duration:', status.durationMillis);
      setDuration(status.durationMillis || 0);
      setError(null);
      setIsLoading(false);
    } catch (e) {
      console.error('[Player] Failed to load sound:', e);
      console.error('[Player] Error message:', e.message);
      console.error('[Player] Error details:', e.toString());
      setError('Erro ao carregar áudio: ' + e.message);
      setIsLoading(false);
    }
  }

  async function unload() {
    try {
      if (sound.current) {
        await sound.current.stopAsync();
        await sound.current.unloadAsync();
        sound.current = null;
        setIsPlaying(false);
        setPosition(0);
      }
    } catch (e) {}
  }

  async function toggle() {
    if (Platform.OS === 'web') {
      if (!audioElement.current) {
        setupWebAudio();
        return;
      }

      try {
        if (audioElement.current.paused) {
          await audioElement.current.play();
          setIsPlaying(true);
        } else {
          audioElement.current.pause();
          setIsPlaying(false);
        }
      } catch (e) {
        console.warn('[Player Web] Error toggling play:', e.message);
        setError('Erro ao reproduzir');
      }
    } else {
      if (!sound.current) {
        await load();
        return;
      }

      try {
        if (isPlaying) {
          await sound.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.current.playAsync();
          setIsPlaying(true);
        }
      } catch (e) {
        console.warn('[Player] Error toggling play:', e.message);
        setError('Erro ao reproduzir');
      }
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
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.time}>
          {formatTime(position)} / {formatTime(duration)}
        </Text>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
      
      {source && source.startsWith('spotify:') ? (
        <TouchableOpacity 
          onPress={() => {
            const trackId = source.replace('spotify:track:', '');
            if (typeof window !== 'undefined') {
              window.open(`https://open.spotify.com/track/${trackId}`, '_blank');
            }
          }}
          style={[styles.button, styles.spotifyButton]}
        >
          <Text style={styles.buttonText}>🎵 Abrir</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          onPress={toggle} 
          style={[styles.button, (isLoading || !audioElement.current) && styles.buttonDisabled]}
          disabled={isLoading || !audioElement.current}
        >
          <Text style={styles.buttonText}>
            {isLoading ? '⟳' : isPlaying ? '⏸️' : '▶️'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const theme = require('../theme').default;
const { colors } = require('../theme/colors');
const { typography } = require('../theme/typography');
const { spacing } = require('../theme/spacing');

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
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: theme.borderRadius.md,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotifyButton: {
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },
  buttonText: {
    ...typography.label,
    color: colors.text.primary,
    fontSize: 16,
  },
  error: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: spacing.xs,
  },
});