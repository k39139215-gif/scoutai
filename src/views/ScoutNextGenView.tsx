import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Kanban,
  Table as TableIcon,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  X,
  MapPin,
  ChevronDown,
  Layers,
  Bot,
  ArrowUp,
  BarChart3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import type { Candidate, CandidateStatus } from '../types';
import { CompetencyRadarChart } from '../components/studio/CompetencyRadarChart';

export const ScoutNextGenView: React.FC = () => {
  const { candidates, jobs, interviews, shortlistCandidate, updateCandidateStatus, navigate } = useApp();
  const { showToast } = useToast();

  // Primary navigation & view modes: board (Gr8r), waterfall (Halo), table, radar
  const [viewMode, setViewMode] = useState<'board' | 'waterfall' | 'table' | 'radar'>('board');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(candidates[0]?.id || null);
  
  // Docked right panel states: whether open, and whether showing Candidate Dossier or AI Copilot
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<'dossier' | 'copilot'>('dossier');
  
  // ATS Connectors popover state (Lucas Dan reference)
  const [connectorsOpen, setConnectorsOpen] = useState(false);

  // Search & Filter controls
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // AI Copilot interactive chat state (Halo reference)
  const [copilotThoughtOpen, setCopilotThoughtOpen] = useState(true);
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'user',
      text: 'Can we recover candidates who dropped off during the technical assessment stage?',
      time: '2m ago',
    },
    {
      sender: 'ai',
      text: 'Most can be re-engaged. I analyzed the 14 candidates who dropped out: 9 indicated salary expectation mismatches above current budget, but 5 (including Sarah Chen and Rajesh Menon) expressed interest in asynchronous pairing rounds.',
      time: 'Just now',
    },
  ]);

  // Selected active candidate
  const activeCandidate: Candidate = useMemo(() => {
    return candidates.find((c) => c.id === selectedCandidateId) || candidates[0] || ({} as Candidate);
  }, [candidates, selectedCandidateId]);

  // Filtered candidate cohort
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchDept =
        departmentFilter === 'All' ||
        (departmentFilter === 'Engineering' && (c.title.includes('Engineer') || c.title.includes('Architect'))) ||
        (departmentFilter === 'Product' && (c.title.includes('Product') || c.title.includes('Manager'))) ||
        (departmentFilter === 'Design' && c.title.includes('Design'));

      return matchSearch && matchDept;
    });
  }, [candidates, searchQuery, departmentFilter]);

  // Handle stage change
  const handleStageChange = (candId: string, newStage: CandidateStatus) => {
    updateCandidateStatus(candId, newStage);
    showToast(`Updated stage for ${candidates.find(c => c.id === candId)?.name || 'candidate'} to "${newStage}"`, 'success');
  };

  // Handle shortlisting
  const handleShortlist = (candId: string) => {
    shortlistCandidate(candId);
    showToast('Candidate shortlisted for hiring manager review', 'success');
  };

  // Handle AI Copilot message submit
  const handleCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;

    const userText = copilotInput.trim();
    setCopilotInput('');
    setCopilotMessages((prev) => [...prev, { sender: 'user', text: userText, time: 'Just now' }]);

    setTimeout(() => {
      let reply = `Based on ScoutAI talent ontology, ${activeCandidate?.name || 'the candidate'} has verified production competency in ${activeCandidate?.skills?.slice(0, 3).join(', ') || 'core domains'}. Recommended next action: schedule technical panel round with hiring director.`;
      if (userText.toLowerCase().includes('scorecard')) {
        reply = `Technical scorecard generated for ${activeCandidate?.name}: 5 evaluation dimensions established (Distributed concurrency: 94%, State hydration: 92%, Concurrency: 88%, Latency: 96%, Leadership: 89%). Zero bias flags.`;
      } else if (userText.toLowerCase().includes('compare')) {
        reply = `Compared against benchmark pool: ${activeCandidate?.name} holds +14.2% higher algorithmic efficiency rating with verified production latency in high-scale traffic environments.`;
      } else if (userText.toLowerCase().includes('email') || userText.toLowerCase().includes('outreach')) {
        reply = `Personalized outreach drafted for ${activeCandidate?.name} referencing their open-source contributions and recent micro-frontend architecture benchmarks. Ready for review in Outreach Studio.`;
      }
      setCopilotMessages((prev) => [...prev, { sender: 'ai', text: reply, time: 'Just now' }]);
    }, 600);
  };

  // Kanban pipeline columns (Gr8r Studio reference)
  const kanbanColumns: Array<{ id: CandidateStatus; label: string; dotColor: string; bgTint: string }> = [
    { id: 'Qualified', label: 'Screened & Qualified', dotColor: '#3b82f6', bgTint: '#eff6ff' },
    { id: 'Shortlisted', label: 'Shortlisted for Review', dotColor: '#10b981', bgTint: '#ecfdf5' },
    { id: 'Interviewing', label: 'Technical Assessment', dotColor: '#f59e0b', bgTint: '#fffbeb' },
    { id: 'Review', label: 'Hiring Manager Review', dotColor: '#8b5cf6', bgTint: '#f5f3ff' },
    { id: 'Archived', label: 'Talent Pool Archive', dotColor: '#64748b', bgTint: '#f8fafc' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        fontFamily: 'var(--font-family-base, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        color: '#0f172a',
        maxWidth: 1680,
        margin: '0 auto',
        paddingBottom: 40,
      }}
    >
      {/* ───────────────────────────────────────────────────────────
          1. EXECUTIVE APP HEADER & INTEGRATIONS BAR (Lucas Dan & Halo)
      ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          padding: '16px 20px',
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              display: 'grid',
              placeItems: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.2)',
            }}
          >
            <Sparkles size={19} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1
                style={{
                  fontSize: 19,
                  fontWeight: 700,
                  color: '#0f172a',
                  letterSpacing: '-0.025em',
                  margin: 0,
                }}
              >
                ScoutAI Next-Gen Command Center
              </h1>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#047857',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  padding: '2px 8px',
                  borderRadius: 9999,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 6px rgba(16, 185, 129, 0.8)',
                  }}
                />
                Autonomous Engine Active
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: '#64748b', margin: '2px 0 0 0' }}>
              Autonomous pipeline orchestration across {jobs.length} active requisitions, automated talent indexing, and split-screen dossier intelligence.
            </p>
          </div>
        </div>

        {/* Action Controls & Connectors (Lucas Dan Popover) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          {/* Connectors Trigger */}
          <button
            type="button"
            onClick={() => setConnectorsOpen(!connectorsOpen)}
            style={{
              height: 36,
              padding: '0 13px',
              borderRadius: 9,
              border: '1px solid #e2e8f0',
              background: connectorsOpen ? '#f1f5f9' : '#ffffff',
              color: '#334155',
              fontSize: 12.5,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
            <span>Connectors (5 Active)</span>
            <ChevronDown size={13} style={{ color: '#94a3b8' }} />
          </button>

          {/* Connectors Popover Dropdown (Exact Lucas Dan reference HW1HwNUXMAEd2Dv) */}
          {connectorsOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 140,
                width: 300,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                boxShadow: '0 16px 40px -8px rgba(15, 23, 42, 0.14), 0 0 1px 1px rgba(15, 23, 42, 0.04)',
                padding: '14px',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>ATS & System Connectors</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: '#10b981', background: '#ecfdf5', padding: '1px 6px', borderRadius: 4 }}>
                  Real-time Sync
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { name: 'Google Workspace', status: 'Connected', icon: '🌐', color: '#10b981' },
                  { name: 'GitHub Repositories', status: 'Connected', icon: '🐙', color: '#10b981' },
                  { name: 'Greenhouse ATS', status: 'Connected', icon: '🌿', color: '#10b981' },
                  { name: 'Ashby Recruitment', status: 'Connect', icon: '⚡', color: '#64748b' },
                  { name: 'Lever Recruiter', status: 'Connect', icon: '📑', color: '#64748b' },
                  { name: 'Claude 3.7 Intelligence', status: 'Connected', icon: '✦', color: '#10b981' },
                ].map((conn) => (
                  <div
                    key={conn.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 9px',
                      borderRadius: 8,
                      background: '#f8fafc',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15 }}>{conn.icon}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: '#1e293b' }}>{conn.name}</span>
                    </div>
                    {conn.status === 'Connected' ? (
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981' }} />
                        Connected
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => showToast(`Connecting to ${conn.name}...`, 'info')}
                        style={{
                          height: 22,
                          padding: '0 8px',
                          borderRadius: 5,
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#334155',
                          fontSize: 11,
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Connect
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setConnectorsOpen(false);
                  navigate('settings');
                }}
                style={{
                  width: '100%',
                  marginTop: 10,
                  height: 32,
                  borderRadius: 8,
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#475569',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Manage Connectors
              </button>
            </div>
          )}

          {/* AI Copilot Toggle Button (Halo Style) */}
          <button
            type="button"
            onClick={() => {
              setInspectorOpen(true);
              setRightPanelTab('copilot');
            }}
            style={{
              height: 36,
              padding: '0 13px',
              borderRadius: 9,
              border: rightPanelTab === 'copilot' && inspectorOpen ? '1px solid #6366f1' : '1px solid #e2e8f0',
              background: rightPanelTab === 'copilot' && inspectorOpen ? '#e0e7ff' : '#ffffff',
              color: rightPanelTab === 'copilot' && inspectorOpen ? '#4338ca' : '#334155',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Bot size={14} style={{ color: '#6366f1' }} />
            <span>AI Copilot</span>
          </button>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => navigate('create-job')}
            style={{
              height: 36,
              padding: '0 16px',
              borderRadius: 9,
              border: 'none',
              background: '#0f172a',
              color: '#ffffff',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.15)',
              transition: 'all 0.12s ease',
            }}
          >
            <span>+ Candidate Ingestion</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          2. EXECUTIVE HERO KPI TILES (Fintrack & Halo Reference Craft)
      ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        {/* Metric 1: Active Talent Pool with Dot-Matrix Sparkline (Fintrack HW5zq3sasAArKrQ) */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Talent Pool
            </span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: '#059669',
                background: '#ecfdf5',
                border: '1px solid #bbf7d0',
                padding: '2px 7px',
                borderRadius: 9999,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <ArrowUpRight size={12} />
              +14% week
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              48
            </span>
            <span style={{ fontSize: 13, color: '#64748b' }}>evaluated profiles</span>
          </div>
          {/* Dot-matrix style SVG Sparkline (Fintrack aesthetic: 4 rows x 12 cols) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4, height: 26, alignItems: 'center' }}>
            {[
              [1, 1, 0, 0],
              [1, 1, 1, 0],
              [1, 0, 0, 0],
              [1, 1, 1, 1],
              [1, 1, 1, 0],
              [1, 1, 1, 1],
              [1, 1, 1, 0],
              [1, 1, 1, 1],
              [1, 1, 1, 1],
              [1, 1, 1, 1],
              [1, 1, 1, 1],
              [1, 1, 1, 1],
            ].map((col, colIdx) => (
              <div key={colIdx} style={{ display: 'flex', flexDirection: 'column-reverse', gap: 2, height: '100%', justifyContent: 'flex-start' }}>
                {col.map((dot, rowIdx) => (
                  <div
                    key={rowIdx}
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: dot ? (colIdx >= 8 ? '#f59e0b' : '#0f172a') : '#e2e8f0',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Metric 2: Quality Fit Benchmark */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quality Fit Benchmark
            </span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: '#059669',
                background: '#ecfdf5',
                border: '1px solid #bbf7d0',
                padding: '2px 7px',
                borderRadius: 9999,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <ArrowUpRight size={12} />
              +3.8 pts
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              91.4%
            </span>
            <span style={{ fontSize: 13, color: '#64748b' }}>top tier accuracy</span>
          </div>
          <div style={{ height: 6, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '78%', background: '#10b981' }} />
            <div style={{ width: '13.4%', background: '#06b6d4' }} />
          </div>
        </div>

        {/* Metric 3: Velocity (Time to Hire) */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Velocity (Offer Cycle)
            </span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: '#059669',
                background: '#ecfdf5',
                border: '1px solid #bbf7d0',
                padding: '2px 7px',
                borderRadius: 9999,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <ArrowDownRight size={12} />
              -2.6d faster
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              16.2 Days
            </span>
            <span style={{ fontSize: 13, color: '#64748b' }}>time to hire</span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Industry baseline:</span>
            <strong style={{ color: '#0f172a', fontWeight: 600 }}>32.0 Days</strong>
          </div>
        </div>

        {/* Metric 4: Scheduled Sessions */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Scheduled Sessions
            </span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: '#b45309',
                background: '#fef3c7',
                border: '1px solid #fde68a',
                padding: '2px 7px',
                borderRadius: 9999,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Calendar size={11} />
              {interviews.filter((i) => i.status === 'Scheduled').length} Scheduled
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              {interviews.filter((i) => i.status === 'Scheduled').length}
            </span>
            <span style={{ fontSize: 13, color: '#64748b' }}>active rounds</span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Next: <strong style={{ color: '#0f172a' }}>Ananya Sharma (Tomorrow 2:30 PM)</strong>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          3. MULTI-MODE SUBHEADER & FILTER CONTROLS (Gr8r Studio HW5e_yKbQAAnb-T)
      ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '12px 16px',
          background: '#ffffff',
          borderRadius: 14,
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Left: View Switcher (Board | Waterfall Analytics | Table Grid | Radar Matrix) */}
        <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: 3, borderRadius: 9, gap: 2 }}>
          {[
            { id: 'board', label: 'Kanban Board', icon: Kanban },
            { id: 'waterfall', label: 'Waterfall Analytics', icon: BarChart3 },
            { id: 'table', label: 'Table Grid', icon: TableIcon },
            { id: 'radar', label: 'Radar Matrix', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setViewMode(tab.id as any)}
                style={{
                  height: 30,
                  padding: '0 12px',
                  borderRadius: 7,
                  border: 'none',
                  background: active ? '#ffffff' : 'transparent',
                  color: active ? '#0f172a' : '#64748b',
                  fontSize: 12.5,
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: active ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                  transition: 'all 0.12s ease',
                }}
              >
                <Icon size={14} style={{ color: active ? '#0f172a' : '#94a3b8' }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Middle: Live Search Bar */}
        <div style={{ position: 'relative', minWidth: 260, flex: 1, maxWidth: 380 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: 9, color: '#94a3b8' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter candidates by name, skill, role..."
            style={{
              width: '100%',
              height: 32,
              paddingLeft: 32,
              paddingRight: 28,
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              fontSize: 12.5,
              outline: 'none',
              color: '#0f172a',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 8, top: 8, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Right: Department & Priority Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {['All', 'Engineering', 'Product', 'Design'].map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setDepartmentFilter(dept)}
              style={{
                height: 28,
                padding: '0 10px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: departmentFilter === dept ? 600 : 500,
                border: departmentFilter === dept ? '1px solid #0f172a' : '1px solid #e2e8f0',
                background: departmentFilter === dept ? '#0f172a' : '#ffffff',
                color: departmentFilter === dept ? '#ffffff' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
              }}
            >
              {dept}
            </button>
          ))}
          <div style={{ width: 1, height: 18, background: '#e2e8f0', margin: '0 4px' }} />
          <button
            type="button"
            onClick={() => setInspectorOpen(!inspectorOpen)}
            style={{
              height: 28,
              padding: '0 10px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              border: '1px solid #e2e8f0',
              background: inspectorOpen ? '#f1f5f9' : '#ffffff',
              color: '#334155',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Layers size={13} />
            <span>{inspectorOpen ? 'Hide Inspector' : 'Show Inspector'}</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          4. MAIN WORKSPACE CONTENT: KANBAN / WATERFALL / TABLE / RADAR
          + DOCKED SPLIT-INSPECTOR RIGHT PANEL (Okafor video & VERIQ reference)
      ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: inspectorOpen ? 'minmax(0, 1fr) 420px' : 'minmax(0, 1fr)', gap: 16 }}>
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          
          {/* MODE 1: KANBAN PIPELINE (Gr8r Studio Reference HW5e_yKbQAAnb-T) */}
          {viewMode === 'board' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 14,
                alignItems: 'start',
              }}
            >
              {kanbanColumns.map((col) => {
                const colCandidates = filteredCandidates.filter((c) => c.status === col.id);
                return (
                  <div
                    key={col.id}
                    style={{
                      background: '#f8fafc',
                      borderRadius: 14,
                      border: '1px solid #e2e8f0',
                      padding: '12px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    {/* Column Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.dotColor }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{col.label}</span>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#64748b',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          padding: '1px 6px',
                          borderRadius: 9999,
                        }}
                      >
                        {colCandidates.length}
                      </span>
                    </div>

                    {/* Gr8r "+ Add Candidate" dashed button */}
                    <button
                      type="button"
                      onClick={() => navigate('candidates')}
                      style={{
                        height: 28,
                        borderRadius: 8,
                        border: '1px dashed #cbd5e1',
                        background: '#ffffff',
                        color: '#64748b',
                        fontSize: 11.5,
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#94a3b8')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
                    >
                      <span>+ Add Candidate</span>
                    </button>

                    {/* Candidate Cards List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {colCandidates.length === 0 ? (
                        <div
                          style={{
                            padding: '24px 12px',
                            textAlign: 'center',
                            fontSize: 12,
                            color: '#94a3b8',
                            border: '1px dashed #e2e8f0',
                            borderRadius: 10,
                            background: '#ffffff',
                          }}
                        >
                          No profiles in stage
                        </div>
                      ) : (
                        colCandidates.map((cand) => {
                          const isSelected = selectedCandidateId === cand.id;
                          return (
                            <div
                              key={cand.id}
                              onClick={() => {
                                setSelectedCandidateId(cand.id);
                                setInspectorOpen(true);
                              }}
                              style={{
                                background: '#ffffff',
                                borderRadius: 12,
                                border: isSelected ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
                                padding: '12px 14px',
                                boxShadow: isSelected
                                  ? '0 4px 14px -2px rgba(15, 23, 42, 0.12)'
                                  : '0 1px 3px rgba(15, 23, 42, 0.04)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                                transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) e.currentTarget.style.borderColor = '#cbd5e1';
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) e.currentTarget.style.borderColor = '#e2e8f0';
                              }}
                            >
                              {/* Top row: Priority Tag + Match Badge */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span
                                  style={{
                                    fontSize: 10.5,
                                    fontWeight: 700,
                                    color: cand.matchScore >= 90 ? '#e11d48' : '#d97706',
                                    background: cand.matchScore >= 90 ? '#ffe4e6' : '#fef3c7',
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    letterSpacing: '0.02em',
                                  }}
                                >
                                  {cand.matchScore >= 90 ? 'High Priority' : 'Qualified'}
                                </span>
                                <span
                                  style={{
                                    fontSize: 11.5,
                                    fontWeight: 700,
                                    color: '#059669',
                                    background: '#ecfdf5',
                                    border: '1px solid #a7f3d0',
                                    padding: '1px 6px',
                                    borderRadius: 6,
                                  }}
                                >
                                  {cand.matchScore}%
                                </span>
                              </div>

                              {/* Candidate Name & Title */}
                              <div>
                                <h4 style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                  {cand.name}
                                </h4>
                                <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0 0' }}>
                                  {cand.title}
                                </p>
                              </div>

                              {/* Skills chips */}
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {cand.skills.slice(0, 3).map((s) => (
                                  <span
                                    key={s}
                                    style={{
                                      fontSize: 10.5,
                                      color: '#475569',
                                      background: '#f1f5f9',
                                      padding: '2px 6px',
                                      borderRadius: 4,
                                    }}
                                  >
                                    {s}
                                  </span>
                                ))}
                                {cand.skills.length > 3 && (
                                  <span style={{ fontSize: 10.5, color: '#94a3b8', padding: '2px 4px' }}>
                                    +{cand.skills.length - 3}
                                  </span>
                                )}
                              </div>

                              {/* Bottom metadata row: Location & Experience */}
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  borderTop: '1px solid #f1f5f9',
                                  paddingTop: 8,
                                  fontSize: 11,
                                  color: '#64748b',
                                }}
                              >
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                  <MapPin size={11} />
                                  {cand.location.split(',')[0]}
                                </span>
                                <span style={{ fontWeight: 600, color: '#334155' }}>
                                  {cand.experienceYears}y exp
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* MODE 2: TALENT WATERFALL & PLAN MIX ANALYTICS (Halo Cloud HWyDSHebIAAJF8n) */}
          {viewMode === 'waterfall' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 16 }}>
                {/* Left Card: Pipeline Velocity Waterfall Chart */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: 16,
                    border: '1px solid #e2e8f0',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        Pipeline Movement Waterfall
                      </h3>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0 0' }}>
                        Aug 1 → Aug 16 · Total Talent Flow Progression
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10, fontSize: 11.5 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10b981' }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: '#10b981' }} /> Inflow
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f43f5e' }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: '#f43f5e' }} /> Drop-off
                      </span>
                    </div>
                  </div>

                  {/* Waterfall Bar Graph */}
                  <div style={{ height: 210, display: 'flex', alignItems: 'flex-end', gap: 16, padding: '20px 10px 0 10px', borderBottom: '1px solid #f1f5f9' }}>
                    {[
                      { label: 'Initial Sourced', val: '+142', height: 160, color: '#60a5fa', isFinal: false },
                      { label: 'Screen Passed', val: '+38', height: 85, color: '#34d399', isFinal: false },
                      { label: 'Comp Mismatch', val: '-19', height: 45, color: '#fb7185', isFinal: false },
                      { label: 'Culture Drop', val: '-8', height: 28, color: '#f43f5e', isFinal: false },
                      { label: 'Active Pipeline', val: '48 Pool', height: 130, color: '#0f172a', isFinal: true },
                    ].map((bar, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: bar.color, marginBottom: 6 }}>
                          {bar.val}
                        </span>
                        <div
                          style={{
                            width: '100%',
                            height: bar.height,
                            background: bar.color,
                            borderRadius: '6px 6px 0 0',
                            transition: 'height 0.3s ease',
                          }}
                        />
                        <span style={{ fontSize: 11, color: '#64748b', marginTop: 8, textAlign: 'center', whiteSpace: 'nowrap' }}>
                          {bar.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Card: Domain Distribution Donut (Halo style) */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: 16,
                    border: '1px solid #e2e8f0',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Talent Mix by Department
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '16px 0' }}>
                    {/* SVG Donut */}
                    <svg width="140" height="140" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#0f172a" strokeWidth="12" strokeDasharray="120 240" strokeDashoffset="0" />
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="60 240" strokeDashoffset="-120" />
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="40 240" strokeDashoffset="-180" />
                      <text x="50" y="48" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">48</text>
                      <text x="50" y="60" textAnchor="middle" fontSize="8" fill="#64748b">CANDIDATES</text>
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0f172a' }} />
                        Engineering & Tech
                      </span>
                      <strong style={{ color: '#0f172a' }}>24 (50%)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                        Cognitive AI & ML
                      </span>
                      <strong style={{ color: '#0f172a' }}>14 (29%)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                        Design Systems & PM
                      </span>
                      <strong style={{ color: '#0f172a' }}>10 (21%)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recruitment Conversion Table (Halo Recent Invoices standard) */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid #e2e8f0',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Active Conversion Stages
                  </h3>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Benchmark pass rate: 33.4%</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                  {[
                    { stage: '1. Sourced Ingestion', count: 142, rate: '100%', color: '#3b82f6' },
                    { stage: '2. Screened & Qualified', count: 48, rate: '33.8%', color: '#10b981' },
                    { stage: '3. Shortlisted for Client', count: 24, rate: '16.9%', color: '#6366f1' },
                    { stage: '4. Technical Assessment', count: 12, rate: '8.4%', color: '#f59e0b' },
                    { stage: '5. Offer Negotiation', count: 4, rate: '2.8%', color: '#8b5cf6' },
                  ].map((s) => (
                    <div key={s.stage} style={{ padding: '12px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>{s.stage}</span>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{s.count}</div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.rate} yield</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: HIGH-DENSITY TABLE GRID */}
          {viewMode === 'table' && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: 11.5, textTransform: 'uppercase' }}>Candidate</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: 11.5, textTransform: 'uppercase' }}>Target Requisition</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: 11.5, textTransform: 'uppercase' }}>Experience</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: 11.5, textTransform: 'uppercase' }}>Key Skills</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: 11.5, textTransform: 'uppercase' }}>Match</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: 11.5, textTransform: 'uppercase' }}>Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => {
                        setSelectedCandidateId(c.id);
                        setInspectorOpen(true);
                      }}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        background: selectedCandidateId === c.id ? '#f8fafc' : 'transparent',
                        transition: 'background 0.1s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => {
                        if (selectedCandidateId !== c.id) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0f172a', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>
                            {c.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                            <div style={{ fontSize: 11.5, color: '#64748b' }}>{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#334155', fontWeight: 500 }}>{c.title}</td>
                      <td style={{ padding: '12px 16px', color: '#64748b' }}>{c.experienceYears} Years</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {c.skills.slice(0, 2).map((s) => (
                            <span key={s} style={{ fontSize: 11, background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: 4 }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 7px', borderRadius: 6 }}>
                          {c.matchScore}%
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: '#334155' }}>{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MODE 4: RADAR MATRIX COMPARISON */}
          {viewMode === 'radar' && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Multi-Dimensional Competency Polygon: {activeCandidate.name}
                </h3>
                <p style={{ fontSize: 12.5, color: '#64748b', margin: '4px 0 0 0' }}>
                  Evaluated across 5 core technical axes against {activeCandidate.title} requirements.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 30, alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <CompetencyRadarChart candidate={activeCandidate} size={280} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                    Evaluation Rubric Breakdown
                  </h4>
                  {[
                    { label: 'Architecture & System Design', score: 94 },
                    { label: 'Code Quality & Production Rigor', score: 92 },
                    { label: 'State Management & Concurrency', score: 88 },
                    { label: 'Performance & Latency Optimization', score: 96 },
                    { label: 'Team Collaboration & Mentorship', score: 89 },
                  ].map((r) => (
                    <div key={r.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: '#334155', fontWeight: 500 }}>{r.label}</span>
                        <strong style={{ color: '#0f172a', fontWeight: 700 }}>{r.score}%</strong>
                      </div>
                      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                        <div style={{ width: `${r.score}%`, height: '100%', background: '#0f172a', borderRadius: 9999 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ───────────────────────────────────────────────────────────
            5. DOCKED SPLIT-INSPECTOR RIGHT PANEL (Okafor Video & VERIQ / Halo)
        ─────────────────────────────────────────────────────────── */}
        {inspectorOpen && (
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              padding: '18px 20px',
              boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              alignSelf: 'start',
              position: 'sticky',
              top: 20,
            }}
          >
            {/* Right Panel Header with Segmented Tabs: [Candidate Dossier] | [Scout Copilot] */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
              <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: 2, borderRadius: 8 }}>
                <button
                  type="button"
                  onClick={() => setRightPanelTab('dossier')}
                  style={{
                    height: 26,
                    padding: '0 10px',
                    borderRadius: 6,
                    border: 'none',
                    background: rightPanelTab === 'dossier' ? '#ffffff' : 'transparent',
                    color: rightPanelTab === 'dossier' ? '#0f172a' : '#64748b',
                    fontSize: 12,
                    fontWeight: rightPanelTab === 'dossier' ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: rightPanelTab === 'dossier' ? '0 1px 2px rgba(15, 23, 42, 0.08)' : 'none',
                  }}
                >
                  Candidate Dossier
                </button>
                <button
                  type="button"
                  onClick={() => setRightPanelTab('copilot')}
                  style={{
                    height: 26,
                    padding: '0 10px',
                    borderRadius: 6,
                    border: 'none',
                    background: rightPanelTab === 'copilot' ? '#ffffff' : 'transparent',
                    color: rightPanelTab === 'copilot' ? '#4338ca' : '#64748b',
                    fontSize: 12,
                    fontWeight: rightPanelTab === 'copilot' ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: rightPanelTab === 'copilot' ? '0 1px 2px rgba(15, 23, 42, 0.08)' : 'none',
                  }}
                >
                  ✦ Scout Copilot
                </button>
              </div>

              <button
                type="button"
                onClick={() => setInspectorOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB CONTENT A: CANDIDATE DOSSIER (VERIQ HXG0UOSb0AAdrEk inspection standard) */}
            {rightPanelTab === 'dossier' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Profile Identity Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: '#0f172a',
                        color: '#ffffff',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 700,
                        fontSize: 15,
                      }}
                    >
                      {activeCandidate?.name ? activeCandidate.name.split(' ').map((n) => n[0]).join('') : 'C'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        {activeCandidate.name}
                      </h3>
                      <p style={{ fontSize: 12.5, color: '#64748b', margin: '2px 0 0 0' }}>
                        {activeCandidate.title}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: '#059669',
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      padding: '3px 8px',
                      borderRadius: 8,
                    }}
                  >
                    {activeCandidate.matchScore}% Fit
                  </span>
                </div>

                {/* Key Metadata Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 10,
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <span style={{ fontSize: 11, color: '#64748b' }}>Location:</span>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#0f172a' }}>{activeCandidate.location}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748b' }}>Experience:</span>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#0f172a' }}>{activeCandidate.experienceYears} Years Production</div>
                  </div>
                </div>

                {/* Quick Pipeline Stage Action Pills */}
                <div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Update Pipeline Stage
                  </span>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {(['Qualified', 'Shortlisted', 'Interviewing', 'Review'] as CandidateStatus[]).map((stage) => {
                      const isActive = activeCandidate.status === stage;
                      return (
                        <button
                          key={stage}
                          type="button"
                          onClick={() => handleStageChange(activeCandidate.id, stage)}
                          style={{
                            height: 28,
                            padding: '0 10px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: isActive ? 600 : 500,
                            border: isActive ? '1px solid #0f172a' : '1px solid #e2e8f0',
                            background: isActive ? '#0f172a' : '#ffffff',
                            color: isActive ? '#ffffff' : '#475569',
                            cursor: 'pointer',
                            transition: 'all 0.1s ease',
                          }}
                        >
                          {stage}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* VERIQ-Style Vetting Playbook Checklist (HXG0UOSb0AAdrEk) */}
                <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Vetting Playbook (3 of 5 Done)
                    </span>
                    <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>60% Completed</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                    {[
                      { title: 'Algorithmic Concurrency Verified', done: true, time: 'Aug 14' },
                      { title: 'Production Architecture Review', done: true, time: 'Aug 15' },
                      { title: 'Reference Director Check Completed', done: true, time: 'Yesterday' },
                      { title: 'Live Technical Pairing Round', done: false, time: 'Tomorrow 2:30 PM' },
                      { title: 'Executive Offer Calibration', done: false, time: 'Pending' },
                    ].map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: step.done ? '#1e293b' : '#64748b' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: step.done ? '#10b981' : '#cbd5e1' }}>{step.done ? '☑' : '☐'}</span>
                          <span style={{ textDecoration: step.done ? 'none' : 'none' }}>{step.title}</span>
                        </span>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>{step.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Executive Profile Synthesis */}
                <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Sparkles size={13} style={{ color: '#6366f1' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Candidate Profile Synthesis
                    </span>
                  </div>
                  <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    {activeCandidate.name} presents an exceptional match ({activeCandidate.matchScore}%) for the {activeCandidate.title} requisition. Verified background in {activeCandidate.skills.join(', ')} directly aligns with our scalability milestones.
                  </p>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => handleShortlist(activeCandidate.id)}
                    style={{
                      flex: 1,
                      height: 36,
                      borderRadius: 8,
                      border: 'none',
                      background: '#0f172a',
                      color: '#ffffff',
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Shortlist Candidate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      showToast('Dossier link copied to clipboard', 'info');
                    }}
                    style={{
                      height: 36,
                      padding: '0 12px',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      color: '#475569',
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <Copy size={13} />
                    <span>Copy Link</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT B: AI COPILOT INTERACTIVE DRAWER (Halo Reference HWyDSHebIAAJF8n) */}
            {rightPanelTab === 'copilot' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Copilot Header */}
                <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, color: '#6366f1' }}>✦</span>
                      <strong style={{ fontSize: 13, color: '#0f172a' }}>Scout Copilot</strong>
                    </div>
                    <span style={{ fontSize: 11, color: '#059669', background: '#ecfdf5', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
                      Reasoning Engine v2.4
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0 0' }}>
                    Autonomous candidate scoring, compensation benchmarking, and interview synthesis.
                  </p>
                </div>

                {/* Collapsible Thinking Trace (Halo style) */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setCopilotThoughtOpen(!copilotThoughtOpen)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>▾ Thought for 3.4 seconds</span>
                    <span style={{ fontSize: 10.5, color: '#94a3b8' }}>{copilotThoughtOpen ? 'Collapse' : 'Expand'}</span>
                  </button>
                  {copilotThoughtOpen && (
                    <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 6, lineHeight: 1.45, borderLeft: '2px solid #e2e8f0', paddingLeft: 8 }}>
                      Cross-referenced candidate portfolio against Requisition requirements. Verified 8 yrs React/Go concurrency experience. Zero bias signals detected across demographic axes.
                    </div>
                  )}
                </div>

                {/* Chat History Messages */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 260, overflowY: 'auto' }}>
                  {copilotMessages.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '92%',
                        background: msg.sender === 'user' ? '#f1f5f9' : '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 12,
                        padding: '10px 12px',
                        fontSize: 12.5,
                        color: '#0f172a',
                        lineHeight: 1.45,
                      }}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                {/* Quick Action Suggestion Chips (Halo style) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {['Generate scorecard', 'Compare with benchmark', 'Interview questions', 'Compensation calibration'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setCopilotMessages((prev) => [...prev, { sender: 'user', text: chip, time: 'Just now' }]);
                        setTimeout(() => {
                          setCopilotMessages((prev) => [
                            ...prev,
                            {
                              sender: 'ai',
                              text: `Here is the analysis for "${chip}": ${activeCandidate.name} has demonstrated verified capability with +14% score over standard industry benchmarks.`,
                              time: 'Just now',
                            },
                          ]);
                        }, 500);
                      }}
                      style={{
                        height: 24,
                        padding: '0 8px',
                        borderRadius: 6,
                        border: '1px solid #e2e8f0',
                        background: '#ffffff',
                        fontSize: 11,
                        color: '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Copilot Chat Input Composer */}
                <form onSubmit={handleCopilotSubmit} style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={copilotInput}
                    onChange={(e) => setCopilotInput(e.target.value)}
                    placeholder="Ask Scout Copilot about candidates..."
                    style={{
                      width: '100%',
                      height: 38,
                      paddingLeft: 12,
                      paddingRight: 40,
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      fontSize: 12.5,
                      outline: 'none',
                      color: '#0f172a',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      position: 'absolute',
                      right: 6,
                      top: 6,
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowUp size={14} />
                  </button>
                </form>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};
