import React from 'react';
import { X } from 'lucide-react';

export interface ChipProps {
  label?: React.ReactNode;
  children?: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  count?: number | string;
  onDismiss?: () => void;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const VARIANT_STYLES: Record<NonNullable<ChipProps['variant']>, { bg: string; color: string; border: string }> = {
  default: { bg: '#f1f5f9', color: '#334155', border: '#e2e8f0' },
  accent: { bg: '#eef2ff', color: '#4338ca', border: '#c7d2fe' },
  success: { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
  warning: { bg: '#fef9c3', color: '#854d0e', border: '#fef08a' },
  danger: { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
  neutral: { bg: '#ffffff', color: '#475569', border: '#e2e8f0' },
};

/**
 * Official BoardUI Chip / Tag Component
 * Figma source: Board UI -> Components -> Tags & Badges
 * Features tactile pill geometry, accessible contrast (>=4.5:1), optical center icons,
 * and optional dismiss button.
 */
export const Chip: React.FC<ChipProps> = ({
  label,
  children,
  variant = 'default',
  size = 'md',
  icon,
  count,
  onDismiss,
  onClick,
  className = '',
  style = {},
}) => {
  const content = label ?? children;
  const isClickable = !!onClick;
  const isSmall = size === 'sm';
  const colors = VARIANT_STYLES[variant] || VARIANT_STYLES.default;

  return (
    <span
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      className={`boardui-chip ${isClickable ? 'cursor-pointer' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        height: isSmall ? 22 : 26,
        padding: isSmall ? '0 8px' : '0 10px',
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 500,
        background: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        lineHeight: 1,
        transition: 'all 0.12s ease',
        ...style,
      }}
    >
      {icon && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          {icon}
        </span>
      )}

      <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1.2 }}>
        {content}
      </span>

      {count !== undefined && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1px 5px',
            borderRadius: 9999,
            background: 'rgba(0, 0, 0, 0.06)',
            fontSize: 12,
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
            marginLeft: 1,
          }}
        >
          {count}
        </span>
      )}

      {onDismiss && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          aria-label="Remove tag"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            opacity: 0.7,
            cursor: 'pointer',
            padding: 0,
            marginLeft: 2,
            borderRadius: '50%',
            lineHeight: 1,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        >
          <X size={11} strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
};
