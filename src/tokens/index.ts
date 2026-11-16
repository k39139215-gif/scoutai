/**
 * ScoutAI Design Token System (Master Entry Point)
 * Systematically built and mathematically sampled from the user's reference designs:
 * - Untitled UI (Header, Search, Quick Actions, High-Density Table, Dropdown Popover, Undo Toast)
 * - Gr8r Studio (Workflows, Recent Activity, 3-Bar Signal Segmenter, Kanban Columns)
 * - Halo / Modern SaaS (Concentric radii, deep ink `#101828`, cool diffused shadows)
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radii';
export * from './shadows';
export * from './motion';
export * from './components';

import { colors, semanticColors } from './colors';
import { typography, textStyles } from './typography';
import { spacing, layoutMetrics } from './spacing';
import { radii, componentRadii } from './radii';
import { shadows } from './shadows';
import { motion } from './motion';
import { componentTokens } from './components';

export const tokens = {
  colors,
  semanticColors,
  typography,
  textStyles,
  spacing,
  layoutMetrics,
  radii,
  componentRadii,
  shadows,
  motion,
  components: componentTokens,
} as const;

export type DesignTokens = typeof tokens;

/**
 * Helper: Resolve match percentage badge colors
 */
export function getMatchBadgeStyle(score: number) {
  if (score >= 90) {
    return {
      text: colors.success[700].hex,
      bg: colors.success[50].hex,
      border: colors.success[200].hex,
      dot: colors.success[700].hex,
    };
  }
  if (score >= 85) {
    return {
      text: colors.warning[700].hex,
      bg: colors.warning[50].hex,
      border: colors.warning[200].hex,
      dot: colors.warning[700].hex,
    };
  }
  return {
    text: colors.error[700].hex,
    bg: colors.error[50].hex,
    border: colors.error[200].hex,
    dot: colors.error[700].hex,
  };
}

/**
 * Helper: Resolve candidate pipeline status style
 */
export function getStatusBadgeStyle(status: string) {
  switch (status.toLowerCase()) {
    case 'active':
    case 'qualified':
    case 'shortlisted':
      return {
        text: colors.success[700].hex,
        bg: colors.success[50].hex,
        border: colors.success[200].hex,
      };
    case 'interviewing':
    case 'paused':
      return {
        text: colors.warning[700].hex,
        bg: colors.warning[50].hex,
        border: colors.warning[200].hex,
      };
    case 'archived':
    case 'cancelled':
    case 'rejected':
      return {
        text: colors.error[700].hex,
        bg: colors.error[50].hex,
        border: colors.error[200].hex,
      };
    case 'draft':
    default:
      return {
        text: colors.gray[700].hex,
        bg: colors.gray[100].hex,
        border: colors.gray[200].hex,
      };
  }
}

export default tokens;
