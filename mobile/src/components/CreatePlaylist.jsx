/**
 * Create Playlist Component
 * UI para criar nova playlist e adicionar tracks
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Switch,
  Alert,
  FlatList,
} from 'react-native';
import {
  createPlaylist,
  addTracksToPlaylist,
  updatePlaylist,
  removeTracksFromPlaylist,
} from '../services/spotifyUserApi';

export default function CreatePlaylistComponent() {
  const [step, setStep] = useState('form'); // 'form', 'select-tracks', 'success'
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdPlaylist, setCreatedPlaylist] = useState(null);
  const [selectedTracks, setSelectedTracks] = useState([]);

  async function handleCreatePlaylist() {
    if (!name.trim()) {
      setError('Nome da playlist é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const playlist = await createPlaylist(name, description, isPublic);
      setCreatedPlaylist(playlist);
      setStep('success');
      setName('');
      setDescription('');
      setIsPublic(false);
    } catch (err) {
      setError(err.message || 'Erro ao criar playlist');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTracks() {
    if (selectedTracks.length === 0) {
      setError('Selecione pelo menos uma música');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const trackUris = selectedTracks.map(t => t.uri);
      await addTracksToPlaylist(createdPlaylist.id, trackUris);
      
      Alert.alert('Sucesso!', `${trackUris.length} músicas adicionadas à playlist`);
      setSelectedTracks([]);
      setStep('success');
    } catch (err) {
      setError(err.message || 'Erro ao adicionar músicas');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'success' && createdPlaylist) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.successCard}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Playlist Criada!</Text>
          
          <View style={styles.playlistInfo}>
            <Text style={styles.playlistName}>{createdPlaylist.name}</Text>
            {createdPlaylist.description && (
              <Text style={styles.playlistDescription}>{createdPlaylist.description}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => {
              if (createdPlaylist.url) {
                // Abrir no Spotify
                console.log('Open:', createdPlaylist.url);
              }
            }}
          >
            <Text style={styles.linkButtonText}>🎵 Abrir no Spotify</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setStep('form');
              setCreatedPlaylist(null);
            }}
          >
            <Text style={styles.buttonText}>Criar Outra Playlist</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🎵 Criar Playlist</Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.label}>Nome da Playlist *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Minhas Top Tracks"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />

        <Text style={styles.label}>Descrição (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ex: Minhas melhores músicas de 2025"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          editable={!loading}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Playlist Pública?</Text>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            disabled={loading}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#1db954" style={{ marginVertical: 20 }} />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handleCreatePlaylist}
          >
            <Text style={styles.buttonText}>Criar Playlist</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.hint}>
          Depois de criar, você poderá adicionar músicas à sua playlist
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  card: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#b3b3b3',
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#282828',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#404040',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingVertical: 12,
    backgroundColor: '#1db954',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#1db954',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    color: '#b3b3b3',
    marginTop: 16,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#e22134',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
  },
  successCard: {
    backgroundColor: '#1db954',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  playlistInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    marginBottom: 20,
  },
  playlistName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  playlistDescription: {
    fontSize: 12,
    color: '#e8e8e8',
  },
  linkButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
