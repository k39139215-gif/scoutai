import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export type StatTone = 'indigo' | 'emerald' | 'purple' | 'blue' | 'sky';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  tone?: StatTone;
  icon?: React.ReactNode;
  sparklineData?: number[];
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const TONE_GRADIENTS: Record<StatTone, string> = {
  indigo: 'linear-gradient(180deg, #4f46e5 0%, #4338ca 100%)',
  emerald: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
  purple: 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)',
  blue: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
  sky: 'linear-gradient(180deg, #0ea5e9 0%, #0284c7 100%)',
};

/**
 * Official BoardUI Metric Card Component
 * Figma source: Board UI -> Dashboard 1 -> Stat Cards (node 3731:3160)
 * Features a gradient icon tile, prominent tabular metric, graceful sparkline,
 * and BoardUI's signature footer band with delta pill.
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  delta,
  deltaType = 'positive',
  tone = 'indigo',
  icon,
  sparklineData,
  onClick,
  className = '',
  style = {},
}) => {
  const isClickable = !!onClick;

  // BoardUI Sparkline SVG renderer
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;

    const width = 72;
    const height = 24;
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;

    const points = sparklineData.map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    });

    const pathD = `M ${points.join(' L ')}`;
    const strokeColor = deltaType === 'positive' ? '#10b981' : deltaType === 'negative' ? '#ef4444' : '#6366f1';
    const gradientId = `boardui-spark-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathD} L ${width},${height} L 0,${height} Z`}
          fill={`url(#${gradientId})`}
        />
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <section
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`boardui-stat-card ${isClickable ? 'boardui-card-clickable' : ''} ${className}`}
      style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle, #e2e8f0)',
        borderRadius: 14,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)',
        transition: 'transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease',
        cursor: isClickable ? 'pointer' : 'default',
        minWidth: 0,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (isClickable) {
          e.currentTarget.style.borderColor = '#cbd5e1';
          e.currentTarget.style.transform = 'translateY(-1.5px)';
          e.currentTarget.style.boxShadow = '0 6px 16px -2px rgba(15, 23, 42, 0.06), 0 2px 4px -1px rgba(15, 23, 42, 0.03)';
        }
      }}
      onMouseLeave={(e) => {
        if (isClickable) {
          e.currentTarget.style.borderColor = 'var(--border-subtle, #e2e8f0)';
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)';
        }
      }}
    >
      {/* Top Row: BoardUI Gradient Icon Tile + Sparkline (Single clean horizontal row) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        {icon && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 10,
              background: TONE_GRADIENTS[tone] || TONE_GRADIENTS.indigo,
              color: '#ffffff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              flexShrink: 0,
            }}
          >
            {icon}
          </span>
        )}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {renderSparkline()}
        </div>
      </div>

      {/* Middle Body: Metric Label + Tabular Headline Value */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 12 }}>
        <p
          style={{
            fontSize: 12.5,
            fontWeight: 500,
            color: 'var(--text-secondary, #475569)',
            letterSpacing: '-0.01em',
            margin: 0,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--text-primary, #0f172a)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            margin: 0,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </p>
      </div>

      {/* BoardUI Footer Band: Caption + Delta Pill */}
      {(subtitle || delta) && (
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            background: 'var(--bg-subtle, #f8fafc)',
            border: '1px solid var(--border-subtle, #f1f5f9)',
            borderRadius: 8,
            padding: '6px 10px',
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--text-secondary, #475569)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </span>

          {delta && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                fontSize: 12,
                fontWeight: 600,
                padding: '2px 7px',
                borderRadius: 9999,
                fontVariantNumeric: 'tabular-nums',
                flexShrink: 0,
                background:
                  deltaType === 'positive'
                    ? '#dcfce7'
                    : deltaType === 'negative'
                    ? '#fee2e2'
                    : '#e2e8f0',
                color:
                  deltaType === 'positive'
                    ? '#166534'
                    : deltaType === 'negative'
                    ? '#991b1b'
                    : '#334155',
                border: `1px solid ${
                  deltaType === 'positive'
                    ? '#bbf7d0'
                    : deltaType === 'negative'
                    ? '#fecaca'
                    : '#cbd5e1'
                }`,
              }}
            >
              {deltaType === 'positive' && <ArrowUpRight size={11} />}
              {deltaType === 'negative' && <ArrowDownRight size={11} />}
              {deltaType === 'neutral' && <Minus size={10} />}
              <span>{delta}</span>
            </span>
          )}
        </div>
      )}
    </section>
  );
};
