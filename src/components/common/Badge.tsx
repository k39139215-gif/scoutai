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
  const sizeClass = size === 'sm' ? 'snow-badge-sm' : 'snow-badge-md';

  return (
    <span className={`snow-badge ${variantClass} ${sizeClass} ${className}`}>
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: 4 }}>{icon}</span>}
      <span style={{ fontVariantNumeric: 'tabular-nums', display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>
        {children}
      </span>
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
