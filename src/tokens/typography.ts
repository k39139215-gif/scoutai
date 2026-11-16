/**
 * ScoutAI Design Tokens: Typography System
 * Formatted strictly for editorial clarity, tabular numerics, and high agency feel.
 */

export const typography = {
  fontFamily: {
    base: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    mono: '"JetBrains Mono", SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },

  fontSize: {
    '2xs': '10.5px', // Tiny badge counter / small avatar initials
    xs: '11.5px',    // Meta tag, skill chip, timestamp
    sm: '12.5px',    // Table data cell, dropdown item, input placeholder
    base: '13.5px',  // Standard UI body text, candidate title
    md: '15px',      // Form label, card sub-header
    lg: '16px',      // Section title, workflow card heading
    xl: '18px',      // Prominent modal header, stat number
    '2xl': '20px',   // Large widget header
    '3xl': '24px',   // Page title ("All Candidates")
    '4xl': '30px',   // Analytics headline
    '5xl': '36px',   // Hero value
  },

  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
  },

  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  letterSpacing: {
    tighter: '-0.03em',
    tight: '-0.02em', // Key for 24px+ headings in Untitled UI
    snug: '-0.01em',
    normal: '0',
    wide: '0.01em',   // Key for 12px uppercase / table column headers
    wider: '0.02em',
  },
} as const;

export const textStyles = {
  pageTitle: {
    fontSize: typography.fontSize['3xl'],
    lineHeight: '32px',
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.tight,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    lineHeight: '24px',
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.snug,
  },
  cardTitle: {
    fontSize: typography.fontSize.base,
    lineHeight: '20px',
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.normal,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    lineHeight: '20px',
    fontWeight: typography.fontWeight.regular,
    letterSpacing: typography.letterSpacing.normal,
  },
  tableHeader: {
    fontSize: typography.fontSize.xs,
    lineHeight: '16px',
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wide,
  },
  tableCellName: {
    fontSize: typography.fontSize.base,
    lineHeight: '18px',
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.normal,
  },
  tableCellMeta: {
    fontSize: typography.fontSize.sm,
    lineHeight: '16px',
    fontWeight: typography.fontWeight.regular,
  },
  badge: {
    fontSize: typography.fontSize.xs,
    lineHeight: '1',
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: '0.01em',
  },
} as const;
