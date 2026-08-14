import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Sparkles,
  Send,
  Calendar,
  CheckSquare,
  Activity,
  BarChart3,
  Building2,
  ShieldCheck,
  Lock,
  Settings,
  X,
  RotateCcw,
} from 'lucide-react';
import type { AppView } from '../../types';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenOnMobile, onCloseMobile }) => {
  const { currentView, navigate, tasks, resetToDemoDefaults, settings } = useApp();

  const pendingTasksCount = tasks.filter((t) => t.status === 'Pending').length;

  const navItems: {
    section: string;
    items: {
      id: AppView;
      label: string;
      icon: React.ReactNode;
      badge?: number | string;
    }[];
  }[] = [
    {
      section: 'Recruitment',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} strokeWidth={1.75} /> },
        { id: 'jobs', label: 'Jobs', icon: <Briefcase size={16} strokeWidth={1.75} /> },
        { id: 'candidates', label: 'Candidates', icon: <Users size={16} strokeWidth={1.75} /> },
        { id: 'sourcing', label: 'AI Sourcing', icon: <Sparkles size={16} strokeWidth={1.75} /> },
        { id: 'outreach', label: 'Outreach', icon: <Send size={16} strokeWidth={1.75} /> },
        { id: 'interviews', label: 'Interviews', icon: <Calendar size={16} strokeWidth={1.75} /> },
        {
          id: 'tasks',
          label: 'Tasks',
          icon: <CheckSquare size={16} strokeWidth={1.75} />,
          badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
        },
      ],
    },
    {
      section: 'Operations & Data',
      items: [
        { id: 'ai-activity', label: 'AI Activity', icon: <Activity size={16} strokeWidth={1.75} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} strokeWidth={1.75} /> },
        { id: 'clients', label: 'Clients', icon: <Building2 size={16} strokeWidth={1.75} /> },
      ],
    },
    {
      section: 'Governance',
      items: [
        { id: 'privacy', label: 'Privacy & Compliance', icon: <ShieldCheck size={16} strokeWidth={1.75} /> },
        { id: 'security', label: 'Security & Audit', icon: <Lock size={16} strokeWidth={1.75} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={16} strokeWidth={1.75} /> },
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
            background: 'rgba(0,0,0,0.2)',
            zIndex: 998,
          }}
        />
      )}

      <aside
        style={{
          width: 'var(--sidebar-width)',
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: 'var(--color-bg-surface)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999,
          flexShrink: 0,
          userSelect: 'none',
        }}
        className={isOpenOnMobile ? 'sidebar-mobile-open' : 'sidebar-desktop'}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 'var(--header-height)',
            padding: '0 18px',
            borderBottom: '1px solid var(--color-divider)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}
            onClick={() => handleNavClick('dashboard')}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: -0.5,
              }}
            >
              S
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 'var(--font-size-md)',
                  letterSpacing: varTrackingTight(),
                  color: 'var(--color-text-primary)',
                }}
              >
                ScoutAI
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Ops
              </span>
            </div>
          </div>

          {isOpenOnMobile && (
            <button
              onClick={onCloseMobile}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
              }}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {navItems.map((sec) => (
            <div key={sec.section}>
              <div
                style={{
                  fontSize: '10.5px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-text-muted)',
                  padding: '0 10px 6px',
                }}
              >
                {sec.section}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {sec.items.map((item) => {
                  const isActive =
                    currentView === item.id ||
                    (item.id === 'jobs' && currentView === 'job-workspace') ||
                    (item.id === 'jobs' && currentView === 'create-job') ||
                    (item.id === 'candidates' && currentView === 'candidate-detail');

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: isActive ? 'var(--color-bg-subtle)' : 'transparent',
                        color: isActive
                          ? 'var(--color-text-primary)'
                          : 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: isActive ? 600 : 500,
                        textAlign: 'left',
                        transition: 'all var(--transition-fast)',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'var(--color-bg-subtle)';
                          e.currentTarget.style.color = 'var(--color-text-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--color-text-secondary)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <span
                          style={{
                            color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--color-border)',
                            color: 'var(--color-text-primary)',
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

        {/* Footer: User profile & Reset */}
        <div
          style={{
            padding: '12px 14px',
            borderTop: '1px solid var(--color-divider)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {settings.profile.name.charAt(0)}
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {settings.profile.name}
              </div>
              <div
                style={{
                  fontSize: '10.5px',
                  color: 'var(--color-text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {settings.profile.role}
              </div>
            </div>
          </div>

          <button
            onClick={resetToDemoDefaults}
            title="Reset to initial demo dataset"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: 5,
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-text-primary)';
              e.currentTarget.style.background = 'var(--color-bg-subtle)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-muted)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </aside>
    </>
  );
};

function varTrackingTight() {
  return '-0.02em';
}
