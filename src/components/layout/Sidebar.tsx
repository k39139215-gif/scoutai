import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  SearchCheck,
  Send,
  Calendar,
  CheckSquare,
  Activity,
  BarChart3,
  Building2,
  ShieldCheck,
  Settings,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { AppView } from '../../types';
import { useApp } from '../../context/AppContext';
import { isDevMode } from '../../utils/devMode';

interface SidebarProps {
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenOnMobile, onCloseMobile }) => {
  const { currentView, navigate, tasks, resetToDemoDefaults, settings } = useApp();

  const pendingTasksCount = tasks.filter((t) => t.status === 'Pending').length;

  const navGroups: {
    section: string;
    items: {
      id: AppView;
      label: string;
      icon: React.ReactNode;
      badge?: string | number;
    }[];
  }[] = [
    {
      section: 'Recruitment',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
        { id: 'jobs', label: 'Requisitions', icon: <Briefcase size={15} /> },
        { id: 'candidates', label: 'Candidates', icon: <Users size={15} /> },
        { id: 'talent-studio', label: 'Talent Studio', icon: <Sparkles size={15} />, badge: isDevMode() ? 'REF' : undefined },
        { id: 'sourcing', label: 'Candidate Matching', icon: <SearchCheck size={15} /> },
        { id: 'outreach', label: 'Outreach', icon: <Send size={15} /> },
        { id: 'interviews', label: 'Interviews', icon: <Calendar size={15} /> },
        {
          id: 'tasks',
          label: 'Tasks',
          icon: <CheckSquare size={15} />,
          badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
        },
      ],
    },
    {
      section: 'Operations & Insights',
      items: [
        { id: 'ai-activity', label: 'Audit Trail', icon: <Activity size={15} /> },
        { id: 'analytics', label: 'Pipeline Analytics', icon: <BarChart3 size={15} /> },
        { id: 'clients', label: 'Client Accounts', icon: <Building2 size={15} /> },
      ],
    },
    {
      section: 'Governance & Settings',
      items: [
        { id: 'privacy', label: 'Data Compliance', icon: <ShieldCheck size={15} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={15} /> },
      ],
    },
  ];

  const handleNavClick = (viewId: AppView) => {
    navigate(viewId);
    if (isOpenOnMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 998,
          }}
        />
      )}

      <aside
        id="side"
        style={{
          width: 'var(--sidebar-width)',
          flex: 'none',
          height: '100vh',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          padding: '0 12px 14px',
          overflow: 'hidden',
          background: '#ffffff',
          zIndex: 999,
          userSelect: 'none',
        }}
        className={isOpenOnMobile ? 'sidebar-mobile-open' : 'sidebar-desktop'}
      >
        {/* Brand Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 'var(--header-height)',
            padding: '0 8px',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: 12,
            flexShrink: 0,
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}
            onClick={() => handleNavClick('dashboard')}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 5,
                background: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}
            >
              S
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', letterSpacing: '-0.015em' }}>
                ScoutAI
              </span>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                ops
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Section Groups */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            paddingRight: 2,
          }}
        >
          {navGroups.map((grp) => (
            <div key={grp.section}>
              {/* Clean Sentence-Case Section Label */}
              <div
                style={{
                  padding: '4px 8px 6px',
                  fontWeight: 500,
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.01em',
                }}
              >
                {grp.section}
              </div>

              {/* Navigation Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {grp.items.map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        textAlign: 'left',
                        padding: '0 10px',
                        height: 32,
                        borderRadius: 6,
                        position: 'relative',
                        gap: 9,
                        fontSize: 13,
                        fontWeight: isActive ? 500 : 400,
                        background: isActive ? 'var(--bg-subtle)' : 'transparent',
                        color: isActive ? '#0f172a' : 'var(--text-secondary)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.1s ease, color 0.1s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'var(--bg-subtle)';
                          e.currentTarget.style.color = '#0f172a';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      {isActive && (
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 6,
                            bottom: 6,
                            width: 2.5,
                            borderRadius: 2,
                            background: '#0f172a',
                          }}
                        />
                      )}
                      <span style={{ color: isActive ? '#0f172a' : 'var(--text-muted)', display: 'flex' }}>
                        {item.icon}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.label}
                      </span>

                      {item.badge !== undefined && (
                        <span
                          style={{
                            borderRadius: 4,
                            padding: '1px 5px',
                            fontSize: 12,
                            fontWeight: 500,
                            color: isActive ? '#0f172a' : 'var(--text-muted)',
                            background: isActive ? '#ffffff' : 'var(--bg-subtle)',
                            border: '1px solid var(--border-subtle)',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Recruiter Profile & Utility */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: 12,
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div
            onClick={() => handleNavClick('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '6px 8px',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'background 0.1s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: '#e2e8f0',
                color: '#334155',
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {settings.profile.name.charAt(0) || 'R'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: '#0f172a',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {settings.profile.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {settings.profile.role}
              </div>
            </div>
          </div>

          {isDevMode() && (
            <button
              onClick={resetToDemoDefaults}
              title="Reset workspace state to demo defaults"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                width: '100%',
                padding: '5px 8px',
                borderRadius: 5,
                fontSize: 12,
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'color 0.1s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <RotateCcw size={12} />
              <span>Reset Demo State</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
