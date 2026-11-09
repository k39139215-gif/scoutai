import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  sparklineData?: number[];
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * BoardUI Stat Card Component (Free / MIT)
 * Enterprise metric card with tabular-nums typography, trend badge, and responsive SVG sparkline.
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  delta,
  deltaType = 'positive',
  icon,
  sparklineData,
  onClick,
  className = '',
  style = {},
}) => {
  // Generate SVG path for sparkline if data provided
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;

    const width = 80;
    const height = 28;
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
    const gradientId = `stat-grad-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Fill area */}
        <path
          d={`${pathD} L ${width},${height} L 0 revolutionary,${height} Z`.replace('revolutionary,', '0,')}
          fill={`url(#${gradientId})`}
        />
        {/* Stroke line */}
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`boardui-stat-card ${isClickable ? 'boardui-card-clickable' : ''} ${className}`}
      style={{
        padding: '18px 20px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
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
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02)';
        }
      }}
    >
      {/* Top Header: Title + Icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12.5, fontWeight: 500, color: '#64748b', letterSpacing: '-0.01em' }}>
          {title}
        </span>
        {icon && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: 6,
              background: '#f8fafc',
              border: '1px solid #f1f5f9',
              color: '#64748b',
            }}
          >
            {icon}
          </span>
        )}
      </div>

      {/* Main Metric Value + Sparkline */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              fontFamily: 'inherit',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {value}
          </div>

          {/* Subtitle / Context */}
          {subtitle && (
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, letterSpacing: '-0.01em' }}>
              {subtitle}
            </div>
          )}
        </div>

        {/* Right side: Sparkline or Delta Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {renderSparkline()}

          {delta && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                fontSize: 11,
                fontWeight: 600,
                padding: '1.5px 6px',
                borderRadius: 4,
                fontVariantNumeric: 'tabular-nums',
                background:
                  deltaType === 'positive'
                    ? 'rgba(16, 185, 129, 0.1)'
                    : deltaType === 'negative'
                    ? 'rgba(239, 68, 68, 0.1)'
                    : '#f1f5f9',
                color:
                  deltaType === 'positive'
                    ? '#059669'
                    : deltaType === 'negative'
                    ? '#dc2626'
                    : '#64748b',
                border: `1px solid ${
                  deltaType === 'positive'
                    ? 'rgba(16, 185, 129, 0.2)'
                    : deltaType === 'negative'
                    ? 'rgba(239, 68, 68, 0.2)'
                    : '#e2e8f0'
                }`,
              }}
            >
              {deltaType === 'positive' && <ArrowUpRight size={11} />}
              {deltaType === 'negative' && <ArrowDownRight size={11} />}
              {deltaType === 'neutral' && <Minus size={11} />}
              <span>{delta}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
