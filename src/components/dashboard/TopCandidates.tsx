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
        borderRadius: 8,
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
                padding: '10px 12px',
                borderRadius: 6,
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#e2e8f0',
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: 12,
                    flexShrink: 0,
                  }}
                >
                  {cand.name.charAt(0)}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>
                      {cand.name}
                    </span>
                    <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>
                      [CAN-{cand.id.replace('cand-', '')}]
                    </span>
                    <StatusBadge status={cand.status} size="sm" />
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                    {cand.title} • {cand.location}
                  </div>

                  {/* Skills tags */}
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                    {cand.skills.slice(0, 3).map((sk) => (
                      <span
                        key={sk}
                        style={{
                          fontSize: 12,
                          background: '#ffffff',
                          border: '1px solid var(--border-subtle)',
                          padding: '1px 5px',
                          borderRadius: 3,
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Match Score + Quick Shortlist / Review */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    padding: '2px 7px',
                    borderRadius: 4,
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
                    gap: 4,
                    height: 26,
                    padding: '0 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500,
                    background: cand.status === 'Shortlisted' ? '#f0fdf4' : '#ffffff',
                    border: `1px solid ${cand.status === 'Shortlisted' ? '#bbf7d0' : 'var(--border-default)'}`,
                    color: cand.status === 'Shortlisted' ? '#166534' : 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'background-color 0.1s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (cand.status !== 'Shortlisted') e.currentTarget.style.background = 'var(--bg-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    if (cand.status !== 'Shortlisted') e.currentTarget.style.background = '#ffffff';
                  }}
                >
                  {cand.status === 'Shortlisted' ? (
                    <>
                      <CheckCircle2 size={12} />
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
