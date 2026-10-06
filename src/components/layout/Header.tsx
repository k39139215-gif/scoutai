import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  X,
  Layers,
  ChevronDown,
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
  Settings as SettingsIcon,
  Plus,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { AppView } from '../../types';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { currentView, candidates, jobs, aiActivity, navigate, settings } = useApp();

  const [searchOpen, setSearchOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [partitionOpen, setPartitionOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notifContainerRef = useRef<HTMLDivElement>(null);
  const partitionContainerRef = useRef<HTMLDivElement>(null);

  // Partitions & Multi-page features
  const partitions = [
    {
      id: 'recruitment',
      label: 'Recruitment Hub',
      badge: 'Core',
      views: ['dashboard', 'jobs', 'candidates', 'sourcing', 'outreach', 'candidate-detail', 'job-workspace'],
      items: [
        { id: 'dashboard' as AppView, label: 'Dashboard', icon: <LayoutDashboard size={14} />, desc: 'Live operations overview' },
        { id: 'jobs' as AppView, label: 'Jobs Requisitions', icon: <Briefcase size={14} />, desc: 'Open headcount & criteria' },
        { id: 'candidates' as AppView, label: 'Candidate Pool', icon: <Users size={14} />, desc: 'Talent roster & fit scoring' },
        { id: 'sourcing' as AppView, label: 'AI Sourcing Engine', icon: <Sparkles size={14} />, desc: 'Autonomous talent matching' },
        { id: 'outreach' as AppView, label: 'Candidate Outreach', icon: <Send size={14} />, desc: 'Smart AI messaging drafts' },
      ],
    },
    {
      id: 'operations',
      label: 'Operations & Data',
      badge: 'Active',
      views: ['interviews', 'tasks', 'ai-activity', 'analytics', 'clients'],
      items: [
        { id: 'interviews' as AppView, label: 'Interviews Hub', icon: <Calendar size={14} />, desc: 'Technical screens & schedules' },
        { id: 'tasks' as AppView, label: 'Recruiter Tasks', icon: <CheckSquare size={14} />, desc: 'Daily operational actions' },
        { id: 'ai-activity' as AppView, label: 'AI Operations Stream', icon: <Activity size={14} />, desc: 'Real-time autonomous audit' },
        { id: 'analytics' as AppView, label: 'Hiring Analytics', icon: <BarChart3 size={14} />, desc: 'Velocity & conversion funnels' },
        { id: 'clients' as AppView, label: 'Client Accounts', icon: <Building2 size={14} />, desc: 'Fulfillment & stakeholders' },
      ],
    },
    {
      id: 'governance',
      label: 'Governance & Admin',
      badge: 'Enterprise',
      views: ['security', 'privacy', 'settings', 'create-job'],
      items: [
        { id: 'security' as AppView, label: 'Security & SOC2 Logs', icon: <ShieldCheck size={14} />, desc: 'Tamper-evident audit trail' },
        { id: 'privacy' as AppView, label: 'DPDP / GDPR Compliance', icon: <Lock size={14} />, desc: 'Data retention & consent' },
        { id: 'settings' as AppView, label: 'System Settings', icon: <SettingsIcon size={14} />, desc: 'Recruiter prefs & timeouts' },
        { id: 'create-job' as AppView, label: 'Create Requisition', icon: <Plus size={14} />, desc: 'New position intake wizard' },
      ],
    },
  ];

  const currentPartition = partitions.find((p) => p.views.includes(currentView)) || partitions[0];
  const [selectedPartitionTab, setSelectedPartitionTab] = useState(currentPartition.id);

  // Sync selected tab when current view changes
  useEffect(() => {
    const matched = partitions.find((p) => p.views.includes(currentView));
    if (matched) setSelectedPartitionTab(matched.id);
  }, [currentView]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        setSearchOpen(false);
      }
      if (
        notifContainerRef.current &&
        !notifContainerRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }
      if (
        partitionContainerRef.current &&
        !partitionContainerRef.current.contains(target)
      ) {
        setPartitionOpen(false);
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
        .toUpperCase()
    : 'AK';

  const activeTabObj = partitions.find((p) => p.id === selectedPartitionTab) || currentPartition;

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        padding: '0 20px',
        borderBottom: '1px solid #e4e4e7',
        background: '#ffffff',
        height: 'var(--header-height)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      {/* Left controls: Mobile menu + Partition Selector + Command Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
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

        {/* Multi-page Feature Partition Dropdown (Matches reference screenshot) */}
        <div ref={partitionContainerRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setPartitionOpen(!partitionOpen)}
            style={{
              height: 36,
              padding: '0 12px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              background: partitionOpen ? '#18181b' : '#ffffff',
              color: partitionOpen ? '#ffffff' : '#18181b',
              border: partitionOpen ? '1px solid #18181b' : '1px solid #e4e4e7',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!partitionOpen) e.currentTarget.style.borderColor = '#d4d4d8';
            }}
            onMouseLeave={(e) => {
              if (!partitionOpen) e.currentTarget.style.borderColor = '#e4e4e7';
            }}
          >
            <Layers size={14} style={{ color: partitionOpen ? '#ffffff' : '#71717a' }} />
            <span>{currentPartition.label}</span>
            <ChevronDown
              size={13}
              style={{
                color: partitionOpen ? '#ffffff' : '#71717a',
                transform: partitionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.15s ease',
              }}
            />
          </button>

          {/* Partition Popover Menu */}
          {partitionOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                width: 440,
                maxWidth: 'calc(100vw - 32px)',
                background: '#ffffff',
                border: '1px solid #e4e4e7',
                borderRadius: 10,
                boxShadow: '0 16px 36px -4px rgba(0, 0, 0, 0.16), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
                padding: 10,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {/* Partition Segmented Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  background: '#f4f4f5',
                  padding: 3,
                  borderRadius: 7,
                }}
              >
                {partitions.map((part) => {
                  const isSelected = selectedPartitionTab === part.id;
                  return (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => setSelectedPartitionTab(part.id)}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: 5,
                        fontSize: 12,
                        fontWeight: isSelected ? 600 : 500,
                        border: 'none',
                        background: isSelected ? '#ffffff' : 'transparent',
                        color: isSelected ? '#18181b' : '#71717a',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                        transition: 'all 0.1s ease',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {part.label.split(' ')[0]}
                    </button>
                  );
                })}
              </div>

              {/* Feature List for Selected Partition */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {activeTabObj.items.map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        navigate(item.id);
                        setPartitionOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '9px 12px',
                        borderRadius: 7,
                        border: 'none',
                        background: isActive ? '#f4f4f5' : 'transparent',
                        color: isActive ? '#18181b' : '#3f3f46',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.1s ease',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = '#fafafa';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            background: isActive ? '#18181b' : '#f4f4f5',
                            color: isActive ? '#ffffff' : '#52525b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 500 }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: 11, color: '#71717a', marginTop: 1 }}>
                            {item.desc}
                          </div>
                        </div>
                      </div>

                      {isActive && <Check size={14} style={{ color: '#18181b' }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Global Command Search */}
        <div
          ref={searchContainerRef}
          style={{ width: 340, maxWidth: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}
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
            {localQuery ? (
              <button
                onClick={() => {
                  setLocalQuery('');
                  setSearchOpen(false);
                }}
                style={{
                  position: 'absolute',
                  right: 12,
                  color: '#71717a',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={13} />
              </button>
            ) : (
              <span
                style={{
                  position: 'absolute',
                  right: 10,
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

          {/* Search Results Dropdown */}
          {searchOpen && localQuery.trim().length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 5px)',
                left: 0,
                right: 0,
                background: '#ffffff',
                border: '1px solid #e4e4e7',
                borderRadius: 8,
                boxShadow: '0 12px 30px -4px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                maxHeight: 380,
                overflowY: 'auto',
                zIndex: 9999,
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
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#f4f4f5')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <div>
                            <span style={{ fontWeight: 600 }}>{c.name}</span>
                            <span style={{ color: '#71717a', marginLeft: 8 }}>{c.title}</span>
                          </div>
                          <span style={{ fontSize: 10, background: '#dcfce7', color: '#15803d', padding: '1px 5px', borderRadius: 4 }}>
                            {c.matchScore}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredJobs.length > 0 && (
                    <div>
                      <div style={{ padding: '4px 12px', fontSize: 10, fontWeight: 600, color: 'var(--mut)', textTransform: 'uppercase', marginTop: 4 }}>
                        Jobs
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
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#f4f4f5')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <div>
                            <span style={{ fontWeight: 600 }}>{j.title}</span>
                            <span style={{ color: '#71717a', marginLeft: 8 }}>{j.client}</span>
                          </div>
                          <span style={{ fontSize: 10, color: '#71717a' }}>{j.location}</span>
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

      {/* Right controls: Notifications + AI Execution Button + Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
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
                  borderBottom: '1px solid #e4e4e7',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                <span>AI Activity Alerts</span>
                <span style={{ color: '#71717a', cursor: 'pointer' }} onClick={() => navigate('ai-activity')}>
                  View All
                </span>
              </div>
              {unreadAlerts.map((a) => (
                <div
                  key={a.id}
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #f4f4f5',
                    fontSize: 11.5,
                  }}
                >
                  <div style={{ fontWeight: 500, color: '#18181b' }}>{a.type}</div>
                  <div style={{ color: '#71717a', fontSize: 10.5, marginTop: 2 }}>{a.details}</div>
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
        >
          {initials}
        </div>
      </div>
    </header>
  );
};
