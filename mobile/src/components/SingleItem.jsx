import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SingleItem({ id, name, image, banner, artist, idPath }) {
  const navigation = useNavigation();

  const onPress = () => {
    if (idPath === '/artist') {
      navigation.navigate('Artist', { artist: { id, name, image, banner } });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image 
        source={{ uri: image }} 
        style={styles.image}
      />
      <View style={styles.texts}>
        <Text style={styles.title} numberOfLines={2}>{name}</Text>
        <Text style={styles.type} numberOfLines={1}>{artist ?? 'Artista'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  texts: { flex: 1 },
  title: { fontSize: 14, fontWeight: '700', color: '#000' },
  type: { fontSize: 12, color: '#666', marginTop: 4 },
});

