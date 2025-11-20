import React, { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator, Text } from 'react-native';
import Header from '../components/Header';
import Main from '../components/Main';
import { getNewReleases, searchTracks } from '../services/spotifyApi';
import { artistArray as localArtists } from '../assets/database/artists';
import { songsArray as localSongs } from '../assets/database/songs';

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
        
        // Fetch new releases (which includes albums/artists)
        const spotifyReleases = await getNewReleases(30);
        
        // Transform releases to song format for compatibility
        const transformedSongs = spotifyReleases.map((release, idx) => ({
          id: release.id || idx,
          name: release.name,
          artist: release.artist,
          image: release.image,
          duration: '3:00',
          audio: null, // Releases don't have preview URLs, we'll use search for playable tracks
          album: release.name,
          uri: release.uri,
        }));

        // Also fetch some popular tracks for playable audio
        try {
          const popularTracks = await searchTracks('top tracks', 15);
          setSongs(popularTracks);
          console.log('[Home] Loaded songs from Spotify API:', popularTracks.length);
        } catch (e) {
          setSongs(transformedSongs.slice(0, 20));
        }

        // Create artist list from songs
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Header title="Spotify" />
        <ActivityIndicator size="large" color="#1db954" />
        <Text style={{ marginTop: 16, color: '#000' }}>Conectando ao Spotify...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Spotify" />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {error && (
          <Text style={{ padding: 12, backgroundColor: '#fff3cd', color: '#856404', marginBottom: 12, marginHorizontal: 12 }}>
            ⚠️ Aviso: {error}
          </Text>
        )}
        <Main artists={artists} songs={songs} />
      </ScrollView>
    </View>
  );
}
