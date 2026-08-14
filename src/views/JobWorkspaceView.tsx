import React, { useState } from 'react';
import {
  MapPin,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import type { JobStatus } from '../types';

export const JobWorkspaceView: React.FC = () => {
  const {
    jobs,
    selectedJobId,
    candidates,
    outreachMessages,
    interviews,
    shortlistCandidate,
    updateJobStatus,
    navigate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'sourcing' | 'outreach' | 'spec'>('pipeline');

  const currentJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  if (!currentJob) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>No job selected.</p>
        <Button onClick={() => navigate('jobs')} style={{ marginTop: 12 }}>
          Back to Jobs List
        </Button>
      </div>
    );
  }

  const jobCandidates = candidates.filter((c) => c.appliedJobId === currentJob.id);
  const jobOutreach = outreachMessages.filter((m) => m.jobId === currentJob.id);
  const jobInterviews = interviews.filter((i) => i.jobId === currentJob.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Navigation / Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <button
          onClick={() => navigate('jobs')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-xs)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: 0,
          }}
        >
          <ArrowLeft size={14} />
          <span>All Requisitions</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            value={currentJob.status}
            onChange={(e) => updateJobStatus(currentJob.id, e.target.value as JobStatus)}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-surface)',
              fontWeight: 500,
              fontSize: 'var(--font-size-xs)',
              cursor: 'pointer',
            }}
          >
            <option value="Open">Status: Open</option>
            <option value="Paused">Status: Paused</option>
            <option value="Draft">Status: Draft</option>
            <option value="Closed">Status: Closed</option>
          </select>

          <Button
            variant="primary"
            size="sm"
            icon={<Sparkles size={13} />}
            onClick={() => navigate('sourcing', { jobId: currentJob.id })}
          >
            Run Sourcing Scan
          </Button>
        </div>
      </div>

      {/* Role Header Banner */}
      <div className="snow-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                {currentJob.title}
              </h1>
              <StatusBadge status={currentJob.status} />
              <span className="snow-badge snow-badge-blue">{currentJob.priority} Priority</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
              <span>{currentJob.client}</span>
              <span>•</span>
              <span>{currentJob.department}</span>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={12} style={{ color: 'var(--color-text-muted)' }} />
                <span>{currentJob.location}</span>
              </div>
              <span>•</span>
              <span>{currentJob.salaryRange}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ textAlign: 'center', padding: '6px 14px', background: 'var(--color-bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>{jobCandidates.length}</div>
              <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>Pipeline</div>
            </div>
            <div style={{ textAlign: 'center', padding: '6px 14px', background: 'var(--color-success-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-success-border)' }}>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-success-text)' }}>
                {currentJob.shortlistedCount}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--color-success-text)' }}>Shortlisted</div>
            </div>
          </div>
        </div>

        {/* Skills list */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--color-divider)' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', alignSelf: 'center', marginRight: 4 }}>
            Required Skills:
          </span>
          {currentJob.skills.map((s) => (
            <span
              key={s}
              style={{
                fontSize: '11px',
                background: 'var(--color-bg-canvas)',
                border: '1px solid var(--color-border)',
                padding: '2px 7px',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--color-border)', paddingBottom: 2 }}>
        <button
          onClick={() => setActiveTab('pipeline')}
          style={{
            padding: '7px 14px',
            border: 'none',
            background: 'transparent',
            fontSize: 'var(--font-size-sm)',
            fontWeight: activeTab === 'pipeline' ? 600 : 500,
            color: activeTab === 'pipeline' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            borderBottom: activeTab === 'pipeline' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Pipeline ({jobCandidates.length})
        </button>

        <button
          onClick={() => setActiveTab('sourcing')}
          style={{
            padding: '7px 14px',
            border: 'none',
            background: 'transparent',
            fontSize: 'var(--font-size-sm)',
            fontWeight: activeTab === 'sourcing' ? 600 : 500,
            color: activeTab === 'sourcing' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            borderBottom: activeTab === 'sourcing' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Sourcing Stats
        </button>

        <button
          onClick={() => setActiveTab('outreach')}
          style={{
            padding: '7px 14px',
            border: 'none',
            background: 'transparent',
            fontSize: 'var(--font-size-sm)',
            fontWeight: activeTab === 'outreach' ? 600 : 500,
            color: activeTab === 'outreach' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            borderBottom: activeTab === 'outreach' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Outreach & Interviews ({jobOutreach.length + jobInterviews.length})
        </button>

        <button
          onClick={() => setActiveTab('spec')}
          style={{
            padding: '7px 14px',
            border: 'none',
            background: 'transparent',
            fontSize: 'var(--font-size-sm)',
            fontWeight: activeTab === 'spec' ? 600 : 500,
            color: activeTab === 'spec' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            borderBottom: activeTab === 'spec' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Job Description
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'pipeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {jobCandidates.length === 0 ? (
            <div className="snow-card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 10 }}>
                No candidates attached to this pipeline yet.
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={<Sparkles size={14} />}
                onClick={() => navigate('sourcing', { jobId: currentJob.id })}
              >
                Run AI Sourcing Scan
              </Button>
            </div>
          ) : (
            <div className="snow-table-container">
              <table className="snow-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Experience</th>
                    <th>Location</th>
                    <th>Match Score</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobCandidates.map((cand) => (
                    <tr key={cand.id}>
                      <td>
                        <div
                          onClick={() => navigate('candidate-detail', { candidateId: cand.id })}
                          style={{ fontWeight: 600, cursor: 'pointer' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-blue)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                        >
                          {cand.name}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
                          {cand.title}
                        </div>
                      </td>
                      <td>{cand.experienceYears} Years</td>
                      <td>{cand.location}</td>
                      <td>
                        <span className="snow-badge snow-badge-success" style={{ fontSize: '11px' }}>
                          {cand.matchScore}% Match
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={cand.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                          <Button
                            variant={cand.status === 'Shortlisted' ? 'success' : 'secondary'}
                            size="sm"
                            icon={<CheckCircle2 size={12} />}
                            onClick={() => shortlistCandidate(cand.id)}
                          >
                            {cand.status === 'Shortlisted' ? 'Shortlisted' : 'Shortlist'}
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate('candidate-detail', { candidateId: cand.id })}
                          >
                            Profile
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'sourcing' && (
        <div className="snow-card" style={{ padding: '20px 24px' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 6 }}>
            AI Sourcing Summary
          </h3>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 18 }}>
            Sourcing evaluation across 247 simulated candidate records.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
            <div style={{ padding: 14, background: 'var(--color-bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600 }}>247</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Profiles Evaluated</div>
            </div>
            <div style={{ padding: 14, background: 'var(--color-bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--color-accent-blue)' }}>42</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Qualified on Core Skills</div>
            </div>
            <div style={{ padding: 14, background: 'var(--color-bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--color-success-text)' }}>12</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>High-Confidence (85%+)</div>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Sparkles size={13} />}
            onClick={() => navigate('sourcing', { jobId: currentJob.id })}
          >
            Launch Interactive Sourcing Scan
          </Button>
        </div>
      )}

      {activeTab === 'outreach' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="snow-card" style={{ padding: '18px 20px' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 10 }}>
              Outreach Messages ({jobOutreach.length})
            </h3>
            {jobOutreach.length === 0 ? (
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                No outreach drafted yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {jobOutreach.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      padding: '10px 14px',
                      background: 'var(--color-bg-canvas)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>{m.candidateName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{m.subject}</div>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="snow-card" style={{ padding: '18px 20px' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 10 }}>
              Scheduled Interviews ({jobInterviews.length})
            </h3>
            {jobInterviews.length === 0 ? (
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                No interviews scheduled for this role.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {jobInterviews.map((i) => (
                  <div
                    key={i.id}
                    style={{
                      padding: '10px 14px',
                      background: 'var(--color-bg-canvas)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>{i.candidateName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                        {i.type} • {i.interviewer} ({i.date} at {i.time})
                      </div>
                    </div>
                    <StatusBadge status={i.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'spec' && (
        <div className="snow-card" style={{ padding: '20px 24px' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 10 }}>
            Role Description & Deliverables
          </h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {currentJob.description}
          </p>
        </div>
      )}
    </div>
  );
};
