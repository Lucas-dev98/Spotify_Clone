import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../theme/spacing';

/**
 * FlexRow Component
 * Flexbox row wrapper with spacing
 */
export function FlexRow({ children, gap = 'md', align = 'center', justify = 'flex-start', style = {} }) {
  return (
    <View
      style={[
        styles.flexRow,
        {
          gap: spacing[gap] || spacing.md,
          alignItems: align,
          justifyContent: justify,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * FlexCol Component
 * Flexbox column wrapper with spacing
 */
export function FlexCol({ children, gap = 'md', align = 'stretch', justify = 'flex-start', style = {} }) {
  return (
    <View
      style={[
        styles.flexCol,
        {
          gap: spacing[gap] || spacing.md,
          alignItems: align,
          justifyContent: justify,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * Spacer Component
 * Visual spacing element
 */
export function Spacer({ size = 'md', direction = 'vertical' }) {
  const sizeValue = spacing[size] || spacing.md;
  return (
    <View
      style={{
        width: direction === 'horizontal' ? sizeValue : 'auto',
        height: direction === 'vertical' ? sizeValue : 'auto',
      }}
    />
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  flexCol: {
    flexDirection: 'column',
  },
});

export default { FlexRow, FlexCol, Spacer };
