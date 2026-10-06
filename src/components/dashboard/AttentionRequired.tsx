import React from 'react';
import { Users, Send, Calendar, CheckSquare, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AttentionRequired: React.FC = () => {
  const { candidates, outreachMessages, interviews, tasks, navigate } = useApp();

  const pendingReviewCandidates = candidates.filter((c) => c.status === 'Review' || c.status === 'Qualified');
  const pendingOutreachDrafts = outreachMessages.filter((m) => m.status === 'Draft');
  const scheduledInterviews = interviews.filter((i) => i.status === 'Scheduled');
  const pendingTasks = tasks.filter((t) => t.status === 'Pending');

  const items = [
    {
      id: 'candidates',
      title: 'Candidates Awaiting Review',
      count: pendingReviewCandidates.length,
      description: `${pendingReviewCandidates.length} high-match profiles ready for evaluation`,
      icon: <Users size={14} style={{ color: '#2563eb' }} />,
      onClick: () => navigate('candidates'),
    },
    {
      id: 'outreach',
      title: 'Outreach Drafts Pending Approval',
      count: pendingOutreachDrafts.length,
      description: `${pendingOutreachDrafts.length} personalized messages drafted by AI`,
      icon: <Send size={14} style={{ color: '#d97706' }} />,
      onClick: () => navigate('outreach'),
    },
    {
      id: 'interviews',
      title: 'Upcoming Assessment Rounds',
      count: scheduledInterviews.length,
      description: `${scheduledInterviews.length} technical screen sessions booked`,
      icon: <Calendar size={14} style={{ color: '#16a34a' }} />,
      onClick: () => navigate('interviews'),
    },
    {
      id: 'tasks',
      title: 'Recruiter Action Items',
      count: pendingTasks.length,
      description: `${pendingTasks.length} operational follow-ups remaining`,
      icon: <CheckSquare size={14} style={{ color: '#18181b' }} />,
      onClick: () => navigate('tasks'),
    },
  ];

  const totalActions = pendingReviewCandidates.length + pendingOutreachDrafts.length + pendingTasks.length;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e4e4e7',
        borderRadius: 10,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#18181b', letterSpacing: '-0.01em' }}>
            Attention Required
          </h2>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 5,
              background: '#fef3c7',
              color: '#92400e',
              border: '1px solid #fde68a',
            }}
          >
            {totalActions} Action Items
          </span>
        </div>
        <p style={{ fontSize: 12.5, color: '#71717a', marginTop: 2 }}>
          Items requiring recruiter decision or scheduling today.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={item.onClick}
            style={{
              padding: '11px 14px',
              borderRadius: 8,
              border: '1px solid #f4f4f5',
              background: '#fafafa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#e4e4e7';
              e.currentTarget.style.background = '#f4f4f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#f4f4f5';
              e.currentTarget.style.background = '#fafafa';
            }}
            role="button"
            tabIndex={0}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid #e4e4e7',
                }}
              >
                {item.icon}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#18181b' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 12, color: '#71717a', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.description}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: item.count > 0 ? '#18181b' : '#a1a1aa',
                }}
              >
                {item.count}
              </span>
              <ArrowRight size={13} style={{ color: '#a1a1aa' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
