import React, { useState } from 'react';
import {
  Plus,
  MapPin,
  SearchCheck,
  ArrowRight,
  Search,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { JobStatus } from '../types';
import { CustomSelect } from '../components/common/CustomDropdown';

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
              color: '#18181b',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Job Requisitions
          </h1>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Manage open roles, assign hiring teams, track candidate stages, and monitor pipeline progress.
          </p>
        </div>

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
            background: '#18181b',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Plus size={15} />
          <span>Create Requisition</span>
        </button>
      </div>

      {/* 2. Secondary Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px',
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: 8,
          flexWrap: 'wrap',
        }}
      >
        {/* Status Segmented Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f4f4f5',
            padding: 3,
            borderRadius: 7,
            gap: 2,
          }}
        >
          {statuses.map((st) => {
            const isSelected = selectedStatus === st;
            const count = st === 'All' ? jobs.length : jobs.filter((j) => j.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontWeight: isSelected ? 600 : 500,
                  background: isSelected ? '#ffffff' : 'transparent',
                  color: isSelected ? '#18181b' : '#71717a',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.12s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{st}</span>
                <span
                  style={{
                    fontSize: 11,
                    padding: '0 5px',
                    borderRadius: 9999,
                    background: isSelected ? '#f4f4f5' : 'transparent',
                    color: isSelected ? '#18181b' : '#a1a1aa',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

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
              color: '#71717a',
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
              border: '1px solid #e4e4e7',
              background: '#ffffff',
              color: '#18181b',
              outline: 'none',
            }}
            onFocusCapture={(e) => (e.currentTarget.style.borderColor = '#18181b')}
            onBlurCapture={(e) => (e.currentTarget.style.borderColor = '#e4e4e7')}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 8,
                background: 'transparent',
                border: 'none',
                color: '#71717a',
                cursor: 'pointer',
                padding: 2,
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div style={{ flex: 1 }} />

        <span style={{ fontSize: 13, color: '#71717a' }}>
          Showing <strong style={{ color: '#18181b' }}>{filteredJobs.length}</strong> of {jobs.length} requisitions
        </span>
      </div>

      {/* 3. Requisitions Data Table */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: 8,
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid var(--border-subtle)' }}>
                <th
                  style={{
                    padding: '10px 14px',
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Role & client requisition
                </th>
                <th
                  style={{
                    padding: '10px 14px',
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Department
                </th>
                <th
                  style={{
                    padding: '10px 14px',
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Location
                </th>
                <th
                  style={{
                    padding: '10px 14px',
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Experience
                </th>
                <th
                  style={{
                    padding: '10px 14px',
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Pipeline
                </th>
                <th
                  style={{
                    padding: '10px 14px',
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: '10px 14px',
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
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
                      color: '#71717a',
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
                      borderBottom: '1px solid #f4f4f5',
                      transition: 'background 0.12s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '0 18px' }}>
                      <div>
                        <span
                          onClick={() => navigate('job-workspace', { jobId: job.id })}
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: '#18181b',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                        >
                          {job.title}
                        </span>
                        <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>
                          {job.client} • {job.salaryRange}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '0 16px', fontSize: 13, color: '#3f3f46' }}>
                      {job.department}
                    </td>

                    <td style={{ padding: '0 16px', fontSize: 13, color: '#71717a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <MapPin size={12} style={{ color: '#a1a1aa' }} />
                        <span>{job.location}</span>
                      </div>
                    </td>

                    <td style={{ padding: '0 16px', fontSize: 13, color: '#3f3f46' }}>
                      {job.experienceLevel}
                    </td>

                    <td style={{ padding: '0 16px' }}>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 12.5,
                          color: job.shortlistedCount > 0 ? '#15803d' : '#71717a',
                          background: job.shortlistedCount > 0 ? '#dcfce7' : '#f4f4f5',
                          padding: '3px 8px',
                          borderRadius: 6,
                        }}
                      >
                        {job.shortlistedCount} shortlisted ({job.applicantsCount} total)
                      </span>
                    </td>

                    <td style={{ padding: '0 16px' }}>
                      <CustomSelect
                        value={job.status}
                        onChange={(val) => updateJobStatus(job.id, val as JobStatus)}
                        options={[
                          { value: 'Open', label: 'Open' },
                          { value: 'Paused', label: 'Paused' },
                          { value: 'Draft', label: 'Draft' },
                          { value: 'Closed', label: 'Closed' },
                        ]}
                        size="sm"
                        menuWidth={110}
                      />
                    </td>

                    <td style={{ padding: '0 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        <button
                          className="pill"
                          style={{
                            height: 28,
                            padding: '0 8px',
                            fontSize: 11.5,
                            borderRadius: 4,
                            border: '1px solid var(--border-default)',
                            background: '#ffffff',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                          onClick={() => navigate('sourcing', { jobId: job.id })}
                        >
                          <SearchCheck size={12} style={{ color: 'var(--text-muted)' }} />
                          <span>Match</span>
                        </button>

                        <button
                          className="btn-dark"
                          style={{
                            height: 30,
                            padding: '0 12px',
                            fontSize: 12,
                            borderRadius: 6,
                            background: '#18181b',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                          }}
                          onClick={() => navigate('job-workspace', { jobId: job.id })}
                        >
                          <span>Workspace</span>
                          <ArrowRight size={11} />
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
