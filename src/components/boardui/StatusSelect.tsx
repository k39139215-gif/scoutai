import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface StatusSelectOption {
  value: string;
  label: string;
  dotColor?: string; // Hex or CSS color
}

export interface StatusSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: StatusSelectOption[];
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_STATUS_COLORS: Record<string, string> = {
  Open: '#10b981',
  Active: '#10b981',
  Shortlisted: '#10b981',
  Qualified: '#3b82f6',
  Interviewing: '#8b5cf6',
  Paused: '#f59e0b',
  Draft: '#94a3b8',
  Review: '#f59e0b',
  Closed: '#ef4444',
  Archived: '#64748b',
};

/**
 * BoardUI Status Select Component (Free / MIT)
 * Replaces unstyled native HTML <select> with accessible popover dropdown and colored status dots.
 */
export const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  onChange,
  options,
  size = 'sm',
  className = '',
  style = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];
  const isSmall = size === 'sm';

  const dotColor =
    selectedOption?.dotColor || DEFAULT_STATUS_COLORS[selectedOption?.value] || '#94a3b8';

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`boardui-status-select-wrapper ${className}`}
      style={{ position: 'relative', display: 'inline-block', ...style }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          height: isSmall ? 28 : 34,
          padding: isSmall ? '0 8px 0 10px' : '0 10px 0 12px',
          background: '#ffffff',
          border: `1px solid ${isOpen ? '#0f172a' : '#e2e8f0'}`,
          borderRadius: 6,
          fontSize: isSmall ? 12 : 13,
          fontWeight: 500,
          color: '#1e293b',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.12s ease',
          outline: 'none',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = '#e2e8f0';
        }}
      >
        {/* Status Dot */}
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: dotColor,
            flexShrink: 0,
            boxShadow: `0 0 0 2px ${dotColor}25`,
          }}
        />

        <span>{selectedOption?.label || value}</span>

        <ChevronDown
          size={13}
          style={{
            color: '#94a3b8',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s ease',
          }}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 100,
            minWidth: 150,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
            padding: 4,
            animation: 'boarduiMenuFade 0.12s ease-out',
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            const optColor = opt.dotColor || DEFAULT_STATUS_COLORS[opt.value] || '#94a3b8';

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: 5,
                  fontSize: 12,
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? '#0f172a' : '#475569',
                  background: isSelected ? '#f8fafc' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: optColor,
                    }}
                  />
                  <span>{opt.label}</span>
                </div>

                {isSelected && <Check size={12} style={{ color: '#0f172a' }} />}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes boarduiMenuFade {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
