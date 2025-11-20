/**
 * Color Palette - Spotify Premium Design System
 * Dark mode optimized for music streaming experience
 */

export const colors = {
  // Primary Brand Colors
  primary: '#1DB954',        // Spotify Green (vibrant, energetic)
  primaryLight: '#1ed760',   // Lighter green for interactions
  primaryDark: '#1aa34a',    // Darker green for depth
  
  // Neutrals - Premium Dark Theme
  background: '#0f0f0f',     // Deep black for OLED
  surface: '#1a1a1a',        // Primary surface
  surfaceLight: '#282828',   // Secondary surface
  surfaceHover: '#333333',   // Hover state
  
  // Text Colors
  text: {
    primary: '#ffffff',      // Primary text
    secondary: '#b3b3b3',    // Secondary text
    tertiary: '#7f7f7f',     // Tertiary text
    muted: '#4d4d4d',        // Muted text
  },
  
  // Semantic Colors
  success: '#1ed760',
  error: '#e22134',
  errorLight: '#f0a9a0',
  warning: '#ffa500',
  info: '#1da1f2',
  
  // Gradients
  gradient: {
    primary: ['#1DB954', '#1aa34a'],
    dark: ['#0f0f0f', '#1a1a1a'],
    accent: ['#FF006E', '#1DB954'],
  },
  
  // Special
  transparent: 'rgba(255, 255, 255, 0)',
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayStrong: 'rgba(0, 0, 0, 0.7)',
  
  // Status specific
  skeleton: '#282828',
  disabled: '#4d4d4d',
  border: '#282828',
};

export default colors;
