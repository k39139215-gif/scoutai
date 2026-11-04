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
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
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
          transition: 'background 0.12s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        role="button"
        tabIndex={0}
        aria-label="View open jobs"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
            Open roles
          </span>
          <Briefcase size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="metric-val" style={{ fontSize: 26, fontWeight: 600, color: '#0f172a' }}>
          {openJobsCount}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
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
          transition: 'background 0.12s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        role="button"
        tabIndex={0}
        aria-label="View active candidates"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
            Active candidates
          </span>
          <Users size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="metric-val" style={{ fontSize: 26, fontWeight: 600, color: '#0f172a' }}>
          {activeCandidatesCount}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
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
          transition: 'background 0.12s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        role="button"
        tabIndex={0}
        aria-label="View shortlisted candidates"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
            Shortlisted
          </span>
          <CheckCircle2 size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="metric-val" style={{ fontSize: 26, fontWeight: 600, color: '#0f172a' }}>
          {shortlistedCandidatesCount}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          Advancing to rounds
        </div>
      </div>

      {/* Metric 4: Upcoming Interviews */}
      <div
        onClick={() => navigate('interviews')}
        style={{
          padding: '16px 20px',
          cursor: 'pointer',
          transition: 'background 0.12s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        role="button"
        tabIndex={0}
        aria-label="View scheduled interviews"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
            Scheduled screens
          </span>
          <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="metric-val" style={{ fontSize: 26, fontWeight: 600, color: '#0f172a' }}>
          {upcomingInterviewsCount}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          {nextInterview ? `Next: ${nextInterview.time}` : 'None pending'}
        </div>
      </div>
    </div>
  );
};
