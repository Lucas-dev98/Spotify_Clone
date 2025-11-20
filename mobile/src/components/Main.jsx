import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ItemList from './ItemList';
import SongItem from './SongItem';
import { artistArray as localArtists } from '../assets/database/artists';
import { songsArray as localSongs } from '../assets/database/songs';

export default function Main({ type, artists, songs }) {
  const artistsSource = artists && artists.length ? artists : localArtists;
  const songsSource = songs && songs.length ? songs : localSongs;

  return (
    <View>
      {(type === 'artists' || type === undefined) && (
        <ItemList title="Artistas" items={5} itemsArray={artistsSource} path="Artists" idPath="/artist" />
      )}

      {(type === 'songs' || type === undefined) && (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Músicas Populares</Text>
          </View>
          <FlatList
            data={songsSource.slice(0, 8)}
            scrollEnabled={false}
            keyExtractor={(item, i) => String(item?.id || i)}
            renderItem={({ item, index }) => (
              <SongItem {...item} index={index} />
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 12, paddingVertical: 12, paddingBottom: 0 },
  title: { fontSize: 16, fontWeight: '700', color: '#000' },
});
