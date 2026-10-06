import React, { useState } from 'react';
import {
  MapPin,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/Badge';
import { CustomSelect } from '../components/common/CustomDropdown';
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
      <div style={{ padding: 48, textAlign: 'center', background: '#ffffff', borderRadius: 8, border: '1px solid #e4e4e7' }}>
        <p style={{ fontSize: 14, color: '#71717a' }}>No requisition selected.</p>
        <button
          onClick={() => navigate('jobs')}
          className="btn-dark"
          style={{
            marginTop: 14,
            height: 36,
            padding: '0 16px',
            borderRadius: 8,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Back to Requisitions
        </button>
      </div>
    );
  }

  const jobCandidates = candidates.filter((c) => c.appliedJobId === currentJob.id);
  const jobOutreach = outreachMessages.filter((m) => m.jobId === currentJob.id);
  const jobInterviews = interviews.filter((i) => i.jobId === currentJob.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Top Navigation / Header Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <button
          onClick={() => navigate('jobs')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#71717a',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#18181b')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
        >
          <ArrowLeft size={14} />
          <span>All Requisitions</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CustomSelect
            value={currentJob.status}
            onChange={(val) => updateJobStatus(currentJob.id, val as JobStatus)}
            options={[
              { value: 'Open', label: 'Status: Open' },
              { value: 'Paused', label: 'Status: Paused' },
              { value: 'Draft', label: 'Status: Draft' },
              { value: 'Closed', label: 'Status: Closed' },
            ]}
            size="sm"
            menuWidth={140}
          />

          <button
            className="btn-dark"
            onClick={() => navigate('sourcing', { jobId: currentJob.id })}
            style={{
              height: 32,
              padding: '0 14px',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#18181b',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={13} style={{ color: '#c084fc' }} />
            <span>Run Sourcing Scan</span>
          </button>
        </div>
      </div>

      {/* 2. Role Header Banner */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: 8,
          padding: '20px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <h1 style={{ fontSize: 22, fontWeight: 600, color: '#18181b', letterSpacing: '-0.02em', margin: 0 }}>
                {currentJob.title}
              </h1>
              <StatusBadge status={currentJob.status} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  background: '#eff6ff',
                  color: '#2563eb',
                  border: '1px solid #dbeafe',
                }}
              >
                {currentJob.priority} Priority
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 13, color: '#71717a' }}>
              <span style={{ fontWeight: 500, color: '#18181b' }}>{currentJob.client}</span>
              <span>•</span>
              <span>{currentJob.department}</span>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={13} style={{ color: '#a1a1aa' }} />
                <span>{currentJob.location}</span>
              </div>
              <span>•</span>
              <span style={{ fontWeight: 500, color: '#18181b' }}>{currentJob.salaryRange}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#18181b' }}>{jobCandidates.length}</div>
              <div style={{ fontSize: 11.5, color: '#71717a' }}>In Pipeline</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #dcfce7' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#16a34a' }}>
                {currentJob.shortlistedCount}
              </div>
              <div style={{ fontSize: 11.5, color: '#15803d' }}>Shortlisted</div>
            </div>
          </div>
        </div>

        {/* Skills list */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 16, paddingTop: 14, borderTop: '1px solid #f4f4f5' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#71717a', alignSelf: 'center', marginRight: 4 }}>
            Required Skills:
          </span>
          {currentJob.skills.map((s) => (
            <span
              key={s}
              style={{
                fontSize: 12,
                background: '#f4f4f5',
                border: '1px solid #e4e4e7',
                padding: '2px 8px',
                borderRadius: 4,
                color: '#3f3f46',
                fontWeight: 500,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Workspace Navigation Tabs */}
      <div style={{ display: 'flex', gap: 3, background: '#f4f4f5', padding: 3, borderRadius: 8, width: 'max-content' }}>
        {[
          { id: 'pipeline', label: `Pipeline (${jobCandidates.length})` },
          { id: 'sourcing', label: 'Sourcing Insights' },
          { id: 'outreach', label: `Outreach & Interviews (${jobOutreach.length + jobInterviews.length})` },
          { id: 'spec', label: 'Role Specifications' },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: isSelected ? 600 : 500,
                border: 'none',
                background: isSelected ? '#ffffff' : 'transparent',
                color: isSelected ? '#18181b' : '#71717a',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.12s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content */}
      {activeTab === 'pipeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {jobCandidates.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', background: '#ffffff', borderRadius: 8, border: '1px solid #e4e4e7' }}>
              <div style={{ color: '#71717a', fontSize: 13.5, marginBottom: 12 }}>
                No candidate profiles attached to this pipeline yet.
              </div>
              <button
                className="btn-dark"
                onClick={() => navigate('sourcing', { jobId: currentJob.id })}
                style={{
                  height: 36,
                  padding: '0 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  background: '#18181b',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Sparkles size={14} style={{ color: '#c084fc' }} />
                <span>Run AI Sourcing Scan</span>
              </button>
            </div>
          ) : (
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e4e4e7',
                borderRadius: 8,
                overflow: 'visible',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#fafafa', borderBottom: '1px solid #e4e4e7' }}>
                    <th style={{ padding: '12px 18px', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Candidate</th>
                    <th style={{ padding: '12px 16px', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Experience</th>
                    <th style={{ padding: '12px 16px', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Location</th>
                    <th style={{ padding: '12px 16px', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Match Fit</th>
                    <th style={{ padding: '12px 16px', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '12px 18px', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobCandidates.map((cand) => (
                    <tr
                      key={cand.id}
                      style={{
                        height: 56,
                        borderBottom: '1px solid #f4f4f5',
                        transition: 'background 0.12s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '0 18px' }}>
                        <div
                          onClick={() => navigate('candidate-detail', { candidateId: cand.id })}
                          style={{ fontSize: 13.5, fontWeight: 600, color: '#18181b', cursor: 'pointer' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#18181b')}
                        >
                          {cand.name}
                        </div>
                        <div style={{ fontSize: 12, color: '#71717a', marginTop: 1 }}>
                          {cand.title}
                        </div>
                      </td>
                      <td style={{ padding: '0 16px', fontSize: 13, color: '#3f3f46' }}>{cand.experienceYears} Years</td>
                      <td style={{ padding: '0 16px', fontSize: 13, color: '#3f3f46' }}>{cand.location}</td>
                      <td style={{ padding: '0 16px' }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: '#dcfce7',
                            color: '#15803d',
                          }}
                        >
                          {cand.matchScore}% Match
                        </span>
                      </td>
                      <td style={{ padding: '0 16px' }}>
                        <StatusBadge status={cand.status} />
                      </td>
                      <td style={{ padding: '0 18px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                          <button
                            onClick={() => shortlistCandidate(cand.id)}
                            style={{
                              height: 30,
                              padding: '0 10px',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 500,
                              background: cand.status === 'Shortlisted' ? '#dcfce7' : '#ffffff',
                              border: cand.status === 'Shortlisted' ? '1px solid #bbf7d0' : '1px solid #e4e4e7',
                              color: cand.status === 'Shortlisted' ? '#15803d' : '#18181b',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <CheckCircle2 size={12} />
                            <span>{cand.status === 'Shortlisted' ? 'Saved' : 'Shortlist'}</span>
                          </button>

                          <button
                            onClick={() => navigate('candidate-detail', { candidateId: cand.id })}
                            className="btn-dark"
                            style={{
                              height: 30,
                              padding: '0 12px',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 500,
                              background: '#18181b',
                              color: '#ffffff',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            Profile
                          </button>
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
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 8,
            padding: '22px 26px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#18181b', margin: '0 0 4px' }}>
            AI Sourcing Summary
          </h3>
          <p style={{ fontSize: 13, color: '#71717a', margin: '0 0 20px' }}>
            Autonomous talent pool evaluation across 247 simulated candidate records.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 22 }}>
            <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#18181b' }}>247</div>
              <div style={{ fontSize: 12, color: '#71717a' }}>Profiles Evaluated</div>
            </div>
            <div style={{ padding: 16, background: '#eff6ff', borderRadius: 8, border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#2563eb' }}>42</div>
              <div style={{ fontSize: 12, color: '#2563eb' }}>Qualified on Core Skills</div>
            </div>
            <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 8, border: '1px solid #dcfce7' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#16a34a' }}>12</div>
              <div style={{ fontSize: 12, color: '#15803d' }}>High-Confidence (85%+)</div>
            </div>
          </div>

          <button
            className="btn-dark"
            onClick={() => navigate('sourcing', { jobId: currentJob.id })}
            style={{
              height: 36,
              padding: '0 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: '#18181b',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={14} style={{ color: '#c084fc' }} />
            <span>Launch Interactive Sourcing Scan</span>
          </button>
        </div>
      )}

      {activeTab === 'outreach' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: 8,
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#18181b', margin: '0 0 12px' }}>
              Outreach Messages ({jobOutreach.length})
            </h3>
            {jobOutreach.length === 0 ? (
              <div style={{ color: '#71717a', fontSize: 13 }}>
                No outreach drafted for this requisition yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {jobOutreach.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      padding: '12px 16px',
                      background: '#f8fafc',
                      border: '1px solid #f1f5f9',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: '#18181b' }}>{m.candidateName}</div>
                      <div style={{ fontSize: 12.5, color: '#71717a', marginTop: 2 }}>{m.subject}</div>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: 8,
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#18181b', margin: '0 0 12px' }}>
              Scheduled Interviews ({jobInterviews.length})
            </h3>
            {jobInterviews.length === 0 ? (
              <div style={{ color: '#71717a', fontSize: 13 }}>
                No interviews scheduled for this role.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {jobInterviews.map((i) => (
                  <div
                    key={i.id}
                    style={{
                      padding: '12px 16px',
                      background: '#f8fafc',
                      border: '1px solid #f1f5f9',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: '#18181b' }}>{i.candidateName}</div>
                      <div style={{ fontSize: 12.5, color: '#71717a', marginTop: 2 }}>
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
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 8,
            padding: '22px 26px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#18181b', margin: '0 0 12px' }}>
            Role Description & Deliverables
          </h3>
          <p style={{ fontSize: 13.5, color: '#3f3f46', lineHeight: 1.6, margin: 0 }}>
            {currentJob.description}
          </p>
        </div>
      )}
    </div>
  );
};

