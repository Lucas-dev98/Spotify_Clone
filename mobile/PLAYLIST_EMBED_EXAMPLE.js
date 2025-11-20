/**
 * Exemplos: Usar PlaylistEmbed Component
 * 
 * PlaylistEmbed exibe uma playlist do Spotify com:
 * - Informações da playlist (nome, descrição, owner)
 * - Lista de tracks
 * - Link para abrir no Spotify
 * - Callbacks para cliques em tracks
 */

// ============================================
// EXEMPLO 1: Uso Básico
// ============================================

import React from 'react';
import { View } from 'react-native';
import PlaylistEmbed from '../components/PlaylistEmbed';

export default function PlaylistPageBasic() {
  const playlistId = '4h0Viu9ObZCHAEZ04Iqj3x';

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <PlaylistEmbed playlistId={playlistId} />
    </View>
  );
}

// ============================================
// EXEMPLO 2: Com Track Press Handler
// ============================================

import React from 'react';
import { View, Alert } from 'react-native';
import PlaylistEmbed from '../components/PlaylistEmbed';

export default function PlaylistPageWithHandler() {
  const playlistId = '4h0Viu9ObZCHAEZ04Iqj3x';

  function handleTrackPress(track) {
    Alert.alert(
      track.name,
      `Artista: ${track.artists?.map(a => a.name).join(', ')}\n\nDeseja tocar?`,
      [
        { text: 'Cancelar' },
        { 
          text: 'Tocar', 
          onPress: () => {
            console.log('Tocando:', track.uri);
            // Aqui você pode integrar com o player
          }
        }
      ]
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <PlaylistEmbed 
        playlistId={playlistId}
        onTrackPress={handleTrackPress}
      />
    </View>
  );
}

// ============================================
// EXEMPLO 3: Mostrar Apenas Info (Sem Tracks)
// ============================================

import React from 'react';
import { View } from 'react-native';
import PlaylistEmbed from '../components/PlaylistEmbed';

export default function PlaylistInfoOnly() {
  const playlistId = '4h0Viu9ObZCHAEZ04Iqj3x';

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <PlaylistEmbed 
        playlistId={playlistId}
        showTracks={false}  // Não mostra tracks
      />
    </View>
  );
}

// ============================================
// EXEMPLO 4: Limitar Número de Tracks
// ============================================

import React from 'react';
import { View } from 'react-native';
import PlaylistEmbed from '../components/PlaylistEmbed';

export default function PlaylistLimited() {
  const playlistId = '4h0Viu9ObZCHAEZ04Iqj3x';

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <PlaylistEmbed 
        playlistId={playlistId}
        maxTracks={5}  // Mostrar apenas 5 tracks
      />
    </View>
  );
}

// ============================================
// EXEMPLO 5: Integrar em Página Existente
// ============================================

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import PlaylistEmbed from '../components/PlaylistEmbed';

export default function PlaylistDetailPage({ route }) {
  const { playlistId } = route.params;
  const [selectedTrack, setSelectedTrack] = useState(null);

  function handleTrackPress(track) {
    setSelectedTrack(track);
    console.log('Selected track:', track.name);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#121212' }}>
      {/* PlaylistEmbed */}
      <PlaylistEmbed 
        playlistId={playlistId}
        maxTracks={20}
        onTrackPress={handleTrackPress}
      />

      {/* Track Selecionado */}
      {selectedTrack && (
        <View style={{ padding: 16, backgroundColor: '#1db954', margin: 16, borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontWeight: '700', marginBottom: 4 }}>
            ▶ Agora selecionada:
          </Text>
          <Text style={{ color: '#fff' }}>
            {selectedTrack.name}
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedTrack(null)}
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: '#fff', textDecorationLine: 'underline' }}>
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

// ============================================
// EXEMPLO 6: Multiple Playlists
// ============================================

import React from 'react';
import { View, Text, FlatList } from 'react-native';
import PlaylistEmbed from '../components/PlaylistEmbed';

export default function MultiplePlaylistsPage() {
  const playlists = [
    '4h0Viu9ObZCHAEZ04Iqj3x',
    'playlist_id_2',
    'playlist_id_3',
  ];

  return (
    <FlatList
      data={playlists}
      keyExtractor={(id) => id}
      renderItem={({ item, index }) => (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 8, marginHorizontal: 16 }}>
            Playlist {index + 1}
          </Text>
          <PlaylistEmbed 
            playlistId={item}
            maxTracks={5}
          />
        </View>
      )}
      style={{ backgroundColor: '#121212' }}
      contentContainerStyle={{ paddingVertical: 16 }}
    />
  );
}

// ============================================
// EXEMPLO 7: Com State Management
// ============================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import PlaylistEmbed from '../components/PlaylistEmbed';

export default function PlaylistSearchPage() {
  const [playlistId, setPlaylistId] = useState('4h0Viu9ObZCHAEZ04Iqj3x');
  const [inputValue, setInputValue] = useState('');

  function handleSearch() {
    if (inputValue.trim()) {
      setPlaylistId(inputValue.trim());
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#121212' }}>
      {/* Input */}
      <View style={{ padding: 16 }}>
        <Text style={{ color: '#fff', fontWeight: '700', marginBottom: 8 }}>
          ID da Playlist
        </Text>
        <TextInput
          placeholder="Cole o ID da playlist"
          placeholderTextColor="#666"
          value={inputValue}
          onChangeText={setInputValue}
          style={{
            borderWidth: 1,
            borderColor: '#1db954',
            padding: 12,
            borderRadius: 8,
            color: '#fff',
            marginBottom: 12,
          }}
        />
        <TouchableOpacity
          onPress={handleSearch}
          style={{
            backgroundColor: '#1db954',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Carregar</Text>
        </TouchableOpacity>
      </View>

      {/* PlaylistEmbed */}
      <PlaylistEmbed playlistId={playlistId} />
    </ScrollView>
  );
}

// ============================================
// DICAS
// ============================================

/*
PROPS:
- playlistId (string, required) - ID da playlist do Spotify
- showTracks (boolean, default: true) - Mostrar lista de tracks
- maxTracks (number, default: 10) - Quantos tracks mostrar
- onTrackPress (function) - Callback quando clica em track

EXEMPLO DE ID:
4h0Viu9ObZCHAEZ04Iqj3x

COMO OBTER ID:
1. Abra a playlist no Spotify
2. Clique em compartilhar/share
3. A URL será: https://open.spotify.com/playlist/4h0Viu9ObZCHAEZ04Iqj3x
4. O ID é: 4h0Viu9ObZCHAEZ04Iqj3x

INTEGRAÇÕES:
- Conecte onTrackPress ao seu player
- Mostre detalhes da track selecionada
- Permita adicionar tracks a outras playlists
*/
