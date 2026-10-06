import React from 'react';
import { Briefcase, Users, CheckCircle2, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OperationalSummary: React.FC = () => {
  const { jobs, candidates, interviews, navigate } = useApp();

  const openJobsCount = jobs.filter((j) => j.status === 'Open').length;
  const activeCandidatesCount = candidates.filter((c) => c.status !== 'Archived').length;
  const shortlistedCandidatesCount = candidates.filter((c) => c.status === 'Shortlisted').length;
  const upcomingInterviews = interviews.filter((i) => i.status === 'Scheduled');
  const upcomingInterviewsCount = upcomingInterviews.length;

  const nextInterview = upcomingInterviews[0];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Metric 1: Open Roles */}
      <div
        onClick={() => navigate('jobs')}
        style={{
          padding: '16px 20px',
          borderRight: '1px solid var(--border-subtle)',
          cursor: 'pointer',
          transition: 'background var(--transition-fast)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        role="button"
        tabIndex={0}
        aria-label="View open jobs"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Open Roles
          </span>
          <Briefcase size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 600, letterSpacing: 'var(--tracking-tight)', color: 'var(--text-primary)' }}>
          {openJobsCount}
        </div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
          Across {jobs.length} requisitions
        </div>
      </div>

      {/* Metric 2: Active Candidates */}
      <div
        onClick={() => navigate('candidates')}
        style={{
          padding: '16px 20px',
          borderRight: '1px solid var(--border-subtle)',
          cursor: 'pointer',
          transition: 'background var(--transition-fast)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        role="button"
        tabIndex={0}
        aria-label="View active candidates"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active Candidates
          </span>
          <Users size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 600, letterSpacing: 'var(--tracking-tight)', color: 'var(--text-primary)' }}>
          {activeCandidatesCount}
        </div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
          247 in talent pool
        </div>
      </div>

      {/* Metric 3: Shortlisted */}
      <div
        onClick={() => navigate('candidates')}
        style={{
          padding: '16px 20px',
          borderRight: '1px solid var(--border-subtle)',
          cursor: 'pointer',
          transition: 'background var(--transition-fast)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        role="button"
        tabIndex={0}
        aria-label="View shortlisted candidates"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Shortlisted
          </span>
          <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} />
        </div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 600, letterSpacing: 'var(--tracking-tight)', color: 'var(--color-success-text)' }}>
          {shortlistedCandidatesCount}
        </div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
          Ready for client review
        </div>
      </div>

      {/* Metric 4: Upcoming Interviews */}
      <div
        onClick={() => navigate('interviews')}
        style={{
          padding: '16px 20px',
          cursor: 'pointer',
          transition: 'background var(--transition-fast)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        role="button"
        tabIndex={0}
        aria-label="View scheduled interviews"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Interviews
          </span>
          <Calendar size={14} style={{ color: 'var(--color-accent-blue)' }} />
        </div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 600, letterSpacing: 'var(--tracking-tight)', color: 'var(--text-primary)' }}>
          {upcomingInterviewsCount}
        </div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
          {nextInterview ? `Next: ${nextInterview.time}` : 'None scheduled today'}
        </div>
      </div>
    </div>
  );
};
