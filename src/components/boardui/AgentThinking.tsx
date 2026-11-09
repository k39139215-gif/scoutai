import React, { useState, useEffect } from 'react';
import { Sparkles, Clock } from 'lucide-react';

export interface AgentThinkingProps {
  label?: string;
  variant?: 'dots' | 'spin' | 'shimmer' | 'pulse';
  showTimer?: boolean;
  initialSeconds?: number;
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * BoardUI Agent Thinking Indicator (Free / MIT)
 * Displays animated neural processing state with shimmering label and elapsed timer.
 */
export const AgentThinking: React.FC<AgentThinkingProps> = ({
  label = 'AI Agent evaluating criteria...',
  variant = 'dots',
  showTimer = true,
  initialSeconds = 0.8,
  size = 'md',
  className = '',
  style = {},
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!showTimer) return;
    const interval = setInterval(() => {
      setSeconds((prev) => +(prev + 0.1).toFixed(1));
    }, 100);
    return () => clearInterval(interval);
  }, [showTimer]);

  const isSmall = size === 'sm';

  return (
    <div
      className={`boardui-agent-thinking ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? 6 : 8,
        padding: isSmall ? '3px 8px' : '5px 12px',
        borderRadius: 9999,
        background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(245, 243, 255, 0.95))',
        border: '1px solid rgba(199, 210, 254, 0.8)',
        boxShadow: '0 1px 3px rgba(99, 102, 241, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        fontSize: isSmall ? 12 : 13,
        fontWeight: 500,
        color: '#4338ca',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Neural Sparkle Icon with micro rotation */}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: isSmall ? 14 : 16,
          height: isSmall ? 14 : 16,
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.15)',
          color: '#4f46e5',
        }}
      >
        <Sparkles size={isSmall ? 9 : 11} className="boardui-spin-slow" />
      </span>

      {/* Thinking Label */}
      <span
        style={{
          color: '#3730a3',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>

      {/* Animated Wave Dots */}
      {variant === 'dots' && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2.5, marginLeft: 1 }}>
          <span className="boardui-dot-wave" style={{ animationDelay: '0ms' }} />
          <span className="boardui-dot-wave" style={{ animationDelay: '150ms' }} />
          <span className="boardui-dot-wave" style={{ animationDelay: '300ms' }} />
        </span>
      )}

      {/* Tabular Elapsed Timer */}
      {showTimer && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            paddingLeft: 6,
            marginLeft: 2,
            borderLeft: '1px solid rgba(199, 210, 254, 0.8)',
            fontFamily: 'inherit',
            fontVariantNumeric: 'tabular-nums',
            fontSize: 12,
            color: '#6366f1',
            fontWeight: 600,
          }}
        >
          <Clock size={isSmall ? 9 : 10} />
          <span>{seconds.toFixed(1)}s</span>
        </span>
      )}

      <style>{`
        .boardui-dot-wave {
          width: 3.5px;
          height: 3.5px;
          border-radius: 50%;
          background: #4f46e5;
          display: inline-block;
          animation: boarduiWave 1.2s infinite ease-in-out;
        }
        @keyframes boarduiWave {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-3px);
            opacity: 1;
          }
        }
        .boardui-spin-slow {
          animation: boarduiSpin 8s linear infinite;
        }
        @keyframes boarduiSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
