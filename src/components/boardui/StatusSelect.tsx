import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface StatusSelectOption {
  value: string;
  label: string;
  dotColor?: string;
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
 * Official BoardUI Status Select Component
 * Figma source: Board UI -> Dashboard 1 -> Table status dropdown (node 3731:3264)
 * Features tactile trigger button with status dot, rotating chevron glyph,
 * and 150ms scale/fade/blur entry motion popover.
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
      {/* Trigger Button matching BoardUI Figma specs */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          height: isSmall ? 28 : 34,
          padding: isSmall ? '0 10px' : '0 12px',
          background: '#ffffff',
          border: `1px solid ${isOpen ? '#4338ca' : 'var(--border-subtle, #e2e8f0)'}`,
          borderRadius: 8,
          fontSize: isSmall ? 12 : 13,
          fontWeight: 500,
          color: 'var(--text-primary, #0f172a)',
          cursor: 'pointer',
          boxShadow: isOpen
            ? '0 0 0 2px rgba(67, 56, 202, 0.15)'
            : '0 1px 2px rgba(15, 23, 42, 0.04)',
          transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          outline: 'none',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = '#cbd5e1';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = 'var(--border-subtle, #e2e8f0)';
        }}
      >
        {/* BoardUI Colored Status Dot */}
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: dotColor,
            flexShrink: 0,
            boxShadow: `0 0 0 2px ${dotColor}33`,
          }}
        />

        <span>{selectedOption?.label || value}</span>

        {/* BoardUI 180deg Rotating Chevron */}
        <ChevronDown
          size={13}
          style={{
            color: '#64748b',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 180ms cubic-bezier(0.34, 1.25, 0.64, 1)',
          }}
        />
      </button>

      {/* BoardUI Animated Popover Menu with Blur/Scale Motion */}
      {isOpen && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 5px)',
            left: 0,
            zIndex: 110,
            minWidth: 160,
            background: '#ffffff',
            border: '1px solid var(--border-subtle, #e2e8f0)',
            borderRadius: 12,
            boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
            padding: 5,
            animation: 'boarduiSelectEnter 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            const optColor = opt.dotColor || DEFAULT_STATUS_COLORS[opt.value] || '#94a3b8';

            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: 7,
                  fontSize: 12.5,
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? '#0f172a' : '#475569',
                  background: isSelected ? '#f8fafc' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.12s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 6.5,
                      height: 6.5,
                      borderRadius: '50%',
                      background: optColor,
                    }}
                  />
                  <span>{opt.label}</span>
                </div>

                {isSelected && <Check size={13} style={{ color: '#4338ca' }} />}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes boarduiSelectEnter {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(-4px);
            filter: blur(2px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0px);
          }
        }
      `}</style>
    </div>
  );
};
