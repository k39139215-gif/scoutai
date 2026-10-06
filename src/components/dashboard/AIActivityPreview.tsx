import React from 'react';
import { Sparkles, User, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIActivityPreview: React.FC = () => {
  const { aiActivity, navigate } = useApp();

  const recentEvents = aiActivity.slice(0, 5);

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
            AI & Operations Stream
          </h2>
          <p style={{ fontSize: 12.5, color: '#71717a', marginTop: 2 }}>
            Recent autonomous candidate evaluations, draft dispatches, and recruiter decisions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('ai-activity')}
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
          <span>Full Audit Log</span>
          <ArrowRight size={13} style={{ color: '#71717a' }} />
        </button>
      </div>

      {/* Activity Timeline List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {recentEvents.map((evt) => (
          <div
            key={evt.id}
            onClick={() => navigate('ai-activity')}
            style={{
              padding: '11px 14px',
              borderRadius: 8,
              border: '1px solid #f4f4f5',
              background: '#fafafa',
              display: 'flex',
              alignItems: 'flex-start',
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
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: 0 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: '#ffffff',
                  border: '1px solid #e4e4e7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: evt.isHumanAction ? '#18181b' : '#7c3aed',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {evt.isHumanAction ? <User size={13} /> : <Sparkles size={13} />}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#18181b' }}>
                    {evt.type}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: '#ffffff',
                      border: '1px solid #e4e4e7',
                      color: '#71717a',
                      textTransform: 'uppercase',
                    }}
                  >
                    {evt.actor}
                  </span>
                </div>

                <div style={{ fontSize: 12, color: '#52525b', marginTop: 2, lineHeight: 1.4 }}>
                  {evt.target} • {evt.details}
                </div>
              </div>
            </div>

            <span style={{ fontSize: 11, color: '#a1a1aa', flexShrink: 0, whiteSpace: 'nowrap' }}>
              {evt.timestamp.split(' ')[1] || evt.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
