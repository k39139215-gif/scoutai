import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { candidates, jobs, aiActivity, navigate, settings } = useApp();

  const [searchOpen, setSearchOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notifContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
      if (
        notifContainerRef.current &&
        !notifContainerRef.current.contains(e.target as Node)
      ) {
        setNotificationsOpen(false);
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

  const unreadAlerts = aiActivity.slice(0, 5);

  const initials = settings.profile.name
    ? settings.profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AK';

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        padding: '0 20px',
        borderBottom: '1px solid var(--line)',
        background: '#ffffff',
        height: 'var(--header-height)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      {/* Mobile Menu Button */}
      <button
        onClick={onOpenMobileMenu}
        style={{
          display: 'none',
          padding: 6,
          color: 'var(--ink)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
        className="mobile-menu-btn"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      {/* Global Command Search */}
      <div
        ref={searchContainerRef}
        style={{ width: 380, maxWidth: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}
      >
        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: 12,
              color: '#71717a',
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
            placeholder="Search candidates, jobs, skills…"
            style={{
              width: '100%',
              height: 36,
              border: '1px solid #e4e4e7',
              borderRadius: 8,
              padding: '0 44px 0 34px',
              fontSize: 13,
              background: '#ffffff',
              color: 'var(--ink)',
              outline: 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onFocusCapture={(e) => (e.currentTarget.style.borderColor = '#18181b')}
            onBlurCapture={(e) => (e.currentTarget.style.borderColor = '#e4e4e7')}
          />
          <div
            style={{
              position: 'absolute',
              right: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {localQuery ? (
              <button
                onClick={() => setLocalQuery('')}
                style={{
                  color: 'var(--mut)',
                  padding: 2,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <X size={13} />
              </button>
            ) : (
              <span
                style={{
                  background: '#f4f4f5',
                  border: '1px solid #e4e4e7',
                  borderRadius: 4,
                  padding: '1px 5px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#71717a',
                  lineHeight: 1.2,
                }}
              >
                ⌘K
              </span>
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {searchOpen && localQuery.trim().length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: '#ffffff',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              maxHeight: 380,
              overflowY: 'auto',
              zIndex: 100,
              padding: '6px 0',
            }}
          >
            {filteredCandidates.length === 0 && filteredJobs.length === 0 ? (
              <div style={{ padding: '12px 14px', fontSize: 12, color: 'var(--mut)' }}>
                No records matching "{localQuery}"
              </div>
            ) : (
              <>
                {filteredCandidates.length > 0 && (
                  <div>
                    <div style={{ padding: '4px 12px', fontSize: 10, fontWeight: 600, color: 'var(--mut)', textTransform: 'uppercase' }}>
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
                          padding: '6px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          fontSize: 12,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--soft)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div>
                          <span style={{ fontWeight: 600 }}>{c.name}</span>
                          <span style={{ color: 'var(--mut)', marginLeft: 8 }}>{c.title}</span>
                        </div>
                        <span style={{ fontSize: 10, background: '#d9f3dc', color: '#1c6b2c', padding: '1px 5px', borderRadius: 4 }}>
                          {c.matchScore}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {filteredJobs.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--line)', marginTop: 4, paddingTop: 4 }}>
                    <div style={{ padding: '4px 12px', fontSize: 10, fontWeight: 600, color: 'var(--mut)', textTransform: 'uppercase' }}>
                      Active Roles
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
                          padding: '6px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          fontSize: 12,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--soft)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div>
                          <span style={{ fontWeight: 600 }}>{j.title}</span>
                          <span style={{ color: 'var(--mut)', marginLeft: 8 }}>{j.client}</span>
                        </div>
                        <span style={{ fontSize: 10, color: 'var(--mut)' }}>{j.location}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Notifications Button */}
      <div ref={notifContainerRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          style={{
            border: '1px solid #e4e4e7',
            borderRadius: 8,
            height: 36,
            width: 36,
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#18181b',
            position: 'relative',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f4f4f5')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
          aria-label="View notifications"
        >
          <Bell size={15} />
          <span
            style={{
              position: 'absolute',
              top: 7,
              right: 7,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#2563eb',
            }}
          />
        </button>

        {notificationsOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 5px)',
              right: 0,
              width: 300,
              background: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: 8,
              boxShadow: '0 12px 30px -4px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              zIndex: 9999,
              padding: '6px 0',
            }}
          >
            <div
              style={{
                padding: '6px 12px',
                borderBottom: '1px solid var(--line)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <span>AI Activity Alerts</span>
              <span style={{ color: 'var(--mut)', cursor: 'pointer' }} onClick={() => navigate('ai-activity')}>
                View All
              </span>
            </div>
            {unreadAlerts.map((a) => (
              <div
                key={a.id}
                style={{
                  padding: '8px 12px',
                  borderBottom: '1px solid var(--line)',
                  fontSize: 11.5,
                }}
              >
                <div style={{ fontWeight: 500, color: 'var(--ink)' }}>{a.type}</div>
                <div style={{ color: 'var(--mut)', fontSize: 10.5, marginTop: 2 }}>{a.details}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <button
        onClick={() => navigate('sourcing')}
        className="btn-dark"
        style={{
          background: '#18181b',
          color: '#ffffff',
          height: 36,
          padding: '0 14px',
          borderRadius: 8,
          fontWeight: 500,
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          whiteSpace: 'nowrap',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <span>✳</span>
        <span>Execute with AI</span>
      </button>

      {/* User Avatar */}
      <div
        onClick={() => navigate('settings')}
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: '#f4f4f5',
          border: '1px solid #e4e4e7',
          display: 'grid',
          placeItems: 'center',
          fontSize: 12,
          fontWeight: 600,
          color: '#18181b',
          cursor: 'pointer',
          flexShrink: 0,
        }}
        title={settings.profile.name || 'User Profile'}
      >
        {initials}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};
