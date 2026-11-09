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
      description: `${pendingReviewCandidates.length} evaluated profiles ready for review`,
      icon: <Users size={14} style={{ color: 'var(--text-secondary)' }} />,
      onClick: () => navigate('candidates'),
    },
    {
      id: 'outreach',
      title: 'Outreach Drafts Pending Approval',
      count: pendingOutreachDrafts.length,
      description: `${pendingOutreachDrafts.length} candidate messages drafted for review`,
      icon: <Send size={14} style={{ color: 'var(--text-secondary)' }} />,
      onClick: () => navigate('outreach'),
    },
    {
      id: 'interviews',
      title: 'Upcoming Assessment Rounds',
      count: scheduledInterviews.length,
      description: `${scheduledInterviews.length} technical screen sessions booked`,
      icon: <Calendar size={14} style={{ color: 'var(--text-secondary)' }} />,
      onClick: () => navigate('interviews'),
    },
    {
      id: 'tasks',
      title: 'Recruiter Action Items',
      count: pendingTasks.length,
      description: `${pendingTasks.length} operational follow-ups remaining`,
      icon: <CheckSquare size={14} style={{ color: 'var(--text-secondary)' }} />,
      onClick: () => navigate('tasks'),
    },
  ];

  const totalActions = pendingReviewCandidates.length + pendingOutreachDrafts.length + pendingTasks.length;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>
            Action Items
          </h2>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: '2px 7px',
              borderRadius: 4,
              background: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {totalActions} pending
          </span>
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>
          Items requiring recruiter decision or scheduling today.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={item.onClick}
            style={{
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-canvas)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              cursor: 'pointer',
              transition: 'background-color 0.1s ease, border-color 0.1s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = 'var(--border-default)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-canvas)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
            role="button"
            tabIndex={0}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 5,
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>
                  {item.description}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span
                className="tabular-nums"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: item.count > 0 ? '#0f172a' : 'var(--text-muted)',
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  padding: '1px 7px',
                  borderRadius: 4,
                }}
              >
                {item.count}
              </span>
              <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
