import React from 'react';
import { Check, Minus } from 'lucide-react';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  size?: 'sm' | 'md';
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Official BoardUI Checkbox Component
 * Figma source: Board UI -> Components -> Inputs -> Checkbox
 * Features smooth spring checkmark motion, accessible keyboard toggling,
 * indeterminate dash support, and focus-visible ring.
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  indeterminate = false,
  label,
  description,
  size = 'md',
  ariaLabel,
  className = '',
  style = {},
}) => {
  const isSm = size === 'sm';
  const boxDim = isSm ? 16 : 18;
  const isHighlighted = checked || indeterminate;

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <label
      className={`boardui-checkbox-container ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: description ? 'flex-start' : 'center',
        gap: 8,
        userSelect: 'none',
        ...style,
      }}
      onClick={(e) => {
        e.preventDefault();
        handleToggle();
      }}
    >
      <div
        role="checkbox"
        tabIndex={disabled ? -1 : 0}
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-label={ariaLabel || (typeof label === 'string' ? label : 'Select')}
        aria-disabled={disabled}
        onKeyDown={handleKeyDown}
        style={{
          width: boxDim,
          height: boxDim,
          borderRadius: 5,
          background: isHighlighted ? '#0f172a' : '#ffffff',
          border: `1.5px solid ${isHighlighted ? '#0f172a' : '#cbd5e1'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isHighlighted ? '0 1px 2px rgba(15, 23, 42, 0.15)' : '0 1px 2px rgba(0, 0, 0, 0.02)',
          outline: 'none',
          marginTop: description ? 2 : 0,
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(67, 56, 202, 0.25)';
          e.currentTarget.style.borderColor = '#4338ca';
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = isHighlighted
            ? '0 1px 2px rgba(15, 23, 42, 0.15)'
            : '0 1px 2px rgba(0, 0, 0, 0.02)';
          e.currentTarget.style.borderColor = isHighlighted ? '#0f172a' : '#cbd5e1';
        }}
      >
        {checked && !indeterminate && (
          <Check size={isSm ? 11 : 12} strokeWidth={3} style={{ color: '#ffffff' }} />
        )}
        {indeterminate && (
          <Minus size={isSm ? 11 : 12} strokeWidth={3} style={{ color: '#ffffff' }} />
        )}
      </div>

      {(label || description) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {label && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: disabled ? '#94a3b8' : '#0f172a',
                lineHeight: 1.3,
              }}
            >
              {label}
            </span>
          )}
          {description && (
            <span style={{ fontSize: 12, color: '#64748b', lineHeight: 1.35 }}>
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
};
