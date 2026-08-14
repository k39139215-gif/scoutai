import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AIActivityView: React.FC = () => {
  const { aiActivity } = useApp();

  const [actorFilter, setActorFilter] = useState<'All' | 'AI' | 'Human'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = aiActivity.filter((evt) => {
    const matchesActor =
      actorFilter === 'All' ||
      (actorFilter === 'AI' && !evt.isHumanAction) ||
      (actorFilter === 'Human' && evt.isHumanAction);

    const matchesSearch =
      evt.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.actor.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesActor && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            AI & Operations Activity
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Audit log of autonomous candidate matching, draft generation, and recruiter decisions.
          </p>
        </div>

        <div
          style={{
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            padding: '4px 10px',
            background: 'var(--color-bg-canvas)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
          }}
        >
          {aiActivity.length} Total Events
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="snow-card"
        style={{
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => setActorFilter('All')}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: actorFilter === 'All' ? 600 : 500,
              border: '1px solid',
              borderColor: actorFilter === 'All' ? 'var(--color-primary)' : 'var(--color-border)',
              background: actorFilter === 'All' ? 'var(--color-primary)' : 'var(--color-bg-surface)',
              color: actorFilter === 'All' ? '#ffffff' : 'var(--color-text-secondary)',
              cursor: 'pointer',
            }}
          >
            All ({aiActivity.length})
          </button>

          <button
            onClick={() => setActorFilter('AI')}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: actorFilter === 'AI' ? 600 : 500,
              border: '1px solid',
              borderColor: actorFilter === 'AI' ? 'var(--color-primary)' : 'var(--color-border)',
              background: actorFilter === 'AI' ? 'var(--color-primary)' : 'var(--color-bg-surface)',
              color: actorFilter === 'AI' ? '#ffffff' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Sparkles size={11} />
            <span>AI Operations</span>
          </button>

          <button
            onClick={() => setActorFilter('Human')}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: actorFilter === 'Human' ? 600 : 500,
              border: '1px solid',
              borderColor: actorFilter === 'Human' ? 'var(--color-primary)' : 'var(--color-border)',
              background: actorFilter === 'Human' ? 'var(--color-primary)' : 'var(--color-bg-surface)',
              color: actorFilter === 'Human' ? '#ffffff' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <User size={11} />
            <span>Human Decisions</span>
          </button>
        </div>

        <div style={{ position: 'relative', width: 200 }}>
          <Search
            size={13}
            style={{
              position: 'absolute',
              left: 9,
              top: 9,
              color: 'var(--color-text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: 28, height: 30, fontSize: 'var(--font-size-xs)' }}
          />
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="snow-card" style={{ padding: '20px 24px' }}>
        {filteredEvents.length === 0 ? (
          <div style={{ padding: 36, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
            No activity records found matching query.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  paddingBottom: 14,
                  borderBottom: '1px solid var(--color-divider)',
                }}
              >
                {/* Avatar / Icon */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-bg-subtle)',
                    color: 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {evt.isHumanAction ? <User size={13} /> : <Sparkles size={13} />}
                </div>

                {/* Event Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {evt.type}
                      </span>
                      <span
                        className="snow-badge snow-badge-default"
                        style={{ fontSize: '10px', height: '18px', padding: '0 5px' }}
                      >
                        {evt.actor}
                      </span>
                    </div>

                    <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>
                      {evt.timestamp}
                    </span>
                  </div>

                  <div style={{ fontSize: '11.5px', fontWeight: 500, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    Target: {evt.target}
                  </div>

                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: 3, lineHeight: 1.45 }}>
                    {evt.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
