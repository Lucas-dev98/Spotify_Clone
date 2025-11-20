/**
 * Typography System - Spotify Design Language
 * Hierarchical text styles for consistent visual hierarchy
 */

export const typography = {
  // Display - Hero sections, main titles
  display: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  
  // Heading Large - Section titles, major headings
  headingLarge: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  
  // Heading Medium - Subsection titles
  headingMedium: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  
  // Heading Small - List headers, card titles
  headingSmall: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  
  // Body Large - Primary body text
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  
  // Body Medium - Secondary body text (default)
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  
  // Body Small - Tertiary text, metadata
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  
  // Label - Tags, labels, badges
  label: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  
  // Caption - Smallest text
  caption: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
};

export default typography;
