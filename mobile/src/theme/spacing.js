/**
 * Spacing System - Consistent spacing scale
 * Based on 4px grid for precise alignment
 */

export const spacing = {
  // Core spacing scale (4px base)
  xs: 4,      // Extra small
  sm: 8,      // Small
  md: 12,     // Medium (default)
  lg: 16,     // Large
  xl: 24,     // Extra large
  xxl: 32,    // 2X large
  xxxl: 48,   // 3X large
  
  // Aliases for semantic naming
  none: 0,
  micro: 2,
  tiny: 4,
  small: 8,
  compact: 12,
  cozy: 16,
  comfortable: 24,
  spacious: 32,
  generous: 48,
};

/**
 * Border Radius System
 * For consistent rounded corners
 */
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  circle: 999,
};

/**
 * Shadows - Elevation system
 * For depth and hierarchy
 */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  // Subtle elevation
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Medium elevation
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Large elevation
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  
  // Extra large elevation
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
};

export default {
  spacing,
  borderRadius,
  shadows,
};
