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
  const sizeStyle =
    size === 'sm'
      ? { fontSize: '10.5px', padding: '1px 6px', height: '18px' }
      : { fontSize: 'var(--font-size-xs)', padding: '2px 8px', height: '22px' };

  return (
    <span className={`snow-badge ${variantClass} ${className}`} style={sizeStyle}>
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
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
}> = ({ status }) => {
  switch (status) {
    case 'Qualified':
    case 'Shortlisted':
    case 'Completed':
    case 'Open':
    case 'Approved':
    case 'Success':
      return <Badge variant="success">{status}</Badge>;
    case 'Interviewing':
    case 'In Progress':
    case 'Scheduled':
    case 'High':
      return <Badge variant="blue">{status}</Badge>;
    case 'Review':
    case 'Pending':
    case 'Pending Review':
    case 'Medium':
    case 'Draft':
    case 'Paused':
    case 'Warning':
      return <Badge variant="warning">{status}</Badge>;
    case 'Closed':
    case 'Cancelled':
    case 'Archived':
    case 'Low':
      return <Badge variant="default">{status}</Badge>;
    case 'Error':
    case 'Blocked':
      return <Badge variant="danger">{status}</Badge>;
    case 'Sent — Demo':
      return <Badge variant="ai">{status}</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};
