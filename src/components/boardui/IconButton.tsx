import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  ariaLabel: string;
  variant?: 'default' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
}

const VARIANT_MAP = {
  default: {
    bg: '#ffffff',
    border: '1px solid #cbd5e1',
    color: '#334155',
    hoverBg: '#f8fafc',
    hoverBorder: '#94a3b8',
  },
  accent: {
    bg: '#eef2ff',
    border: '1px solid #c7d2fe',
    color: '#4338ca',
    hoverBg: '#e0e7ff',
    hoverBorder: '#818cf8',
  },
  ghost: {
    bg: 'transparent',
    border: '1px solid transparent',
    color: '#475569',
    hoverBg: '#f1f5f9',
    hoverBorder: 'transparent',
  },
  danger: {
    bg: '#ffffff',
    border: '1px solid #fecaca',
    color: '#991b1b',
    hoverBg: '#fee2e2',
    hoverBorder: '#f87171',
  },
};

/**
 * Official BoardUI Icon Button Component
 * Tactile button with optical center icon alignment, active spring scale,
 * and accessible aria attributes.
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  ariaLabel,
  variant = 'default',
  size = 'md',
  tooltip,
  disabled,
  style = {},
  className = '',
  ...props
}) => {
  const dim = size === 'sm' ? 28 : size === 'lg' ? 40 : 34;
  const cfg = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={tooltip || ariaLabel}
      disabled={disabled}
      className={`boardui-icon-btn ${className}`}
      style={{
        width: dim,
        height: dim,
        borderRadius: size === 'sm' ? 6 : 8,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: cfg.bg,
        border: cfg.border,
        color: cfg.color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.12s ease',
        outline: 'none',
        flexShrink: 0,
        lineHeight: 1,
        boxShadow: variant === 'ghost' ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.03)',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = cfg.hoverBg;
          e.currentTarget.style.borderColor = cfg.hoverBorder;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = cfg.bg;
          e.currentTarget.style.borderColor = cfg.border.replace('1px solid ', '');
        }
      }}
      {...props}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
    </button>
  );
};
