/**
 * ScoutAI Design Tokens: Concentric Border Radii
 * Follows the concentric corner curvature principle:
 * R_outer = R_inner + padding to prevent awkward corner nesting.
 */

export const radii = {
  none: '0px',
  xs: '4px',     // Checkbox, tiny skill tag, status pill inner
  sm: '6px',     // Segmented control button, small dropdown item
  md: '8px',     // Form input, secondary button, icon wrapper container
  lg: '10px',    // Dropdown popover container, Kanban task card
  xl: '12px',    // Standard card, high-density table container, toast card
  '2xl': '16px', // Large modal dialog, showcase banner
  '3xl': '20px', // Extra large overlay container
  full: '9999px',// Pills, circular avatars, toggle track
} as const;

export const componentRadii = {
  button: radii.md,
  card: radii.xl,
  table: radii.xl,
  input: radii.md,
  dropdownMenu: radii.lg,
  dropdownItem: radii.sm,
  segmentTrack: radii.md,
  segmentPill: radii.sm,
  badgePill: radii.full,
  toast: radii.xl,
  toggleSwitch: radii.full,
} as const;
