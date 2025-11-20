import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import SongItem from '../components/SongItem';
import { getArtistTopTracks, searchTracks } from '../services/spotifyApi';
import { songsArray as localSongs } from '../assets/database/songs';

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
    <View style={{ flex: 1 }}>
      <Header title={artist?.name ?? 'Artista'} />
      <ScrollView contentContainerStyle={styles.container}>
        {artist?.banner && <Image source={{ uri: artist.banner }} style={styles.banner} />}
        <Text style={styles.name}>{artist?.name}</Text>

        <View style={styles.songsHeader}>
          <Text style={styles.songsTitle}>Músicas</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#1db954" style={{ marginTop: 20 }} />
        ) : songs.length > 0 ? (
          <FlatList
            data={songs}
            scrollEnabled={false}
            keyExtractor={(item, i) => String(item?.id || i)}
            renderItem={({ item, index }) => (
              <SongItem {...item} index={index} />
            )}
          />
        ) : (
          <Text style={styles.noSongs}>Nenhuma música encontrada</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 100 },
  banner: { width: '100%', height: 180, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: '700', paddingHorizontal: 16, textAlign: 'center', marginBottom: 24 },
  songsHeader: { paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderColor: '#eee', marginTop: 12 },
  songsTitle: { fontSize: 16, fontWeight: '700' },
  noSongs: { textAlign: 'center', color: '#999', marginTop: 20, fontSize: 14 },
});
