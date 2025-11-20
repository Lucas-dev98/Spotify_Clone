/**
 * Exemplos de uso: Spotify User API
 * Copie & adapte para seus componentes!
 */

// ============================================
// EXEMPLO 1: Página de Top Tracks do Usuário
// ============================================

import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import { getUserTopTracks } from '../services/spotifyUserApi';
import SongItem from '../components/SongItem';

export default function TopTracksPage() {
  const [tracks, setTracks] = useState([]);
  const [timeRange, setTimeRange] = useState('long_term');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTopTracks();
  }, [timeRange]);

  async function loadTopTracks() {
    setLoading(true);
    try {
      // long_term = tudo / medium_term = 6 meses / short_term = 4 semanas
      const topTracks = await getUserTopTracks(timeRange, 50);
      setTracks(topTracks);
    } catch (error) {
      console.error('Error loading top tracks:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 12 }}>
        <Text 
          onPress={() => setTimeRange('short_term')} 
          style={{ fontWeight: timeRange === 'short_term' ? '700' : '400' }}
        >
          Últimas 4 semanas
        </Text>
        <Text 
          onPress={() => setTimeRange('medium_term')} 
          style={{ fontWeight: timeRange === 'medium_term' ? '700' : '400' }}
        >
          Últimos 6 meses
        </Text>
        <Text 
          onPress={() => setTimeRange('long_term')} 
          style={{ fontWeight: timeRange === 'long_term' ? '700' : '400' }}
        >
          Tudo
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1db954" />
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <SongItem {...item} index={index} />
          )}
        />
      )}
    </View>
  );
}

// ============================================
// EXEMPLO 2: Página de Curtidas (Saved Tracks)
// ============================================

import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, Button } from 'react-native';
import { getUserSavedTracks, removeTrack, saveTrack } from '../services/spotifyUserApi';

export default function SavedTracksPage() {
  const [tracks, setTracks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const limit = 20;

  useEffect(() => {
    loadSavedTracks();
  }, [offset]);

  async function loadSavedTracks() {
    setLoading(true);
    try {
      const result = await getUserSavedTracks(limit, offset);
      setTotal(result.total);
      
      if (offset === 0) {
        setTracks(result.tracks);
      } else {
        setTracks(prev => [...prev, ...result.tracks]);
      }
    } catch (error) {
      console.error('Error loading saved tracks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveTrack(trackId) {
    try {
      await removeTrack(trackId);
      setTracks(prev => prev.filter(t => t.id !== trackId));
    } catch (error) {
      console.error('Error removing track:', error);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ padding: 12, fontSize: 18, fontWeight: '700' }}>
        Músicas Curtidas ({total})
      </Text>

      {loading && <ActivityIndicator size="large" color="#1db954" />}

      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        onEndReached={() => {
          if (offset + limit < total) {
            setOffset(offset + limit);
          }
        }}
        onEndReachedThreshold={0.5}
        renderItem={({ item, index }) => (
          <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontWeight: '600' }}>{item.name}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>{item.artist}</Text>
            <Button 
              title="Remover" 
              onPress={() => handleRemoveTrack(item.id)} 
              color="#d00" 
            />
          </View>
        )}
      />
    </View>
  );
}

// ============================================
// EXEMPLO 3: Playlists do Usuário
// ============================================

import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getUserPlaylists, getPlaylistTracks } from '../services/spotifyUserApi';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlaylists();
  }, []);

  async function loadPlaylists() {
    setLoading(true);
    try {
      const data = await getUserPlaylists(50);
      setPlaylists(data);
    } catch (error) {
      console.error('Error loading playlists:', error);
    } finally {
      setLoading(false);
    }
  }

  async function selectPlaylist(playlist) {
    setSelectedPlaylist(playlist);
    setLoading(true);
    try {
      const { tracks } = await getPlaylistTracks(playlist.id, 50);
      setPlaylistTracks(tracks);
    } catch (error) {
      console.error('Error loading playlist tracks:', error);
    } finally {
      setLoading(false);
    }
  }

  if (selectedPlaylist) {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity 
          onPress={() => {
            setSelectedPlaylist(null);
            setPlaylistTracks([]);
          }}
          style={{ padding: 12 }}
        >
          <Text>← Voltar</Text>
        </TouchableOpacity>

        <Text style={{ padding: 12, fontSize: 18, fontWeight: '700' }}>
          {selectedPlaylist.name}
        </Text>
        <Text style={{ paddingHorizontal: 12, color: '#666', fontSize: 12 }}>
          {playlistTracks.length} músicas
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#1db954" />
        ) : (
          <FlatList
            data={playlistTracks}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
                <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>{item.artist}</Text>
              </View>
            )}
          />
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ padding: 12, fontSize: 18, fontWeight: '700' }}>
        Suas Playlists
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1db954" />
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => selectPlaylist(item)}
              style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}
            >
              <Text style={{ fontWeight: '600' }}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>
                {item.tracks} músicas • {item.owner}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

