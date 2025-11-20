import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import theme from '../theme';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function SongItem({ image, name, duration, artist, audio, previewUrl, id, index, uri }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => navigation.navigate('Song', { song: { image, name, duration, artist, audio, previewUrl, id, uri } })}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View style={styles.indexBadge}>
          <Text style={styles.index}>{index + 1}</Text>
        </View>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>{name}</Text>
          <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
        </View>
      </View>

      <View style={styles.right}>
        {audio && <View style={styles.audioIndicator} />}
        <Text style={styles.duration}>{duration}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indexBadge: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.md,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  index: {
    ...typography.label,
    color: colors.text.secondary,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    marginRight: spacing.md,
    backgroundColor: colors.skeleton,
  },
  meta: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    ...typography.bodyMedium,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  artist: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  audioIndicator: {
    width: 6,
    height: 6,
    borderRadius: theme.borderRadius.circle,
    backgroundColor: colors.primary,
  },
  duration: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    minWidth: 32,
    textAlign: 'right',
  },
});

