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
  MessageSquare,
  Building,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import type { Candidate, CandidateStatus } from '../types';
import { CompetencyRadarChart } from '../components/studio/CompetencyRadarChart';

// Exact Palette Sampled from Reference Images (Halo HWyDSHebIAAJF8n, Gr8r HW5e_yKbQAAnb-T, Fintrack HW5zq3sasAArKrQ, VERIQ HXG0UOSb0AAdrEk)
const COLORS = {
  canvasBg: '#f6f7f9',
  cardBg: '#ffffff',
  subtleBg: '#f8f9fa',
  border: '#e5e7eb',
  borderDark: '#d1d5db',
  borderLight: '#f0f2f5',

  // Ink Typography
  ink: '#111827',
  textSecondary: '#4b5563',
  textMuted: '#6b7280',
  textLight: '#9ca3af',

  // Halo AI & Copilot Accents
  indigo: '#6366f1',
  indigoBg: '#eef2ff',
  indigoBorder: '#c7d2fe',

  // Gr8r & Halo Growth Emerald
  emerald: '#10b981',
  emeraldBg: '#ecfdf5',
  emeraldBorder: '#a7f3d0',
  emeraldText: '#047857',

  // Gr8r High Priority Rose / Halo Churn Loss
  rose: '#e11d48',
  roseBg: '#fff1f2',
  roseBorder: '#fecdd3',
  roseText: '#be123c',

  // Amber Warning / Medium Priority / Schedule
  amber: '#d97706',
  amberBg: '#fffbeb',
  amberBorder: '#fde68a',
  amberText: '#b45309',

  // BRICK Royal Blue & Cobalt
  cobalt: '#2563eb',
  cobaltBg: '#eff6ff',
  cobaltBorder: '#bfdbfe',
  cobaltText: '#1d4ed8',

  // Review & Architecture Purple
  purple: '#8b5cf6',
  purpleBg: '#f5f3ff',
  purpleBorder: '#ddd6fe',
  purpleText: '#6d28d9',
};

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

  // AI Copilot interactive chat state (Halo reference HWyDSHebIAAJF8n)
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
    showToast(`Updated stage for ${candidates.find((c) => c.id === candId)?.name || 'candidate'} to "${newStage}"`, 'success');
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
    { id: 'Qualified', label: 'Screened & Qualified', dotColor: COLORS.cobalt, bgTint: COLORS.cobaltBg },
    { id: 'Shortlisted', label: 'Shortlisted for Review', dotColor: COLORS.emerald, bgTint: COLORS.emeraldBg },
    { id: 'Interviewing', label: 'Technical Assessment', dotColor: COLORS.amber, bgTint: COLORS.amberBg },
    { id: 'Review', label: 'Hiring Manager Review', dotColor: COLORS.purple, bgTint: COLORS.purpleBg },
    { id: 'Archived', label: 'Talent Pool Archive', dotColor: COLORS.textMuted, bgTint: COLORS.subtleBg },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        fontFamily: 'var(--font-family-base, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        color: COLORS.ink,
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
          background: COLORS.cardBg,
          borderRadius: 16,
          border: `1px solid ${COLORS.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${COLORS.ink} 0%, #1e293b 100%)`,
              display: 'grid',
              placeItems: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(17, 24, 39, 0.2)',
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
                  color: COLORS.ink,
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
                  color: COLORS.emeraldText,
                  background: COLORS.emeraldBg,
                  border: `1px solid ${COLORS.emeraldBorder}`,
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
                    background: COLORS.emerald,
                    boxShadow: `0 0 6px ${COLORS.emerald}`,
                  }}
                />
                Autonomous Engine Active
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: COLORS.textMuted, margin: '2px 0 0 0' }}>
              Autonomous pipeline orchestration across {jobs.length} active requisitions, automated talent indexing, and split-screen dossier intelligence.
            </p>
          </div>
        </div>

        {/* Action Controls & Connectors (Lucas Dan Popover HW1HwNUXMAEd2Dv) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          {/* Connectors Trigger */}
          <button
            type="button"
            onClick={() => setConnectorsOpen(!connectorsOpen)}
            style={{
              height: 36,
              padding: '0 13px',
              borderRadius: 8,
              border: `1px solid ${COLORS.border}`,
              background: connectorsOpen ? COLORS.subtleBg : COLORS.cardBg,
              color: COLORS.ink,
              fontSize: 12.5,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: COLORS.emerald }} />
            <span>Connectors (5 Active)</span>
            <ChevronDown size={13} style={{ color: COLORS.textLight }} />
          </button>

          {/* Connectors Popover Dropdown (Exact Lucas Dan reference HW1HwNUXMAEd2Dv) */}
          {connectorsOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 140,
                width: 300,
                background: COLORS.cardBg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                boxShadow: '0 16px 40px -8px rgba(0, 0, 0, 0.12), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
                padding: '14px',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: COLORS.ink,
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>ATS & System Connectors</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: COLORS.emeraldText, background: COLORS.emeraldBg, padding: '1px 6px', borderRadius: 4 }}>
                  Real-time Sync
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { name: 'Google Workspace', status: 'Connected', icon: '🌐' },
                  { name: 'GitHub Repositories', status: 'Connected', icon: '🐙' },
                  { name: 'Greenhouse ATS', status: 'Connected', icon: '🌿' },
                  { name: 'Ashby Recruitment', status: 'Connect', icon: '⚡' },
                  { name: 'Lever Recruiter', status: 'Connect', icon: '📑' },
                  { name: 'Claude 3.7 Intelligence', status: 'Connected', icon: '✦' },
                ].map((conn) => (
                  <div
                    key={conn.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 9px',
                      borderRadius: 8,
                      background: COLORS.subtleBg,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15 }}>{conn.icon}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: COLORS.ink }}>{conn.name}</span>
                    </div>
                    {conn.status === 'Connected' ? (
                      <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.emeraldText, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: COLORS.emerald }} />
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
                          border: `1px solid ${COLORS.border}`,
                          background: COLORS.cardBg,
                          color: COLORS.ink,
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
                  background: COLORS.subtleBg,
                  color: COLORS.textSecondary,
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
              borderRadius: 8,
              border: rightPanelTab === 'copilot' && inspectorOpen ? `1px solid ${COLORS.indigo}` : `1px solid ${COLORS.border}`,
              background: rightPanelTab === 'copilot' && inspectorOpen ? COLORS.indigoBg : COLORS.cardBg,
              color: rightPanelTab === 'copilot' && inspectorOpen ? COLORS.indigo : COLORS.ink,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Bot size={14} style={{ color: COLORS.indigo }} />
            <span>AI Copilot</span>
          </button>

          {/* Primary Action Button (Gr8r Solid Black #111827) */}
          <button
            type="button"
            onClick={() => navigate('create-job')}
            style={{
              height: 36,
              padding: '0 16px',
              borderRadius: 8,
              border: 'none',
              background: COLORS.ink,
              color: '#ffffff',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.12)',
              transition: 'all 0.12s ease',
            }}
          >
            <span>+ Candidate Ingestion</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          2. EXECUTIVE HERO KPI TILES (Fintrack HW5zq3sasAArKrQ & Halo)
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
            background: COLORS.cardBg,
            borderRadius: 16,
            border: `1px solid ${COLORS.border}`,
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              • Active Talent Pool
            </span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: COLORS.emeraldText,
                background: COLORS.emeraldBg,
                border: `1px solid ${COLORS.emeraldBorder}`,
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
            <span style={{ fontSize: 34, fontWeight: 800, color: COLORS.ink, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              48
            </span>
            <span style={{ fontSize: 13, color: COLORS.textMuted }}>evaluated profiles</span>
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
                      background: dot ? (colIdx >= 8 ? COLORS.amber : COLORS.ink) : '#e2e8f0',
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
            background: COLORS.cardBg,
            borderRadius: 16,
            border: `1px solid ${COLORS.border}`,
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              • Quality Fit Benchmark
            </span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: COLORS.emeraldText,
                background: COLORS.emeraldBg,
                border: `1px solid ${COLORS.emeraldBorder}`,
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
            <span style={{ fontSize: 34, fontWeight: 800, color: COLORS.ink, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              91.4%
            </span>
            <span style={{ fontSize: 13, color: COLORS.textMuted }}>top tier accuracy</span>
          </div>
          <div style={{ height: 6, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '78%', background: COLORS.emerald }} />
            <div style={{ width: '13.4%', background: '#06b6d4' }} />
          </div>
        </div>

        {/* Metric 3: Velocity (Time to Hire) */}
        <div
          style={{
            background: COLORS.cardBg,
            borderRadius: 16,
            border: `1px solid ${COLORS.border}`,
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              • Velocity (Offer Cycle)
            </span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: COLORS.emeraldText,
                background: COLORS.emeraldBg,
                border: `1px solid ${COLORS.emeraldBorder}`,
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
            <span style={{ fontSize: 34, fontWeight: 800, color: COLORS.ink, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              16.2 Days
            </span>
            <span style={{ fontSize: 13, color: COLORS.textMuted }}>time to hire</span>
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Industry baseline:</span>
            <strong style={{ color: COLORS.ink, fontWeight: 600 }}>32.0 Days (-49.4%)</strong>
          </div>
        </div>

        {/* Metric 4: Scheduled Sessions */}
        <div
          style={{
            background: COLORS.cardBg,
            borderRadius: 16,
            border: `1px solid ${COLORS.border}`,
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              • Scheduled Sessions
            </span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: COLORS.amberText,
                background: COLORS.amberBg,
                border: `1px solid ${COLORS.amberBorder}`,
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
            <span style={{ fontSize: 34, fontWeight: 800, color: COLORS.ink, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              {interviews.filter((i) => i.status === 'Scheduled').length}
            </span>
            <span style={{ fontSize: 13, color: COLORS.textMuted }}>active rounds</span>
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Next: <strong style={{ color: COLORS.ink }}>Ananya Sharma (Tomorrow 2:30 PM)</strong>
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
          background: COLORS.cardBg,
          borderRadius: 14,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        {/* Left: View Switcher (Board | Waterfall Analytics | Table Grid | Radar Matrix) */}
        <div style={{ display: 'inline-flex', background: '#f3f4f6', padding: 3, borderRadius: 8, gap: 2 }}>
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
                  borderRadius: 6,
                  border: 'none',
                  background: active ? '#ffffff' : 'transparent',
                  color: active ? COLORS.ink : COLORS.textMuted,
                  fontSize: 12.5,
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: active ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                  transition: 'all 0.12s ease',
                }}
              >
                <Icon size={14} style={{ color: active ? COLORS.ink : COLORS.textLight }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Middle: Live Search Bar */}
        <div style={{ position: 'relative', minWidth: 260, flex: 1, maxWidth: 380 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: 9, color: COLORS.textLight }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter candidates by name, skill, role... (⌘K)"
            style={{
              width: '100%',
              height: 32,
              paddingLeft: 32,
              paddingRight: 28,
              borderRadius: 8,
              border: `1px solid ${COLORS.border}`,
              background: COLORS.subtleBg,
              fontSize: 12.5,
              outline: 'none',
              color: COLORS.ink,
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 8, top: 8, background: 'none', border: 'none', color: COLORS.textLight, cursor: 'pointer' }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Right: Department Filter Pills */}
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
                border: departmentFilter === dept ? `1px solid ${COLORS.ink}` : `1px solid ${COLORS.border}`,
                background: departmentFilter === dept ? COLORS.ink : '#ffffff',
                color: departmentFilter === dept ? '#ffffff' : COLORS.textSecondary,
                cursor: 'pointer',
                transition: 'all 0.1s ease',
              }}
            >
              {dept}
            </button>
          ))}
          <div style={{ width: 1, height: 18, background: COLORS.border, margin: '0 4px' }} />
          <button
            type="button"
            onClick={() => setInspectorOpen(!inspectorOpen)}
            style={{
              height: 28,
              padding: '0 10px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              border: `1px solid ${COLORS.border}`,
              background: inspectorOpen ? '#f1f5f9' : '#ffffff',
              color: COLORS.textSecondary,
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
                      background: COLORS.subtleBg,
                      borderRadius: 14,
                      border: `1px solid ${COLORS.border}`,
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
                        <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink }}>{col.label}</span>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: COLORS.textSecondary,
                          background: '#ffffff',
                          border: `1px solid ${COLORS.border}`,
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
                        border: `1px dashed ${COLORS.borderDark}`,
                        background: '#ffffff',
                        color: COLORS.textMuted,
                        fontSize: 11.5,
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.textMuted)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.borderDark)}
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
                            color: COLORS.textLight,
                            border: `1px dashed ${COLORS.border}`,
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
                                background: COLORS.cardBg,
                                borderRadius: 12,
                                border: isSelected ? `1.5px solid ${COLORS.ink}` : `1px solid ${COLORS.border}`,
                                padding: '14px',
                                boxShadow: isSelected
                                  ? '0 4px 14px -2px rgba(17, 24, 39, 0.1)'
                                  : '0 1px 3px rgba(0, 0, 0, 0.03)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 9,
                                transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) e.currentTarget.style.borderColor = COLORS.borderDark;
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) e.currentTarget.style.borderColor = COLORS.border;
                              }}
                            >
                              {/* Top row: Priority Tag + Match Badge (Gr8r Exact Colors) */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <span
                                    style={{
                                      fontSize: 10.5,
                                      fontWeight: 700,
                                      color: cand.matchScore >= 90 ? COLORS.roseText : COLORS.amberText,
                                      background: cand.matchScore >= 90 ? COLORS.roseBg : COLORS.amberBg,
                                      border: `1px solid ${cand.matchScore >= 90 ? COLORS.roseBorder : COLORS.amberBorder}`,
                                      padding: '2px 6px',
                                      borderRadius: 4,
                                      letterSpacing: '0.02em',
                                    }}
                                  >
                                    {cand.matchScore >= 90 ? 'High Priority' : 'Qualified'}
                                  </span>
                                  <span style={{ fontSize: 11, color: COLORS.textMuted }}>
                                    {cand.title.includes('Frontend') ? 'UI Design' : cand.title.includes('AI') ? 'Cognitive ML' : 'Distributed'}
                                  </span>
                                </div>
                                <span
                                  style={{
                                    fontSize: 11.5,
                                    fontWeight: 700,
                                    color: COLORS.emeraldText,
                                    background: COLORS.emeraldBg,
                                    border: `1px solid ${COLORS.emeraldBorder}`,
                                    padding: '1px 6px',
                                    borderRadius: 6,
                                  }}
                                >
                                  {cand.matchScore}%
                                </span>
                              </div>

                              {/* Requisition line */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: COLORS.textMuted }}>
                                <Building size={11} />
                                <span>{cand.title.includes('Frontend') ? 'HyperScale Fintech' : 'FinFlow Global'} · {cand.title}</span>
                              </div>

                              {/* Candidate Name & Title */}
                              <div>
                                <h4 style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.ink, margin: 0 }}>
                                  {cand.name}
                                </h4>
                                <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: '2px 0 0 0', lineHeight: 1.4 }}>
                                  Specialized in low-latency event-driven architecture, state hydration, and micro-frontends.
                                </p>
                              </div>

                              {/* Skills chips */}
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {cand.skills.slice(0, 3).map((s) => (
                                  <span
                                    key={s}
                                    style={{
                                      fontSize: 10.5,
                                      color: COLORS.textSecondary,
                                      background: '#f1f5f9',
                                      padding: '2px 6px',
                                      borderRadius: 4,
                                    }}
                                  >
                                    {s}
                                  </span>
                                ))}
                                {cand.skills.length > 3 && (
                                  <span style={{ fontSize: 10.5, color: COLORS.textLight, padding: '2px 4px' }}>
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
                                  borderTop: `1px solid ${COLORS.borderLight}`,
                                  paddingTop: 8,
                                  fontSize: 11,
                                  color: COLORS.textMuted,
                                }}
                              >
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                  <MapPin size={11} />
                                  {cand.location.split(',')[0]}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                    <MessageSquare size={11} /> 2
                                  </span>
                                  <span style={{ fontWeight: 600, color: COLORS.ink }}>
                                    {cand.experienceYears}y exp
                                  </span>
                                </div>
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
                    background: COLORS.cardBg,
                    borderRadius: 16,
                    border: `1px solid ${COLORS.border}`,
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.ink, margin: 0 }}>
                        Pipeline Movement Waterfall
                      </h3>
                      <p style={{ fontSize: 12, color: COLORS.textMuted, margin: '2px 0 0 0' }}>
                        Aug 1 → Aug 16 · Total Talent Flow Progression
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10, fontSize: 11.5 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: COLORS.emeraldText }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: COLORS.emerald }} /> Inflow
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: COLORS.roseText }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: COLORS.rose }} /> Drop-off
                      </span>
                    </div>
                  </div>

                  {/* Waterfall Bar Graph */}
                  <div style={{ height: 210, display: 'flex', alignItems: 'flex-end', gap: 16, padding: '20px 10px 0 10px', borderBottom: `1px solid ${COLORS.borderLight}` }}>
                    {[
                      { label: 'Initial Sourced', val: '+142', height: 160, color: '#60a5fa' },
                      { label: 'Screen Passed', val: '+38', height: 85, color: '#34d399' },
                      { label: 'Comp Mismatch', val: '-19', height: 45, color: '#fb7185' },
                      { label: 'Culture Drop', val: '-8', height: 28, color: '#f43f5e' },
                      { label: 'Active Pipeline', val: '48 Pool', height: 130, color: COLORS.ink },
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
                        <span style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 8, textAlign: 'center', whiteSpace: 'nowrap' }}>
                          {bar.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Card: Domain Distribution Donut (Halo style) */}
                <div
                  style={{
                    background: COLORS.cardBg,
                    borderRadius: 16,
                    border: `1px solid ${COLORS.border}`,
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.ink, margin: 0 }}>
                    Talent Mix by Department
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '16px 0' }}>
                    {/* SVG Donut with center text */}
                    <svg width="140" height="140" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                      <circle cx="50" cy="50" r="38" fill="none" stroke={COLORS.ink} strokeWidth="12" strokeDasharray="120 240" strokeDashoffset="0" />
                      <circle cx="50" cy="50" r="38" fill="none" stroke={COLORS.emerald} strokeWidth="12" strokeDasharray="60 240" strokeDashoffset="-120" />
                      <circle cx="50" cy="50" r="38" fill="none" stroke={COLORS.amber} strokeWidth="12" strokeDasharray="40 240" strokeDashoffset="-180" />
                      <text x="50" y="48" textAnchor="middle" fontSize="13" fontWeight="800" fill={COLORS.ink}>48</text>
                      <text x="50" y="60" textAnchor="middle" fontSize="8" fill={COLORS.textMuted}>CANDIDATES</text>
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.ink }} />
                        Engineering & Tech
                      </span>
                      <strong style={{ color: COLORS.ink }}>24 (50%)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.emerald }} />
                        Cognitive AI & ML
                      </span>
                      <strong style={{ color: COLORS.ink }}>14 (29%)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.amber }} />
                        Design Systems & PM
                      </span>
                      <strong style={{ color: COLORS.ink }}>10 (21%)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recruitment Conversion Table (Halo Recent Invoices standard) */}
              <div
                style={{
                  background: COLORS.cardBg,
                  borderRadius: 16,
                  border: `1px solid ${COLORS.border}`,
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.ink, margin: 0 }}>
                    Active Conversion Stages
                  </h3>
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>Benchmark pass rate: 33.4%</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                  {[
                    { stage: '1. Sourced Ingestion', count: 142, rate: '100%', color: COLORS.cobalt },
                    { stage: '2. Screened & Qualified', count: 48, rate: '33.8%', color: COLORS.emerald },
                    { stage: '3. Shortlisted for Client', count: 24, rate: '16.9%', color: COLORS.indigo },
                    { stage: '4. Technical Assessment', count: 12, rate: '8.4%', color: COLORS.amber },
                    { stage: '5. Offer Negotiation', count: 4, rate: '2.8%', color: COLORS.purple },
                  ].map((s) => (
                    <div key={s.stage} style={{ padding: '12px', background: COLORS.subtleBg, borderRadius: 10, border: `1px solid ${COLORS.border}` }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted }}>{s.stage}</span>
                      <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.ink, margin: '4px 0' }}>{s.count}</div>
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
                background: COLORS.cardBg,
                borderRadius: 16,
                border: `1px solid ${COLORS.border}`,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: COLORS.subtleBg, borderBottom: `1px solid ${COLORS.border}` }}>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: COLORS.textSecondary, fontSize: 11.5, textTransform: 'uppercase' }}>Candidate</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: COLORS.textSecondary, fontSize: 11.5, textTransform: 'uppercase' }}>Target Requisition</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: COLORS.textSecondary, fontSize: 11.5, textTransform: 'uppercase' }}>Experience</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: COLORS.textSecondary, fontSize: 11.5, textTransform: 'uppercase' }}>Key Skills</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: COLORS.textSecondary, fontSize: 11.5, textTransform: 'uppercase' }}>Match</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: COLORS.textSecondary, fontSize: 11.5, textTransform: 'uppercase' }}>Stage</th>
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
                        borderBottom: `1px solid ${COLORS.borderLight}`,
                        cursor: 'pointer',
                        background: selectedCandidateId === c.id ? COLORS.subtleBg : 'transparent',
                        transition: 'background 0.1s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.subtleBg)}
                      onMouseLeave={(e) => {
                        if (selectedCandidateId !== c.id) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: COLORS.ink, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>
                            {c.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: COLORS.ink }}>{c.name}</div>
                            <div style={{ fontSize: 11.5, color: COLORS.textMuted }}>{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: COLORS.textSecondary, fontWeight: 500 }}>{c.title}</td>
                      <td style={{ padding: '12px 16px', color: COLORS.textMuted }}>{c.experienceYears} Years</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {c.skills.slice(0, 2).map((s) => (
                            <span key={s} style={{ fontSize: 11, background: '#f1f5f9', color: COLORS.textSecondary, padding: '2px 6px', borderRadius: 4 }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.emeraldText, background: COLORS.emeraldBg, padding: '2px 7px', borderRadius: 6 }}>
                          {c.matchScore}%
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: COLORS.ink }}>{c.status}</span>
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
                background: COLORS.cardBg,
                borderRadius: 16,
                border: `1px solid ${COLORS.border}`,
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, margin: 0 }}>
                  Multi-Dimensional Competency Polygon: {activeCandidate.name}
                </h3>
                <p style={{ fontSize: 12.5, color: COLORS.textMuted, margin: '4px 0 0 0' }}>
                  Evaluated across 5 core technical axes against {activeCandidate.title} requirements.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 30, alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <CompetencyRadarChart candidate={activeCandidate} size={280} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
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
                        <span style={{ color: COLORS.textSecondary, fontWeight: 500 }}>{r.label}</span>
                        <strong style={{ color: COLORS.ink, fontWeight: 700 }}>{r.score}%</strong>
                      </div>
                      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                        <div style={{ width: `${r.score}%`, height: '100%', background: COLORS.ink, borderRadius: 9999 }} />
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
              background: COLORS.cardBg,
              borderRadius: 16,
              border: `1px solid ${COLORS.border}`,
              padding: '18px 20px',
              boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              alignSelf: 'start',
              position: 'sticky',
              top: 20,
            }}
          >
            {/* Right Panel Header with Segmented Tabs: [Candidate Dossier] | [Scout Copilot] */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${COLORS.borderLight}`, paddingBottom: 12 }}>
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
                    color: rightPanelTab === 'dossier' ? COLORS.ink : COLORS.textMuted,
                    fontSize: 12,
                    fontWeight: rightPanelTab === 'dossier' ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: rightPanelTab === 'dossier' ? '0 1px 2px rgba(0, 0, 0, 0.08)' : 'none',
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
                    color: rightPanelTab === 'copilot' ? COLORS.indigo : COLORS.textMuted,
                    fontSize: 12,
                    fontWeight: rightPanelTab === 'copilot' ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: rightPanelTab === 'copilot' ? '0 1px 2px rgba(0, 0, 0, 0.08)' : 'none',
                  }}
                >
                  ✦ Scout Copilot
                </button>
              </div>

              <button
                type="button"
                onClick={() => setInspectorOpen(false)}
                style={{ background: 'none', border: 'none', color: COLORS.textLight, cursor: 'pointer', padding: 4 }}
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
                        background: COLORS.ink,
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
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, margin: 0 }}>
                        {activeCandidate.name}
                      </h3>
                      <p style={{ fontSize: 12.5, color: COLORS.textMuted, margin: '2px 0 0 0' }}>
                        {activeCandidate.title}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: COLORS.emeraldText,
                      background: COLORS.emeraldBg,
                      border: `1px solid ${COLORS.emeraldBorder}`,
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
                    background: COLORS.subtleBg,
                    borderRadius: 12,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 11, color: COLORS.textMuted }}>Location:</span>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.ink }}>{activeCandidate.location}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: COLORS.textMuted }}>Experience:</span>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.ink }}>{activeCandidate.experienceYears} Years Production</div>
                  </div>
                </div>

                {/* Quick Pipeline Stage Action Pills */}
                <div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
                            border: isActive ? `1px solid ${COLORS.ink}` : `1px solid ${COLORS.border}`,
                            background: isActive ? COLORS.ink : '#ffffff',
                            color: isActive ? '#ffffff' : COLORS.textSecondary,
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
                <div style={{ background: COLORS.subtleBg, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.ink, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Vetting Playbook (3 of 5 Done)
                    </span>
                    <span style={{ fontSize: 11, color: COLORS.emeraldText, fontWeight: 600 }}>60% Completed</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                    {[
                      { title: 'Algorithmic Concurrency Verified', done: true, time: 'Aug 14' },
                      { title: 'Production Architecture Review', done: true, time: 'Aug 15' },
                      { title: 'Reference Director Check Completed', done: true, time: 'Yesterday' },
                      { title: 'Live Technical Pairing Round', done: false, time: 'Tomorrow 2:30 PM' },
                      { title: 'Executive Offer Calibration', done: false, time: 'Pending' },
                    ].map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: step.done ? COLORS.ink : COLORS.textMuted }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: step.done ? COLORS.emerald : COLORS.textLight }}>{step.done ? '☑' : '☐'}</span>
                          <span>{step.title}</span>
                        </span>
                        <span style={{ fontSize: 11, color: COLORS.textLight }}>{step.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Executive Profile Synthesis */}
                <div style={{ background: COLORS.subtleBg, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Sparkles size={13} style={{ color: COLORS.indigo }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.ink, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Candidate Profile Synthesis
                    </span>
                  </div>
                  <p style={{ fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 1.5, margin: 0 }}>
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
                      background: COLORS.ink,
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
                      border: `1px solid ${COLORS.border}`,
                      background: '#ffffff',
                      color: COLORS.textSecondary,
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
                <div style={{ background: COLORS.subtleBg, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, color: COLORS.indigo }}>✦</span>
                      <strong style={{ fontSize: 13, color: COLORS.ink }}>Scout Copilot</strong>
                    </div>
                    <span style={{ fontSize: 11, color: COLORS.emeraldText, background: COLORS.emeraldBg, padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
                      Reasoning Engine v2.4
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: COLORS.textMuted, margin: '4px 0 0 0' }}>
                    Autonomous candidate scoring, compensation benchmarking, and interview synthesis.
                  </p>
                </div>

                {/* Collapsible Thinking Trace (Halo style) */}
                <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setCopilotThoughtOpen(!copilotThoughtOpen)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: COLORS.textMuted,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>▾ Thought for 3.4 seconds</span>
                    <span style={{ fontSize: 10.5, color: COLORS.textLight }}>{copilotThoughtOpen ? 'Collapse' : 'Expand'}</span>
                  </button>
                  {copilotThoughtOpen && (
                    <div style={{ fontSize: 11.5, color: COLORS.textMuted, marginTop: 6, lineHeight: 1.45, borderLeft: `2px solid ${COLORS.indigo}`, paddingLeft: 8 }}>
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
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 12,
                        padding: '10px 12px',
                        fontSize: 12.5,
                        color: COLORS.ink,
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
                        border: `1px solid ${COLORS.border}`,
                        background: '#ffffff',
                        fontSize: 11,
                        color: COLORS.textSecondary,
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
                      border: `1px solid ${COLORS.borderDark}`,
                      background: '#ffffff',
                      fontSize: 12.5,
                      outline: 'none',
                      color: COLORS.ink,
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
                      background: COLORS.ink,
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
