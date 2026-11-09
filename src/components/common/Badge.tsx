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
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'blue' | 'purple' | 'ai';
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

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: '#f1f5f9',
      border: '1px solid #e2e8f0',
      color: '#475569',
    },
    success: {
      background: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#15803d',
    },
    blue: {
      background: '#eff6ff',
      border: '1px solid #bfdbfe',
      color: '#1d4ed8',
    },
    purple: {
      background: '#faf5ff',
      border: '1px solid #e9d5ff',
      color: '#7e22ce',
    },
    warning: {
      background: '#fefce8',
      border: '1px solid #fef08a',
      color: '#854d0e',
    },
    danger: {
      background: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#991b1b',
    },
    ai: {
      background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
      border: '1px solid #c7d2fe',
      color: '#4338ca',
    },
  };

  const currentStyle = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`boardui-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: isSmall ? '1px 6px' : '2px 8px',
        borderRadius: 5,
        fontSize: isSmall ? 11 : 12,
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1.3,
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
    case 'Shortlisted':
    case 'Completed':
    case 'Approved':
    case 'Success':
      return <Badge variant="success" size={size}>{status}</Badge>;

    case 'Qualified':
      return <Badge variant="blue" size={size}>{status}</Badge>;

    case 'Open':
      return <Badge variant="success" size={size}>Open</Badge>;

    case 'Interviewing':
    case 'In Progress':
    case 'Scheduled':
      return <Badge variant="purple" size={size}>{status}</Badge>;

    case 'High':
      return <Badge variant="danger" size={size}>High Priority</Badge>;

    case 'Review':
    case 'Pending':
    case 'Pending Review':
    case 'Medium':
    case 'Draft':
    case 'Paused':
    case 'Warning':
      return <Badge variant="warning" size={size}>{status}</Badge>;

    case 'Closed':
    case 'Cancelled':
    case 'Archived':
    case 'Low':
      return <Badge variant="default" size={size}>{status}</Badge>;

    case 'Error':
    case 'Blocked':
      return <Badge variant="danger" size={size}>{status}</Badge>;

    case 'Sent — Demo':
      return <Badge variant="blue" size={size}>{status}</Badge>;

    default:
      return <Badge variant="default" size={size}>{status}</Badge>;
  }
};
