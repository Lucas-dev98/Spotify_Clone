import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import theme from '../theme';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function SingleItem({ id, name, image, banner, artist, idPath }) {
  const navigation = useNavigation();

  const onPress = () => {
    if (idPath === '/artist') {
      navigation.navigate('Artist', { artist: { id, name, image, banner } });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image 
        source={{ uri: image }} 
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{name}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{artist ?? 'Artista'}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.md,
    marginRight: spacing.md,
    backgroundColor: colors.skeleton,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.bodyMedium,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  arrow: {
    ...typography.headingSmall,
    color: colors.text.tertiary,
    marginLeft: spacing.md,
  },
});

