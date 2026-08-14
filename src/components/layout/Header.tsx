import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Bell,
  Menu,
  User,
  Briefcase,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { candidates, jobs, aiActivity, navigate } = useApp();

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

  // Global keydown for search shortcut
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
      )
    : [];

  const filteredJobs = localQuery.trim()
    ? jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(localQuery.toLowerCase()) ||
          j.client.toLowerCase().includes(localQuery.toLowerCase()) ||
          j.location.toLowerCase().includes(localQuery.toLowerCase())
      )
    : [];

  const unreadAlerts = aiActivity.slice(0, 5);

  return (
    <header
      style={{
        height: 'var(--header-height)',
        background: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      {/* Left side: Mobile Toggle + Global Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, maxWidth: 480 }}>
        <button
          onClick={onOpenMobileMenu}
          className="mobile-menu-btn"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: 4,
            display: 'none',
          }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar */}
        <div ref={searchContainerRef} style={{ position: 'relative', width: '100%' }}>
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
                color: 'var(--color-text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search candidates, roles, skills..."
              value={localQuery}
              onChange={(e) => {
                setLocalQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              className="form-input"
              style={{
                paddingLeft: 32,
                paddingRight: 60,
                height: 32,
                fontSize: 'var(--font-size-xs)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border)',
              }}
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
                  onClick={() => {
                    setLocalQuery('');
                    setSearchOpen(false);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: 2,
                    display: 'flex',
                  }}
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              ) : (
                <kbd
                  style={{
                    fontSize: '10px',
                    fontFamily: 'inherit',
                    color: 'var(--color-text-muted)',
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '1px 4px',
                  }}
                >
                  ⌘K
                </kbd>
              )}
            </div>
          </div>

          {/* Search Dropdown Results */}
          {searchOpen && localQuery.trim().length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 38,
                left: 0,
                right: 0,
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-dropdown)',
                maxHeight: 340,
                overflowY: 'auto',
                zIndex: 200,
                padding: '6px 0',
              }}
            >
              {filteredCandidates.length === 0 && filteredJobs.length === 0 ? (
                <div
                  style={{
                    padding: '14px',
                    textAlign: 'center',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  No matching records for "{localQuery}"
                </div>
              ) : (
                <>
                  {/* Candidates */}
                  {filteredCandidates.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: 'var(--color-text-muted)',
                          padding: '4px 14px',
                        }}
                      >
                        Candidates ({filteredCandidates.length})
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
                            padding: '6px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'background var(--transition-fast)',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = 'var(--color-bg-subtle)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = 'transparent')
                          }
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <User size={13} style={{ color: 'var(--color-text-muted)' }} />
                            <div>
                              <div
                                style={{
                                  fontSize: 'var(--font-size-xs)',
                                  fontWeight: 600,
                                  color: 'var(--color-text-primary)',
                                }}
                              >
                                {c.name}
                              </div>
                              <div
                                style={{
                                  fontSize: '11px',
                                  color: 'var(--color-text-muted)',
                                }}
                              >
                                {c.title} • {c.location}
                              </div>
                            </div>
                          </div>
                          <span className="snow-badge snow-badge-success" style={{ fontSize: '10px' }}>
                            {c.matchScore}% Match
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Jobs */}
                  {filteredJobs.length > 0 && (
                    <div>
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: 'var(--color-text-muted)',
                          padding: '4px 14px',
                          borderTop:
                            filteredCandidates.length > 0
                              ? '1px solid var(--color-divider)'
                              : undefined,
                        }}
                      >
                        Jobs ({filteredJobs.length})
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
                            padding: '6px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'background var(--transition-fast)',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = 'var(--color-bg-subtle)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = 'transparent')
                          }
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Briefcase size={13} style={{ color: 'var(--color-text-muted)' }} />
                            <div>
                              <div
                                style={{
                                  fontSize: 'var(--font-size-xs)',
                                  fontWeight: 600,
                                  color: 'var(--color-text-primary)',
                                }}
                              >
                                {j.title}
                              </div>
                              <div
                                style={{
                                  fontSize: '11px',
                                  color: 'var(--color-text-muted)',
                                }}
                              >
                                {j.client} • {j.location}
                              </div>
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: '11px',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            {j.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Operations Hub, Notifications, Create Job CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '11.5px',
            color: 'var(--color-text-secondary)',
            padding: '3px 9px',
            background: 'var(--color-bg-canvas)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
          }}
          className="hub-badge-desktop"
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--color-success)',
            }}
          />
          <span>India Hub</span>
        </div>

        {/* Notifications Popover */}
        <div ref={notifContainerRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            style={{
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 9px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              color: 'var(--color-text-primary)',
              transition: 'all var(--transition-fast)',
            }}
            aria-label="View activity notifications"
          >
            <Bell size={14} />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              {unreadAlerts.length}
            </span>
          </button>

          {notificationsOpen && (
            <div
              style={{
                position: 'absolute',
                top: 38,
                right: 0,
                width: 320,
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-dropdown)',
                zIndex: 200,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--color-divider)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  System Activity
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    navigate('ai-activity');
                    setNotificationsOpen(false);
                  }}
                >
                  View All
                </span>
              </div>

              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {unreadAlerts.map((act) => (
                  <div
                    key={act.id}
                    style={{
                      padding: '9px 14px',
                      borderBottom: '1px solid var(--color-divider)',
                      fontSize: 'var(--font-size-xs)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 2,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {act.type}
                      </span>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '10.5px' }}>
                        {act.timestamp.split(' ')[1]}
                      </span>
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.35, fontSize: '11.5px' }}>
                      {act.details}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create Job CTA */}
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={13} />}
          onClick={() => navigate('create-job')}
        >
          Create Job
        </Button>
      </div>
    </header>
  );
};
