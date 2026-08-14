import React, { useState } from 'react';
import {
  Plus,
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import type { JobStatus } from '../types';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Job Requisitions
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Manage active client hiring requisitions, talent pipelines, and AI matching parameters.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={14} />}
          onClick={() => navigate('create-job')}
        >
          Create Requisition
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="snow-card"
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: selectedStatus === st ? 600 : 500,
                border: '1px solid',
                borderColor: selectedStatus === st ? 'var(--color-primary)' : 'var(--color-border)',
                background: selectedStatus === st ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                color: selectedStatus === st ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search & Dept Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 190 }}>
            <Search
              size={13}
              style={{
                position: 'absolute',
                left: 9,
                top: 9,
                color: 'var(--color-text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 28, height: 30, fontSize: 'var(--font-size-xs)' }}
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="form-select"
            style={{ width: 140, height: 30, fontSize: 'var(--font-size-xs)' }}
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Depts' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="snow-table-container">
        <table className="snow-table">
          <thead>
            <tr>
              <th>Role & Client</th>
              <th>Department</th>
              <th>Location</th>
              <th>Experience</th>
              <th>Shortlisted</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--color-text-muted)' }}>
                  No requisitions found matching selected criteria.
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <div>
                      <div
                        onClick={() => navigate('job-workspace', { jobId: job.id })}
                        style={{
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-blue)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                      >
                        {job.title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: 1 }}>
                        {job.client} • {job.salaryRange}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                      {job.department}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                      <MapPin size={11} style={{ color: 'var(--color-text-muted)' }} />
                      <span>{job.location}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 'var(--font-size-xs)' }}>{job.experienceLevel}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 600,
                        color: job.shortlistedCount > 0 ? 'var(--color-success-text)' : 'var(--color-text-muted)',
                      }}
                    >
                      {job.shortlistedCount} candidates
                    </span>
                  </td>
                  <td>
                    <select
                      value={job.status}
                      onChange={(e) => updateJobStatus(job.id, e.target.value as JobStatus)}
                      style={{
                        padding: '2px 6px',
                        fontSize: '11px',
                        fontWeight: 500,
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-bg-canvas)',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="Open">Open</option>
                      <option value="Paused">Paused</option>
                      <option value="Draft">Draft</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Sparkles size={12} />}
                        onClick={() => navigate('sourcing', { jobId: job.id })}
                      >
                        Source
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        iconRight={<ArrowRight size={12} />}
                        onClick={() => navigate('job-workspace', { jobId: job.id })}
                      >
                        Workspace
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
