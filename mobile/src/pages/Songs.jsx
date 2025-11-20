import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import Header from '../components/Header';
import SongItem from '../components/SongItem';
import SkeletonLoader from '../components/SkeletonLoader';
import { searchTracks } from '../services/spotifyApi';
import theme from '../theme';

export default function Songs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSpotifySongs();
  }, []);

  async function loadSpotifySongs() {
    try {
      setLoading(true);
      setError(null);
      console.log('[Songs] Fetching popular songs from Spotify...');

      // Search for popular tracks
      const tracks = await searchTracks('top tracks', 50);
      console.log('[Songs] Loaded', tracks.length, 'songs from Spotify');
      setSongs(tracks);
    } catch (e) {
      console.warn('[Songs] Error loading songs:', e.message);
      setError(e.message);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Header title="Músicas" />
        <View style={{ padding: theme.spacing.md }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={{ marginBottom: theme.spacing.md }}>
              <SkeletonLoader width="100%" height={80} borderRadius={theme.spacing.sm} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Músicas" />
      {error && (
        <View style={{ 
          backgroundColor: theme.colors.error, 
          padding: theme.spacing.md,
          margin: theme.spacing.md,
          borderRadius: theme.spacing.sm,
        }}>
          <Text style={{ 
            color: theme.colors.surface,
            fontSize: theme.typography.body.fontSize,
            fontWeight: theme.typography.body.fontWeight,
          }}>
            ⚠️ Erro: {error}
          </Text>
        </View>
      )}
      {songs.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ 
            fontSize: theme.typography.body.fontSize,
            color: theme.colors.textSecondary,
          }}>
            Nenhuma música encontrada
          </Text>
        </View>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item, index }) => <SongItem {...item} index={index} />}
          contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
        />
      )}
    </View>
  );
}
