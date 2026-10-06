import React from 'react';
import { User, ArrowRight, Video } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/Badge';

export const UpcomingInterviews: React.FC = () => {
  const { interviews, navigate } = useApp();

  const scheduledInterviews = interviews
    .filter((i) => i.status === 'Scheduled')
    .slice(0, 4);

  return (
    <div className="snow-card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
            Upcoming Interviews
          </h2>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
            Confirmed assessment and technical evaluation sessions.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          iconRight={<ArrowRight size={13} />}
          onClick={() => navigate('interviews')}
        >
          Calendar ({interviews.length})
        </Button>
      </div>

      {/* Interviews List */}
      {scheduledInterviews.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>
          No upcoming interviews currently scheduled.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {scheduledInterviews.map((item, idx) => {
            const isNextUp = idx === 0;

            return (
              <div
                key={item.id}
                onClick={() => navigate('candidate-detail', { candidateId: item.candidateId })}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: isNextUp ? 'var(--border-strong)' : 'var(--border-default)',
                  background: isNextUp ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.background = 'var(--bg-subtle)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isNextUp ? 'var(--border-strong)' : 'var(--border-default)';
                  e.currentTarget.style.background = isNextUp ? 'var(--bg-subtle)' : 'var(--bg-surface)';
                }}
                role="button"
                tabIndex={0}
              >
                {/* Left: Time Anchor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div
                    style={{
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-page)',
                      border: '1px solid var(--border-default)',
                      textAlign: 'center',
                      minWidth: 74,
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.time.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {item.date.slice(5)}
                    </div>
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.candidateName}
                      </span>
                      {isNextUp && (
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            padding: '1px 5px',
                            borderRadius: 'var(--radius-xs)',
                            background: 'var(--color-primary)',
                            color: '#ffffff',
                          }}
                        >
                          Next Up
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: 1 }}>
                      {item.jobTitle} • {item.type}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '10.5px', color: 'var(--text-muted)', marginTop: 2 }}>
                      <User size={11} />
                      <span>{item.interviewer}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Round status & Video link indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <Video size={13} style={{ color: 'var(--color-accent-blue)' }} />
                  <StatusBadge status={item.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
