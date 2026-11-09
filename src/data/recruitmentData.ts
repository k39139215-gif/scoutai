import type { Job, Candidate, Interview } from '../types';
import { DEMO_TODAY_ANCHOR, formatDate, formatTime, getRelativeDateLabel } from '../utils/formatters';

/**
 * ScoutAI Centralized Recruitment Operations Data Module
 * Single Source of Truth for counts, definitions, funnel metrics, and reconciliations.
 */

// 1. Stated Talent Pool Base Definitions
export const TALENT_POOL_TOTAL = 247; // Total passive tech candidate profiles cataloged
export const QUALIFIED_POOL_TOTAL = 42; // Profiles meeting baseline skills across active requisition tech stacks (17.0% of pool)
export const HIGH_COMPATIBILITY_TOTAL = 12; // Profiles with >= 85% match score (4.9% of pool, 28.6% of qualified)

/**
 * Get total applicant volume across all requisitions
 */
export function getTotalApplicantsCount(jobs: Job[]): number {
  return jobs.reduce((sum, j) => sum + (j.applicantsCount || 0), 0);
}

/**
 * Get total shortlisted count across all requisitions
 */
export function getTotalShortlistedCount(jobs: Job[]): number {
  return jobs.reduce((sum, j) => sum + (j.shortlistedCount || 0), 0);
}

/**
 * Get active candidate count in directory
 */
export function getActiveDirectoryCandidates(candidates: Candidate[]): Candidate[] {
  return candidates.filter((c) => c.status !== 'Archived');
}

/**
 * Compute Funnel Stages with mathematical integrity against stated bases
 */
export interface ComputedFunnelStage {
  id: string;
  name: string;
  count: number;
  avgDays: number;
  color: string;
  percentOfPool: number; // Against 247 pool base
  conversionFromPrev: number | null; // Stage-over-stage pass rate
  baseLabel: string;
}

export function computeFunnelStages(
  candidates: Candidate[],
  totalPool = TALENT_POOL_TOTAL,
  qualifiedCount = QUALIFIED_POOL_TOTAL
): ComputedFunnelStage[] {
  const directoryShortlisted = candidates.filter((c) => c.status === 'Shortlisted').length;
  const directoryInterviewing = candidates.filter((c) => c.status === 'Interviewing').length;

  // Stated total stages across full operation (including passive + active directory)
  const shortlistedTotal = directoryShortlisted > 0 ? directoryShortlisted + 10 : 14;
  const screeningTotal = directoryInterviewing > 0 ? directoryInterviewing + 4 : 6;
  const offerTotal = 2;

  const rawStages = [
    { id: 'pool', name: 'Talent Pool Evaluated', count: totalPool, avgDays: 1, color: '#0f172a', base: 'Total indexed profiles' },
    { id: 'qualified', name: 'Qualified on Core Stack', count: qualifiedCount, avgDays: 2, color: '#1e293b', base: '42 of 247 pool' },
    { id: 'shortlisted', name: 'Recruiter Shortlisted', count: shortlistedTotal, avgDays: 4, color: '#2563eb', base: `${shortlistedTotal} of 42 qualified` },
    { id: 'screening', name: 'Technical Screening', count: screeningTotal, avgDays: 7, color: '#7c3aed', base: `${screeningTotal} of ${shortlistedTotal} shortlisted` },
    { id: 'offer', name: 'Final Offer Stage', count: offerTotal, avgDays: 12, color: '#16a34a', base: `${offerTotal} of ${screeningTotal} screening` },
  ];

  return rawStages.map((stage, idx) => {
    const prevCount = idx > 0 ? rawStages[idx - 1].count : null;
    const percentOfPool = parseFloat(((stage.count / totalPool) * 100).toFixed(1));
    const conversionFromPrev = prevCount
      ? parseFloat(((stage.count / prevCount) * 100).toFixed(1))
      : null;

    return {
      id: stage.id,
      name: stage.name,
      count: stage.count,
      avgDays: stage.avgDays,
      color: stage.color,
      percentOfPool,
      conversionFromPrev,
      baseLabel: stage.base,
    };
  });
}

/**
 * Find the nearest upcoming interview chronologically on or after the demo anchor date
 */
export interface UpcomingInterviewResult {
  interview: Interview;
  dateFormatted: string;
  timeFormatted: string;
  relativeDateLabel: string;
  displaySubtitle: string;
}

export function getNearestUpcomingInterview(
  interviews: Interview[],
  anchorDate = DEMO_TODAY_ANCHOR
): UpcomingInterviewResult | null {
  const scheduled = interviews.filter((i) => i.status === 'Scheduled' && i.date >= anchorDate);
  if (scheduled.length === 0) return null;

  // Sort chronologically ascending
  const sorted = [...scheduled].sort((a, b) => {
    const dateTimeA = `${a.date} ${a.time || ''}`;
    const dateTimeB = `${b.date} ${b.time || ''}`;
    return dateTimeA.localeCompare(dateTimeB);
  });

  const next = sorted[0];
  const dateFormatted = formatDate(next.date);
  const timeFormatted = formatTime(next.time);
  const relLabel = getRelativeDateLabel(next.date, anchorDate);

  const displaySubtitle = relLabel === 'Today'
    ? `Next: Today • ${timeFormatted}`
    : relLabel === 'Tomorrow'
    ? `Next: Tomorrow (${dateFormatted}) • ${timeFormatted}`
    : `Next: ${dateFormatted} • ${timeFormatted}`;

  return {
    interview: next,
    dateFormatted,
    timeFormatted,
    relativeDateLabel: relLabel,
    displaySubtitle,
  };
}
