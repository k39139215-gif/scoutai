import React from 'react';
import type { Candidate } from '../../types';

export interface CompetencyDimension {
  label: string;
  shortLabel: string;
  score: number;
}

export const getCandidateCompetencies = (candidate: Candidate): CompetencyDimension[] => {
  const hasBackend = candidate.skills.some((s) => /distributed|cloud|backend|architect|microservices|golang|rust|node/i.test(s));
  const hasFrontend = candidate.skills.some((s) => /test|clean|react|typescript|next|vue/i.test(s));
  
  const arch = Math.min(99, Math.max(65, Math.round(candidate.matchScore * 0.96 + (hasBackend ? 7 : 1))));
  const code = Math.min(99, Math.max(68, Math.round(candidate.matchScore * 0.94 + (hasFrontend ? 6 : 2))));
  const scale = Math.min(99, Math.max(60, Math.round(candidate.experienceYears * 4.5 + candidate.matchScore * 0.48)));
  const lead = Math.min(98, Math.max(70, Math.round(candidate.matchScore * 0.88 + (candidate.experienceYears > 6 ? 9 : 3))));
  const domain = Math.min(99, Math.max(66, Math.round(candidate.matchScore * 0.95 + Math.min(candidate.skills.length * 2, 7))));

  return [
    { label: 'Systems Architecture', shortLabel: 'Architecture', score: arch },
    { label: 'Code Craftsmanship', shortLabel: 'Code Craft', score: code },
    { label: 'Scalability & Performance', shortLabel: 'Scalability', score: scale },
    { label: 'Leadership & Collaboration', shortLabel: 'Leadership', score: lead },
    { label: 'Domain Velocity', shortLabel: 'Domain Fit', score: domain },
  ];
};

interface CompetencyRadarChartProps {
  candidate: Candidate;
  size?: number;
  showLegend?: boolean;
}

export const CompetencyRadarChart: React.FC<CompetencyRadarChartProps> = ({
  candidate,
  size = 260,
  showLegend = true,
}) => {
  const competencies = getCandidateCompetencies(candidate);
  const numAxes = competencies.length;
  
  const width = size;
  const height = size * 0.92;
  const cx = width / 2;
  const cy = height / 2;
  const R = size * 0.33;

  const levels = [0.25, 0.5, 0.75, 1.0];

  // Helper for coordinates
  const getCoordinates = (i: number, radius: number) => {
    const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  // Build polygon path for each level
  const levelPolygons = levels.map((lvl) => {
    return competencies
      .map((_, i) => {
        const { x, y } = getCoordinates(i, R * lvl);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  });

  // Build candidate data polygon
  const candidatePolygon = competencies
    .map((c, i) => {
      const r = R * (c.score / 100);
      const { x, y } = getCoordinates(i, r);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: 'visible' }}
        aria-label={`Competency radar chart for ${candidate.name}`}
      >
        <defs>
          <radialGradient id={`radar-grad-${candidate.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.08" />
          </radialGradient>
        </defs>

        {/* Concentric Reference Grid Polygons */}
        {levelPolygons.map((pts, idx) => (
          <polygon
            key={idx}
            points={pts}
            fill={idx === levels.length - 1 ? '#f8fafc' : 'none'}
            stroke="#cbd5e1"
            strokeWidth={idx === levels.length - 1 ? '1.5' : '1'}
            strokeDasharray={idx === levels.length - 1 ? 'none' : '3 3'}
          />
        ))}

        {/* Radial Axis Spokes */}
        {competencies.map((_, i) => {
          const { x, y } = getCoordinates(i, R);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          );
        })}

        {/* Candidate Filled Competency Polygon */}
        <polygon
          points={candidatePolygon}
          fill={`url(#radar-grad-${candidate.id})`}
          stroke="#2563eb"
          strokeWidth="2"
        />

        {/* Vertex Data Markers */}
        {competencies.map((c, i) => {
          const r = R * (c.score / 100);
          const { x, y } = getCoordinates(i, r);
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={4}
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          );
        })}

        {/* Axis Labels & Vertex Scores */}
        {competencies.map((c, i) => {
          const { x, y } = getCoordinates(i, R + 18);
          const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
          const cos = Math.cos(angle);
          const textAnchor = Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end';

          return (
            <text
              key={i}
              x={x}
              y={y + 3}
              textAnchor={textAnchor}
              fontSize="10"
              fontWeight="600"
              fill="#334155"
              style={{ userSelect: 'none' }}
            >
              {c.shortLabel}{' '}
              <tspan fill="#2563eb" fontWeight="700">
                {c.score}%
              </tspan>
            </text>
          );
        })}
      </svg>

      {/* Optional Horizontal Score Bar List */}
      {showLegend && (
        <div style={{ width: '100%', marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {competencies.map((comp) => (
            <div key={comp.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
              <span style={{ width: 130, color: '#475569', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {comp.label}
              </span>
              <div style={{ flex: 1, height: 6, backgroundColor: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${comp.score}%`,
                    height: '100%',
                    backgroundColor: comp.score >= 90 ? '#10b981' : comp.score >= 80 ? '#3b82f6' : '#f59e0b',
                    borderRadius: 9999,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              <span style={{ width: 32, textAlign: 'right', fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                {comp.score}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
