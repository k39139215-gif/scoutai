/**
 * ScoutAI Design Tokens: Spacing Scale
 * Linear-geometric scale designed for balanced visual rhythm and concentric container alignment.
 */

export const spacing = {
  0: '0px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  4.5: '18px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
} as const;

export const layoutMetrics = {
  headerHeight: '52px',
  sidebarWidth: '248px',
  sidebarCollapsedWidth: '64px',
  contentMaxWidth: '1600px',

  // Control standard heights
  controlHeightXs: '26px', // Mini tag
  controlHeightSm: '30px', // Table pagination button
  controlHeightMd: '32px', // Standard input, secondary button, segment pill
  controlHeightLg: '36px', // Primary CTA button ("Post Requisition")
  controlHeightXl: '40px', // Large modal action button

  // Table padding
  tableCellPaddingX: '16px',
  tableCellPaddingY: '12px',

  // Card padding
  cardPaddingSm: '14px 16px',
  cardPaddingMd: '16px 18px',
  cardPaddingLg: '20px 24px',
} as const;
