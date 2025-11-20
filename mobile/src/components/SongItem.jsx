import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SongItem({ image, name, duration, artist, audio, previewUrl, id, index }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Song', { song: { image, name, duration, artist, audio, previewUrl, id } })}>
      <View style={styles.left}>
        <Text style={styles.index}>{index + 1}</Text>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.meta}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.artist}>{artist}</Text>
        </View>
      </View>

      <Text style={styles.duration}>{duration}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', padding: 12, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#eee' },
  left: { flexDirection: 'row', alignItems: 'center' },
  index: { width: 24, textAlign: 'center', color: '#666' },
  image: { width: 48, height: 48, borderRadius: 6, marginHorizontal: 8 },
  meta: { maxWidth: 220 },
  title: { fontSize: 16, fontWeight: '600' },
  artist: { fontSize: 12, color: '#666' },
  duration: { fontSize: 12, color: '#666' },
});

