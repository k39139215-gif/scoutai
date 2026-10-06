import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Search,
  X,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          paddingBottom: 4,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: '#18181b',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            AI & Operations Activity
          </h1>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Audit log of autonomous candidate matching, draft generation, and recruiter decisions.
          </p>
        </div>

        <div
          style={{
            fontSize: 12.5,
            fontWeight: 500,
            color: '#71717a',
            padding: '6px 12px',
            background: '#ffffff',
            borderRadius: 8,
            border: '1px solid #e4e4e7',
          }}
        >
          <strong style={{ color: '#18181b' }}>{aiActivity.length}</strong> Total Operations
        </div>
      </div>

      {/* 2. Filter and Search Bar */}
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 3, background: '#f4f4f5', padding: 3, borderRadius: 7 }}>
          <button
            onClick={() => setActorFilter('All')}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: actorFilter === 'All' ? 600 : 500,
              border: 'none',
              background: actorFilter === 'All' ? '#ffffff' : 'transparent',
              color: actorFilter === 'All' ? '#18181b' : '#71717a',
              cursor: 'pointer',
              boxShadow: actorFilter === 'All' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.12s ease',
            }}
          >
            All Events ({aiActivity.length})
          </button>

          <button
            onClick={() => setActorFilter('AI')}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: actorFilter === 'AI' ? 600 : 500,
              border: 'none',
              background: actorFilter === 'AI' ? '#ffffff' : 'transparent',
              color: actorFilter === 'AI' ? '#6d28d9' : '#71717a',
              cursor: 'pointer',
              boxShadow: actorFilter === 'AI' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.12s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Sparkles size={13} style={{ color: '#7c3aed' }} />
            <span>AI Automated</span>
          </button>

          <button
            onClick={() => setActorFilter('Human')}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: actorFilter === 'Human' ? 600 : 500,
              border: 'none',
              background: actorFilter === 'Human' ? '#ffffff' : 'transparent',
              color: actorFilter === 'Human' ? '#18181b' : '#71717a',
              cursor: 'pointer',
              boxShadow: actorFilter === 'Human' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.12s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <User size={13} />
            <span>Human Actions</span>
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 11,
              color: '#71717a',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search activity by type, target, detail…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              height: 36,
              width: 280,
              padding: '0 32px 0 32px',
              fontSize: 13,
              borderRadius: 8,
              border: '1px solid #e4e4e7',
              background: '#ffffff',
              color: '#18181b',
              outline: 'none',
            }}
            onFocusCapture={(e) => (e.currentTarget.style.borderColor = '#18181b')}
            onBlurCapture={(e) => (e.currentTarget.style.borderColor = '#e4e4e7')}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 8,
                background: 'transparent',
                border: 'none',
                color: '#71717a',
                cursor: 'pointer',
                padding: 2,
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Activity Timeline List */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: 8,
          padding: '16px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        {filteredEvents.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#71717a', fontSize: 13 }}>
            No activity records found matching query.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredEvents.map((evt, idx) => (
              <div
                key={evt.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '16px 8px',
                  borderBottom: idx < filteredEvents.length - 1 ? '1px solid #f4f4f5' : 'none',
                }}
              >
                {/* Avatar / Icon */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: evt.isHumanAction ? '#f4f4f5' : '#f5f3ff',
                    color: evt.isHumanAction ? '#18181b' : '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: evt.isHumanAction ? '1px solid #e4e4e7' : '1px solid #ddd6fe',
                  }}
                >
                  {evt.isHumanAction ? <User size={15} /> : <Sparkles size={15} />}
                </div>

                {/* Event Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: '#18181b' }}>
                        {evt.type}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          padding: '2px 7px',
                          borderRadius: 4,
                          background: evt.isHumanAction ? '#f4f4f5' : '#ede9fe',
                          color: evt.isHumanAction ? '#52525b' : '#6d28d9',
                        }}
                      >
                        {evt.actor}
                      </span>
                    </div>

                    <span style={{ fontSize: 12, color: '#a1a1aa' }}>
                      {evt.timestamp}
                    </span>
                  </div>

                  <div style={{ fontSize: 12.5, fontWeight: 500, color: '#2563eb', marginTop: 3 }}>
                    Target: {evt.target}
                  </div>

                  <p style={{ fontSize: 13, color: '#52525b', marginTop: 4, lineHeight: 1.5, margin: 0 }}>
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

