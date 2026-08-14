import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';

export const CandidatesView: React.FC = () => {
  const { candidates, shortlistCandidate, navigate } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [matchFilter, setMatchFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'experience' | 'name'>('match');

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesScore = true;
    if (matchFilter === '90+') matchesScore = c.matchScore >= 90;
    else if (matchFilter === '80+') matchesScore = c.matchScore >= 80;
    else if (matchFilter === '70+') matchesScore = c.matchScore >= 70;

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesScore && matchesStatus;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
    return a.name.localeCompare(b.name);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
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
            Candidates Directory
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Review candidates evaluated across role criteria, match confidence, and pipeline stages.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Sparkles size={13} />}
          onClick={() => navigate('sourcing')}
        >
          Scan Talent Pool
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
        {/* Match Score Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', marginRight: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Match:
          </span>
          {['All', '90+', '80+', '70+'].map((m) => (
            <button
              key={m}
              onClick={() => setMatchFilter(m)}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: matchFilter === m ? 600 : 500,
                border: '1px solid',
                borderColor: matchFilter === m ? 'var(--color-primary)' : 'var(--color-border)',
                background: matchFilter === m ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                color: matchFilter === m ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {m === 'All' ? 'All Scores' : `${m}%`}
            </button>
          ))}
        </div>

        {/* Search, Status, Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 180 }}>
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
              placeholder="Search candidate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 28, height: 30, fontSize: 'var(--font-size-xs)' }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 130, height: 30, fontSize: 'var(--font-size-xs)' }}
          >
            <option value="All">Status: All</option>
            <option value="Qualified">Qualified</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Review">Review</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="form-select"
            style={{ width: 140, height: 30, fontSize: 'var(--font-size-xs)' }}
          >
            <option value="match">Sort: Match Score</option>
            <option value="experience">Sort: Experience</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="snow-table-container">
        <table className="snow-table">
          <thead>
            <tr>
              <th>Candidate Name & Title</th>
              <th>Applied Role</th>
              <th>Experience</th>
              <th>Location</th>
              <th>Match Score</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCandidates.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--color-text-muted)' }}>
                  No candidates found matching selected filters.
                </td>
              </tr>
            ) : (
              sortedCandidates.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div>
                      <div
                        onClick={() => navigate('candidate-detail', { candidateId: c.id })}
                        style={{
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-blue)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                      >
                        {c.name}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: 1 }}>
                        {c.title}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                      {c.appliedJobTitle}
                    </span>
                  </td>
                  <td>{c.experienceYears} Years</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                      <MapPin size={11} style={{ color: 'var(--color-text-muted)' }} />
                      <span>{c.location}</span>
                    </div>
                  </td>
                  <td>
                    <span className="snow-badge snow-badge-success" style={{ fontSize: '11px' }}>
                      {c.matchScore}% Match
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                      <Button
                        variant={c.status === 'Shortlisted' ? 'success' : 'secondary'}
                        size="sm"
                        icon={<CheckCircle2 size={12} />}
                        onClick={() => shortlistCandidate(c.id)}
                      >
                        {c.status === 'Shortlisted' ? 'Shortlisted' : 'Shortlist'}
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('candidate-detail', { candidateId: c.id })}
                      >
                        Profile
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
