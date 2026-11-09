import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  ariaLabel?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Official BoardUI Switch / Toggle Component
 * Figma source: Board UI -> Inputs & Controls -> Switch
 * Features fluid spring transition, accessible keyboard activation,
 * and high-contrast active state.
 */
export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  id,
  ariaLabel,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const isSmall = size === 'sm';
  const width = isSmall ? 36 : 42;
  const height = isSmall ? 20 : 24;
  const thumbSize = isSmall ? 16 : 20;
  const travelDist = width - thumbSize - 4;

  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`boardui-switch ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width,
        height,
        borderRadius: 9999,
        backgroundColor: checked ? '#4338ca' : '#e2e8f0',
        border: checked ? '1px solid #4338ca' : '1px solid #cbd5e1',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: 2,
        transition: 'background-color 200ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        outline: 'none',
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
        boxShadow: checked ? '0 1px 2px rgba(67, 56, 202, 0.2)' : 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
      }}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (!disabled) onChange(!checked);
        }
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 2px #ffffff, 0 0 0 4px #6366f1';
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = checked ? '0 1px 2px rgba(67, 56, 202, 0.2)' : 'inset 0 1px 2px rgba(0, 0, 0, 0.04)';
      }}
    >
      <span
        style={{
          display: 'block',
          width: thumbSize,
          height: thumbSize,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(15, 23, 42, 0.2), 0 1px 2px rgba(15, 23, 42, 0.1)',
          transform: checked ? `translateX(${travelDist}px)` : 'translateX(0)',
          transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </button>
  );
};
