import React from 'react';
import { Sparkles, Check, AlertCircle, Info } from 'lucide-react';
import type { Candidate } from '../../types';

interface AIMatchCardProps {
  candidate: Candidate;
}

export const AIMatchCard: React.FC<AIMatchCardProps> = ({ candidate }) => {
  const isHighMatch = candidate.matchScore >= 90;
  const isGoodMatch = candidate.matchScore >= 80 && candidate.matchScore < 90;

  return (
    <div className="snow-card" style={{ padding: '20px 24px' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={14} />
          </div>
          <div>
            <div
              style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              AI Advisory Evaluation
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
              Evaluated against role: {candidate.appliedJobTitle}
            </div>
          </div>
        </div>

        {/* Match Percentage */}
        <div
          style={{
            background: isHighMatch
              ? 'var(--color-success-subtle)'
              : isGoodMatch
              ? 'var(--color-accent-blue-subtle)'
              : 'var(--color-warning-subtle)',
            border: `1px solid ${
              isHighMatch
                ? 'var(--color-success-border)'
                : isGoodMatch
                ? 'var(--color-accent-blue-border)'
                : 'var(--color-warning-border)'
            }`,
            color: isHighMatch
              ? 'var(--color-success-text)'
              : isGoodMatch
              ? 'var(--color-accent-blue-text)'
              : 'var(--color-warning-text)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <span>{candidate.matchScore}% Match</span>
        </div>
      </div>

      {/* Rationale Explanation */}
      <div
        style={{
          background: 'var(--color-bg-canvas)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-secondary)',
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
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* Key Strengths */}
        <div
          style={{
            background: 'var(--color-bg-canvas)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Check size={13} style={{ color: 'var(--color-success)' }} />
            <span>Key Strengths</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {candidate.strengths.map((str, i) => (
              <li
                key={i}
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 6,
                  lineHeight: 1.45,
                }}
              >
                <span style={{ color: 'var(--color-text-muted)', marginTop: 1 }}>•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Considerations / Gaps */}
        <div
          style={{
            background: 'var(--color-bg-canvas)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <AlertCircle size={13} style={{ color: 'var(--color-warning)' }} />
            <span>Considerations</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {candidate.potentialGaps.map((gap, i) => (
              <li
                key={i}
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 6,
                  lineHeight: 1.45,
                }}
              >
                <span style={{ color: 'var(--color-text-muted)', marginTop: 1 }}>•</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Advisory Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          paddingTop: 10,
          borderTop: '1px solid var(--color-divider)',
        }}
      >
        <Info size={13} style={{ flexShrink: 0 }} />
        <span>
          AI match scores provide advisory ranking assistance. All shortlisting and progression decisions are made by human recruiters.
        </span>
      </div>
    </div>
  );
};
