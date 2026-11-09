import React from 'react';
import { Check } from 'lucide-react';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
  size?: number;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  ariaLabel,
  size = 17,
}) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange(!checked);
      }}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius: 4,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: checked ? '#0f172a' : '#ffffff',
        border: checked ? '1.5px solid #0f172a' : '1.5px solid #cbd5e1',
        transition: 'background-color 0.12s ease, border-color 0.12s ease',
        padding: 0,
        outline: 'none',
        boxShadow: 'none',
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !checked) {
          e.currentTarget.style.borderColor = '#94a3b8';
          e.currentTarget.style.background = '#f8fafc';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !checked) {
          e.currentTarget.style.borderColor = '#cbd5e1';
          e.currentTarget.style.background = '#ffffff';
        }
      }}
    >
      {checked && (
        <Check
          size={size - 5}
          strokeWidth={3}
          style={{
            color: '#ffffff',
            pointerEvents: 'none',
          }}
        />
      )}
    </button>
  );
};
