import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { getPlaylistTracks } from '../services/spotifyUserApi';
import { getPlaylistInfo } from '../services/spotifyApi';

/**
 * PlaylistEmbed - Exibe playlist do Spotify com tracks
 * 
 * Props:
 * - playlistId: string (ID da playlist)
 * - showTracks: boolean (mostrar lista de tracks)
 * - maxTracks: number (máximo de tracks a mostrar)
 * - onTrackPress: function (callback quando clica em track)
 */
export default function PlaylistEmbed({
  playlistId,
  showTracks = true,
  maxTracks = 10,
  onTrackPress = null,
}) {
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPlaylist();
  }, [playlistId]);

  async function loadPlaylist() {
    try {
      setLoading(true);
      setError(null);

      // Obter info da playlist
      const playlistData = await getPlaylistInfo(playlistId);
      setPlaylist(playlistData);

      // Obter tracks se showTracks ativado
      if (showTracks) {
        const tracksData = await getPlaylistTracks(playlistId, maxTracks);
        setTracks(tracksData);
      }
    } catch (err) {
      console.error('Erro ao carregar playlist:', err);
      setError('Erro ao carregar playlist');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={{ padding: 16, alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <ActivityIndicator size="large" color="#1db954" />
        <Text style={{ color: '#888', marginTop: 8 }}>Carregando playlist...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 16, backgroundColor: '#ffebee', borderRadius: 8 }}>
        <Text style={{ color: '#c62828', fontWeight: '700' }}>❌ {error}</Text>
        <TouchableOpacity
          onPress={loadPlaylist}
          style={{
            marginTop: 8,
            padding: 8,
            backgroundColor: '#f48fb1',
            borderRadius: 4,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!playlist) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: '#888' }}>Playlist não encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Header da Playlist */}
      <View style={{ padding: 16, backgroundColor: '#1a1a1a', borderBottomWidth: 1, borderBottomColor: '#333' }}>
        {/* Cover */}
        {playlist.images && playlist.images[0] && (
          <View
            style={{
              width: '100%',
              height: 200,
              backgroundColor: '#333',
              borderRadius: 8,
              marginBottom: 16,
              overflow: 'hidden',
            }}
          >
            <Text style={{ color: '#888', padding: 16 }}>
              {/* Placeholder para imagem */}
              📀 {playlist.name}
            </Text>
          </View>
        )}

        {/* Nome */}
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 4 }}>
          {playlist.name}
        </Text>

        {/* Descrição */}
        {playlist.description && (
          <Text style={{ fontSize: 14, color: '#aaa', marginBottom: 8 }}>
            {playlist.description}
          </Text>
        )}

        {/* Info */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
          <Text style={{ color: '#1db954', fontWeight: '600', marginRight: 12 }}>
            🎵 {playlist.tracks?.total || 0} tracks
          </Text>
          {playlist.owner && (
            <Text style={{ color: '#aaa', fontSize: 12 }}>
              Por: {playlist.owner.display_name}
            </Text>
          )}
        </View>

        {/* Link Externo */}
        {playlist.external_urls?.spotify && (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Abrir no Spotify',
                'Funcionalidade disponível na versão full',
                [{ text: 'OK' }]
              );
            }}
            style={{
              marginTop: 12,
              padding: 10,
              backgroundColor: '#1db954',
              borderRadius: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>
              ▶ Abrir no Spotify
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tracks */}
      {showTracks && tracks.length > 0 && (
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 12 }}>
            Tracks
          </Text>

          {tracks.map((track, index) => (
            <TouchableOpacity
              key={track.id}
              onPress={() => onTrackPress && onTrackPress(track)}
              style={{
                flexDirection: 'row',
                padding: 12,
                marginBottom: 8,
                backgroundColor: '#222',
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: '#1db954',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
                  {index + 1}. {track.name}
                </Text>
                <Text style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>
                  {track.artists?.map(a => a.name).join(', ')}
                </Text>
              </View>
              <Text style={{ color: '#1db954', fontWeight: '600', marginLeft: 8 }}>
                ▶
              </Text>
            </TouchableOpacity>
          ))}

          {playlist.tracks?.total > maxTracks && (
            <View style={{ padding: 12, backgroundColor: '#2a2a2a', borderRadius: 8, marginTop: 8 }}>
              <Text style={{ color: '#aaa', fontSize: 12 }}>
                +{playlist.tracks.total - maxTracks} mais tracks...
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Stats */}
      <View
        style={{
          padding: 16,
          marginHorizontal: 16,
          marginBottom: 32,
          backgroundColor: '#1db954',
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center' }}>
          ✅ Playlist carregada com sucesso!
        </Text>
      </View>
    </ScrollView>
  );
}
