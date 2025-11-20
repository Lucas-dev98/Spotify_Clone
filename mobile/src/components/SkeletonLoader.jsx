import React, { useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import theme from '../theme';

/**
 * Skeleton Loader Component
 * Shimmer animation for loading states
 */
export default function SkeletonLoader({ width = 100, height = 20, style = {}, borderRadiusSize = 'md' }) {
  const shimmerAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: borderRadius[borderRadiusSize] || borderRadius.md,
          opacity,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.skeleton,
  },
});
