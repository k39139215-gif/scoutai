import React, { useState } from 'react';
import {
  Activity,
  User,
  Search,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AIActivityView: React.FC = () => {
  const { aiActivity } = useApp();

  const [actorFilter, setActorFilter] = useState<'All' | 'System' | 'Recruiter'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = aiActivity.filter((evt) => {
    const matchesActor =
      actorFilter === 'All' ||
      (actorFilter === 'System' && !evt.isHumanAction) ||
      (actorFilter === 'Recruiter' && evt.isHumanAction);

    const matchesSearch =
      evt.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.actor.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesActor && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          paddingBottom: 2,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
            }}
          >
            Operations Audit Trail
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Verifiable record of candidate evaluations, outreach dispatches, and recruiter determinations.
          </p>
        </div>

        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--text-secondary)',
            padding: '5px 10px',
            background: '#ffffff',
            borderRadius: 6,
            border: '1px solid var(--border-subtle)',
          }}
        >
          <span className="tabular-nums" style={{ fontWeight: 600, color: '#0f172a' }}>{aiActivity.length}</span> total operations recorded
        </div>
      </div>

      {/* 2. Filter and Search Bar */}
      <div
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          background: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 2, background: 'var(--bg-subtle)', padding: 2, borderRadius: 6 }}>
          <button
            onClick={() => setActorFilter('All')}
            style={{
              padding: '4px 10px',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: actorFilter === 'All' ? 500 : 400,
              border: 'none',
              background: actorFilter === 'All' ? '#ffffff' : 'transparent',
              color: actorFilter === 'All' ? '#0f172a' : 'var(--text-secondary)',
              cursor: 'pointer',
              boxShadow: actorFilter === 'All' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.1s ease',
            }}
          >
            All events ({aiActivity.length})
          </button>

          <button
            onClick={() => setActorFilter('System')}
            style={{
              padding: '4px 10px',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: actorFilter === 'System' ? 500 : 400,
              border: 'none',
              background: actorFilter === 'System' ? '#ffffff' : 'transparent',
              color: actorFilter === 'System' ? '#0f172a' : 'var(--text-secondary)',
              cursor: 'pointer',
              boxShadow: actorFilter === 'System' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.1s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Activity size={12} style={{ color: 'var(--text-muted)' }} />
            <span>System</span>
          </button>

          <button
            onClick={() => setActorFilter('Recruiter')}
            style={{
              padding: '4px 10px',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: actorFilter === 'Recruiter' ? 500 : 400,
              border: 'none',
              background: actorFilter === 'Recruiter' ? '#ffffff' : 'transparent',
              color: actorFilter === 'Recruiter' ? '#0f172a' : 'var(--text-secondary)',
              cursor: 'pointer',
              boxShadow: actorFilter === 'Recruiter' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.1s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <User size={12} style={{ color: 'var(--text-muted)' }} />
            <span>Recruiter</span>
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: 260 }}>
          <Search
            size={13}
            style={{ position: 'absolute', left: 9, top: 9, color: 'var(--text-muted)', pointerEvents: 'none' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter audit entries..."
            style={{
              width: '100%',
              height: 30,
              paddingLeft: 28,
              paddingRight: 26,
              fontSize: 12,
              borderRadius: 5,
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-canvas)',
              color: '#0f172a',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 7,
                top: 7,
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Event List */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {filteredEvents.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            No operations recorded matching current filters.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredEvents.map((evt, idx) => (
              <div
                key={evt.id}
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  borderBottom: idx === filteredEvents.length - 1 ? 'none' : '1px solid #f3f4f6',
                  transition: 'background 0.1s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
              >
                {/* Avatar / Icon */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 5,
                    background: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid var(--border-subtle)',
                    marginTop: 1,
                  }}
                >
                  {evt.isHumanAction ? <User size={13} /> : <Activity size={13} />}
                </div>

                {/* Event Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>
                        {evt.type}
                      </span>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 500,
                          padding: '1px 5px',
                          borderRadius: 3,
                          background: 'var(--bg-subtle)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {evt.actor}
                      </span>
                    </div>

                    <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
                      {evt.timestamp}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Target: <span style={{ fontWeight: 500, color: '#0f172a' }}>{evt.target}</span>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.45 }}>
                    {evt.details}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
