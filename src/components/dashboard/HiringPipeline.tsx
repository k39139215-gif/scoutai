import React from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { Button } from '../common/Button';

export const HiringPipeline: React.FC = () => {
  const { jobs, candidates, navigate } = useApp();

  const activeJobs = jobs.filter((j) => j.status === 'Open' || j.status === 'Paused');
  const displayJobs = activeJobs.length > 0 ? activeJobs : jobs;

  return (
    <div className="snow-card" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
            Active Hiring Pipelines
          </h2>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
            Live status of requisitions, applicant volume, and pipeline conversion stages.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            variant="ghost"
            size="sm"
            iconRight={<ArrowRight size={13} />}
            onClick={() => navigate('jobs')}
          >
            All Requisitions
          </Button>
        </div>
      </div>

      {/* Pipeline Table */}
      {displayJobs.length === 0 ? (
        <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 12 }}>No active hiring requisitions.</p>
          <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => navigate('create-job')}>
            Create Requisition
          </Button>
        </div>
      ) : (
        <div className="snow-table-container" style={{ border: 'none' }}>
          <table className="snow-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 8 }}>Role & Client</th>
                <th style={{ textAlign: 'center' }}>Applied</th>
                <th style={{ textAlign: 'center' }}>Qualified</th>
                <th style={{ textAlign: 'center' }}>Shortlisted</th>
                <th style={{ textAlign: 'center' }}>Interviewing</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: 8 }}>Actions</th>
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
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ paddingLeft: 8 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)' }}>
                        {job.title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: 1 }}>
                        {job.client} • {job.location}
                      </div>
                    </td>

                    <td style={{ textAlign: 'center', fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>
                      {appliedCount}
                    </td>

                    <td style={{ textAlign: 'center', fontWeight: 500, fontSize: 'var(--font-size-sm)', color: 'var(--color-accent-blue-text)' }}>
                      {qualifiedCount}
                    </td>

                    <td style={{ textAlign: 'center', fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-success-text)' }}>
                      {shortlistedCount}
                    </td>

                    <td style={{ textAlign: 'center', fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>
                      {interviewingCount}
                    </td>

                    <td>
                      <StatusBadge status={job.status} />
                    </td>

                    <td style={{ textAlign: 'right', paddingRight: 8 }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        iconRight={<ArrowRight size={12} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('job-workspace', { jobId: job.id });
                        }}
                      >
                        Workspace
                      </Button>
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
