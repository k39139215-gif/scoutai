import React from 'react';
import { ArrowDown, Clock } from 'lucide-react';

export interface FunnelStage {
  name: string;
  count: number;
  avgDays?: number;
  color?: string;
}

export interface FunnelBarListProps {
  stages: FunnelStage[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * BoardUI Funnel Bar List Component (Free / MIT)
 * Visualizes multi-stage recruitment conversion velocity with drop-off percentages and duration metrics.
 */
export const FunnelBarList: React.FC<FunnelBarListProps> = ({
  stages,
  className = '',
  style = {},
}) => {
  const maxCount = stages.length > 0 ? stages[0].count : 1;

  const defaultColors = ['#0f172a', '#2563eb', '#10b981', '#8b5cf6', '#f59e0b'];

  return (
    <div
      className={`boardui-funnel-barlist ${className}`}
      style={{ display: 'flex', flexDirection: 'column', gap: 14, ...style }}
    >
      {stages.map((stage, idx) => {
        const percentOfTotal = ((stage.count / maxCount) * 100).toFixed(1);
        const prevCount = idx > 0 ? stages[idx - 1].count : null;
        const conversionFromPrev = prevCount
          ? ((stage.count / prevCount) * 100).toFixed(1)
          : null;
        const color = stage.color || defaultColors[idx % defaultColors.length];

        return (
          <div key={stage.name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Stage Label & Metrics */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'monospace',
                    color: '#94a3b8',
                    fontWeight: 600,
                  }}
                >
                  0{idx + 1}.
                </span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{stage.name}</span>

                {conversionFromPrev && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 2,
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: '#059669',
                      background: 'rgba(16, 185, 129, 0.08)',
                      padding: '1px 5px',
                      borderRadius: 4,
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <ArrowDown size={10} />
                    <span>{conversionFromPrev}% conv.</span>
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {stage.avgDays !== undefined && (
                  <span
                    style={{
                      fontSize: 11,
                      color: '#94a3b8',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    <Clock size={10} />
                    <span>avg {stage.avgDays}d</span>
                  </span>
                )}

                <span
                  style={{
                    fontWeight: 700,
                    color: '#0f172a',
                    fontFamily: 'inherit',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {stage.count} <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: 11 }}>candidates</span>
                </span>
              </div>
            </div>

            {/* Gradient Bar Track */}
            <div
              style={{
                width: '100%',
                height: 10,
                background: '#f1f5f9',
                borderRadius: 5,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: `${percentOfTotal}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                  borderRadius: 5,
                  transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
