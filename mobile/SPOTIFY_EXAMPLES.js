/**
 * Exemplos de como usar a Spotify API em seus componentes
 * Copy & paste esses exemplos para adicionar funcionalidades!
 */

// ============================================
// EXEMPLO 1: Buscar Músicas por Query
// ============================================

import { searchTracks } from '../services/spotifyApi';

async function buscarMusicas() {
  try {
    const tracks = await searchTracks('Michael Jackson', 10);
    console.log(tracks);
    // Retorna:
    // [
    //   {
    //     id: '3qm84nBvXcjf6OdNwVCM57',
    //     name: 'Billie Jean',
    //     artist: 'Michael Jackson',
    //     image: 'https://i.scdn.co/image/...',
    //     duration: '4:54',
    //     audio: 'https://p.scdn.co/mp3-preview/...',
    //     uri: 'spotify:track:3qm84nBvXcjf6OdNwVCM57'
    //   },
    //   ...
    // ]
  } catch (error) {
    console.error('Erro ao buscar:', error);
  }
}

// ============================================
// EXEMPLO 2: Usar em um Componente React Native
// ============================================

import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text } from 'react-native';
import { searchTracks } from '../services/spotifyApi';

export default function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(text) {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const tracks = await searchTracks(text, 15);
      setResults(tracks);
    } catch (error) {
      console.error('Erro na busca:', error);
    }
    setLoading(false);
  }

  return (
    <View>
      <TextInput
        placeholder="Buscar música..."
        value={query}
        onChangeText={handleSearch}
        style={{ padding: 12, borderBottomWidth: 1, borderColor: '#ddd' }}
      />
      
      {loading && <Text>Carregando...</Text>}
      
      <FlatList
        data={results}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontWeight: '600' }}>{item.name}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>{item.artist}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ============================================
// EXEMPLO 3: Carregar Top Tracks de um Artista
// ============================================

import { getArtistTopTracks } from '../services/spotifyApi';

async function carregarTopTracksDoArtista(artistId) {
  try {
    const tracks = await getArtistTopTracks(artistId, 10);
    console.log(`Top 10 tracks:`);
    tracks.forEach((track, idx) => {
      console.log(`${idx + 1}. ${track.name} - ${track.duration}`);
    });
  } catch (error) {
    console.error('Erro:', error);
  }
}

// ============================================
// EXEMPLO 4: Carregar Tracks de uma Playlist
// ============================================

import { getPlaylistTracks } from '../services/spotifyApi';

async function carregarPlaylist() {
  try {
    // ID da playlist (ex: "This Is Michael Jackson")
    const playlistId = '37i9dQZF1DX7K31D69s4M1';
    
    const tracks = await getPlaylistTracks(playlistId, 50);
    console.log(`Playlist tem ${tracks.length} tracks:`);
    return tracks;
  } catch (error) {
    console.error('Erro ao carregar playlist:', error);
  }
}

// ============================================
// EXEMPLO 5: Home Customizada com Múltiplas Buscas
// ============================================

import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { searchTracks, getNewReleases } from '../services/spotifyApi';

export default function CustomHome() {
  const [popTracks, setPopTracks] = useState([]);
  const [brazilianTracks, setBrazilianTracks] = useState([]);
  const [edm, setEDM] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      // Buscar diferentes gêneros em paralelo
      const [pop, brazilian, edmTracks] = await Promise.all([
        searchTracks('pop', 10),
        searchTracks('brazilian music', 10),
        searchTracks('EDM', 10),
      ]);

      setPopTracks(pop);
      setBrazilianTracks(brazilian);
      setEDM(edmTracks);
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  return (
    <ScrollView>
      <Section title="📻 Popular" tracks={popTracks} />
      <Section title="🇧🇷 Brasileiro" tracks={brazilianTracks} />
      <Section title="🎧 EDM" tracks={edm} />
    </ScrollView>
  );
}

