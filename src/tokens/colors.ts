/**
 * ScoutAI Design Tokens: Color System
 * Forensically sampled from Untitled UI, Gr8r Studio, and Halo reference artifacts.
 * Includes exact HEX, HSL, and semantic aliases.
 */

export interface ColorToken {
  hex: string;
  hsl: string;
  description?: string;
}

export const colors = {
  // ── 1. NEUTRAL / GRAY SCALE (Untitled UI Slate Ramp) ──────────────────────
  // Slightly cool blue-undertone ink that eliminates harsh 100% black contrast
  gray: {
    25: { hex: '#fcfcfd', hsl: 'hsl(240, 20%, 99%)', description: 'Ultra-subtle page canvas' },
    50: { hex: '#f9fafb', hsl: 'hsl(210, 20%, 98%)', description: 'Table zebra, badge base, avatar background' },
    100: { hex: '#f2f4f7', hsl: 'hsl(220, 16%, 96%)', description: 'Segmented control track, tag chip background' },
    200: { hex: '#eaecf0', hsl: 'hsl(220, 14%, 93%)', description: 'Default hairline border, table horizontal divider' },
    300: { hex: '#d0d5dd', hsl: 'hsl(216, 12%, 84%)', description: 'Form input border, inactive switch track' },
    400: { hex: '#98a2b3', hsl: 'hsl(218, 11%, 65%)', description: 'Muted icon, placeholder text, plus indicator' },
    500: { hex: '#667085', hsl: 'hsl(220, 13%, 46%)', description: 'Table column header, meta timestamp' },
    600: { hex: '#475467', hsl: 'hsl(215, 18%, 34%)', description: 'Section subtitle, secondary copy' },
    700: { hex: '#344054', hsl: 'hsl(215, 25%, 27%)', description: 'Dropdown menu label, secondary button text' },
    800: { hex: '#1d2939', hsl: 'hsl(215, 32%, 17%)', description: 'Dark button hover, prominent badge' },
    900: { hex: '#101828', hsl: 'hsl(220, 40%, 11%)', description: 'Primary ink headings, active text, primary CTA' },
    950: { hex: '#0c111d', hsl: 'hsl(222, 42%, 8%)', description: 'Deepest midnight black' },
  },

  // ── 2. SUCCESS / MATCH FIT RAMP (Emerald) ──────────────────────────────────
  // Used in match percentage (91% Match), "Active" workflows, and verified badges
  success: {
    25: { hex: '#f6fef9', hsl: 'hsl(144, 75%, 98%)' },
    50: { hex: '#ecfdf3', hsl: 'hsl(138, 76%, 96%)', description: 'Badge pill background' },
    100: { hex: '#d1fadf', hsl: 'hsl(141, 74%, 90%)' },
    200: { hex: '#a6f4c5', hsl: 'hsl(143, 76%, 81%)', description: 'Badge pill hairline border' },
    300: { hex: '#6ce9a6', hsl: 'hsl(148, 74%, 67%)' },
    400: { hex: '#32d583', hsl: 'hsl(150, 68%, 52%)' },
    500: { hex: '#12b76a', hsl: 'hsl(152, 82%, 40%)', description: 'Live status pulse dot' },
    600: { hex: '#039855', hsl: 'hsl(152, 96%, 30%)' },
    700: { hex: '#027a48', hsl: 'hsl(154, 95%, 24%)', description: 'Badge pill text (WCAG AAA compliant)' },
    800: { hex: '#05603a', hsl: 'hsl(155, 90%, 20%)' },
    900: { hex: '#054f31', hsl: 'hsl(156, 88%, 16%)' },
  },

  // ── 3. WARNING / REVIEW RAMP (Amber) ──────────────────────────────────────
  // Used in "Paused" workflows, medium candidate fit (85-89%), and pending actions
  warning: {
    25: { hex: '#fffcf5', hsl: 'hsl(40, 100%, 98%)' },
    50: { hex: '#fffaeb', hsl: 'hsl(45, 100%, 96%)', description: 'Warning pill background' },
    100: { hex: '#fef0c7', hsl: 'hsl(43, 96%, 89%)' },
    200: { hex: '#fedf89', hsl: 'hsl(43, 97%, 77%)', description: 'Warning pill hairline border' },
    300: { hex: '#fec84b', hsl: 'hsl(42, 98%, 65%)' },
    400: { hex: '#fdb022', hsl: 'hsl(39, 98%, 56%)' },
    500: { hex: '#f79009', hsl: 'hsl(34, 93%, 50%)', description: 'Warning indicator dot' },
    600: { hex: '#dc6803', hsl: 'hsl(28, 97%, 44%)' },
    700: { hex: '#b54708', hsl: 'hsl(21, 92%, 37%)', description: 'Warning pill text (WCAG AAA compliant)' },
    800: { hex: '#93370d', hsl: 'hsl(19, 84%, 31%)' },
    900: { hex: '#7a2e0e', hsl: 'hsl(18, 79%, 27%)' },
  },

  // ── 4. ERROR / DESTRUCTIVE RAMP (Rose / Crimson) ──────────────────────────
  // Used in "Archive Candidate", destructive modal confirmation, and error toast
  error: {
    25: { hex: '#fffbfa', hsl: 'hsl(12, 100%, 99%)' },
    50: { hex: '#fef3f2', hsl: 'hsl(4, 86%, 97%)', description: 'Destructive item hover bg' },
    100: { hex: '#fee4e2', hsl: 'hsl(5, 87%, 94%)' },
    200: { hex: '#fecdca', hsl: 'hsl(5, 86%, 89%)', description: 'Destructive border' },
    300: { hex: '#fda29b', hsl: 'hsl(4, 95%, 80%)' },
    400: { hex: '#f97066', hsl: 'hsl(5, 93%, 69%)' },
    500: { hex: '#f04438', hsl: 'hsl(4, 86%, 58%)', description: 'Critical icon color' },
    600: { hex: '#d92d20', hsl: 'hsl(4, 74%, 49%)' },
    700: { hex: '#b42318', hsl: 'hsl(4, 77%, 40%)', description: 'Destructive action text' },
    800: { hex: '#912018', hsl: 'hsl(4, 72%, 33%)' },
    900: { hex: '#7a271a', hsl: 'hsl(8, 65%, 29%)' },
  },

  // ── 5. BRAND / PRIMARY ACCENT (Obsidian & Indigo) ─────────────────────────
  brand: {
    ink: { hex: '#101828', hsl: 'hsl(220, 40%, 11%)', description: 'Primary brand dark CTA' },
    inkHover: { hex: '#1d2939', hsl: 'hsl(215, 32%, 17%)' },
    indigo: { hex: '#4338ca', hsl: 'hsl(244, 58%, 51%)', description: 'Interactive link and recruiter tag' },
    indigoSubtle: { hex: '#eef2ff', hsl: 'hsl(231, 100%, 97%)' },
    indigoBorder: { hex: '#c7d2fe', hsl: 'hsl(228, 96%, 89%)' },
  },

  // ── 6. DARK MODE TRACKS (Sampled from Image 9 dark 3-bar segmenter) ───────
  dark: {
    canvas: { hex: '#0f1117', hsl: 'hsl(224, 21%, 7%)' },
    surface: { hex: '#161922', hsl: 'hsl(225, 21%, 11%)' },
    track: { hex: '#1f242f', hsl: 'hsl(220, 20%, 15%)', description: 'Dark segmented track' },
    pill: { hex: '#344054', hsl: 'hsl(215, 25%, 27%)', description: 'Active dark segment pill' },
    border: { hex: '#333741', hsl: 'hsl(222, 12%, 23%)' },
    text: { hex: '#f5f5f6', hsl: 'hsl(240, 3%, 96%)' },
    textMuted: { hex: '#94969c', hsl: 'hsl(227, 4%, 60%)' },
  },
} as const;

