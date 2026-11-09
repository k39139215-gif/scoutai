import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { AppView } from '../../types';

export interface LinkButtonProps {
  view?: AppView;
  params?: Record<string, any>;
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  showArrow?: boolean;
  variant?: 'primary' | 'secondary' | 'subtle' | 'ghost' | 'text';
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Official BoardUI Link Button Component
 * Navigates smoothly between app views with hover transitions,
 * accessible keyboard activation, and optical alignment.
 */
export const LinkButton: React.FC<LinkButtonProps> = ({
  view,
  params,
  onClick,
  children,
  icon,
  iconRight,
  showArrow = false,
  variant = 'secondary',
  size = 'md',
  className = '',
  style = {},
}) => {
  const { navigate } = useApp();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else if (view) {
      navigate(view, params);
    }
  };

  const isSmall = size === 'sm';
  const height = isSmall ? 28 : 34;

  let bg = '#ffffff';
  let border = '1px solid #cbd5e1';
  let color = '#0f172a';
  let hoverBg = '#f8fafc';

  if (variant === 'primary') {
    bg = '#0f172a';
    border = '1px solid #0f172a';
    color = '#ffffff';
    hoverBg = '#1e293b';
  } else if (variant === 'subtle') {
    bg = '#f1f5f9';
    border = '1px solid #e2e8f0';
    color = '#334155';
    hoverBg = '#e2e8f0';
  } else if (variant === 'ghost' || variant === 'text') {
    bg = 'transparent';
    border = '1px solid transparent';
    color = '#4338ca';
    hoverBg = variant === 'text' ? 'transparent' : '#eef2ff';
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`boardui-link-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height,
        padding: variant === 'text' ? '0 2px' : isSmall ? '0 10px' : '0 14px',
        borderRadius: 8,
        fontSize: isSmall ? 12 : 13,
        fontWeight: 500,
        background: bg,
        border,
        color,
        cursor: 'pointer',
        textDecoration: variant === 'text' ? 'underline' : 'none',
        transition: 'all 0.12s ease',
        outline: 'none',
        whiteSpace: 'nowrap',
        lineHeight: 1,
        boxShadow: variant === 'primary' ? '0 1px 2px rgba(15, 23, 42, 0.1)' : variant === 'secondary' ? '0 1px 2px rgba(0, 0, 0, 0.03)' : 'none',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hoverBg;
        if (variant === 'text') e.currentTarget.style.color = '#3730a3';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = bg;
        if (variant === 'text') e.currentTarget.style.color = color;
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
        {children}
      </span>

      {iconRight && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          {iconRight}
        </span>
      )}

      {showArrow && (
        <ArrowRight size={isSmall ? 11 : 13} style={{ flexShrink: 0 }} />
      )}
    </button>
  );
};
