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
      icon: <Users size={14} style={{ color: 'var(--color-accent-blue)' }} />,
      onClick: () => navigate('candidates'),
    },
    {
      id: 'outreach',
      title: 'Outreach Drafts Pending Approval',
      count: pendingOutreachDrafts.length,
      description: `${pendingOutreachDrafts.length} personalized messages drafted by AI`,
      icon: <Send size={14} style={{ color: 'var(--color-warning)' }} />,
      onClick: () => navigate('outreach'),
    },
    {
      id: 'interviews',
      title: 'Upcoming Assessment Rounds',
      count: scheduledInterviews.length,
      description: `${scheduledInterviews.length} technical screen sessions booked`,
      icon: <Calendar size={14} style={{ color: 'var(--color-success)' }} />,
      onClick: () => navigate('interviews'),
    },
    {
      id: 'tasks',
      title: 'Recruiter Action Items',
      count: pendingTasks.length,
      description: `${pendingTasks.length} operational follow-ups remaining`,
      icon: <CheckSquare size={14} style={{ color: 'var(--text-primary)' }} />,
      onClick: () => navigate('tasks'),
    },
  ];

  return (
    <div className="snow-card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
            Attention Required
          </h2>
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-warning-subtle)',
              color: 'var(--color-warning-text)',
              border: '1px solid var(--color-warning-border)',
            }}
          >
            {pendingReviewCandidates.length + pendingOutreachDrafts.length + pendingTasks.length} Action Items
          </span>
        </div>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
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
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.background = 'var(--bg-subtle)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.background = 'var(--bg-surface)';
            }}
            role="button"
            tabIndex={0}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {item.icon}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.description}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: item.count > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {item.count}
              </span>
              <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
