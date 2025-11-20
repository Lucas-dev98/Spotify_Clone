import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Player from '../components/Player';
import SpotifyWebPlaybackPlayer from '../components/SpotifyWebPlaybackPlayer';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function Song({ route }) {
  const { song } = route.params ?? {};
  const { userToken } = useAuth();

  // Debug logging
  React.useEffect(() => {
    console.log('[Song] Loaded with:', {
      name: song?.name,
      hasUri: !!song?.uri,
      uri: song?.uri,
      hasAudio: !!song?.audio,
      audio: song?.audio,
    });
  }, [song]);

  if (!song) {
    return (
      <View style={styles.container}>
        <Header title="Música" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Música não encontrada</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={song.name} subtitle={song.artist} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {song.image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: song.image }} style={styles.image} />
          </View>
        )}
        
        <View style={styles.content}>
          <Text style={styles.title}>{song.name}</Text>
          <Text style={styles.artist}>{song.artist}</Text>
          <Text style={styles.duration}>{song.duration}</Text>

          {song.audio || song.previewUrl ? (
            <View style={styles.playerContainer}>
              {song.uri && song.uri.startsWith('spotify:track:') ? (
                // Use Spotify Web Playback for full track
                <SpotifyWebPlaybackPlayer 
                  source={song.uri} 
                  title={song.name}
                  userToken={userToken}
                />
              ) : (
                // Fallback to HTTP audio (Deezer preview)
                <Player source={song.audio || song.previewUrl} title={song.name} />
              )}
            </View>
          ) : (
            <View style={styles.noAudioContainer}>
              <Text style={styles.noAudioEmoji}>🎵</Text>
              <Text style={styles.noAudioText}>Áudio não disponível</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
  },
  imageContainer: {
    width: '100%',
    height: 320,
    backgroundColor: colors.surfaceLight,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  title: {
    ...typography.display,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  artist: {
    ...typography.bodyLarge,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  duration: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    marginBottom: spacing.xl,
  },
  playerContainer: {
    marginTop: spacing.lg,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  noAudioContainer: {
    marginTop: spacing.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
  },
  noAudioEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  noAudioText: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
