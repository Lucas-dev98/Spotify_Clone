import React, { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator, Text } from 'react-native';
import Header from '../components/Header';
import Main from '../components/Main';
import { getNewReleases, searchTracks } from '../services/spotifyApi';
import { artistArray as localArtists } from '../assets/database/artists';
import { songsArray as localSongs } from '../assets/database/songs';
import theme from '../theme';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function Home() {
  const [artists, setArtists] = useState(localArtists);
  const [songs, setSongs] = useState(localSongs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        console.log('[Home] Fetching from Spotify API...');
        
        const spotifyReleases = await getNewReleases(30);
        
        const transformedSongs = spotifyReleases.map((release, idx) => ({
          id: release.id || idx,
          name: release.name,
          artist: release.artist,
          image: release.image,
          duration: '3:00',
          audio: null,
          album: release.name,
          uri: release.uri,
        }));

        try {
          const popularTracks = await searchTracks('top tracks', 15);
          setSongs(popularTracks);
          console.log('[Home] Loaded songs from Spotify API:', popularTracks.length);
        } catch (e) {
          setSongs(transformedSongs.slice(0, 20));
        }

        const uniqueArtists = [];
        const artistSet = new Set();
        
        transformedSongs.forEach(song => {
          if (!artistSet.has(song.artist) && uniqueArtists.length < 10) {
            artistSet.add(song.artist);
            uniqueArtists.push({
              name: song.artist,
              image: song.image,
              id: song.artist.replace(/\s+/g, '_').toLowerCase(),
            });
          }
        });
        
        setArtists(uniqueArtists.length > 0 ? uniqueArtists : localArtists);
        console.log('[Home] Loaded artists:', uniqueArtists.length);
        
      } catch (e) {
        console.warn('[Home] Spotify API error, using local data:', e.message);
        setError(e.message);
        setArtists(localArtists);
        setSongs(localSongs);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Header title="Spotify" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Conectando ao Spotify...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Spotify" subtitle="Descubra música nova" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}
        <Main artists={artists} songs={songs} />
      </ScrollView>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
    marginTop: spacing.lg,
  },
  errorBanner: {
    backgroundColor: colors.error,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.text.primary,
  },
};
