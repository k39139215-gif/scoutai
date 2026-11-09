import React from 'react';
import { ArrowDown, Clock } from 'lucide-react';

export interface FunnelStage {
  id?: string;
  name: string;
  count: number;
  avgDays?: number;
  color?: string;
  gradient?: string;
  baseLabel?: string;
  percentOfPool?: number;
  conversionFromPrev?: number | null;
}

export interface FunnelBarListProps {
  stages: FunnelStage[];
  className?: string;
  style?: React.CSSProperties;
}

const STAGE_GRADIENTS = [
  'linear-gradient(90deg, #1e293b 0%, #334155 100%)', // Pool: Deep Slate
  'linear-gradient(90deg, #1d4ed8 0%, #3b82f6 100%)', // Qualified: Cobalt Blue
  'linear-gradient(90deg, #4338ca 0%, #6366f1 100%)', // Shortlisted: Indigo
  'linear-gradient(90deg, #6d28d9 0%, #8b5cf6 100%)', // Screening: Purple/Violet
  'linear-gradient(90deg, #047857 0%, #10b981 100%)', // Offer: Emerald
];

const STAGE_ACCENT_COLORS = [
  '#334155',
  '#2563eb',
  '#4f46e5',
  '#7c3aed',
  '#047857',
];

/**
 * Official BoardUI Recruitment Pipeline Funnel Component
 * Features graduated semantic stage gradients, stage-to-stage conversion connectors,
 * duration velocity metrics, and mathematical integrity.
 */
export const FunnelBarList: React.FC<FunnelBarListProps> = ({
  stages,
  className = '',
  style = {},
}) => {
  const maxCount = stages.length > 0 ? stages[0].count : 1;

  return (
    <div
      className={`boardui-funnel-barlist ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        ...style,
      }}
    >
      {stages.map((stage, idx) => {
        const percentOfTotal =
          stage.percentOfPool !== undefined
            ? stage.percentOfPool
            : parseFloat(((stage.count / maxCount) * 100).toFixed(1));

        const prevCount = idx > 0 ? stages[idx - 1].count : null;
        const conversionFromPrev =
          stage.conversionFromPrev !== undefined
            ? stage.conversionFromPrev
            : prevCount
            ? parseFloat(((stage.count / prevCount) * 100).toFixed(1))
            : null;

        const gradient = stage.gradient || STAGE_GRADIENTS[idx % STAGE_GRADIENTS.length];
        const accentColor = STAGE_ACCENT_COLORS[idx % STAGE_ACCENT_COLORS.length];
        const dropoffPercent = conversionFromPrev !== null ? (100 - conversionFromPrev).toFixed(1) : null;

        return (
          <div key={stage.name} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Stage-to-Stage Drop-off Connector Pill */}
            {idx > 0 && conversionFromPrev !== null && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 8px 4px 18px',
                  position: 'relative',
                }}
              >
                {/* Vertical hairline connector */}
                <span
                  style={{
                    position: 'absolute',
                    left: 20,
                    top: -6,
                    bottom: 0,
                    width: 2,
                    background: 'var(--border-subtle, #e2e8f0)',
                  }}
                />

                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  <ArrowDown size={11} style={{ color: '#4338ca' }} />
                  <span>{conversionFromPrev}% pass-through</span>
                  {dropoffPercent && (
                    <span style={{ color: '#475569', fontWeight: 500 }}>
                      • {dropoffPercent}% filtered
                    </span>
                  )}
                </div>

                {stage.avgDays !== undefined && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      color: '#475569',
                      marginLeft: 'auto',
                    }}
                  >
                    <Clock size={11} />
                    <span>{stage.avgDays}d avg</span>
                  </span>
                )}
              </div>
            )}

            {/* Stage Container Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle, #e2e8f0)',
                borderRadius: 10,
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                transition: 'all 0.15s ease',
              }}
            >
              {/* Header row: Index + Name + Count */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: accentColor,
                      background: 'var(--bg-subtle, #f1f5f9)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    0{idx + 1}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--text-primary, #0f172a)',
                    }}
                  >
                    {stage.name}
                  </span>
                  {stage.baseLabel && (
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--text-secondary, #475569)',
                      }}
                    >
                      ({stage.baseLabel})
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--text-primary, #0f172a)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {stage.count} profiles
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#334155',
                      background: '#f1f5f9',
                      padding: '2px 7px',
                      borderRadius: 9999,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {percentOfTotal}% of pool
                  </span>
                </div>
              </div>

              {/* High-Performance Progress Bar with Rich Gradient */}
              <div
                style={{
                  height: 10,
                  width: '100%',
                  background: 'var(--bg-subtle, #f1f5f9)',
                  borderRadius: 9999,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.max(percentOfTotal, 2)}%`,
                    background: gradient,
                    borderRadius: 9999,
                    transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.25)',
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
