import React from 'react';
import { Activity, User, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDateTime } from '../../utils/formatters';

export const AIActivityPreview: React.FC = () => {
  const { aiActivity, navigate } = useApp();

  const recentEvents = aiActivity.slice(0, 5);

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
            Operations Audit Trail
          </h2>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>
            Recent candidate evaluations, outreach dispatches, and recruiter determinations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('ai-activity')}
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
          <span>Full audit log</span>
          <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      {/* Activity Timeline List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {recentEvents.map((evt) => (
          <div
            key={evt.id}
            onClick={() => navigate('ai-activity')}
            style={{
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-canvas)',
              display: 'flex',
              alignItems: 'flex-start',
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
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.background = 'var(--bg-canvas)';
            }}
            role="button"
            tabIndex={0}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: 0 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 5,
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {evt.isHumanAction ? <User size={13} /> : <Activity size={13} />}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>
                    {evt.type}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      padding: '1px 5px',
                      borderRadius: 3,
                      background: '#ffffff',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {evt.actor}
                  </span>
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 500, color: '#0f172a' }}>{evt.target}</span> • {evt.details}
                </div>
              </div>
            </div>

            <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b', fontVariantNumeric: 'tabular-nums', flexShrink: 0, whiteSpace: 'nowrap' }}>
              {formatDateTime(evt.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
