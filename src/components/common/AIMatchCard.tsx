import React from 'react';
import { Check, AlertCircle, Info, SearchCheck } from 'lucide-react';
import type { Candidate } from '../../types';

interface AIMatchCardProps {
  candidate: Candidate;
}

export const AIMatchCard: React.FC<AIMatchCardProps> = ({ candidate }) => {
  const isHighMatch = candidate.matchScore >= 90;
  const isGoodMatch = candidate.matchScore >= 80 && candidate.matchScore < 90;

  return (
    <div className="snow-card" style={{ padding: '20px 22px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SearchCheck size={14} />
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#0f172a',
                letterSpacing: '-0.01em',
              }}
            >
              Compatibility Scorecard
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
              Target Requisition: {candidate.appliedJobTitle}
            </div>
          </div>
        </div>

        {/* Match Percentage */}
        <div
          style={{
            background: isHighMatch ? '#f0fdf4' : isGoodMatch ? '#eff6ff' : '#fefce8',
            border: `1px solid ${isHighMatch ? '#bbf7d0' : isGoodMatch ? '#bfdbfe' : '#fef08a'}`,
            color: isHighMatch ? '#166534' : isGoodMatch ? '#1e40af' : '#854d0e',
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <span className="tabular-nums">{candidate.matchScore}% Match Fit</span>
        </div>
      </div>

      {/* Rationale Explanation */}
      <div
        style={{
          background: 'var(--bg-canvas)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 6,
          padding: '12px 14px',
          fontSize: 12.5,
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: 16,
        }}
      >
        {candidate.aiAnalysisExplanation}
      </div>

      {/* Strengths & Considerations Two-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {/* Key Strengths */}
        <div
          style={{
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6,
            padding: '12px 14px',
          }}
        >
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 500,
              color: '#0f172a',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Check size={13} style={{ color: '#166534' }} />
            <span>Key strengths</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {candidate.strengths && candidate.strengths.length > 0 ? (
              candidate.strengths.map((str, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 6,
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ color: 'var(--border-strong)', marginTop: 3 }}>•</span>
                  <span>{str}</span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                Demonstrated core competencies meet minimum requirements.
              </div>
            )}
          </div>
        </div>

        {/* Considerations / Interview Questions */}
        <div
          style={{
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6,
            padding: '12px 14px',
          }}
        >
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 500,
              color: '#0f172a',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <AlertCircle size={13} style={{ color: '#854d0e' }} />
            <span>Recommended interview probes</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {candidate.potentialGaps && candidate.potentialGaps.length > 0 ? (
              candidate.potentialGaps.map((con: string, idx: number) => (
                <div
                  key={idx}
                  style={{
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 6,
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ color: 'var(--border-strong)', marginTop: 3 }}>•</span>
                  <span>{con}</span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                Verify practical depth in production scale environments.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advisory Note */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 11.5,
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 12,
        }}
      >
        <Info size={13} style={{ flexShrink: 0 }} />
        <span>
          Scoring rubric calculated against stated technical depth, years of experience, and role requirements.
        </span>
      </div>
    </div>
  );
};
