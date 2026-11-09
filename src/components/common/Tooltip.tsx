import React, { useState, useRef } from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: number | string;
  delay?: number;
}

/**
 * ScoutAI Accessible Tooltip Component
 * Displays full text on hover / focus for truncated strings.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  maxWidth = 260,
  delay = 150,
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  if (!content) return children;

  const showTooltip = () => {
    timeoutRef.current = window.setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  };

  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case 'bottom':
        return {
          top: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          right: 'calc(100% + 6px)',
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          left: 'calc(100% + 6px)',
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case 'top':
      default:
        return {
          bottom: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
        };
    }
  };

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', maxWidth: '100%' }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            ...getPositionStyles(),
            zIndex: 9999,
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            fontSize: 12,
            lineHeight: 1.35,
            fontWeight: 400,
            padding: '4px 8px',
            borderRadius: 4,
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.18)',
            pointerEvents: 'none',
            whiteSpace: 'normal',
            maxWidth,
            width: 'max-content',
            wordBreak: 'break-word',
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
};
