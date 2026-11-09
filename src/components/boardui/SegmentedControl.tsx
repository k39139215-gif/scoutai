import React from 'react';

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  count?: number | string;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (val: string) => void;
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * BoardUI Segmented Control Component (Free / MIT)
 * Tactile pill switch with smooth active indicator and count badges.
 */
export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  size = 'md',
  className = '',
  style = {},
}) => {
  const isSmall = size === 'sm';

  return (
    <div
      role="radiogroup"
      className={`boardui-segmented-control ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#f1f5f9',
        border: '1px solid #e2e8f0',
        borderRadius: isSmall ? 6 : 8,
        padding: 2,
        gap: 2,
        userSelect: 'none',
        ...style,
      }}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.value)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              padding: isSmall ? '3px 8px' : '5px 12px',
              borderRadius: isSmall ? 4 : 6,
              fontSize: isSmall ? 11.5 : 12.5,
              fontWeight: isActive ? 600 : 500,
              background: isActive ? '#ffffff' : 'transparent',
              color: isActive ? '#4338ca' : '#64748b',
              border: isActive ? '1px solid #c7d2fe' : '1px solid transparent',
              cursor: 'pointer',
              boxShadow: isActive ? '0 1px 2px rgba(67, 56, 202, 0.08)' : 'none',
              transition: 'all 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
              outline: 'none',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#0f172a';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#64748b';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {opt.icon && <span style={{ display: 'flex' }}>{opt.icon}</span>}
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                style={{
                  fontSize: 10,
                  fontFamily: 'inherit',
                  fontVariantNumeric: 'tabular-nums',
                  padding: '1px 5px',
                  borderRadius: 9999,
                  background: isActive ? '#e0e7ff' : '#e2e8f0',
                  color: isActive ? '#3730a3' : '#64748b',
                  fontWeight: 600,
                  marginLeft: 1,
                }}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
