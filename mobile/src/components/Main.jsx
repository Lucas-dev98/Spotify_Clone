import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ItemList from './ItemList';
import SongItem from './SongItem';
import { artistArray as localArtists } from '../assets/database/artists';
import { songsArray as localSongs } from '../assets/database/songs';
import theme from '../theme';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function Main({ type, artists, songs }) {
  const artistsSource = artists && artists.length ? artists : localArtists;
  const songsSource = songs && songs.length ? songs : localSongs;

  return (
    <View style={styles.container}>
      {(type === 'artists' || type === undefined) && (
        <ItemList title="Artistas" items={5} itemsArray={artistsSource} path="Artists" idPath="/artist" />
      )}

      {(type === 'songs' || type === undefined) && (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Músicas Populares</Text>
            <Text style={styles.subtitle}>Tendências de agora</Text>
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
  container: {
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.headingSmall,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
});
