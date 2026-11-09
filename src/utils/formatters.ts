/**
 * ScoutAI Unified Formatting Helpers
 * Anchored to the demo reference date '2026-08-15' (IST)
 */

export const DEMO_TODAY_ANCHOR = '2026-08-15';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Format ISO date string (YYYY-MM-DD) into standardized "Aug 15, 2026"
 */
export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '—';
  
  // Extract YYYY-MM-DD
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return dateStr;
  
  const [, year, month, day] = match;
  const monthIdx = parseInt(month, 10) - 1;
  const monthName = MONTH_NAMES[monthIdx] || month;
  const dayNum = parseInt(day, 10);
  
  return `${monthName} ${dayNum}, ${year}`;
}

/**
 * Standardize time string into "2:30 PM IST" or "14:30 IST"
 */
export function formatTime(timeStr: string | undefined | null): string {
  if (!timeStr) return '';
  const trimmed = timeStr.trim();

  // If already formatted like "2:30 PM IST", return
  if (trimmed.includes('AM') || trimmed.includes('PM')) {
    return trimmed;
  }

  // Parse 24-hr like "14:30" or "14:30 IST"
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?:\s*IST)?/i);
  if (!match) return trimmed;

  const hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutes} ${period} IST`;
}

/**
 * Format timestamp like "2026-08-14 11:20:00" into "Aug 14, 2026 • 11:20 AM IST"
 */
export function formatDateTime(dateTimeStr: string | undefined | null): string {
  if (!dateTimeStr) return '—';
  
  const parts = dateTimeStr.split(/[\sT]+/);
  const dateFormatted = formatDate(parts[0]);
  if (parts.length > 1 && parts[1]) {
    const timeFormatted = formatTime(parts[1]);
    return `${dateFormatted} • ${timeFormatted}`;
  }
  return dateFormatted;
}

/**
 * Relative date descriptor relative to anchor date '2026-08-15'
 */
export function getRelativeDateLabel(dateStr: string | undefined | null, anchor = DEMO_TODAY_ANCHOR): string {
  if (!dateStr) return '';
  const dateKey = dateStr.slice(0, 10);
  
  if (dateKey === anchor) return 'Today';

  const dateMs = new Date(dateKey + 'T00:00:00Z').getTime();
  const anchorMs = new Date(anchor + 'T00:00:00Z').getTime();
  const diffDays = Math.round((dateMs - anchorMs) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

  return formatDate(dateStr);
}

/**
 * Format percentages safely with stated base
 */
export function formatPercentage(value: number, total: number, decimals = 1): string {
  if (!total || total <= 0) return '0.0%';
  const pct = (value / total) * 100;
  return `${pct.toFixed(decimals)}%`;
}
