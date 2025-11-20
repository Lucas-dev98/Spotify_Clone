import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import Header from '../components/Header';
import SongItem from '../components/SongItem';
import { searchTracks } from '../services/spotifyApi';

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Header title="Músicas" />
        <ActivityIndicator size="large" color="#1db954" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Músicas" />
      {error && <Text style={{ color: 'red', padding: 12 }}>Erro: {error}</Text>}
      {songs.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#666' }}>Nenhuma música encontrada</Text>
        </View>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item, index }) => <SongItem {...item} index={index} />}
        />
      )}
    </View>
  );
}
