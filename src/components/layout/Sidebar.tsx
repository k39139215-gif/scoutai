import React, { useState } from 'react';
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
  ChevronDown,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import type { AppView } from '../../types';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenOnMobile, onCloseMobile }) => {
  const { currentView, navigate, tasks, resetToDemoDefaults } = useApp();

  const pendingTasksCount = tasks.filter((t) => t.status === 'Pending').length;

  // Track collapsed sections
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    'Recruitment': false,
    'Operations & Data': false,
    'Governance': false,
  });

  const toggleSection = (sec: string) => {
    setCollapsed((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const navGroups: {
    section: string;
    items: {
      id: AppView;
      label: string;
      icon: React.ReactNode;
      badge?: string | number;
      isNew?: boolean;
    }[];
  }[] = [
    {
      section: 'Recruitment',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
        { id: 'jobs', label: 'Jobs', icon: <Briefcase size={16} /> },
        { id: 'candidates', label: 'Candidates', icon: <Users size={16} /> },
        { id: 'sourcing', label: 'AI Sourcing', icon: <Sparkles size={16} />, isNew: true },
        { id: 'outreach', label: 'Outreach', icon: <Send size={16} /> },
        { id: 'interviews', label: 'Interviews', icon: <Calendar size={16} /> },
        {
          id: 'tasks',
          label: 'Tasks',
          icon: <CheckSquare size={16} />,
          badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
        },
      ],
    },
    {
      section: 'Operations & Data',
      items: [
        { id: 'ai-activity', label: 'AI Activity', icon: <Activity size={16} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
        { id: 'clients', label: 'Clients', icon: <Building2 size={16} /> },
      ],
    },
    {
      section: 'Governance',
      items: [
        { id: 'privacy', label: 'Compliance', icon: <ShieldCheck size={16} /> },
        { id: 'security', label: 'Security', icon: <Lock size={16} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
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
            background: 'rgba(0, 0, 0, 0.32)',
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
          borderRight: '1px solid var(--line)',
          display: 'flex',
          flexDirection: 'column',
          padding: '0 8px 12px',
          overflow: 'hidden',
          fontSize: 13.5,
          background: 'var(--bg)',
          zIndex: 999,
          userSelect: 'none',
        }}
        className={isOpenOnMobile ? 'sidebar-mobile-open' : 'sidebar-desktop'}
      >
        {/* Brand Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 'var(--header-height)',
            padding: '0 8px',
            borderBottom: '1px solid var(--line)',
            marginBottom: 8,
            flexShrink: 0,
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            onClick={() => handleNavClick('dashboard')}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: '#18181b',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              ✳
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ letterSpacing: -0.2, fontWeight: 700, fontSize: 14.5, color: '#18181b' }}>
                ScoutAI
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '1px 5px',
                  borderRadius: 4,
                  background: '#f4f4f5',
                  color: '#71717a',
                  border: '1px solid #e4e4e7',
                }}
              >
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Accordion Groups */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, paddingRight: 2 }}>
          {navGroups.map((grp) => {
            const isClosed = collapsed[grp.section];
            return (
              <div key={grp.section} style={{ marginBottom: 6 }}>
                {/* Group Header */}
                <button
                  onClick={() => toggleSection(grp.section)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    padding: '8px 8px 4px',
                    fontWeight: 600,
                    fontSize: 11,
                    color: '#71717a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span>{grp.section}</span>
                  <span>
                    {isClosed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                  </span>
                </button>

                {/* Items */}
                {!isClosed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
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
                            height: 36,
                            borderRadius: 6,
                            position: 'relative',
                            gap: 10,
                            fontSize: 13,
                            fontWeight: isActive ? 600 : 400,
                            background: isActive ? '#18181b' : 'transparent',
                            color: isActive ? '#ffffff' : '#27272a',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.12s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.background = '#f4f4f5';
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <span style={{ color: isActive ? '#ffffff' : '#71717a', display: 'flex' }}>
                            {item.icon}
                          </span>
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.label}
                          </span>

                          {item.isNew && (
                            <span
                              style={{
                                background: '#dcfce7',
                                color: '#15803d',
                                fontSize: 10,
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: 9999,
                              }}
                            >
                              NEW
                            </span>
                          )}

                          {item.badge !== undefined && (
                            <span
                              style={{
                                border: isActive ? '1px solid #3f3f46' : '1px solid #e4e4e7',
                                borderRadius: 4,
                                padding: '1px 5px',
                                fontSize: 11,
                                fontWeight: 600,
                                color: isActive ? '#ffffff' : '#71717a',
                                background: isActive ? '#27272a' : '#f4f4f5',
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Utility Area */}
        <div style={{ marginTop: 'auto', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Workspace Plan & Setup Card */}
          <div
            style={{
              border: '1px solid #e4e4e7',
              borderRadius: 8,
              padding: '12px',
              fontSize: 12,
              background: '#fafafa',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontWeight: 600, color: '#18181b', fontSize: 12.5 }}>Enterprise Pilot</span>
              <span style={{ color: '#71717a', fontSize: 11, fontWeight: 500 }}>72%</span>
            </div>
            <div
              style={{
                height: 4,
                background: '#e4e4e7',
                borderRadius: 9999,
                margin: '6px 0 8px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '72%',
                  height: '100%',
                  background: '#18181b',
                  borderRadius: 9999,
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#71717a' }}>5 of 7 tasks done</span>
              <span
                onClick={() => handleNavClick('settings')}
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#18181b',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: 2,
                }}
              >
                Upgrade
              </span>
            </div>
          </div>

          {/* Quick Settings & Reset Flat Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <button
              onClick={() => handleNavClick('settings')}
              style={{
                padding: '6px 8px',
                textAlign: 'left',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: 6,
                fontSize: 13,
                color: '#71717a',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f4f4f5';
                e.currentTarget.style.color = '#18181b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#71717a';
              }}
            >
              <SlidersHorizontal size={14} />
              <span>Preferences</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all candidate, task and job data to initial demo state?')) {
                  resetToDemoDefaults();
                }
              }}
              style={{
                padding: '6px 8px',
                textAlign: 'left',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: 6,
                fontSize: 12.5,
                color: '#a1a1aa',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f4f4f5';
                e.currentTarget.style.color = '#71717a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#a1a1aa';
              }}
            >
              <RotateCcw size={13} />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
