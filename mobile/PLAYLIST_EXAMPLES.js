/**
 * Exemplos: Criar e Gerenciar Playlists
 * Copy & paste para usar na sua app!
 */

// ============================================
// EXEMPLO 1: Criar Playlist Simples
// ============================================

import { createPlaylist } from '../services/spotifyUserApi';

async function simpleExample() {
  try {
    const playlist = await createPlaylist(
      'Minha Playlist Top 2025',
      'Minhas melhores músicas do ano'
    );
    
    console.log('Playlist criada:');
    console.log('Nome:', playlist.name);
    console.log('ID:', playlist.id);
    console.log('URL:', playlist.url);
  } catch (error) {
    console.error('Erro:', error);
  }
}

// ============================================
// EXEMPLO 2: Criar e Adicionar Tracks
// ============================================

import { createPlaylist, addTracksToPlaylist, getUserTopTracks } from '../services/spotifyUserApi';

async function createPlaylistWithTopTracks() {
  try {
    // 1. Criar playlist
    const playlist = await createPlaylist(
      'Meus Top Tracks 2025',
      'Meus melhores tracks do ano'
    );
    
    console.log('✅ Playlist criada:', playlist.name);
    
    // 2. Obter top tracks
    const topTracks = await getUserTopTracks('long_term', 50);
    
    // 3. Extrair URIs
    const trackUris = topTracks.map(t => t.uri);
    
    // 4. Adicionar à playlist
    const result = await addTracksToPlaylist(playlist.id, trackUris);
    
    console.log('✅ Tracks adicionadas:', result.tracksAdded);
    console.log('🎵 Playlist URL:', playlist.url);
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// ============================================
// EXEMPLO 3: Criar Playlist Pública
// ============================================

import { createPlaylist } from '../services/spotifyUserApi';

async function createPublicPlaylist() {
  try {
    const playlist = await createPlaylist(
      'Minhas Descobertas 2025',
      'Novas músicas que descobri',
      true  // isPublic = true
    );
    
    console.log('Playlist pública criada!');
    console.log('Compartilhe com amigos:', playlist.url);
  } catch (error) {
    console.error('Erro:', error);
  }
}

// ============================================
// EXEMPLO 4: Adicionar Tracks Específicas
// ============================================

import { addTracksToPlaylist } from '../services/spotifyUserApi';

async function addSpecificTracks() {
  const playlistId = 'seu_playlist_id';
  
  // Tracks para adicionar (URIs do Spotify)
  const trackUris = [
    'spotify:track:0s66r2vh1tGRT2SRvZumWs',
    'spotify:track:5A2PGUJvo4euS7n6Bu6C9u',
    'spotify:track:5zikaD3Pi5g5PBAUYPlMae',
    'spotify:track:0GOwPW90VjMGLC9OUzC6cb',
    'spotify:track:7lY0JmHyS5TRL9pfXxRJ0u'
  ];

  try {
    const result = await addTracksToPlaylist(playlistId, trackUris);
    console.log(`✅ ${result.tracksAdded} tracks adicionadas!`);
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// ============================================
// EXEMPLO 5: Obter URIs de Tracks (para adicionar)
// ============================================

import { getUserTopTracks, getUserSavedTracks } from '../services/spotifyUserApi';

async function getTrackUris() {
  try {
    // Opção 1: Top tracks
    const topTracks = await getUserTopTracks('long_term', 10);
    const topUris = topTracks.map(t => t.uri);
    console.log('Top tracks URIs:', topUris);
    
    // Opção 2: Saved tracks
    const { tracks: savedTracks } = await getUserSavedTracks(10);
    const savedUris = savedTracks.map(t => t.uri);
    console.log('Saved tracks URIs:', savedUris);
    
    return { topUris, savedUris };
  } catch (error) {
    console.error('Erro:', error);
  }
}

// ============================================
// EXEMPLO 6: Remover Tracks da Playlist
// ============================================

import { removeTracksFromPlaylist } from '../services/spotifyUserApi';

async function removeTracksExample() {
  const playlistId = 'seu_playlist_id';
  const tracksToRemove = [
    'spotify:track:0s66r2vh1tGRT2SRvZumWs',
    'spotify:track:5A2PGUJvo4euS7n6Bu6C9u'
  ];

  try {
    const result = await removeTracksFromPlaylist(playlistId, tracksToRemove);
    console.log(`✅ ${result.tracksRemoved} tracks removidas!`);
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// ============================================
// EXEMPLO 7: Renomear Playlist
// ============================================

import { updatePlaylist } from '../services/spotifyUserApi';

async function renamePlaylist() {
  const playlistId = 'seu_playlist_id';

  try {
    await updatePlaylist(
      playlistId,
      'Novo Nome da Playlist',
      'Nova descrição',
      true  // isPublic
    );
    
    console.log('✅ Playlist atualizada!');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// ============================================
// EXEMPLO 8: Component com Criação em Real-time
// ============================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { createPlaylist, addTracksToPlaylist } from '../services/spotifyUserApi';

export default function PlaylistCreatorExample() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleCreatePlaylist() {
    setLoading(true);
    try {
      const playlist = await createPlaylist(name, 'Criada via app');
      setResult(playlist);
      setName('');
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
        Criar Playlist
      </Text>

      <TextInput
        placeholder="Nome da playlist"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          marginBottom: 12,
          borderRadius: 8,
        }}
        editable={!loading}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1db954" />
      ) : (
        <TouchableOpacity
          onPress={handleCreatePlaylist}
          style={{
            backgroundColor: '#1db954',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>
            Criar Playlist
          </Text>
        </TouchableOpacity>
      )}

      {result && (
        <View style={{ marginTop: 20, padding: 12, backgroundColor: '#e8f5e9', borderRadius: 8 }}>
          <Text style={{ fontWeight: '700', color: '#2e7d32' }}>
            ✅ {result.name}
          </Text>
          <Text style={{ color: '#558b2f', fontSize: 12, marginTop: 4 }}>
            ID: {result.id}
          </Text>
        </View>
      )}
    </View>
  );
}

// ============================================
// EXEMPLO 9: Factory - Criar de Template
// ============================================

import { createPlaylist, addTracksToPlaylist } from '../services/spotifyUserApi';

const playlistTemplates = {
  'workout': {
    name: 'Workout Mix 💪',
    description: 'Músicas para malhar'
  },
  'chill': {
    name: 'Chill Vibes 🎧',
    description: 'Para relaxar'
  },
  'party': {
    name: 'Party Hits 🎉',
    description: 'Para festar'
  },
};

async function createFromTemplate(templateKey, tracks = []) {
  const template = playlistTemplates[templateKey];
  
  try {
    const playlist = await createPlaylist(
      template.name,
      template.description,
      false
    );

    if (tracks.length > 0) {
      const trackUris = tracks.map(t => t.uri);
      await addTracksToPlaylist(playlist.id, trackUris);
    }

    return playlist;
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Usar:
// const workoutPlaylist = await createFromTemplate('workout', topTracks);

// ============================================
// EXEMPLO 10: Batch Create Multiple Playlists
// ============================================

import { createPlaylist, addTracksToPlaylist } from '../services/spotifyUserApi';

async function createMultiplePlaylists() {
  const playlists = [
    { name: 'Top 2024', description: 'Melhores de 2024' },
    { name: 'Top 2025', description: 'Melhores de 2025' },
    { name: 'Descobertas', description: 'Novas descobertas' },
  ];

  try {
    const created = [];
    
    for (const p of playlists) {
      const playlist = await createPlaylist(p.name, p.description);
      created.push(playlist);
      console.log(`✅ Criada: ${playlist.name}`);
      
      // Pequeno delay para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return created;
  } catch (error) {
    console.error('Erro:', error);
  }
}

// ============================================
// DICAS & BOAS PRÁTICAS
// ============================================

/*
1. URI FORMAT:
   ✅ Correto: spotify:track:3qm84nBvXcjf6OdNwVCM57
   ❌ Errado: 3qm84nBvXcjf6OdNwVCM57

2. BATCH ADD (Limite de Spotify):
   ✅ Max 100 tracks por request (auto-tratado)
   ✅ Automático quando fizer >100 tracks

3. PERFORMANCE:
   ✅ Use debounce para criar múltiplas playlists
   ✅ Mostre loading state
   ✅ Salve IDs para referência

4. ERROR HANDLING:
   ✅ Sempre use try/catch
   ✅ Mostre erro amigável ao usuário
   ✅ Tente de novo automaticamente

5. SCOPES NECESSÁRIOS:
   ✅ playlist-modify-public (já configurado)
   ✅ playlist-modify-private (já configurado)
*/
