import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import Header from '../components/Header';
import SingleItem from '../components/SingleItem';
import { searchTracks, getNewReleases } from '../services/spotifyApi';

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Header title="Artistas" />
        <ActivityIndicator size="large" color="#1db954" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Artistas" />
      {error && <Text style={{ color: 'red', padding: 12 }}>Erro: {error}</Text>}
      {artists.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#666' }}>Nenhum artista encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={artists}
          keyExtractor={(i) => String(i.id ?? i.name)}
          renderItem={({ item }) => <SingleItem {...item} idPath="/artist" />}
        />
      )}
    </View>
  );
}
