import React from 'react';
import { ArrowRight, Video } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';

export const UpcomingInterviews: React.FC = () => {
  const { interviews, navigate } = useApp();

  const scheduledInterviews = interviews
    .filter((i) => i.status === 'Scheduled')
    .slice(0, 4);

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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>
            Scheduled Interviews
          </h2>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>
            Technical evaluations and assessment screens for this week.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('interviews')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            height: 28,
            padding: '0 10px',
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 500,
            background: '#ffffff',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'background-color 0.1s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
        >
          <span>All schedules ({interviews.length})</span>
          <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      {/* Interviews List */}
      {scheduledInterviews.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
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
                  padding: '10px 12px',
                  borderRadius: 6,
                  border: '1px solid',
                  borderColor: isNextUp ? 'var(--border-default)' : 'var(--border-subtle)',
                  background: isNextUp ? '#ffffff' : 'var(--bg-canvas)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  cursor: 'pointer',
                  transition: 'background-color 0.1s ease, border-color 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.background = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isNextUp ? 'var(--border-default)' : 'var(--border-subtle)';
                  e.currentTarget.style.background = isNextUp ? '#ffffff' : 'var(--bg-canvas)';
                }}
                role="button"
                tabIndex={0}
              >
                {/* Left: Video Icon + Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 5,
                      background: isNextUp ? '#eff6ff' : 'var(--bg-subtle)',
                      border: `1px solid ${isNextUp ? '#bfdbfe' : 'var(--border-subtle)'}`,
                      color: isNextUp ? '#1e40af' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Video size={14} />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>
                        {item.candidateName}
                      </span>
                      <StatusBadge status={item.type} size="sm" />
                      {isNextUp && (
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 500,
                            padding: '1px 5px',
                            borderRadius: 3,
                            background: '#f1f5f9',
                            color: '#334155',
                            border: '1px solid #cbd5e1',
                          }}
                        >
                          Next Up
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>
                      {item.jobTitle} • Interviewer: {item.interviewer}
                    </div>
                  </div>
                </div>

                {/* Right: Date & Time in tabular figures */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div className="tabular-nums" style={{ fontSize: 12.5, fontWeight: 500, color: '#0f172a' }}>
                    {item.time}
                  </div>
                  <div className="tabular-nums" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                    {item.date}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
