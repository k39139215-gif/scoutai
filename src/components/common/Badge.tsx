import React from 'react';
import type {
  JobStatus,
  CandidateStatus,
  OutreachStatus,
  InterviewStatus,
  TaskStatus,
  JobPriority,
} from '../../types';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'ai' | 'neutral';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  icon,
  className = '',
  size = 'md',
  style = {},
}) => {
  const isSmall = size === 'sm';

  // Phase 6 Unified Status Palette: Tinted background, borderless, 24px height, 12px font
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: 'var(--status-info-bg, #eff6ff)',
      color: 'var(--status-info-text, #1e40af)',
      border: 'none',
    },
    success: {
      background: 'var(--status-success-bg, #dcfce7)',
      color: 'var(--status-success-text, #166534)',
      border: 'none',
    },
    info: {
      background: 'var(--status-info-bg, #eff6ff)',
      color: 'var(--status-info-text, #1e40af)',
      border: 'none',
    },
    warning: {
      background: 'var(--status-warning-bg, #fef9c3)',
      color: 'var(--status-warning-text, #854d0e)',
      border: 'none',
    },
    danger: {
      background: 'var(--status-danger-bg, #fee2e2)',
      color: 'var(--status-danger-text, #991b1b)',
      border: 'none',
    },
    neutral: {
      background: 'var(--bg-subtle, #f1f5f9)',
      color: 'var(--text-secondary, #475569)',
      border: 'none',
    },
    ai: {
      background: 'var(--accent-subtle, #eef2ff)',
      color: 'var(--accent, #4338ca)',
      border: 'none',
    },
  };

  const currentStyle = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`status-pill ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        height: isSmall ? 22 : 24,
        padding: isSmall ? '0 8px' : '0 10px',
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 500,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1,
        userSelect: 'none',
        ...currentStyle,
        ...style,
      }}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export const StatusBadge: React.FC<{
  status:
    | JobStatus
    | CandidateStatus
    | OutreachStatus
    | InterviewStatus
    | TaskStatus
    | JobPriority
    | string;
  size?: 'sm' | 'md';
}> = ({ status, size = 'md' }) => {
  switch (status) {
    // Open / Active / Completed / Approved = Success
    case 'Open':
    case 'Active':
    case 'Completed':
    case 'Approved':
    case 'Shortlisted':
    case 'Success':
      return <Badge variant="success" size={size}>{status}</Badge>;

    // Pending / Scheduled / Draft / Qualified = Info / Neutral
    case 'Pending':
    case 'Pending Review':
    case 'Scheduled':
    case 'Draft':
    case 'Qualified':
    case 'Sent — Demo':
    case 'Sent':
      return <Badge variant="info" size={size}>{status}</Badge>;

    // Paused / Review / In Progress = Warning
    case 'Paused':
    case 'Review':
    case 'In Progress':
    case 'Interviewing':
    case 'Warning':
      return <Badge variant="warning" size={size}>{status}</Badge>;

    // Cancelled / Failed / Closed / Blocked = Danger
    case 'Cancelled':
    case 'Closed':
    case 'Archived':
    case 'Blocked':
    case 'Error':
      return <Badge variant="danger" size={size}>{status}</Badge>;

    // Priority Tags
    case 'High':
      return (
        <span
          className="priority-pill priority-high"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: size === 'sm' ? 20 : 22,
            padding: '0 8px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 600,
            background: '#fee2e2',
            color: '#991b1b',
            border: 'none',
          }}
        >
          High Priority
        </span>
      );

    case 'Medium':
      return (
        <span
          className="priority-pill priority-medium"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: size === 'sm' ? 20 : 22,
            padding: '0 8px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 600,
            background: '#f1f5f9',
            color: '#334155',
            border: 'none',
          }}
        >
          Medium
        </span>
      );

    case 'Low':
      return (
        <span
          className="priority-pill priority-low"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: size === 'sm' ? 20 : 22,
            padding: '0 8px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 500,
            background: '#f8fafc',
            color: '#64748b',
            border: 'none',
          }}
        >
          Low
        </span>
      );

    default:
      return <Badge variant="neutral" size={size}>{status}</Badge>;
  }
};
