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
        border: '1px solid #e4e4e7',
        borderRadius: 10,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#18181b', letterSpacing: '-0.01em' }}>
            Top Matched Candidates
          </h2>
          <p style={{ fontSize: 12.5, color: '#71717a', marginTop: 2 }}>
            AI-evaluated profiles with highest compatibility scores.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('candidates')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 32,
            padding: '0 12px',
            borderRadius: 6,
            fontSize: 12.5,
            fontWeight: 500,
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            color: '#18181b',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f4f4f5';
            e.currentTarget.style.borderColor = '#d4d4d8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = '#e4e4e7';
          }}
        >
          <span>View All ({candidates.length})</span>
          <ArrowRight size={13} style={{ color: '#71717a' }} />
        </button>
      </div>

      {/* Candidates List */}
      {topCandidates.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: '#a1a1aa', fontSize: 13 }}>
          No candidate profiles in current pipeline.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topCandidates.map((cand) => (
            <div
              key={cand.id}
              onClick={() => navigate('candidate-detail', { candidateId: cand.id })}
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid #f4f4f5',
                background: '#fafafa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#e4e4e7';
                e.currentTarget.style.background = '#f4f4f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#f4f4f5';
                e.currentTarget.style.background = '#fafafa';
              }}
              role="button"
              tabIndex={0}
            >
              {/* Left: Avatar + Info + Skills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: '#18181b',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {cand.name.charAt(0)}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: '#18181b' }}>
                      {cand.name}
                    </span>
                    <StatusBadge status={cand.status} />
                  </div>

                  <div style={{ fontSize: 12, color: '#71717a', marginTop: 1 }}>
                    {cand.title} • {cand.location}
                  </div>

                  {/* Skills tags */}
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                    {cand.skills.slice(0, 3).map((sk) => (
                      <span
                        key={sk}
                        style={{
                          fontSize: 11,
                          background: '#ffffff',
                          border: '1px solid #e4e4e7',
                          padding: '1px 6px',
                          borderRadius: 4,
                          color: '#52525b',
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
                    fontSize: 11.5,
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: 5,
                    background: '#dcfce7',
                    color: '#15803d',
                    border: '1px solid #bbf7d0',
                  }}
                >
                  {cand.matchScore}% Match
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
                    padding: '0 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    background: cand.status === 'Shortlisted' ? '#dcfce7' : '#ffffff',
                    border: cand.status === 'Shortlisted' ? '1px solid #86efac' : '1px solid #e4e4e7',
                    color: cand.status === 'Shortlisted' ? '#15803d' : '#18181b',
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>{cand.status === 'Shortlisted' ? 'Shortlisted' : 'Shortlist'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
