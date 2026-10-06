import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { Button } from '../common/Button';

export const TopCandidates: React.FC = () => {
  const { candidates, shortlistCandidate, navigate } = useApp();

  const topCandidates = [...candidates]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  return (
    <div className="snow-card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
            Top Matched Candidates
          </h2>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
            AI-evaluated profiles with highest compatibility scores.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          iconRight={<ArrowRight size={13} />}
          onClick={() => navigate('candidates')}
        >
          View All ({candidates.length})
        </Button>
      </div>

      {/* Candidates List */}
      {topCandidates.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>
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
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.background = 'var(--bg-subtle)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.background = 'var(--bg-surface)';
              }}
              role="button"
              tabIndex={0}
            >
              {/* Left: Avatar + Info + Skills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '12px',
                    flexShrink: 0,
                  }}
                >
                  {cand.name.charAt(0)}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {cand.name}
                    </span>
                    <StatusBadge status={cand.status} />
                  </div>

                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: 1 }}>
                    {cand.title} • {cand.location}
                  </div>

                  {/* Skills tags */}
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                    {cand.skills.slice(0, 3).map((sk) => (
                      <span
                        key={sk}
                        style={{
                          fontSize: '10.5px',
                          background: 'var(--bg-page)',
                          border: '1px solid var(--border-default)',
                          padding: '1px 5px',
                          borderRadius: 'var(--radius-xs)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-success-subtle)',
                    color: 'var(--color-success-text)',
                    border: '1px solid var(--color-success-border)',
                  }}
                >
                  {cand.matchScore}% Match
                </span>

                <Button
                  variant={cand.status === 'Shortlisted' ? 'success' : 'secondary'}
                  size="sm"
                  icon={<CheckCircle2 size={12} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    shortlistCandidate(cand.id);
                  }}
                >
                  {cand.status === 'Shortlisted' ? 'Shortlisted' : 'Shortlist'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
