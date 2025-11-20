import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Player from '../components/Player';

export default function Song({ route }) {
  const { song } = route.params ?? {};
  const [isPlaying, setIsPlaying] = useState(false);

  if (!song) {
    return (
      <View style={{ flex: 1 }}>
        <Header title="Música" />
        <Text style={{ padding: 16, color: '#666' }}>Música não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title={song.name} />
      <ScrollView contentContainerStyle={styles.container}>
        {song.image && (
          <Image source={{ uri: song.image }} style={styles.image} />
        )}
        
        <Text style={styles.title}>{song.name}</Text>
        <Text style={styles.artist}>{song.artist}</Text>
        <Text style={styles.duration}>{song.duration}</Text>

        {song.audio || song.previewUrl ? (
          <View style={styles.playerContainer}>
            <Player source={song.audio || song.previewUrl} title={song.name} />
          </View>
        ) : (
          <View style={styles.playerContainer}>
            <Text style={styles.noAudio}>Áudio não disponível para esta música</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center', paddingBottom: 100 },
  image: { width: 220, height: 220, borderRadius: 12, marginBottom: 24 },
  title: { fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 8 },
  artist: { fontSize: 16, color: '#666', marginBottom: 8 },
  duration: { fontSize: 14, color: '#999', marginBottom: 24 },
  playerContainer: { width: '100%', marginTop: 24, paddingHorizontal: 16 },
  noAudio: { fontSize: 14, color: '#999', textAlign: 'center', padding: 12 },
});
