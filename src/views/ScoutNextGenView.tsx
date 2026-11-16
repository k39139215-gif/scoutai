import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Kanban,
  Table as TableIcon,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Send,
  Copy,
  X,
  MapPin,
  ChevronDown,
  Layers,
  Bot,
  ArrowUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import type { CandidateStatus } from '../types';
import { CompetencyRadarChart } from '../components/studio/CompetencyRadarChart';

export const ScoutNextGenView: React.FC = () => {
  const { candidates, jobs, interviews, shortlistCandidate, updateCandidateStatus, navigate } = useApp();
  const { showToast } = useToast();

  // Primary navigation & view states
  const [viewMode, setViewMode] = useState<'board' | 'table' | 'radar'>('board');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(candidates[0]?.id || null);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [connectorsOpen, setConnectorsOpen] = useState(false);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // AI Copilot interactive chat state
  const [copilotThoughtOpen, setCopilotThoughtOpen] = useState(true);
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Good evening, Aarav. I evaluated 48 pipeline candidates across your 6 open requisitions. Ananya Sharma and Rajesh Menon currently lead the technical fit indices with 94% and 88% accuracy scores.',
      time: 'Just now',
    },
  ]);

  // Selected candidate object
  const activeCandidate = useMemo(() => {
    return candidates.find((c) => c.id === selectedCandidateId) || candidates[0] || null;
  }, [candidates, selectedCandidateId]);

  // Filtered candidate list
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

  // Handle stage drop or move
  const handleStageChange = (candId: string, newStage: CandidateStatus) => {
    updateCandidateStatus(candId, newStage);
  };

  // Handle Copilot question submission
  const handleCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;

    const userText = copilotInput.trim();
    setCopilotInput('');
    setCopilotMessages((prev) => [...prev, { sender: 'user', text: userText, time: 'Just now' }]);

    setTimeout(() => {
      let reply = `Based on our candidate ontology, ${activeCandidate?.name || 'the candidate'} has verified production competency in ${activeCandidate?.skills.slice(0, 3).join(', ') || 'core domains'}. Recommended next step: schedule technical panel round.`;
      if (userText.toLowerCase().includes('scorecard')) {
        reply = `Technical scorecard generated for ${activeCandidate?.name}: 5 evaluation nodes established (Distributed concurrency, state hydration, unit test coverage, architectural trade-offs, and communication).`;
      } else if (userText.toLowerCase().includes('compare')) {
        reply = `Compared against benchmark: ${activeCandidate?.name} holds +12% higher algorithmic efficiency rating with zero detected bias variance.`;
      }
      setCopilotMessages((prev) => [...prev, { sender: 'ai', text: reply, time: 'Just now' }]);
    }, 600);
  };

  // Kanban pipeline columns
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
        maxWidth: 1600,
        margin: '0 auto',
      }}
    >
      {/* 1. Next-Gen Executive Context Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          padding: '16px 20px',
          background: '#ffffff',
          borderRadius: 14,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#0f172a',
              display: 'grid',
              placeItems: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.2)',
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
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
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                Autonomous Engine Active
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: '#64748b', margin: '2px 0 0 0' }}>
              Real-time pipeline orchestration across {jobs.length} active requisitions, automated talent indexing, and split-screen dossier intelligence.
            </p>
          </div>
        </div>

        {/* Action Controls & Connectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          {/* Connectors Popover Trigger */}
          <button
            type="button"
            onClick={() => setConnectorsOpen(!connectorsOpen)}
            style={{
              height: 34,
              padding: '0 12px',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#334155',
              fontSize: 12.5,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
            <span>Connectors (5 Active)</span>
            <ChevronDown size={13} style={{ color: '#94a3b8' }} />
          </button>

          {/* Connectors Dropdown Popover (Inspired by Lucas Dan Reference) */}
          {connectorsOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 120,
                width: 280,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.14), 0 4px 10px -2px rgba(15, 23, 42, 0.05)',
                padding: '12px',
                zIndex: 100,
                animation: 'boarduiDropdownEnter 160ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8, padding: '0 4px' }}>
                Active ATS Connectors
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { name: 'Google Meet', status: 'Connected', icon: '📹' },
                  { name: 'LinkedIn Recruiter', status: 'Connected', icon: '💼' },
                  { name: 'GitHub Enterprise', status: 'Connected', icon: '🐙' },
                  { name: 'Slack Notifications', status: 'Connected', icon: '💬' },
                  { name: 'Claude Model Hub', status: 'Connected', icon: '🤖' },
                ].map((item) => (
                  <div
                    key={item.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 8px',
                      borderRadius: 6,
                      fontSize: 12.5,
                      color: '#0f172a',
                      background: '#f8fafc',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{item.icon}</span>
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981' }} />
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setConnectorsOpen(false);
                  showToast('ATS connectors synchronized with workspace.', 'success');
                }}
                style={{
                  width: '100%',
                  marginTop: 10,
                  height: 30,
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: '#334155',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                }}
              >
                Sync All Connectors
              </button>
            </div>
          )}

          {/* AI Copilot Toggle Button */}
          <button
            type="button"
            onClick={() => setCopilotOpen(!copilotOpen)}
            style={{
              height: 34,
              padding: '0 12px',
              borderRadius: 8,
              border: copilotOpen ? '1px solid #4338ca' : '1px solid #e2e8f0',
              background: copilotOpen ? '#eef2ff' : '#ffffff',
              color: copilotOpen ? '#4338ca' : '#334155',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
            }}
          >
            <Bot size={15} style={{ color: copilotOpen ? '#4338ca' : '#64748b' }} />
            <span>AI Copilot</span>
          </button>

          {/* Quick Primary Button */}
          <button
            type="button"
            onClick={() => navigate('candidates')}
            style={{
              height: 34,
              padding: '0 14px',
              borderRadius: 8,
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.15)',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#1e293b')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#0f172a')}
          >
            <span>+ Candidate Ingestion</span>
          </button>
        </div>
      </div>

      {/* 2. Hero KPI Metric Cards (Halo & Fintrack Craft) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        {/* Metric 1 */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 14,
            border: '1px solid #e2e8f0',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
            <span style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              {candidates.length * 8}
            </span>
            <span style={{ fontSize: 13, color: '#64748b' }}>evaluated profiles</span>
          </div>
          {/* Dot-matrix style SVG Sparkline (Fintrack aesthetic) */}
          <div style={{ height: 26, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
            {[35, 45, 30, 60, 55, 75, 70, 85, 90, 80, 95, 100].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: i >= 9 ? '#0f172a' : '#e2e8f0',
                  borderRadius: 2,
                  transition: 'height 0.2s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Metric 2 */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 14,
            border: '1px solid #e2e8f0',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
            <span style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              91.4%
            </span>
            <span style={{ fontSize: 13, color: '#64748b' }}>top tier accuracy</span>
          </div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: 6, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ width: '91.4%', height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', borderRadius: 9999 }} />
          </div>
        </div>

        {/* Metric 3 */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 14,
            border: '1px solid #e2e8f0',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
            <span style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              16.2 Days
            </span>
            <span style={{ fontSize: 13, color: '#64748b' }}>time to hire</span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            Industry baseline: <strong style={{ color: '#334155' }}>32.0 Days</strong>
          </div>
        </div>

        {/* Metric 4 */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 14,
            border: '1px solid #e2e8f0',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Scheduled Sessions
            </span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: '#d97706',
                background: '#fffbeb',
                border: '1px solid #fde68a',
                padding: '2px 7px',
                borderRadius: 9999,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Calendar size={12} />
              {interviews.length} Scheduled
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              {interviews.length}
            </span>
            <span style={{ fontSize: 13, color: '#64748b' }}>active rounds</span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            Next: <strong style={{ color: '#334155' }}>Ananya Sharma (2:30 PM)</strong>
          </div>
        </div>
      </div>

      {/* 3. Filter & View Switcher Bar (Gr8r Studio & Acme Taste) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '12px 16px',
          background: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Left: View Mode Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f1f5f9', padding: 3, borderRadius: 8 }}>
          <button
            type="button"
            onClick={() => setViewMode('board')}
            style={{
              height: 28,
              padding: '0 12px',
              borderRadius: 6,
              border: 'none',
              background: viewMode === 'board' ? '#ffffff' : 'transparent',
              color: viewMode === 'board' ? '#0f172a' : '#64748b',
              fontWeight: viewMode === 'board' ? 600 : 500,
              fontSize: 12.5,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: viewMode === 'board' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.12s ease',
            }}
          >
            <Kanban size={13} />
            <span>Board</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('table')}
            style={{
              height: 28,
              padding: '0 12px',
              borderRadius: 6,
              border: 'none',
              background: viewMode === 'table' ? '#ffffff' : 'transparent',
              color: viewMode === 'table' ? '#0f172a' : '#64748b',
              fontWeight: viewMode === 'table' ? 600 : 500,
              fontSize: 12.5,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: viewMode === 'table' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.12s ease',
            }}
          >
            <TableIcon size={13} />
            <span>Table Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('radar')}
            style={{
              height: 28,
              padding: '0 12px',
              borderRadius: 6,
              border: 'none',
              background: viewMode === 'radar' ? '#ffffff' : 'transparent',
              color: viewMode === 'radar' ? '#0f172a' : '#64748b',
              fontWeight: viewMode === 'radar' ? 600 : 500,
              fontSize: 12.5,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: viewMode === 'radar' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.12s ease',
            }}
          >
            <Sparkles size={13} />
            <span>Radar Matrix</span>
          </button>
        </div>

        {/* Center: Search input */}
        <div style={{ position: 'relative', width: 280, maxWidth: '100%' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: 10, color: '#94a3b8' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter candidates by name, skill, role..."
            style={{
              width: '100%',
              height: 32,
              paddingLeft: 30,
              paddingRight: 28,
              borderRadius: 6,
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

        {/* Right: Department & Stage filter tags */}
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

      {/* 4. Main Body: Split-Screen Architecture (Board/Table on Left, Inspector on Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: inspectorOpen ? 'minmax(0, 1fr) 420px' : 'minmax(0, 1fr)',
          gap: 20,
          alignItems: 'start',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Left Section: Active View Mode */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          {/* A. Kanban Board View */}
          {viewMode === 'board' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 14,
                overflowX: 'auto',
                paddingBottom: 8,
              }}
            >
              {kanbanColumns.map((col) => {
                const colCandidates = filteredCandidates.filter((c) => c.status === col.id);

                return (
                  <div
                    key={col.id}
                    style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      padding: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      minHeight: 480,
                    }}
                  >
                    {/* Column Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.dotColor }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{col.label}</span>
                      </div>
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          padding: '1px 7px',
                          borderRadius: 9999,
                          color: '#475569',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {colCandidates.length}
                      </span>
                    </div>

                    {/* Cards Container */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                      {colCandidates.length === 0 ? (
                        <div
                          style={{
                            padding: 24,
                            textAlign: 'center',
                            fontSize: 12,
                            color: '#94a3b8',
                            border: '1px dashed #e2e8f0',
                            borderRadius: 8,
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
                                if (!inspectorOpen) setInspectorOpen(true);
                              }}
                              style={{
                                background: '#ffffff',
                                borderRadius: 10,
                                border: isSelected ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
                                padding: '12px 14px',
                                boxShadow: isSelected
                                  ? '0 4px 14px rgba(15, 23, 42, 0.08)'
                                  : '0 1px 3px rgba(15, 23, 42, 0.02)',
                                cursor: 'pointer',
                                transition: 'all 0.12s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.borderColor = '#cbd5e1';
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.borderColor = '#e2e8f0';
                                  e.currentTarget.style.transform = 'none';
                                }
                              }}
                            >
                              {/* Top row: Name & Match Pill */}
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                                <div>
                                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>
                                    {cand.name}
                                  </div>
                                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
                                    {cand.title}
                                  </div>
                                </div>
                                <span
                                  style={{
                                    fontSize: 11.5,
                                    fontWeight: 700,
                                    padding: '2px 7px',
                                    borderRadius: 9999,
                                    background: cand.matchScore >= 90 ? '#ecfdf5' : '#eff6ff',
                                    border: cand.matchScore >= 90 ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
                                    color: cand.matchScore >= 90 ? '#065f46' : '#1e40af',
                                    fontVariantNumeric: 'tabular-nums',
                                    flexShrink: 0,
                                  }}
                                >
                                  {cand.matchScore}%
                                </span>
                              </div>

                              {/* Skills chips */}
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {cand.skills.slice(0, 3).map((sk) => (
                                  <span
                                    key={sk}
                                    style={{
                                      fontSize: 11,
                                      padding: '1px 6px',
                                      borderRadius: 4,
                                      background: '#f1f5f9',
                                      color: '#475569',
                                    }}
                                  >
                                    {sk}
                                  </span>
                                ))}
                                {cand.skills.length > 3 && (
                                  <span style={{ fontSize: 10.5, color: '#94a3b8', alignSelf: 'center' }}>
                                    +{cand.skills.length - 3}
                                  </span>
                                )}
                              </div>

                              {/* Meta footer: Location & Rubric Fraction */}
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  borderTop: '1px solid #f1f5f9',
                                  paddingTop: 8,
                                  fontSize: 11.5,
                                  color: '#64748b',
                                }}
                              >
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <MapPin size={11} style={{ color: '#94a3b8' }} />
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

          {/* B. Table Grid View (Okafor Household Video & VERIQ Ref) */}
          {viewMode === 'table' && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Candidate</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Target Requisition</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Experience</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Fit Score</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Pipeline Stage</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((cand) => {
                    const isSelected = selectedCandidateId === cand.id;

                    return (
                      <tr
                        key={cand.id}
                        onClick={() => {
                          setSelectedCandidateId(cand.id);
                          if (!inspectorOpen) setInspectorOpen(true);
                        }}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          background: isSelected ? '#f8fafc' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'background 0.1s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = '#fafafa';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = '#ffffff';
                        }}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: '#0f172a',
                                color: '#ffffff',
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              {cand.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{cand.name}</div>
                              <div style={{ fontSize: 12, color: '#64748b' }}>{cand.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#334155' }}>
                          {cand.appliedJobTitle}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
                          {cand.experienceYears} Years
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 9999,
                              background: cand.matchScore >= 90 ? '#ecfdf5' : '#eff6ff',
                              border: cand.matchScore >= 90 ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
                              color: cand.matchScore >= 90 ? '#065f46' : '#1e40af',
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {cand.matchScore}% Match
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: 6,
                              background: '#f1f5f9',
                              color: '#334155',
                            }}
                          >
                            {cand.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCandidateId(cand.id);
                              setInspectorOpen(true);
                            }}
                            style={{
                              height: 28,
                              padding: '0 10px',
                              borderRadius: 6,
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              color: '#0f172a',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* C. Competency Radar Matrix View */}
          {viewMode === 'radar' && activeCandidate && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: 14,
                border: '1px solid #e2e8f0',
                padding: 24,
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 340px',
                gap: 24,
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                  Multi-Dimensional Competency Polygon: {activeCandidate.name}
                </div>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px 0' }}>
                  Evaluated across 5 core technical axes against {activeCandidate.appliedJobTitle} requirements.
                </p>
                <div style={{ display: 'grid', placeItems: 'center', height: 380 }}>
                  <CompetencyRadarChart candidate={activeCandidate} />
                </div>
              </div>

              <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Evaluation Rubric Breakdown</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { axis: 'Architecture & System Design', score: 94 },
                    { axis: 'Code Quality & Production Rigor', score: 92 },
                    { axis: 'State Management & Concurrency', score: 88 },
                    { axis: 'Performance & Latency Optimization', score: 96 },
                    { axis: 'Team Collaboration & Mentorship', score: 89 },
                  ].map((dim) => (
                    <div key={dim.axis} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <span style={{ color: '#475569' }}>{dim.axis}</span>
                        <strong style={{ color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>{dim.score}%</strong>
                      </div>
                      <div style={{ width: '100%', height: 5, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                        <div style={{ width: `${dim.score}%`, height: '100%', background: '#0f172a', borderRadius: 9999 }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'auto', background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>AI Executive Assessment:</div>
                  Candidate exhibits top 5th percentile competency in performance and async concurrency pipelines.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Split-Screen Candidate Inspector (Okafor & VERIQ Design) */}
        {inspectorOpen && activeCandidate && (
          <div
            style={{
              background: '#ffffff',
              borderRadius: 14,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              position: 'sticky',
              top: 20,
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
              animation: 'boarduiDropdownEnter 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {/* Inspector Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#fafafa',
                borderRadius: '14px 14px 0 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#0f172a',
                    color: '#ffffff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {activeCandidate.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0f172a' }}>{activeCandidate.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{activeCandidate.title}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    background: activeCandidate.matchScore >= 90 ? '#ecfdf5' : '#eff6ff',
                    border: activeCandidate.matchScore >= 90 ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
                    color: activeCandidate.matchScore >= 90 ? '#065f46' : '#1e40af',
                  }}
                >
                  {activeCandidate.matchScore}% Fit
                </span>
                <button
                  type="button"
                  onClick={() => setInspectorOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Inspector Body */}
            <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Quick Info Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 12,
                }}
              >
                <div>
                  <span style={{ color: '#64748b' }}>Location:</span>
                  <div style={{ fontWeight: 600, color: '#0f172a', marginTop: 2 }}>{activeCandidate.location}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Experience:</span>
                  <div style={{ fontWeight: 600, color: '#0f172a', marginTop: 2 }}>{activeCandidate.experienceYears} Years Production</div>
                </div>
              </div>

              {/* Stage Transition Selector */}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                  Update Pipeline Stage
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {kanbanColumns.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => handleStageChange(activeCandidate.id, col.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 11.5,
                        fontWeight: 600,
                        border: activeCandidate.status === col.id ? `1.5px solid ${col.dotColor}` : '1px solid #e2e8f0',
                        background: activeCandidate.status === col.id ? col.bgTint : '#ffffff',
                        color: activeCandidate.status === col.id ? '#0f172a' : '#475569',
                        cursor: 'pointer',
                        transition: 'all 0.12s ease',
                      }}
                    >
                      {col.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Synthesis Summary */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Sparkles size={13} style={{ color: '#4338ca' }} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase' }}>
                    Candidate Profile Synthesis
                  </span>
                </div>
                <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.55, margin: 0 }}>
                  {activeCandidate.aiAnalysisExplanation || activeCandidate.summary}
                </p>
              </div>

              {/* Verified Skills */}
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                  Verified Technologies & Competencies
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {activeCandidate.skills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        fontSize: 11.5,
                        fontWeight: 500,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: '#f1f5f9',
                        border: '1px solid #e2e8f0',
                        color: '#334155',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Parsed Resume Snippet */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Parsed Resume Transcript
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(activeCandidate.resumeText);
                      showToast('Resume snippet copied to clipboard', 'success');
                    }}
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: '#4338ca',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Copy size={11} />
                    <span>Copy</span>
                  </button>
                </div>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: '10px 12px',
                    fontSize: 11.5,
                    color: '#475569',
                    lineHeight: 1.6,
                    maxHeight: 120,
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {activeCandidate.resumeText}
                </div>
              </div>
            </div>

            {/* Inspector Sticky Action Footer */}
            <div
              style={{
                padding: '14px 20px',
                borderTop: '1px solid #e2e8f0',
                background: '#fafafa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                borderRadius: '0 0 14px 14px',
              }}
            >
              <button
                type="button"
                onClick={() => shortlistCandidate(activeCandidate.id)}
                style={{
                  height: 34,
                  padding: '0 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  border: activeCandidate.status === 'Shortlisted' ? '1px solid #bbf7d0' : '1px solid #cbd5e1',
                  background: activeCandidate.status === 'Shortlisted' ? '#f0fdf4' : '#ffffff',
                  color: activeCandidate.status === 'Shortlisted' ? '#166534' : '#334155',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <CheckCircle2 size={13} style={{ color: activeCandidate.status === 'Shortlisted' ? '#166534' : '#64748b' }} />
                <span>{activeCandidate.status === 'Shortlisted' ? 'Shortlisted' : 'Shortlist'}</span>
              </button>

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => navigate('outreach')}
                  style={{
                    height: 34,
                    padding: '0 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <Send size={12} />
                  <span>Outreach</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('interviews')}
                  style={{
                    height: 34,
                    padding: '0 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    border: 'none',
                    background: '#0f172a',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <Calendar size={12} />
                  <span>Schedule</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Floating / Dockable AI Copilot Panel (Halo Reference Aesthetic) */}
      {copilotOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 380,
            maxHeight: 520,
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(15, 23, 42, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 999,
            animation: 'boarduiDropdownEnter 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Copilot Header */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#fafafa',
              borderRadius: '16px 16px 0 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: '#4338ca', color: '#ffffff', display: 'grid', placeItems: 'center' }}>
                <Bot size={14} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Scout Copilot</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Reasoning Engine v2.4</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCopilotOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2 }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Thought Trace Pill (Halo Ref) */}
          <div style={{ padding: '8px 14px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={() => setCopilotThoughtOpen(!copilotThoughtOpen)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: 11.5,
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                cursor: 'pointer',
              }}
            >
              <ChevronDown size={12} style={{ transform: copilotThoughtOpen ? 'none' : 'rotate(-90deg)', transition: 'transform 0.12s ease' }} />
              <span>Thought for 3.4 seconds</span>
            </button>
            {copilotThoughtOpen && (
              <p style={{ fontSize: 11.5, color: '#475569', margin: '4px 0 0 16px', lineHeight: 1.45 }}>
                Cross-referenced candidate portfolio against Requisition requirements. Verified 8 yrs React/Go concurrency experience. Zero bias signals detected.
              </p>
            )}
          </div>

          {/* Message History */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 260 }}>
            {copilotMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.sender === 'user' ? '#0f172a' : '#f1f5f9',
                  color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                  padding: '8px 12px',
                  borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  fontSize: 12.5,
                  lineHeight: 1.45,
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Suggestion Chips */}
          <div style={{ padding: '6px 12px', display: 'flex', gap: 6, overflowX: 'auto', borderTop: '1px solid #f1f5f9' }}>
            {['Generate scorecard', 'Compare with benchmark', 'Interview questions'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setCopilotInput(s);
                }}
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Composer Form */}
          <form
            onSubmit={handleCopilotSubmit}
            style={{
              padding: '10px 12px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#ffffff',
              borderRadius: '0 0 16px 16px',
            }}
          >
            <input
              type="text"
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              placeholder="Ask Scout Copilot about candidates..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 12.5,
                color: '#0f172a',
                background: 'transparent',
              }}
            />
            <button
              type="submit"
              style={{
                width: 28,
                height: 28,
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
  );
};
