import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';

export const TopCandidates: React.FC = () => {
  const { candidates, shortlistCandidate, navigate } = useApp();

  const topCandidates = [...candidates]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>
            Top Matched Candidates
          </h2>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>
            Highest compatibility candidates evaluated against requisition criteria.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('candidates')}
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
          <span>All candidates ({candidates.length})</span>
          <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      {/* Candidates List */}
      {topCandidates.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          No candidate profiles in current pipeline.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {topCandidates.map((cand) => (
            <div
              key={cand.id}
              onClick={() => navigate('candidate-detail', { candidateId: cand.id })}
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-canvas)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                cursor: 'pointer',
                transition: 'background-color 0.1s ease, border-color 0.1s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.background = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = 'var(--bg-canvas)';
              }}
            >
              {/* Left: Avatar + Info + Skills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#0f172a',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: 13,
                    flexShrink: 0,
                    letterSpacing: '0.02em',
                  }}
                >
                  {cand.name.charAt(0)}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a' }}>
                      {cand.name}
                    </span>
                    <StatusBadge status={cand.status} size="sm" />
                  </div>

                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
                    {cand.title} • {cand.location}
                  </div>

                  {/* Skills tags */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 5 }}>
                    {cand.skills.slice(0, 3).map((sk) => (
                      <span
                        key={sk}
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          padding: '2px 7px',
                          borderRadius: 4,
                          color: '#475569',
                        }}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Match Score + Quick Shortlist / Review */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '3px 9px',
                    borderRadius: 6,
                    background: '#f0fdf4',
                    color: '#166534',
                    border: '1px solid #bbf7d0',
                  }}
                >
                  {cand.matchScore}% fit
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    shortlistCandidate(cand.id);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    height: 30,
                    padding: '0 12px',
                    borderRadius: 6,
                    fontSize: 12.5,
                    fontWeight: 500,
                    background: cand.status === 'Shortlisted' ? '#f0fdf4' : '#ffffff',
                    border: `1px solid ${cand.status === 'Shortlisted' ? '#bbf7d0' : '#cbd5e1'}`,
                    color: cand.status === 'Shortlisted' ? '#166534' : '#0f172a',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (cand.status !== 'Shortlisted') {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#94a3b8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (cand.status !== 'Shortlisted') {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }
                  }}
                >
                  {cand.status === 'Shortlisted' ? (
                    <>
                      <CheckCircle2 size={13} />
                      <span>Shortlisted</span>
                    </>
                  ) : (
                    <span>Shortlist</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
