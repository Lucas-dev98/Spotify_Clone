/**
 * Theme Configuration - Complete Design System
 * Centralized theme for consistent UI/UX
 */

import colors from './colors';
import typography from './typography';
import { spacing, borderRadius, shadows } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  
  // Layout constants
  layout: {
    headerHeight: 64,
    tabBarHeight: 60,
    playerHeight: 80,
    screenPadding: spacing.lg,
  },
  
  // Animation timings
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
    slowest: 800,
  },
};

export default theme;
