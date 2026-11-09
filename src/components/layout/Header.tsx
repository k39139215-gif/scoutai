import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  X,
  Briefcase,
  Users,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { AppView } from '../../types';
import { isDevMode } from '../../utils/devMode';
import { Notifications } from '../boardui';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { currentView, candidates, jobs, navigate, settings } = useApp();

  const [searchOpen, setSearchOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notifContainerRef = useRef<HTMLDivElement>(null);

  // Close search popover on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Global keydown for search shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter search results
  const filteredCandidates = localQuery.trim()
    ? candidates.filter(
        (c) =>
          c.name.toLowerCase().includes(localQuery.toLowerCase()) ||
          c.title.toLowerCase().includes(localQuery.toLowerCase()) ||
          c.skills.some((s) => s.toLowerCase().includes(localQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const filteredJobs = localQuery.trim()
    ? jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(localQuery.toLowerCase()) ||
          j.client.toLowerCase().includes(localQuery.toLowerCase()) ||
          j.location.toLowerCase().includes(localQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const initials = settings.profile.name
    ? settings.profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'RC';

  const viewLabels: Record<AppView, string> = {
    dashboard: 'Dashboard',
    jobs: 'Requisitions',
    'create-job': 'New Requisition',
    'job-workspace': 'Requisition Workspace',
    candidates: 'Candidates',
    'talent-studio': 'Talent Operations Studio',
    'candidate-detail': 'Candidate Dossier',
    sourcing: 'Candidate Matching',
    outreach: 'Outreach',
    interviews: 'Interviews',
    tasks: 'Tasks',
    'ai-activity': 'Audit Trail',
    analytics: 'Pipeline Analytics',
    clients: 'Client Accounts',
    privacy: 'Data Compliance',
    security: 'Security & Access',
    settings: 'Settings',
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '0 24px',
        borderBottom: '1px solid var(--border-subtle)',
        background: '#ffffff',
        height: 'var(--header-height)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      {/* Left: Mobile Toggle + Breadcrumb Location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <button
          onClick={onOpenMobileMenu}
          style={{
            display: 'none',
            padding: 6,
            color: 'var(--text-primary)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
          className="mobile-menu-btn"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Talent Ops</span>
          <ChevronRight size={13} style={{ color: 'var(--border-strong)' }} />
          <span style={{ fontWeight: 600, color: '#0f172a' }}>
            {viewLabels[currentView] || 'Overview'}
          </span>
        </div>

        {isDevMode() ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#f1f5f9',
              padding: '2px',
              borderRadius: 6,
              marginLeft: 8,
              border: '1px solid #e2e8f0',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 500,
            }}
          >
            <button
              onClick={() => navigate(currentView === 'talent-studio' ? 'candidates' : currentView)}
              style={{
                padding: '3px 9px',
                borderRadius: 4,
                border: 'none',
                background: currentView !== 'talent-studio' ? '#ffffff' : 'transparent',
                color: currentView !== 'talent-studio' ? '#0f172a' : '#64748b',
                boxShadow: currentView !== 'talent-studio' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                fontWeight: currentView !== 'talent-studio' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.1s ease',
              }}
            >
              {currentView === 'talent-studio' ? 'Live Ops View' : 'Live Mode'}
            </button>
            <button
              onClick={() => navigate('talent-studio')}
              style={{
                padding: '3px 9px',
                borderRadius: 4,
                border: 'none',
                background: currentView === 'talent-studio' ? '#ffffff' : 'transparent',
                color: currentView === 'talent-studio' ? '#0f172a' : '#64748b',
                boxShadow: currentView === 'talent-studio' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                fontWeight: currentView === 'talent-studio' ? 600 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.1s ease',
              }}
            >
              <span>✨ Studio Desk</span>
              <span style={{ fontSize: 12, background: currentView === 'talent-studio' ? '#4338ca' : '#e0e7ff', color: currentView === 'talent-studio' ? '#ffffff' : '#4338ca', padding: '1px 4px', borderRadius: 3, fontWeight: 700 }}>REF</span>
            </button>
          </div>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '2px 8px',
              borderRadius: 12,
              background: '#f1f5f9',
              color: '#475569',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 500,
              marginLeft: 8,
              border: '1px solid #e2e8f0',
            }}
            title="Simulated recruitment workspace — no live external communications"
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8' }} />
            Demo data
          </span>
        )}
      </div>

      {/* Center: Clean Quick Search with Command Palette Keycap */}
      <div
        ref={searchContainerRef}
        style={{
          position: 'relative',
          maxWidth: 420,
          width: '100%',
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 10,
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            ref={searchInputRef}
            type="text"
            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search candidates, roles, skills..."
            style={{
              width: '100%',
              height: 32,
              paddingLeft: 32,
              paddingRight: 48,
              fontSize: 12.5,
              borderRadius: 6,
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-canvas)',
              color: '#0f172a',
              outline: 'none',
              transition: 'border-color 0.12s ease, background 0.12s ease',
            }}
          />
          {localQuery ? (
            <button
              onClick={() => {
                setLocalQuery('');
                setSearchOpen(false);
              }}
              style={{
                position: 'absolute',
                right: 8,
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={13} />
            </button>
          ) : (
            <span
              className="keycap"
              style={{
                position: 'absolute',
                right: 8,
                pointerEvents: 'none',
              }}
            >
              ⌘K
            </span>
          )}
        </div>

        {/* Search Results Popover */}
        {searchOpen && localQuery.trim().length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: '#ffffff',
              border: '1px solid var(--border-default)',
              borderRadius: 8,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
              maxHeight: 380,
              overflowY: 'auto',
              zIndex: 9999,
              padding: '6px 0',
            }}
          >
            {filteredCandidates.length === 0 && filteredJobs.length === 0 ? (
              <div style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-muted)' }}>
                No records found matching "{localQuery}"
              </div>
            ) : (
              <>
                {filteredCandidates.length > 0 && (
                  <div>
                    <div
                      style={{
                        padding: '6px 12px 4px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        letterSpacing: '0.01em',
                      }}
                    >
                      Candidates
                    </div>
                    {filteredCandidates.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          navigate('candidate-detail', { candidateId: c.id });
                          setSearchOpen(false);
                          setLocalQuery('');
                        }}
                        style={{
                          padding: '7px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          fontSize: 12.5,
                          transition: 'background 0.1s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Users size={13} style={{ color: 'var(--text-muted)' }} />
                          <span style={{ fontWeight: 500, color: '#0f172a' }}>{c.name}</span>
                          <span style={{ color: 'var(--text-muted)' }}>— {c.title}</span>
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            fontVariantNumeric: 'tabular-nums',
                            fontWeight: 500,
                            color: '#166534',
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            padding: '1px 6px',
                            borderRadius: 4,
                          }}
                        >
                          {c.matchScore}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {filteredJobs.length > 0 && (
                  <div style={{ marginTop: filteredCandidates.length > 0 ? 6 : 0, borderTop: filteredCandidates.length > 0 ? '1px solid var(--border-subtle)' : 'none', paddingTop: filteredCandidates.length > 0 ? 6 : 0 }}>
                    <div
                      style={{
                        padding: '6px 12px 4px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        letterSpacing: '0.01em',
                      }}
                    >
                      Requisitions
                    </div>
                    {filteredJobs.map((j) => (
                      <div
                        key={j.id}
                        onClick={() => {
                          navigate('job-workspace', { jobId: j.id });
                          setSearchOpen(false);
                          setLocalQuery('');
                        }}
                        style={{
                          padding: '7px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          fontSize: 12.5,
                          transition: 'background 0.1s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Briefcase size={13} style={{ color: 'var(--text-muted)' }} />
                          <span style={{ fontWeight: 500, color: '#0f172a' }}>{j.title}</span>
                          <span style={{ color: 'var(--text-muted)' }}>({j.client})</span>
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{j.location}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Notifications + Recruiter Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {/* Notifications Button */}
        <div ref={notifContainerRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: 6,
              height: 32,
              width: 32,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.1s ease, color 0.1s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-subtle)';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            aria-label="View notifications"
          >
            <Bell size={14} />
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#2563eb',
              }}
            />
          </button>

          <Notifications
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />
        </div>

        {/* User Avatar */}
        <div
          onClick={() => navigate('settings')}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            display: 'grid',
            placeItems: 'center',
            fontSize: 12,
            fontWeight: 600,
            color: '#0f172a',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'border-color 0.1s ease',
          }}
          title={settings.profile.name}
        >
          {initials}
        </div>
      </div>
    </header>
  );
};
