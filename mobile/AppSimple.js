import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, ScrollView, FlatList, Image, StyleSheet } from 'react-native';
import { songsArray } from './src/assets/database/songs';

export default function AppSimple() {
  const renderSong = ({ item }) => (
    <View style={styles.songItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
      </View>
      <Text style={styles.duration}>{item.duration}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>♫ Spotify</Text>
      </View>
      <FlatList
        data={songsArray}
        renderItem={renderSong}
        keyExtractor={(item) => String(item.id)}
        scrollEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#1db954', paddingVertical: 16 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  songItem: { flexDirection: 'row', padding: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  image: { width: 50, height: 50, borderRadius: 4, marginRight: 12 },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: '#000' },
  artist: { fontSize: 12, color: '#666', marginTop: 4 },
  duration: { fontSize: 12, color: '#999' },
});
