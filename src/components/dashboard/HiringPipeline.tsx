import React from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';

export const HiringPipeline: React.FC = () => {
  const { jobs, candidates, navigate } = useApp();

  const activeJobs = jobs.filter((j) => j.status === 'Open' || j.status === 'Paused');
  const displayJobs = activeJobs.length > 0 ? activeJobs : jobs;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e4e4e7',
        borderRadius: 10,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#18181b', letterSpacing: '-0.01em' }}>
            Active Hiring Pipelines
          </h2>
          <p style={{ fontSize: 12.5, color: '#71717a', marginTop: 2 }}>
            Live status of requisitions, applicant volume, and pipeline conversion stages.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('jobs')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 32,
            padding: '0 12px',
            borderRadius: 6,
            fontSize: 12.5,
            fontWeight: 500,
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            color: '#18181b',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f4f4f5';
            e.currentTarget.style.borderColor = '#d4d4d8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = '#e4e4e7';
          }}
        >
          <span>All Requisitions</span>
          <ArrowRight size={13} style={{ color: '#71717a' }} />
        </button>
      </div>

      {/* Pipeline Table */}
      {displayJobs.length === 0 ? (
        <div style={{ padding: '36px', textAlign: 'center', color: '#a1a1aa' }}>
          <p style={{ fontSize: 13, marginBottom: 12 }}>No active hiring requisitions.</p>
          <button
            type="button"
            className="btn-dark"
            onClick={() => navigate('create-job')}
            style={{
              height: 34,
              padding: '0 14px',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 500,
              background: '#18181b',
              color: '#ffffff',
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
        <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e4e4e7' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #e4e4e7' }}>
                <th style={{ padding: '10px 14px', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Role & Client</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Applied</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Qualified</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Shortlisted</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Interviewing</th>
                <th style={{ padding: '10px 14px', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayJobs.map((job) => {
                const jobCandidates = candidates.filter((c) => c.appliedJobId === job.id);
                const appliedCount = jobCandidates.length > 0 ? jobCandidates.length : job.applicantsCount || 0;
                const qualifiedCount = jobCandidates.filter(
                  (c) => c.status === 'Qualified' || c.matchScore >= 80
                ).length;
                const shortlistedCount = jobCandidates.filter((c) => c.status === 'Shortlisted').length;
                const interviewingCount = jobCandidates.filter((c) => c.status === 'Interviewing').length;

                return (
                  <tr
                    key={job.id}
                    onClick={() => navigate('job-workspace', { jobId: job.id })}
                    style={{
                      height: 52,
                      borderBottom: '1px solid #f4f4f5',
                      cursor: 'pointer',
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                  >
                    <td style={{ padding: '0 14px' }}>
                      <div style={{ fontWeight: 600, color: '#18181b', fontSize: 13.5 }}>
                        {job.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#71717a', marginTop: 1 }}>
                        {job.client} • {job.location}
                      </div>
                    </td>

                    <td style={{ padding: '0 14px', textAlign: 'center', fontWeight: 500, fontSize: 13 }}>
                      {appliedCount}
                    </td>

                    <td style={{ padding: '0 14px', textAlign: 'center', fontWeight: 500, fontSize: 13, color: '#2563eb' }}>
                      {qualifiedCount}
                    </td>

                    <td style={{ padding: '0 14px', textAlign: 'center', fontWeight: 600, fontSize: 13, color: '#16a34a' }}>
                      {shortlistedCount}
                    </td>

                    <td style={{ padding: '0 14px', textAlign: 'center', fontWeight: 500, fontSize: 13 }}>
                      {interviewingCount}
                    </td>

                    <td style={{ padding: '0 14px' }}>
                      <StatusBadge status={job.status} />
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
                          gap: 5,
                          height: 30,
                          padding: '0 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 500,
                          background: '#ffffff',
                          border: '1px solid #e4e4e7',
                          color: '#18181b',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f4f4f5';
                          e.currentTarget.style.borderColor = '#d4d4d8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#ffffff';
                          e.currentTarget.style.borderColor = '#e4e4e7';
                        }}
                      >
                        <span>Workspace</span>
                        <ArrowRight size={12} style={{ color: '#71717a' }} />
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
