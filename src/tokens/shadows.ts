/**
 * ScoutAI Design Tokens: Shadows & Elevation
 * Multi-layer diffuse shadows with cool gray tint rgba(16, 24, 40, ...).
 * No muddy black drop shadows.
 */

export const shadows = {
  none: 'none',

  // Subtle resting elevation for cards & tables
  xs: '0 1px 2px rgba(16, 24, 40, 0.05)',
  
  // Segmented control active pill
  sm: '0 1px 3px rgba(16, 24, 40, 0.08), 0 1px 2px rgba(16, 24, 40, 0.04)',

  // Card hover state
  md: '0 4px 10px -2px rgba(16, 24, 40, 0.06), 0 2px 4px -2px rgba(16, 24, 40, 0.04)',

  // Dropdown menus & popovers (Exact Untitled UI Image 5)
  dropdown: '0 12px 24px -4px rgba(16, 24, 40, 0.12), 0 4px 6px -2px rgba(16, 24, 40, 0.04)',

  // Floating Undo Toast (Exact Untitled UI Image 5)
  toast: '0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16, 24, 40, 0.03)',

  // Modal dialog overlay
  modal: '0 24px 48px -12px rgba(16, 24, 40, 0.18), 0 12px 16px -6px rgba(16, 24, 40, 0.08)',
} as const;
