import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import Header from '../components/Header';
import SingleItem from '../components/SingleItem';
import SkeletonLoader from '../components/SkeletonLoader';
import { searchTracks, getNewReleases } from '../services/spotifyApi';
import theme from '../theme';

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSpotifyArtists();
  }, []);

  async function loadSpotifyArtists() {
    try {
      setLoading(true);
      setError(null);
      console.log('[Artists] Fetching artists from Spotify...');

      // Get popular releases to extract artists
      const releases = await getNewReleases(50);
      
      // Extract unique artists from releases
      const artistMap = new Map();
      releases.forEach(release => {
        if (release.artist && release.id && !artistMap.has(release.artist)) {
          artistMap.set(release.artist, {
            name: release.artist,
            image: release.image,
            id: release.id,
            uri: release.uri,
            banner: release.image,
          });
        }
      });

      const uniqueArtists = Array.from(artistMap.values()).slice(0, 30);
      console.log('[Artists] Loaded', uniqueArtists.length, 'artists from Spotify');
      console.log('[Artists] First artist:', uniqueArtists[0]);
      setArtists(uniqueArtists);
    } catch (e) {
      console.warn('[Artists] Error loading artists:', e.message);
      setError(e.message);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Header title="Artistas" />
        <View style={{ padding: theme.spacing.md }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={{ marginBottom: theme.spacing.md }}>
              <SkeletonLoader width="100%" height={100} borderRadius={theme.spacing.md} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Artistas" />
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
      {artists.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ 
            fontSize: theme.typography.body.fontSize,
            color: theme.colors.textSecondary,
          }}>
            Nenhum artista encontrado
          </Text>
        </View>
      ) : (
        <FlatList
          data={artists}
          keyExtractor={(i) => String(i.id ?? i.name)}
          renderItem={({ item }) => <SingleItem {...item} idPath="/artist" />}
          contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
        />
      )}
    </View>
  );
}
