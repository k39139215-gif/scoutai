import React from 'react';
import { Sparkles, User, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const AIActivityPreview: React.FC = () => {
  const { aiActivity, navigate } = useApp();

  const recentEvents = aiActivity.slice(0, 5);

  return (
    <div className="snow-card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
            AI & Operations Stream
          </h2>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
            Recent autonomous candidate evaluations, draft dispatches, and recruiter decisions.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          iconRight={<ArrowRight size={13} />}
          onClick={() => navigate('ai-activity')}
        >
          Full Audit Log
        </Button>
      </div>

      {/* Activity Timeline List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {recentEvents.map((evt) => (
          <div
            key={evt.id}
            onClick={() => navigate('ai-activity')}
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.background = 'var(--bg-subtle)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.background = 'var(--bg-surface)';
            }}
            role="button"
            tabIndex={0}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: 0 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--border-default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: evt.isHumanAction ? 'var(--text-primary)' : 'var(--color-ai-neutral)',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {evt.isHumanAction ? <User size={12} /> : <Sparkles size={12} />}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {evt.type}
                  </span>
                  <span
                    style={{
                      fontSize: '9.5px',
                      padding: '1px 5px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'var(--bg-page)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {evt.actor}
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.35 }}>
                  {evt.target} • {evt.details}
                </div>
              </div>
            </div>

            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', flexShrink: 0 }}>
              {evt.timestamp.split(' ')[1] || evt.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