function Section({ title, tracks }) {
  return (
    <View style={{ padding: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
        {title}
      </Text>
      {tracks.map((track) => (
        <Text key={track.id} style={{ fontSize: 12, marginBottom: 6 }}>
          {track.name} - {track.artist}
        </Text>
      ))}
    </View>
  );
}

// ============================================
// EXEMPLO 6: Customizar Home.jsx com Gêneros
// ============================================

// Edite src/pages/Home.jsx, função loadData():

async function loadData() {
  try {
    setError(null);
    
    // Em vez de getNewReleases, use searchTracks:
    const spotifyTracks = await Promise.all([
      searchTracks('pop', 10),
      searchTracks('rock', 10),
      searchTracks('hip hop', 10),
    ]);

    const allTracks = spotifyTracks.flat().slice(0, 30);
    setSongs(allTracks);

    // Extrair artistas únicos
    const uniqueArtists = [];
    const seen = new Set();
    allTracks.forEach((track) => {
      if (!seen.has(track.artist)) {
        seen.add(track.artist);
        uniqueArtists.push({
          name: track.artist,
          image: track.image,
          id: track.artist.replace(/\s+/g, '_'),
        });
      }
    });

    setArtists(uniqueArtists.slice(0, 10));
  } catch (error) {
    console.error('Erro:', error);
  }
}

// ============================================
// EXEMPLO 7: Função Helper para Render de Listas
// ============================================

import { FlatList, Text, Image, TouchableOpacity } from 'react-native';

export function TrackList({ tracks, onTrackPress }) {
  return (
    <FlatList
      data={tracks}
      scrollEnabled={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          onPress={() => onTrackPress && onTrackPress(item)}
          style={{
            flexDirection: 'row',
            padding: 12,
            borderBottomWidth: 1,
            borderColor: '#eee',
          }}
        >
          <Text style={{ width: 24, textAlign: 'center', marginRight: 8 }}>
            {index + 1}
          </Text>
          {item.image && (
            <Image
              source={{ uri: item.image }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 4,
                marginRight: 12,
              }}
            />
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '600' }}>{item.name}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              {item.artist}
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: '#999' }}>
            {item.duration}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

// ============================================
// EXEMPLO 8: Tratamento de Erro Robusto
// ============================================

export async function searchTracksWithFallback(query, fallbackData = []) {
  try {
    if (!query || query.trim() === '') {
      return fallbackData;
    }

    console.log(`[Search] Procurando por: ${query}`);
    const results = await searchTracks(query, 20);

    console.log(`[Search] Encontrado ${results.length} resultados`);
    return results.length > 0 ? results : fallbackData;
  } catch (error) {
    console.error(`[Search] Erro: ${error.message}`);
    console.log('[Search] Usando fallback data');
    return fallbackData;
  }
}

// Uso:
const tracks = await searchTracksWithFallback('Michael Jackson', localSongsFallback);

// ============================================
// DICAS & TRUQUES
// ============================================

/*
1. PERFORMANCE:
   ✅ Use searchTracks() com limite baixo (10-20)
   ✅ Cache resultados em useState
   ✅ Evite múltiplas buscas no mesmo query

2. UX:
   ✅ Mostre loading state enquanto carrega
   ✅ Fallback para dados locais em erro
   ✅ Limite resultados por tela

3. SEGURANÇA:
   ✅ Nunca exponha Client Secret no código
   ✅ Use .env.local para credenciais
   ✅ Valide entrada do usuário

4. DEBUGGING:
   ✅ Use console.log para rastrear requisições
   ✅ Teste com SpotifyDebug component
   ✅ Monitore network requests no navegador (F12)

5. API LIMITS:
   ✅ Spotify tem rate limiting (rate limits)
   ✅ Cache agressivamente
   ✅ Não faça múltiplas requisições em loop
*/

// ============================================
// ENDPOINTS ÚTEIS ADICIONAIS
// ============================================

/*
Esses você pode implementar facilmente:

// Buscar albums
GET /v1/search?q=love&type=album

// Buscar artistas
GET /v1/search?q=travis scott&type=artist

// Pegar recomendações
GET /v1/recommendations?seed_artists=123&seed_genres=pop

// Pegar audio features (BPM, danceability, etc)
GET /v1/audio-features/{track_id}

Veja: https://developer.spotify.com/documentation/web-api/reference/
*/
