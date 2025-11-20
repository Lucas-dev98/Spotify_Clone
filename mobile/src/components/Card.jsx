import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import theme from '../theme';

/**
 * Card Component
 * Elevated container for content with consistent styling
 */
export default function Card({
  children,
  style = {},
  onPress = null,
  elevation = 'md',    // none, sm, md, lg, xl
  variant = 'surface', // surface, surfaceLight, primary
  borderRadius_size = 'md',
}) {
  const variantBg = {
    surface: colors.surface,
    surfaceLight: colors.surfaceLight,
    primary: colors.primary,
  };

  const elevationStyle = shadows[elevation] || shadows.md;

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        styles.card,
        {
          backgroundColor: variantBg[variant],
          borderRadius: borderRadius[borderRadius_size] || borderRadius.md,
          ...elevationStyle,
        },
        style,
      ]}
    >
      {children}
    </Component>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
  },
});
