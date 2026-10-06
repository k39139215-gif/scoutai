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
        border: '1px solid #e4e4e7',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      {/* Metric 1: Open Roles */}
      <div
        onClick={() => navigate('jobs')}
        style={{
          padding: '18px 22px',
          borderRight: '1px solid #f4f4f5',
          cursor: 'pointer',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        role="button"
        tabIndex={0}
        aria-label="View open jobs"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Open Roles
          </span>
          <Briefcase size={14} style={{ color: '#71717a' }} />
        </div>
        <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: '#18181b' }}>
          {openJobsCount}
        </div>
        <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>
          Across {jobs.length} requisitions
        </div>
      </div>

      {/* Metric 2: Active Candidates */}
      <div
        onClick={() => navigate('candidates')}
        style={{
          padding: '18px 22px',
          borderRight: '1px solid #f4f4f5',
          cursor: 'pointer',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        role="button"
        tabIndex={0}
        aria-label="View active candidates"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active Candidates
          </span>
          <Users size={14} style={{ color: '#71717a' }} />
        </div>
        <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: '#18181b' }}>
          {activeCandidatesCount}
        </div>
        <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>
          247 in talent pool
        </div>
      </div>

      {/* Metric 3: Shortlisted */}
      <div
        onClick={() => navigate('candidates')}
        style={{
          padding: '18px 22px',
          borderRight: '1px solid #f4f4f5',
          cursor: 'pointer',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        role="button"
        tabIndex={0}
        aria-label="View shortlisted candidates"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Shortlisted
          </span>
          <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
        </div>
        <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: '#16a34a' }}>
          {shortlistedCandidatesCount}
        </div>
        <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>
          Ready for client review
        </div>
      </div>

      {/* Metric 4: Upcoming Interviews */}
      <div
        onClick={() => navigate('interviews')}
        style={{
          padding: '18px 22px',
          cursor: 'pointer',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        role="button"
        tabIndex={0}
        aria-label="View scheduled interviews"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Interviews
          </span>
          <Calendar size={14} style={{ color: '#2563eb' }} />
        </div>
        <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: '#18181b' }}>
          {upcomingInterviewsCount}
        </div>
        <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>
          {nextInterview ? `Next: ${nextInterview.time}` : 'None scheduled today'}
        </div>
      </div>
    </div>
  );
};
