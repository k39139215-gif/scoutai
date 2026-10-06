import React from 'react';
import { User, ArrowRight, Video } from 'lucide-react';
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
        border: '1px solid #e4e4e7',
        borderRadius: 10,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#18181b', letterSpacing: '-0.01em' }}>
            Upcoming Interviews
          </h2>
          <p style={{ fontSize: 12.5, color: '#71717a', marginTop: 2 }}>
            Confirmed assessment and technical evaluation sessions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('interviews')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 32,
            padding: '0 12px',
            borderRadius: 6,
            fontSize: 12.5,
            fontWeight: 500,
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            color: '#18181b',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f4f4f5';
            e.currentTarget.style.borderColor = '#d4d4d8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = '#e4e4e7';
          }}
        >
          <span>Calendar ({interviews.length})</span>
          <ArrowRight size={13} style={{ color: '#71717a' }} />
        </button>
      </div>

      {/* Interviews List */}
      {scheduledInterviews.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: '#a1a1aa', fontSize: 13 }}>
          No upcoming interviews currently scheduled.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {scheduledInterviews.map((item, idx) => {
            const isNextUp = idx === 0;

            return (
              <div
                key={item.id}
                onClick={() => navigate('candidate-detail', { candidateId: item.candidateId })}
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: '1px solid',
                  borderColor: isNextUp ? '#d4d4d8' : '#f4f4f5',
                  background: isNextUp ? '#fbfbfa' : '#fafafa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d4d4d8';
                  e.currentTarget.style.background = '#f4f4f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isNextUp ? '#d4d4d8' : '#f4f4f5';
                  e.currentTarget.style.background = isNextUp ? '#fbfbfa' : '#fafafa';
                }}
                role="button"
                tabIndex={0}
              >
                {/* Left: Time Anchor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      background: '#ffffff',
                      border: '1px solid #e4e4e7',
                      textAlign: 'center',
                      minWidth: 76,
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#18181b' }}>
                      {item.time.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: 10, color: '#71717a', textTransform: 'uppercase' }}>
                      {item.date.slice(5)}
                    </div>
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: '#18181b' }}>
                        {item.candidateName}
                      </span>
                      {isNextUp && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: 4,
                            background: '#18181b',
                            color: '#ffffff',
                          }}
                        >
                          Next Up
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: 12, color: '#71717a', marginTop: 1 }}>
                      {item.jobTitle} • {item.type}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#a1a1aa', marginTop: 2 }}>
                      <User size={12} />
                      <span>{item.interviewer}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Round status & Video link indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <Video size={14} style={{ color: '#2563eb' }} />
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