// ============================================
// EXEMPLO 4: Mostrar Artistas Favoritos
// ============================================

import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, ActivityIndicator } from 'react-native';
import { getUserTopArtists } from '../services/spotifyUserApi';

export default function TopArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadArtists();
  }, []);

  async function loadArtists() {
    setLoading(true);
    try {
      const data = await getUserTopArtists('long_term', 50);
      setArtists(data);
    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ padding: 12, fontSize: 18, fontWeight: '700' }}>
        Seus Artistas Favoritos
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1db954" />
      ) : (
        <FlatList
          data={artists}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={{ flex: 1, margin: 8, alignItems: 'center' }}>
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 150, height: 150, borderRadius: 75 }}
                />
              )}
              <Text style={{ marginTop: 8, fontWeight: '600', textAlign: 'center' }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
                {item.followers.toLocaleString()} seguidores
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ============================================
// EXEMPLO 5: Verificar se Track está Curtido
// ============================================

import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { isTrackSaved, saveTrack, removeTrack } from '../services/spotifyUserApi';

export default function LikeButton({ trackId }) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIfSaved();
  }, [trackId]);

  async function checkIfSaved() {
    try {
      const result = await isTrackSaved(trackId);
      setIsSaved(result[0]); // Primeiro item do array
    } catch (error) {
      console.error('Error checking if saved:', error);
    }
  }

  async function toggleSave() {
    setLoading(true);
    try {
      if (isSaved) {
        await removeTrack(trackId);
        setIsSaved(false);
      } else {
        await saveTrack(trackId);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableOpacity 
      onPress={toggleSave} 
      disabled={loading}
      style={{ 
        padding: 8, 
        backgroundColor: isSaved ? '#1db954' : '#333',
        borderRadius: 4,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '600' }}>
        {isSaved ? '❤️ Curtido' : '🤍 Curtir'}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================
// EXEMPLO 6: Recently Played
// ============================================

import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import { getRecentlyPlayed } from '../services/spotifyUserApi';

export default function RecentlyPlayedPage() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecent();
  }, []);

  async function loadRecent() {
    setLoading(true);
    try {
      const data = await getRecentlyPlayed(50);
      setTracks(data);
    } catch (error) {
      console.error('Error loading recently played:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ padding: 12, fontSize: 18, fontWeight: '700' }}>
        Recentemente Tocadas
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1db954" />
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(item, idx) => `${item.id}-${idx}`}
          renderItem={({ item, index }) => (
            <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
              <Text style={{ fontWeight: '600' }}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>{item.artist}</Text>
              <Text style={{ fontSize: 10, color: '#999', marginTop: 4 }}>
                Tocada em: {new Date(item.playedAt).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ============================================
// EXEMPLO 7: Página Completa com Abas
// ============================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TopTracksPage from './TopTracksPage';
import TopArtistsPage from './TopArtistsPage';
import SavedTracksPage from './SavedTracksPage';
import PlaylistsPage from './PlaylistsPage';

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState('tracks');

  const renderContent = () => {
    switch (activeTab) {
      case 'tracks': return <TopTracksPage />;
      case 'artists': return <TopArtistsPage />;
      case 'saved': return <SavedTracksPage />;
      case 'playlists': return <PlaylistsPage />;
      default: return <TopTracksPage />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabBar}>
        {[
          { key: 'tracks', label: '🎵 Top Tracks' },
          { key: 'artists', label: '🎤 Artistas' },
          { key: 'saved', label: '❤️ Curtidas' },
          { key: 'playlists', label: '📋 Playlists' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#1db954',
  },
  tabText: {
    fontSize: 12,
    color: '#999',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '700',
  },
});
