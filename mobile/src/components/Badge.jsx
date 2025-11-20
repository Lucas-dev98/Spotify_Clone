import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import theme from '../theme';

/**
 * Badge Component
 * Display small informative labels
 */
export default function Badge({ 
  label, 
  variant = 'primary',  // primary, success, error, warning, info, secondary
  size = 'md',          // sm, md, lg
  icon = null
}) {
  const variantStyles = {
    primary: { bg: colors.primary, text: colors.text.primary },
    success: { bg: colors.success, text: colors.text.primary },
    error: { bg: colors.error, text: colors.text.primary },
    warning: { bg: colors.warning, text: colors.text.primary },
    info: { bg: colors.info, text: colors.text.primary },
    secondary: { bg: colors.surfaceLight, text: colors.text.secondary },
  };

  const sizeStyles = {
    sm: { padding: spacing.xs, fontSize: 10 },
    md: { padding: spacing.sm, fontSize: 12 },
    lg: { padding: spacing.md, fontSize: 14 },
  };

  const variant_style = variantStyles[variant] || variantStyles.primary;
  const size_style = sizeStyles[size] || sizeStyles.md;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variant_style.bg,
          paddingHorizontal: size_style.padding,
          paddingVertical: size_style.padding / 2,
        },
      ]}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text
        style={[
          styles.label,
          {
            color: variant_style.text,
            fontSize: size_style.fontSize,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.circle,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '600',
  },
  icon: {
    marginRight: spacing.xs,
  },
});
