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
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'blue' | 'ai';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  icon,
  className = '',
  size = 'md',
}) => {
  const variantClass = `snow-badge-${variant}`;
  const sizeStyle: React.CSSProperties =
    size === 'sm'
      ? {
          fontSize: '11px',
          padding: '0 6px',
          height: '18px',
          lineHeight: '18px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          verticalAlign: 'middle',
        }
      : {
          fontSize: '11.5px',
          padding: '0 8px',
          height: '20px',
          lineHeight: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          verticalAlign: 'middle',
        };

  return (
    <span className={`snow-badge ${variantClass} ${className}`} style={sizeStyle}>
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: 3 }}>{icon}</span>}
      <span style={{ fontVariantNumeric: 'tabular-nums', display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>{children}</span>
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
    case 'Qualified':
    case 'Shortlisted':
    case 'Completed':
    case 'Open':
    case 'Approved':
    case 'Success':
      return <Badge variant="success" size={size}>{status}</Badge>;
    case 'Interviewing':
    case 'In Progress':
    case 'Scheduled':
    case 'High':
      return <Badge variant="blue" size={size}>{status}</Badge>;
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
      return <Badge variant="default" size={size}>{status}</Badge>;
    default:
      return <Badge variant="default" size={size}>{status}</Badge>;
  }
};
