import React, { useState, useRef } from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delayMs?: number;
}

/**
 * Official BoardUI Tooltip Component
 * Displays a lightweight, accessible floating label on hover or focus.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delayMs = 150,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timerRef.current = setTimeout(() => setIsVisible(true), delayMs);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  const positionStyles: Record<string, React.CSSProperties> = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-6px)',
      marginBottom: 4,
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(6px)',
      marginTop: 4,
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(-6px)',
      marginRight: 4,
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(6px)',
      marginLeft: 4,
    },
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {isVisible && content && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            zIndex: 9999,
            whiteSpace: 'nowrap',
            padding: '4px 8px',
            fontSize: 12,
            fontWeight: 500,
            color: '#ffffff',
            background: '#0f172a',
            borderRadius: 6,
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
            pointerEvents: 'none',
            lineHeight: 1.25,
            ...positionStyles[position],
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
