import React, { useState } from 'react';
import {
  Plus,
  MapPin,
  Sparkles,
  SearchCheck,
  ArrowRight,
  Search,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { JobStatus } from '../types';
import { CustomSelect } from '../components/common/CustomDropdown';
import { SegmentedControl, StatusSelect } from '../components/boardui';
import { isDevMode } from '../utils/devMode';

export const JobsView: React.FC = () => {
  const { jobs, updateJobStatus, navigate } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');

  const departments = ['All', ...Array.from(new Set(jobs.map((j) => j.department)))];
  const statuses: ('All' | JobStatus)[] = ['All', 'Open', 'Paused', 'Draft', 'Closed'];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === 'All' || job.status === selectedStatus;
    const matchesDept = selectedDept === 'All' || job.department === selectedDept;

    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 16 }}>
      {/* 1. Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          paddingBottom: 4,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Job Requisitions
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            Manage open roles, assign hiring teams, track candidate stages, and monitor pipeline progress.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isDevMode() && (
            <button
              onClick={() => navigate('talent-studio')}
              style={{
                height: 36,
                padding: '0 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#eef2ff',
                border: '1px solid #c7d2fe',
                color: '#4338ca',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
            >
              <Sparkles size={14} />
              <span>Studio Desk (Refs)</span>
            </button>
          )}

          <button
            className="btn-dark"
            onClick={() => navigate('create-job')}
          style={{
            height: 36,
            padding: '0 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            background: '#0f172a',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Plus size={15} />
          <span>Create Requisition</span>
        </button>
        </div>
      </div>

      {/* 2. Secondary Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          flexWrap: 'wrap',
        }}
      >
        {/* Status Segmented Controls (BoardUI SegmentedControl) */}
        <SegmentedControl
          size="sm"
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={statuses.map((st) => ({
            value: st,
            label: st,
            count: st === 'All' ? jobs.length : jobs.filter((j) => j.status === st).length,
          }))}
        />

        {/* Custom Department Selector */}
        <CustomSelect
          value={selectedDept}
          onChange={setSelectedDept}
          options={departments.map((d) => ({
            value: d,
            label: d === 'All' ? 'All Departments' : d,
          }))}
          size="md"
          menuWidth={210}
        />

        {/* Search Input */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 11,
              color: '#94a3b8',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles, clients, skills…"
            style={{
              height: 36,
              width: 250,
              padding: '0 32px 0 32px',
              fontSize: 13,
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#0f172a',
              outline: 'none',
            }}
            onFocusCapture={(e) => (e.currentTarget.style.borderColor = '#0f172a')}
            onBlurCapture={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 8,
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: 2,
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div style={{ flex: 1 }} />

        <span style={{ fontSize: 13, color: '#64748b' }}>
          Showing <strong style={{ color: '#0f172a' }}>{filteredJobs.length}</strong> of {jobs.length} requisitions
        </span>
      </div>

      {/* 3. Requisitions Data Table */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#64748b',
                    letterSpacing: '0.01em',
                    minWidth: 240,
                  }}
                >
                  Role & client requisition
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#64748b',
                    letterSpacing: '0.01em',
                  }}
                >
                  Department
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#64748b',
                    letterSpacing: '0.01em',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={13} style={{ color: '#94a3b8' }} />
                    <span>Location</span>
                  </div>
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#64748b',
                    letterSpacing: '0.01em',
                  }}
                >
                  Experience
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#64748b',
                    letterSpacing: '0.01em',
                  }}
                >
                  Pipeline
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#64748b',
                    letterSpacing: '0.01em',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#64748b',
                    letterSpacing: '0.01em',
                    textAlign: 'right',
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: 'center',
                      padding: '48px 16px',
                      color: '#64748b',
                    }}
                  >
                    No requisitions found matching selected filters.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    style={{
                      height: 56,
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background 0.12s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div>
                        <span
                          onClick={() => navigate('job-workspace', { jobId: job.id })}
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: '#0f172a',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#4338ca')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
                        >
                          {job.title}
                        </span>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span>{job.client}</span>
                          <span style={{ color: '#cbd5e1' }}>•</span>
                          <span style={{ color: '#475569', fontWeight: 500 }}>{job.salaryRange}</span>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#334155' }}>
                      {job.department}
                    </td>

                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={13} style={{ color: '#94a3b8' }} />
                        <span>{job.location}</span>
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#334155' }}>
                      {job.experienceLevel}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          fontWeight: 500,
                          fontSize: 12,
                          color: job.shortlistedCount > 0 ? '#166534' : '#64748b',
                          background: job.shortlistedCount > 0 ? '#dcfce7' : '#f1f5f9',
                          border: job.shortlistedCount > 0 ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {job.shortlistedCount} shortlisted ({job.applicantsCount} total)
                      </span>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <StatusSelect
                        value={job.status}
                        onChange={(val) => updateJobStatus(job.id, val as JobStatus)}
                        options={[
                          { value: 'Open', label: 'Open' },
                          { value: 'Paused', label: 'Paused' },
                          { value: 'Draft', label: 'Draft' },
                          { value: 'Closed', label: 'Closed' },
                        ]}
                        size="sm"
                      />
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        <button
                          type="button"
                          className="pill"
                          style={{
                            height: 28,
                            padding: '0 10px',
                            fontSize: 12,
                            borderRadius: 6,
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#334155',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            fontWeight: 500,
                          }}
                          onClick={() => navigate('sourcing', { jobId: job.id })}
                        >
                          <SearchCheck size={13} style={{ color: '#64748b' }} />
                          <span>Match</span>
                        </button>

                        <button
                          type="button"
                          style={{
                            height: 30,
                            padding: '0 12px',
                            fontSize: 12,
                            borderRadius: 6,
                            background: '#f8fafc',
                            color: '#0f172a',
                            border: '1px solid #cbd5e1',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            fontWeight: 600,
                            transition: 'all 0.12s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#0f172a';
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.borderColor = '#0f172a';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#f8fafc';
                            e.currentTarget.style.color = '#0f172a';
                            e.currentTarget.style.borderColor = '#cbd5e1';
                          }}
                          onClick={() => navigate('job-workspace', { jobId: job.id })}
                        >
                          <span>Workspace</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
