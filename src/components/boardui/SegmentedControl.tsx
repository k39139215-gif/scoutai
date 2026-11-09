import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';

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

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Official BoardUI Segmented Control Component
 * Figma source: Board UI -> Dashboard 1 switch (node 3731:3096)
 * Features tactile track, smooth sliding spring thumb transition,
 * keyboard accessibility, and refined typography.
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const activeBtn = el.querySelector<HTMLButtonElement>('[data-active="true"]');
      if (activeBtn) {
        setThumb({
          left: activeBtn.offsetLeft,
          top: activeBtn.offsetTop,
          width: activeBtn.offsetWidth,
          height: activeBtn.offsetHeight,
        });
      }
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const buttons = el.querySelectorAll('button');
    buttons.forEach((btn) => ro.observe(btn));

    return () => {
      ro.disconnect();
    };
  }, [value, options]);

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % options.length;
      onChange(options[nextIndex].value);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      onChange(options[prevIndex].value);
    }
  };

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label="Filter options"
      className={`boardui-segmented-control ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--bg-subtle, #f1f5f9)',
        border: '1px solid var(--border-subtle, #e2e8f0)',
        borderRadius: isSmall ? 8 : 10,
        padding: isSmall ? 2 : 3,
        gap: 2,
        userSelect: 'none',
        ...style,
      }}
    >
      {/* BoardUI Sliding Spring Thumb */}
      {thumb && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: thumb.width,
            height: thumb.height,
            transform: `translate3d(${thumb.left}px, ${thumb.top}px, 0)`,
            borderRadius: isSmall ? 6 : 7,
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)',
            transition: 'transform 240ms cubic-bezier(0.34, 1.25, 0.64, 1), width 200ms ease, height 200ms ease',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      {options.map((opt, idx) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            data-active={isActive ? 'true' : 'false'}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            tabIndex={isActive ? 0 : -1}
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: isSmall ? '4px 10px' : '6px 14px',
              borderRadius: isSmall ? 6 : 7,
              fontSize: isSmall ? 12 : 13,
              fontWeight: isActive ? 600 : 500,
              background: 'transparent',
              color: isActive ? '#0f172a' : '#475569',
              border: 'none',
              cursor: 'pointer',
              outline: 'none',
              whiteSpace: 'nowrap',
              transition: 'color 160ms ease',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#0f172a';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#475569';
              }
            }}
          >
            {opt.icon && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: isActive ? '#4338ca' : '#64748b',
                  transition: 'color 160ms ease',
                }}
              >
                {opt.icon}
              </span>
            )}
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  fontVariantNumeric: 'tabular-nums',
                  padding: '1px 6px',
                  borderRadius: 9999,
                  background: isActive ? '#eef2ff' : '#e2e8f0',
                  color: isActive ? '#4338ca' : '#475569',
                  transition: 'background-color 160ms ease, color 160ms ease',
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