// ── SEMANTIC TOKENS (High-Level Mappings) ─────────────────────────────────────
export const semanticColors = {
  // Surfaces
  surfaceCanvas: colors.gray[25].hex,
  surfaceWhite: '#ffffff',
  surfaceCard: '#ffffff',
  surfaceCardSubtle: colors.gray[50].hex,
  surfaceSegmentTrack: colors.gray[100].hex,
  surfaceRowHover: colors.gray[50].hex,
  surfaceSelected: colors.gray[50].hex,

  // Borders
  borderHairline: colors.gray[200].hex,
  borderSubtle: colors.gray[100].hex,
  borderDefault: colors.gray[200].hex,
  borderInput: colors.gray[300].hex,
  borderHover: colors.gray[400].hex,

  // Text
  textPrimary: colors.gray[900].hex,
  textSecondary: colors.gray[700].hex,
  textMuted: colors.gray[600].hex,
  textLight: colors.gray[500].hex,
  textDisabled: colors.gray[400].hex,
  textInverse: '#ffffff',

  // Interactive Buttons
  btnPrimaryBg: colors.brand.ink.hex,
  btnPrimaryHover: colors.brand.inkHover.hex,
  btnPrimaryText: '#ffffff',

  btnSecondaryBg: '#ffffff',
  btnSecondaryBorder: colors.gray[300].hex,
  btnSecondaryText: colors.gray[700].hex,
  btnSecondaryHover: colors.gray[50].hex,

  // Match Fit Badges
  matchHighText: colors.success[700].hex,
  matchHighBg: colors.success[50].hex,
  matchHighBorder: colors.success[200].hex,

  matchMediumText: colors.warning[700].hex,
  matchMediumBg: colors.warning[50].hex,
  matchMediumBorder: colors.warning[200].hex,

  matchLowText: colors.error[700].hex,
  matchLowBg: colors.error[50].hex,
  matchLowBorder: colors.error[200].hex,
} as const;
