/**
 * ScoutAI Design Tokens: Component Specifications
 * Extracted directly from:
 * - Image 10: Untitled UI All Files & File Explorer Cards
 * - Image 9: 3-Bar Signal Antenna Segmenter (Light & Dark)
 * - Image 8: Gr8r Studio Workflows & Activity
 * - Image 5: Untitled UI Dropdown Menu & Undo Toast
 */

import { colors } from './colors';
import { radii, componentRadii } from './radii';
import { shadows } from './shadows';
import { typography } from './typography';

export const componentTokens = {
  // ── 1. QUICK ACTION CARDS (Untitled UI Image 10) ─────────────────────────
  quickActionCard: {
    background: '#ffffff',
    border: `1px solid ${colors.gray[200].hex}`,
    borderRadius: radii.xl,
    padding: '16px 18px',
    boxShadow: shadows.xs,
    iconBox: {
      width: '38px',
      height: '38px',
      borderRadius: radii.md,
      background: colors.gray[50].hex,
      border: `1px solid ${colors.gray[100].hex}`,
      iconSize: 18,
      color: colors.gray[900].hex,
    },
    title: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.gray[900].hex,
    },
    description: {
      fontSize: typography.fontSize.xs,
      color: colors.gray[500].hex,
    },
    plusIcon: {
      size: 16,
      color: colors.gray[400].hex,
    },
    hover: {
      borderColor: colors.gray[300].hex,
      boxShadow: shadows.md,
    },
  },

  // ── 2. EXACT 3-BAR SIGNAL ANTENNA SEGMENTER (Gr8r Studio Image 9) ────────
  signalSegmenter: {
    track: {
      background: colors.gray[100].hex,
      padding: '3px',
      borderRadius: componentRadii.segmentTrack,
      gap: '2px',
    },
    pill: {
      height: '28px',
      padding: '0 11px',
      borderRadius: componentRadii.segmentPill,
      fontSize: typography.fontSize.sm,
      fontWeightActive: typography.fontWeight.semibold,
      fontWeightInactive: typography.fontWeight.medium,
      colorActive: colors.gray[900].hex,
      colorInactive: colors.gray[600].hex,
      bgActive: '#ffffff',
      shadowActive: shadows.sm,
    },
    bars: {
      width: '2.5px',
      gap: '1.5px',
      borderRadius: '1px',
      heights: {
        low: '4px',
        medium: '7px',
        high: '10px',
      },
      colorActive: colors.gray[900].hex,
      colorInactive: colors.gray[500].hex,
      colorDisabled: colors.gray[300].hex,
    },
    darkVariant: {
      trackBg: colors.dark.track.hex,
      pillBgActive: colors.dark.pill.hex,
      colorActive: colors.dark.text.hex,
      colorInactive: colors.dark.textMuted.hex,
      barDisabledColor: '#475467',
    },
  },

  // ── 3. ACTION DROPDOWN MENU WITH TOGGLE (Untitled UI Image 5) ─────────────
  dropdownMenu: {
    width: '210px',
    background: '#ffffff',
    border: `1px solid ${colors.gray[200].hex}`,
    borderRadius: componentRadii.dropdownMenu,
    boxShadow: shadows.dropdown,
    padding: '6px',
    item: {
      padding: '8px 10px',
      borderRadius: componentRadii.dropdownItem,
      fontSize: typography.fontSize.sm,
      color: colors.gray[700].hex,
      hoverBg: colors.gray[50].hex,
      iconSize: 14,
    },
    toggleSwitch: {
      trackWidth: '28px',
      trackHeight: '16px',
      trackBorderRadius: radii.full,
      trackBgActive: colors.brand.ink.hex,
      trackBgInactive: colors.gray[300].hex,
      thumbSize: '12px',
      thumbColor: '#ffffff',
      thumbOffsetActive: '14px',
      thumbOffsetInactive: '2px',
    },
    destructiveItem: {
      color: colors.error[700].hex,
      hoverBg: colors.error[50].hex,
      iconSize: 14,
    },
    divider: {
      height: '1px',
      background: colors.gray[100].hex,
      margin: '4px 0',
    },
  },

  // ── 4. FLOATING UNDO TOAST (Untitled UI Image 5) ──────────────────────────
  undoToast: {
    width: '380px',
    background: '#ffffff',
    border: `1px solid ${colors.gray[200].hex}`,
    borderRadius: componentRadii.toast,
    boxShadow: shadows.toast,
    padding: '16px',
    iconBox: {
      width: '32px',
      height: '32px',
      borderRadius: radii.md,
      background: colors.success[50].hex,
      color: colors.success[700].hex,
      size: 16,
    },
    title: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.gray[900].hex,
    },
    subtitle: {
      fontSize: typography.fontSize.xs,
      color: colors.gray[600].hex,
    },
    restoreBtn: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      color: colors.gray[900].hex,
    },
    dismissBtn: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      color: colors.gray[600].hex,
    },
  },

  // ── 5. STATUS CAPSULES & BADGES (Gr8r Studio Image 8) ─────────────────────
  statusBadges: {
    active: {
      bg: colors.success[50].hex,
      text: colors.success[700].hex,
      border: colors.success[200].hex,
      label: 'Active',
    },
    paused: {
      bg: colors.warning[50].hex,
      text: colors.warning[700].hex,
      border: colors.warning[200].hex,
      label: 'Paused',
    },
    draft: {
      bg: colors.gray[100].hex,
      text: colors.gray[700].hex,
      border: colors.gray[200].hex,
      label: 'Draft',
    },
    archived: {
      bg: colors.gray[100].hex,
      text: colors.gray[500].hex,
      border: colors.gray[200].hex,
      label: 'Archived',
    },
  },
} as const;
