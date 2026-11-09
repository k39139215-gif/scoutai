import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Helper mirror imports for Node test runner
const DEMO_TODAY_ANCHOR = '2026-08-15';
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return dateStr;
  const [, year, month, day] = match;
  const monthIdx = parseInt(month, 10) - 1;
  const monthName = MONTH_NAMES[monthIdx] || month;
  return `${monthName} ${parseInt(day, 10)}, ${year}`;
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const trimmed = timeStr.trim();
  if (trimmed.includes('AM') || trimmed.includes('PM')) return trimmed;
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?:\s*IST)?/i);
  if (!match) return trimmed;
  const hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${period} IST`;
}

function getRelativeDateLabel(dateStr, anchor = DEMO_TODAY_ANCHOR) {
  if (!dateStr) return '';
  const dateKey = dateStr.slice(0, 10);
  if (dateKey === anchor) return 'Today';
  const dateMs = new Date(dateKey + 'T00:00:00Z').getTime();
  const anchorMs = new Date(anchor + 'T00:00:00Z').getTime();
  const diffDays = Math.round((dateMs - anchorMs) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  return formatDate(dateStr);
}

function computeFunnelStages(totalPool, qualifiedCount, shortlistedCount, screeningCount, offerCount) {
  const rawStages = [
    { name: 'Talent Pool Evaluated', count: totalPool },
    { name: 'Qualified on Core Stack', count: qualifiedCount },
    { name: 'Recruiter Shortlisted', count: shortlistedCount },
    { name: 'Technical Screening', count: screeningCount },
    { name: 'Final Offer Stage', count: offerCount },
  ];

  return rawStages.map((stage, idx) => {
    const prevCount = idx > 0 ? rawStages[idx - 1].count : null;
    const percentOfPool = parseFloat(((stage.count / totalPool) * 100).toFixed(1));
    const conversionFromPrev = prevCount
      ? parseFloat(((stage.count / prevCount) * 100).toFixed(1))
      : null;
    return { ...stage, percentOfPool, conversionFromPrev };
  });
}

function getNearestUpcomingInterview(interviews, anchorDate = DEMO_TODAY_ANCHOR) {
  const scheduled = interviews.filter((i) => i.status === 'Scheduled' && i.date >= anchorDate);
  if (scheduled.length === 0) return null;
  const sorted = [...scheduled].sort((a, b) => `${a.date} ${a.time || ''}`.localeCompare(`${b.date} ${b.time || ''}`));
  const next = sorted[0];
  return {
    interview: next,
    dateFormatted: formatDate(next.date),
    timeFormatted: formatTime(next.time),
    relLabel: getRelativeDateLabel(next.date, anchorDate),
  };
}

describe('Phase 4: Data Consistency & Reconciliation Engine', () => {
  const mockJobs = [
    { id: 'job-101', applicantsCount: 38, shortlistedCount: 4 },
    { id: 'job-102', applicantsCount: 24, shortlistedCount: 2 },
    { id: 'job-103', applicantsCount: 19, shortlistedCount: 3 },
    { id: 'job-104', applicantsCount: 15, shortlistedCount: 1 },
    { id: 'job-105', applicantsCount: 29, shortlistedCount: 2 },
    { id: 'job-106', applicantsCount: 0, shortlistedCount: 0 },
  ];

  const mockInterviews = [
    { id: 'int-1', date: '2026-08-16', time: '14:30 IST', status: 'Scheduled' },
    { id: 'int-2', date: '2026-08-18', time: '16:00 IST', status: 'Scheduled' },
  ];

  it('correctly aggregates requisition applicants and shortlist totals without contradiction', () => {
    const totalApplicants = mockJobs.reduce((acc, j) => acc + j.applicantsCount, 0);
    const totalShortlisted = mockJobs.reduce((acc, j) => acc + j.shortlistedCount, 0);

    assert.equal(totalApplicants, 125, 'Total applicant volume across all requisitions must equal 125');
    assert.equal(totalShortlisted, 12, 'Total shortlisted candidates across all requisitions must equal 12');
    assert.equal(mockJobs[0].applicantsCount, 38, 'Job 101 must report 38 applicants consistently');
  });

  it('computes pipeline funnel percentages with mathematical integrity against stated bases', () => {
    const stages = computeFunnelStages(247, 42, 14, 6, 2);

    // Stage 0: 247 of 247 = 100%
    assert.equal(stages[0].percentOfPool, 100.0);
    assert.equal(stages[0].conversionFromPrev, null);

    // Stage 1: 42 of 247 = 17.0%
    assert.equal(stages[1].count, 42);
    assert.equal(stages[1].percentOfPool, 17.0);
    assert.equal(stages[1].conversionFromPrev, 17.0);

    // Stage 2: 14 of 247 = 5.7%, 14 of 42 = 33.3%
    assert.equal(stages[2].count, 14);
    assert.equal(stages[2].percentOfPool, 5.7);
    assert.equal(stages[2].conversionFromPrev, 33.3);

    // Stage 3: 6 of 247 = 2.4%, 6 of 14 = 42.9%
    assert.equal(stages[3].count, 6);
    assert.equal(stages[3].percentOfPool, 2.4);
    assert.equal(stages[3].conversionFromPrev, 42.9);

    // Stage 4: 2 of 247 = 0.8%, 2 of 6 = 33.3%
    assert.equal(stages[4].count, 2);
    assert.equal(stages[4].percentOfPool, 0.8);
    assert.equal(stages[4].conversionFromPrev, 33.3);
  });

  it('resolves nearest upcoming interview relative to demo anchor date 2026-08-15', () => {
    const next = getNearestUpcomingInterview(mockInterviews, '2026-08-15');

    assert.ok(next, 'Next upcoming interview must be found');
    assert.equal(next.interview.id, 'int-1', 'int-1 on 2026-08-16 is the nearest scheduled round');
    assert.equal(next.dateFormatted, 'Aug 16, 2026');
    assert.equal(next.timeFormatted, '2:30 PM IST');
    assert.equal(next.relLabel, 'Tomorrow');
  });

  it('sorts candidate matching ranked matches by fit score descending', () => {
    const candidates = [
      { id: 'c1', name: 'Devendra', matchScore: 82 },
      { id: 'c2', name: 'Sarah', matchScore: 91 },
      { id: 'c3', name: 'Ananya', matchScore: 96 },
      { id: 'c4', name: 'Rajesh', matchScore: 94 },
    ];

    const sorted = [...candidates].sort((a, b) => b.matchScore - a.matchScore);

    assert.equal(sorted[0].name, 'Ananya', 'Highest score (96%) must rank first');
    assert.equal(sorted[1].name, 'Rajesh', 'Second highest (94%) must rank second');
    assert.equal(sorted[2].name, 'Sarah', '91% must rank third');
    assert.equal(sorted[3].name, 'Devendra', '82% must rank fourth');
  });

  it('formats dates and times consistently using single unified formatter', () => {
    assert.equal(formatDate('2026-08-15'), 'Aug 15, 2026');
    assert.equal(formatDate('2026-08-01'), 'Aug 1, 2026');
    assert.equal(formatTime('14:30 IST'), '2:30 PM IST');
    assert.equal(formatTime('16:00 IST'), '4:00 PM IST');
    assert.equal(formatTime('09:15'), '9:15 AM IST');
  });
});
