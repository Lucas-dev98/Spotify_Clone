import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import SingleItem from './SingleItem';
import { useNavigation } from '@react-navigation/native';
import theme from '../theme';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function ItemList({ title, items = 10, itemsArray = [], path = 'Artists', idPath = '/artist' }) {
  const navigation = useNavigation();

  if (!itemsArray || itemsArray.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title} populares</Text>
        </View>
        <Text style={styles.emptyText}>Nenhum item disponível</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{title} populares</Text>
          <Text style={styles.subtitle}>Descubra novos favoritos</Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.navigate(path)}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>Ver tudo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={itemsArray.slice(0, items)}
        scrollEnabled={false}
        keyExtractor={(item, i) => String(item?.id || i)}
        renderItem={({ item }) => (
          <SingleItem {...item} idPath={idPath} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  headerContent: {
    flex: 1,
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
  viewAllButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceHover,
    borderRadius: theme.borderRadius.md,
  },
  viewAllText: {
    ...typography.label,
    color: colors.primary,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    paddingHorizontal: spacing.lg,
  },
});

