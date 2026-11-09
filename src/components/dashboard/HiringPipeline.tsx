import React from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';

export const HiringPipeline: React.FC = () => {
  const { jobs, interviews, navigate } = useApp();

  const activeJobs = jobs.filter((j) => j.status === 'Open' || j.status === 'Paused');
  const displayJobs = activeJobs.length > 0 ? activeJobs : jobs;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>
            Active Hiring Pipelines
          </h2>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>
            Conversion volume across open requisitions and screening stages.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('jobs')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            height: 28,
            padding: '0 10px',
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 500,
            background: '#ffffff',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'background-color 0.1s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
        >
          <span>All Requisitions</span>
          <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      {/* Pipeline Table */}
      {displayJobs.length === 0 ? (
        <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 13, marginBottom: 12 }}>No active hiring requisitions.</p>
          <button
            type="button"
            className="btn-dark"
            onClick={() => navigate('create-job')}
            style={{
              height: 30,
              padding: '0 12px',
              borderRadius: 5,
              fontSize: 12,
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Plus size={13} />
            <span>Create Requisition</span>
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '9px 14px', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Role & client</th>
                <th style={{ padding: '9px 14px', textAlign: 'center', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Applied</th>
                <th style={{ padding: '9px 14px', textAlign: 'center', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Qualified</th>
                <th style={{ padding: '9px 14px', textAlign: 'center', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Shortlisted</th>
                <th style={{ padding: '9px 14px', textAlign: 'center', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Interviewing</th>
                <th style={{ padding: '9px 14px', textAlign: 'center', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '9px 14px', textAlign: 'right', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayJobs.map((job) => {
                const appliedCount = job.applicantsCount || 0;
                const shortlistedCount = job.shortlistedCount || 0;
                const qualifiedCount = Math.max(
                  shortlistedCount,
                  Math.round(appliedCount * 0.32)
                );
                const interviewingCount = interviews.filter(
                  (i) => i.jobId === job.id && i.status === 'Scheduled'
                ).length;

                return (
                  <tr
                    key={job.id}
                    onClick={() => navigate('job-workspace', { jobId: job.id })}
                    style={{
                      height: 48,
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                  >
                    <td style={{ padding: '0 14px' }}>
                      <div style={{ fontWeight: 500, color: '#0f172a', fontSize: 13 }}>
                        {job.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                        {job.client} • {job.location}
                      </div>
                    </td>

                    <td className="tabular-nums" style={{ padding: '0 14px', textAlign: 'center', fontSize: 12.5, color: 'var(--text-secondary)' }}>
                      {appliedCount}
                    </td>

                    <td className="tabular-nums" style={{ padding: '0 14px', textAlign: 'center', fontSize: 12.5, fontWeight: 500, color: '#0f172a' }}>
                      {qualifiedCount}
                    </td>

                    <td className="tabular-nums" style={{ padding: '0 14px', textAlign: 'center', fontSize: 12.5, fontWeight: 500, color: '#15803d' }}>
                      {shortlistedCount}
                    </td>

                    <td className="tabular-nums" style={{ padding: '0 14px', textAlign: 'center', fontSize: 12.5, color: 'var(--text-secondary)' }}>
                      {interviewingCount}
                    </td>

                    <td style={{ padding: '0 14px', textAlign: 'center' }}>
                      <StatusBadge status={job.status} size="sm" />
                    </td>

                    <td style={{ padding: '0 14px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('job-workspace', { jobId: job.id });
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          height: 26,
                          padding: '0 8px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 500,
                          background: '#ffffff',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          transition: 'background 0.1s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                      >
                        <span>Workspace</span>
                        <ArrowRight size={11} style={{ color: 'var(--text-muted)' }} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
