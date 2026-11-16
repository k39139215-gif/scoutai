/**
 * ScoutAI Design Tokens: Motion & Transitions
 * Subtle micro-interaction curves based on Apple & Untitled UI motion standards.
 */

export const motion = {
  duration: {
    instant: '50ms',
    fast: '120ms',
    normal: '180ms',
    slow: '280ms',
    toastEnter: '220ms',
  },

  easing: {
    linear: 'linear',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Apple-style natural deceleration
    decelerate: 'cubic-bezier(0.16, 1, 0.3, 1)',
    // Spring popover / toast entry
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  transitions: {
    default: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
    color: 'color 0.12s ease, background-color 0.12s ease, border-color 0.12s ease',
    transform: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
    shadow: 'box-shadow 0.15s ease',
  },
} as const;
