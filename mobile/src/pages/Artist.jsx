import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, FlatList, StyleSheet } from 'react-native';
import Header from '../components/Header';
import SongItem from '../components/SongItem';
import SkeletonLoader from '../components/SkeletonLoader';
import { getArtistTopTracks, searchTracks } from '../services/spotifyApi';
import { songsArray as localSongs } from '../assets/database/songs';
import theme from '../theme';

export default function Artist({ route }) {
  const { artist } = route.params ?? {};
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadArtistSongs();
  }, [artist?.id]);

  async function loadArtistSongs() {
    setLoading(true);
    try {
      let songs = [];

      // Try to fetch from Spotify API first
      if (artist?.id && artist.id.length === 22) {  // Spotify IDs are always 22 chars
        try {
          // If artist has valid Spotify ID, fetch top tracks
          console.log('[Artist] Fetching tracks for artist ID:', artist.id);
          songs = await getArtistTopTracks(artist.id, 50);
          console.log('[Artist] Got', songs.length, 'tracks from Spotify API');
          // Keep all songs, even without preview (will show "Áudio não disponível")
        } catch (e) {
          console.warn('Failed to fetch from Spotify API by ID, trying search:', e);
          // Fallback to search by artist name
          songs = await searchTracks(`artist:${artist?.name}`, 50);
        }
      } else {
        // Search by artist name if no valid ID
        console.log('[Artist] Searching by name:', artist?.name);
        songs = await searchTracks(`artist:${artist?.name}`, 50);
      }

      console.log('[Artist] Final songs count:', songs?.length || 0);
      setSongs(songs || []);
    } catch (e) {
      console.warn('Failed to fetch artist songs:', e);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title={artist?.name ?? 'Artista'} />
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <>
            <SkeletonLoader width="100%" height={200} borderRadius={0} />
            <View style={{ padding: theme.spacing.md }}>
              <SkeletonLoader width="60%" height={32} borderRadius={theme.spacing.sm} style={{ marginVertical: theme.spacing.md }} />
              <SkeletonLoader width="100%" height={theme.spacing.xl} borderRadius={theme.spacing.sm} style={{ marginVertical: theme.spacing.sm }} />
              {[1, 2, 3].map((i) => (
                <SkeletonLoader key={i} width="100%" height={80} borderRadius={theme.spacing.sm} style={{ marginVertical: theme.spacing.sm }} />
              ))}
            </View>
          </>
        ) : (
          <>
            {artist?.banner && (
              <Image 
                source={{ uri: artist.banner }} 
                style={styles.banner} 
              />
            )}
            <View style={styles.heroContent}>
              <Text style={[theme.typography.heading1, { color: theme.colors.textPrimary, textAlign: 'center' }]}>
                {artist?.name}
              </Text>
            </View>

            <View style={styles.songsHeader}>
              <Text style={[theme.typography.heading3, { color: theme.colors.textPrimary }]}>
                🎵 Músicas Populares
              </Text>
            </View>

            {songs.length > 0 ? (
              <FlatList
                data={songs}
                scrollEnabled={false}
                keyExtractor={(item, i) => String(item?.id || i)}
                renderItem={({ item, index }) => (
                  <SongItem {...item} index={index} />
                )}
              />
            ) : (
              <View style={styles.noSongsContainer}>
                <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
                  Nenhuma música encontrada
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: theme.spacing.xxl },
  banner: { 
    width: '100%', 
    height: 200, 
    marginBottom: theme.spacing.md 
  },
  heroContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceLight,
  },
  songsHeader: { 
    paddingHorizontal: theme.spacing.md, 
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1, 
    borderTopColor: theme.colors.surfaceLight,
    marginTop: theme.spacing.md,
  },
  noSongsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
});
