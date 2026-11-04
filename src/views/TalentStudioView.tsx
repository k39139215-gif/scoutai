import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Bot,
  X,
  ArrowUpDown,
  Download,
  Mail,
  ShieldCheck,
  Lock,
  LayoutGrid,
  FileText,
  Workflow,
  CheckCircle2,
  Send,
  MoreVertical,
  UserCheck,
  Columns3,
  Zap,
  Printer,
  GitCompare,
} from 'lucide-react';
import { CustomCheckbox } from '../components/common/CustomCheckbox';
import { CompetencyRadarChart } from '../components/studio/CompetencyRadarChart';
import { CandidateComparisonModal } from '../components/studio/CandidateComparisonModal';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import type { CandidateStatus } from '../types';

type ViewMode = 'table' | 'kanban' | 'dossier' | 'pipeline';

interface FilterRule {
  id: string;
  field: 'matchScore' | 'experienceYears' | 'location' | 'status';
  operator: 'gte' | 'lte' | 'contains' | 'equals';
  value: string;
}

export const TalentStudioView: React.FC = () => {
  const {
    candidates,
    shortlistCandidate,
    createOutreachMessage,
    navigate,
  } = useApp();
  const { showToast } = useToast();

  // Mode & selection state with URL search param synchronization
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const m = p.get('mode') as ViewMode;
      if (m && ['table', 'kanban', 'dossier', 'pipeline'].includes(m)) return m;
    } catch {
      // fallback
    }
    return 'table';
  });

  const handleSelectViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', mode);
      window.history.replaceState(null, '', url.toString());
    } catch {
      // ignore
    }
  };

  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedRowIds, setExpandedRowIds] = useState<string[]>(['cand-1']);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCandidateId, setActiveCandidateId] = useState<string>(candidates[0]?.id || 'cand-1');

  // AI Copilot Panel state
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [copilotTab, setCopilotTab] = useState<'overview' | 'metrics' | 'traces'>('overview');
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Talent Intelligence Engine active. 18 candidates indexed with verified credentials. 3 high-fit senior distributed systems profiles detected.',
      time: 'Just now',
    },
  ]);

  // Floating Filter Builder popover state
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [filterRules, setFilterRules] = useState<FilterRule[]>([
    { id: 'rule-1', field: 'matchScore', operator: 'gte', value: '80' },
  ]);
  const [quickExpFilter, setQuickExpFilter] = useState<string>('All');

  // Column Menu state
  const [sortField, setSortField] = useState<'matchScore' | 'experienceYears' | 'name'>('matchScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [visibleColumns, setVisibleColumns] = useState({
    code: true,
    candidate: true,
    department: true,
    matchScore: true,
    experience: true,
    status: true,
    actions: true,
  });
  const [manageColumnsOpen, setManageColumnsOpen] = useState(false);

  // Active column menu state (Ref 9: c52644afe1c61981064a1e4a2f90d20a.png)
  const [activeColMenu, setActiveColMenu] = useState<string | null>(null);
  const colMenuRef = useRef<HTMLDivElement>(null);

  // Active row popover menu state
  const [rowMenuId, setRowMenuId] = useState<string | null>(null);

  // Pipeline simulation state
  const [simulatingPipeline, setSimulatingPipeline] = useState(false);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([
    '[00:00.12] Hook: Inbound candidate vector received from Lever API',
    '[00:00.35] Vectorization: 1,540 tokens embedded via Ada-002',
    '[00:00.82] Precision Match: Neural Scorer evaluated 6 core competency vectors',
    '[00:01.05] Audit Complete: Demographic bias check passed with 0 discrepancies',
  ]);

  // Collaboration Notes state (Ref 7: f54bcf618ae2ce1b7f05a76f83df5b34.jpg)
  const [collaborationNotesOpen, setCollaborationNotesOpen] = useState(true);
  const [teamNotes, setTeamNotes] = useState<Array<{ id: string; author: string; role: string; text: string; time: string; tag: string }>>([
    {
      id: 'n-1',
      author: 'Alex Rivera',
      role: 'Head of Engineering',
      text: 'Prioritize candidates with distributed consensus and Raft/Paxos experience for FinFlow.',
      time: 'Today, 11:30 AM',
      tag: 'Priority: High',
    },
    {
      id: 'n-2',
      author: 'Priya Sharma',
      role: 'Staff Recruiter',
      text: 'Sarah Chen passed preliminary async technical review with 91% alignment.',
      time: 'Today, 2:15 PM',
      tag: 'Status: Ongoing',
    },
  ]);
  const [newNoteInput, setNewNoteInput] = useState('');

  // Split-Dossier Editor state
  const activeCandidate = candidates.find((c) => c.id === activeCandidateId) || candidates[0];
  const [dossierNotes, setDossierNotes] = useState(
    'Strong cultural alignment observed during preliminary review. Candidate demonstrated high systems clarity.'
  );
  const [dossierComp, setDossierComp] = useState('₹45,00,000 - ₹55,00,000 PA');

  // References for outside click handling
  const filterPopoverRef = useRef<HTMLDivElement>(null);
  const manageColsRef = useRef<HTMLDivElement>(null);
  const rowMenuRef = useRef<HTMLDivElement>(null);

  // Keyboard-first row navigation (Ref 6: 920dba95d421aa4879c1b70e83f29021.png)
  const [focusedRowIndex, setFocusedRowIndex] = useState<number>(0);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (filterPopoverRef.current && !filterPopoverRef.current.contains(target)) {
        setFilterPopoverOpen(false);
      }
      if (colMenuRef.current && !colMenuRef.current.contains(target)) {
        setActiveColMenu(null);
      }
      if (manageColsRef.current && !manageColsRef.current.contains(target)) {
        setManageColumnsOpen(false);
      }
      if (rowMenuRef.current && !rowMenuRef.current.contains(target)) {
        setRowMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter & Sort Logic
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // Search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchLower) ||
        c.title.toLowerCase().includes(searchLower) ||
        c.location.toLowerCase().includes(searchLower) ||
        c.skills.some((s) => s.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;

      // Quick Exp
      if (quickExpFilter === 'Senior' && c.experienceYears < 5) return false;
      if (quickExpFilter === 'Mid' && (c.experienceYears < 3 || c.experienceYears >= 5)) return false;
      if (quickExpFilter === 'Junior' && c.experienceYears >= 3) return false;

      // Active Rules
      for (const rule of filterRules) {
        if (rule.field === 'matchScore') {
          const val = Number(rule.value) || 0;
          if (rule.operator === 'gte' && c.matchScore < val) return false;
          if (rule.operator === 'lte' && c.matchScore > val) return false;
        } else if (rule.field === 'experienceYears') {
          const val = Number(rule.value) || 0;
          if (rule.operator === 'gte' && c.experienceYears < val) return false;
          if (rule.operator === 'lte' && c.experienceYears > val) return false;
        } else if (rule.field === 'location') {
          if (!c.location.toLowerCase().includes(rule.value.toLowerCase())) return false;
        } else if (rule.field === 'status') {
          if (c.status.toLowerCase() !== rule.value.toLowerCase()) return false;
        }
      }

      return true;
    });
  }, [candidates, searchQuery, quickExpFilter, filterRules]);

  const sortedCandidates = useMemo(() => {
    return [...filteredCandidates].sort((a, b) => {
      let comp = 0;
      if (sortField === 'matchScore') {
        comp = a.matchScore - b.matchScore;
      } else if (sortField === 'experienceYears') {
        comp = a.experienceYears - b.experienceYears;
      } else {
        comp = a.name.localeCompare(b.name);
      }
      return sortDirection === 'asc' ? comp : -comp;
    });
  }, [filteredCandidates, sortField, sortDirection]);

  // Row selection helpers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === sortedCandidates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedCandidates.map((c) => c.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleExpandRow = (id: string) => {
    setExpandedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Global Keyboard Shortcuts (Ref 6: 920dba95d421aa4879c1b70e83f29021.png)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName)) return;

      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedRowIndex((prev) => Math.min(prev + 1, sortedCandidates.length - 1));
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedRowIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'x') {
        e.preventDefault();
        const cand = sortedCandidates[focusedRowIndex];
        if (cand) handleToggleSelectRow(cand.id);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cand = sortedCandidates[focusedRowIndex];
        if (cand) handleToggleExpandRow(cand.id);
      } else if (e.key === '1') {
        handleSelectViewMode('table');
      } else if (e.key === '2') {
        handleSelectViewMode('kanban');
      } else if (e.key === '3') {
        handleSelectViewMode('dossier');
      } else if (e.key === '4') {
        handleSelectViewMode('pipeline');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sortedCandidates, focusedRowIndex]);

  const handleSendCopilotMessage = (promptText?: string) => {
    const textToSend = promptText || copilotInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: 'Just now',
    };
    setCopilotMessages((prev) => [...prev, userMsg]);
    if (!promptText) setCopilotInput('');

    setTimeout(() => {
      let reply = '';
      if (textToSend.includes('top 3') || textToSend.includes('Rank')) {
        const top3 = [...candidates].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
        reply = `Top 3 recommended candidates: 1) ${top3[0]?.name} (${top3[0]?.matchScore}%) for ${top3[0]?.title}, 2) ${top3[1]?.name} (${top3[1]?.matchScore}%), 3) ${top3[2]?.name} (${top3[2]?.matchScore}%). All 3 show zero compliance gaps.`;
      } else if (textToSend.includes('gaps') || textToSend.includes('risk')) {
        reply = `Risk Analysis: 2 candidates have missing backend microservices proof in resume text (Sarah Chen, Vikram Malhotra). Recommended follow-up: send technical assessment screen.`;
      } else if (textToSend.includes('outreach') || textToSend.includes('Draft')) {
        reply = `Drafted 3 personalized executive outreach templates focusing on NovaStack architecture scaling and engineering leadership. Saved to Outreach queue.`;
      } else {
        reply = `Analysis completed for "${textToSend}". Evaluated 18 candidate profiles against client rubric. 94.2% confidence score achieved.`;
      }

      setCopilotMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: 'Just now',
        },
      ]);
    }, 600);
  };

  const handleBatchShortlist = () => {
    selectedIds.forEach((id) => shortlistCandidate(id));
    showToast(`${selectedIds.length} candidates moved to Shortlisted stage.`, 'success');
    setSelectedIds([]);
  };

  const handleBatchOutreach = () => {
    selectedIds.forEach((id) => {
      const cand = candidates.find((c) => c.id === id);
      if (cand) {
        createOutreachMessage({
          candidateId: cand.id,
          candidateName: cand.name,
          candidateEmail: cand.email,
          jobId: cand.appliedJobId || 'job-101',
          jobTitle: cand.appliedJobTitle || 'Senior Engineer',
          subject: `Exploring Architecture Leadership at ScoutAI — ${cand.name}`,
          body: `Hi ${cand.name},\n\nWe were thoroughly impressed by your background in ${cand.skills.slice(0, 3).join(', ')}. We'd love to invite you to an introductory technical exchange.\n\nBest regards,\nTalent Operations Team`,
          tone: 'Professional',
        });
      }
    });
    showToast(`Drafted personalized outreach for ${selectedIds.length} candidates.`, 'success');
    setSelectedIds([]);
  };

  const handleRunPipelineSimulation = () => {
    setSimulatingPipeline(true);
    setPipelineLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Pipeline test triggered manually for current candidate cohort...`,
    ]);

    setTimeout(() => {
      setPipelineLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Vector ingestion: OK (0.18s)`,
        `[${new Date().toLocaleTimeString()}] Neural inference: 18 profiles scored (sub-400ms avg)`,
        `[${new Date().toLocaleTimeString()}] Bias audit: 0 flagged issues. Ready for recruiter sign-off.`,
      ]);
      setSimulatingPipeline(false);
      showToast('Pipeline simulation passed with 99.4% confidence rating.', 'success');
    }, 1200);
  };

  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [selectedPreviewRef, setSelectedPreviewRef] = useState<{ id: number; file: string; title: string; location: string; desc: string; mode?: ViewMode } | null>(null);

  const handleExportCSV = (targetCandidates: typeof candidates) => {
    const headers = ['Candidate ID', 'Name', 'Title', 'Specialization', 'Match Score (%)', 'Experience (Years)', 'Location', 'Email', 'Status'];
    const rows = targetCandidates.map((c, i) => [
      `CAN-${String(i + 1).padStart(3, '0')}`,
      `"${c.name}"`,
      `"${c.title}"`,
      `"${c.skills[0] || 'Engineering'}"`,
      c.matchScore,
      c.experienceYears,
      `"${c.location}"`,
      `"${c.email}"`,
      `"${c.status}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `scoutai_candidates_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${targetCandidates.length} candidate profiles to CSV spreadsheet.`, 'success');
  };

  const handlePrintDossier = () => {
    window.print();
  };

  // Helper for department tags
  const getDeptColor = (index: number) => {
    const colors = [
      { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe', dot: '#3b82f6' }, // Blue
      { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', dot: '#22c55e' }, // Green
      { bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff', dot: '#a855f7' }, // Purple
      { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa', dot: '#f97316' }, // Orange
    ];
    return colors[index % colors.length];
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        fontFamily: 'var(--font-family-base)',
      }}
    >
      {/* =========================================================================
          1. CAPABILITY & TRUST PILL BANNER (Ref 5: ad4635c44bfa9071f067030de7fde1fe.jpg)
          ========================================================================= */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '10px 24px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: 9999,
              fontSize: 11,
              fontWeight: 600,
              color: '#334155',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#10b981',
                display: 'inline-block',
              }}
            />
            <span>#1 Ranked Match Precision (99.4%)</span>
            <ChevronRight size={12} style={{ color: '#64748b' }} />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 9999,
              fontSize: 11,
              fontWeight: 500,
              color: '#475569',
            }}
          >
            <ShieldCheck size={12} style={{ color: '#10b981' }} />
            <span>SOC 2 Type II Certified</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 9999,
              fontSize: 11,
              fontWeight: 500,
              color: '#475569',
            }}
          >
            <Zap size={12} style={{ color: '#6366f1' }} />
            <span>Fair-Hiring AI v3.4 Active</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setShowReferenceModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              backgroundColor: '#eef2ff',
              border: '1px solid #c7d2fe',
              borderRadius: 9999,
              fontSize: 11,
              fontWeight: 600,
              color: '#4338ca',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            <span>📷 20 Reference Designs</span>
          </button>

          {selectedIds.length >= 2 && (
            <button
              onClick={() => setCompareModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 9999,
                fontSize: 11,
                fontWeight: 600,
                color: '#2563eb',
                cursor: 'pointer',
              }}
            >
              <GitCompare size={12} />
              <span>Compare Selected ({selectedIds.length})</span>
            </button>
          )}
          <span
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-family-base)',
              color: '#64748b',
              background: '#f1f5f9',
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            18 PROFILES SYNCHRONIZED
          </span>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              color: '#64748b',
            }}
          >
            <Lock size={12} />
            <span>Private Tenant DB</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. WORKSPACE CONTROL BAR & MULTI-MODE SWITCHER (Refs 3, 10, 11, 16, 17, 18)
          ========================================================================= */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          padding: '14px 24px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 80,
        }}
      >
        {/* Left: View Mode Segmented Switcher & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Segmented View Switcher */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#f1f5f9',
              padding: 3,
              borderRadius: 8,
              border: '1px solid #e2e8f0',
            }}
          >
            <button
              onClick={() => handleSelectViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? '#0f172a' : '#64748b',
                fontWeight: viewMode === 'table' ? 600 : 500,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <Columns3 size={14} />
              <span>Dense Table</span>
            </button>

            <button
              onClick={() => handleSelectViewMode('kanban')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: viewMode === 'kanban' ? '#ffffff' : 'transparent',
                color: viewMode === 'kanban' ? '#0f172a' : '#64748b',
                fontWeight: viewMode === 'kanban' ? 600 : 500,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: viewMode === 'kanban' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <LayoutGrid size={14} />
              <span>Pipeline Kanban</span>
            </button>

            <button
              onClick={() => handleSelectViewMode('dossier')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: viewMode === 'dossier' ? '#ffffff' : 'transparent',
                color: viewMode === 'dossier' ? '#0f172a' : '#64748b',
                fontWeight: viewMode === 'dossier' ? 600 : 500,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: viewMode === 'dossier' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <FileText size={14} />
              <span>Split Dossier</span>
            </button>

            <button
              onClick={() => handleSelectViewMode('pipeline')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: viewMode === 'pipeline' ? '#ffffff' : 'transparent',
                color: viewMode === 'pipeline' ? '#0f172a' : '#64748b',
                fontWeight: viewMode === 'pipeline' ? 600 : 500,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: viewMode === 'pipeline' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <Workflow size={14} />
              <span>AI Logic Nodes</span>
            </button>
          </div>

          {/* Quick Search */}
          <div
            style={{
              position: 'relative',
              width: 260,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 10,
                color: '#94a3b8',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, skills, title..."
              style={{
                width: '100%',
                padding: '6px 32px 6px 30px',
                fontSize: 12,
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                color: '#0f172a',
                outline: 'none',
              }}
            />
            <span
              style={{
                position: 'absolute',
                right: 8,
                fontSize: 10,
                color: '#94a3b8',
                fontFamily: 'var(--font-family-base)',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '1px 4px',
                borderRadius: 3,
              }}
            >
              ⌘K
            </span>
          </div>

          {/* Filter Popover Trigger Button (Ref 1, 6, 8) */}
          <div style={{ position: 'relative' }} ref={filterPopoverRef}>
            <button
              onClick={() => setFilterPopoverOpen(!filterPopoverOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                border: filterPopoverOpen ? '1px solid #0f172a' : '1px solid #cbd5e1',
                backgroundColor: filterPopoverOpen ? '#f1f5f9' : '#ffffff',
                color: '#0f172a',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
              {filterRules.length > 0 && (
                <span
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: 9999,
                  }}
                >
                  {filterRules.length}
                </span>
              )}
            </button>

            {/* Floating Filter Popover Card */}
            {filterPopoverOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: 6,
                  width: 380,
                  backgroundColor: '#ffffff',
                  borderRadius: 12,
                  boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(15, 23, 42, 0.08)',
                  padding: 16,
                  zIndex: 200,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                    Active Filter Criteria
                  </span>
                  <button
                    onClick={() => setFilterRules([])}
                    style={{
                      fontSize: 11,
                      color: '#64748b',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Reset all
                  </button>
                </div>

                {/* Filter Rule Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  {filterRules.map((rule, idx) => (
                    <div
                      key={rule.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        backgroundColor: '#f8fafc',
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                        {idx === 0 ? 'Where' : 'And'}
                      </span>
                      <select
                        value={rule.field}
                        onChange={(e) => {
                          const updated = [...filterRules];
                          updated[idx].field = e.target.value as any;
                          setFilterRules(updated);
                        }}
                        style={{
                          fontSize: 11,
                          padding: '3px 6px',
                          borderRadius: 4,
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <option value="matchScore">Match Score</option>
                        <option value="experienceYears">Experience</option>
                        <option value="location">Location</option>
                        <option value="status">Status</option>
                      </select>

                      <select
                        value={rule.operator}
                        onChange={(e) => {
                          const updated = [...filterRules];
                          updated[idx].operator = e.target.value as any;
                          setFilterRules(updated);
                        }}
                        style={{
                          fontSize: 11,
                          padding: '3px 6px',
                          borderRadius: 4,
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <option value="gte">≥</option>
                        <option value="lte">≤</option>
                        <option value="contains">contains</option>
                        <option value="equals">=</option>
                      </select>

                      <input
                        type="text"
                        value={rule.value}
                        onChange={(e) => {
                          const updated = [...filterRules];
                          updated[idx].value = e.target.value;
                          setFilterRules(updated);
                        }}
                        style={{
                          fontSize: 11,
                          padding: '3px 6px',
                          borderRadius: 4,
                          border: '1px solid #cbd5e1',
                          width: 80,
                        }}
                      />

                      <button
                        onClick={() =>
                          setFilterRules((prev) => prev.filter((r) => r.id !== rule.id))
                        }
                        style={{
                          marginLeft: 'auto',
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() =>
                      setFilterRules((prev) => [
                        ...prev,
                        {
                          id: `rule-${Date.now()}`,
                          field: 'experienceYears',
                          operator: 'gte',
                          value: '5',
                        },
                      ])
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                      color: '#2563eb',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px 0',
                      fontWeight: 600,
                    }}
                  >
                    <Plus size={12} />
                    <span>Add condition rule</span>
                  </button>
                </div>

                {/* Quick Checklists (Ref 1: bc56f35e8ee29a4d525fddf2b30ae4b0.jpg) */}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
                    Seniority Level
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['All', 'Senior', 'Mid', 'Junior'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setQuickExpFilter(lvl)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          border: quickExpFilter === lvl ? '1px solid #0f172a' : '1px solid #e2e8f0',
                          backgroundColor: quickExpFilter === lvl ? '#0f172a' : '#ffffff',
                          color: quickExpFilter === lvl ? '#ffffff' : '#475569',
                          cursor: 'pointer',
                        }}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 14,
                    paddingTop: 8,
                    borderTop: '1px solid #e2e8f0',
                    fontSize: 10,
                    color: '#94a3b8',
                  }}
                >
                  <span>↵ To apply filters</span>
                  <span>ESC to close</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Action Controls: Column Manager, Copilot Drawer Toggle & Add Candidate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Manage Columns Dropdown (Ref 16: 091b617340c206e5c9ced281d4b05cc4.jpg) */}
          <div style={{ position: 'relative' }} ref={manageColsRef}>
            <button
              onClick={() => setManageColumnsOpen(!manageColumnsOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              <Columns3 size={14} />
              <span>Columns</span>
            </button>

            {manageColumnsOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 6,
                  width: 200,
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  boxShadow: '0 12px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
                  padding: 8,
                  zIndex: 200,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#64748b',
                    padding: '4px 8px',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  Toggle Table Columns
                </div>
                {Object.keys(visibleColumns).map((colKey) => (
                  <label
                    key={colKey}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 8px',
                      fontSize: 12,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    <CustomCheckbox
                      checked={Boolean((visibleColumns as any)[colKey])}
                      onChange={(checked: boolean) =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          [colKey]: checked,
                        }))
                      }
                      size={14}
                    />
                    <span>{colKey}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* AI Copilot Drawer Toggle Button (Ref 10 & 20) */}
          <button
            onClick={() => setCopilotOpen(!copilotOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 6,
              border: copilotOpen ? '1px solid #4f46e5' : '1px solid #cbd5e1',
              backgroundColor: copilotOpen ? '#eef2ff' : '#ffffff',
              color: copilotOpen ? '#4338ca' : '#475569',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Sparkles size={14} style={{ color: copilotOpen ? '#4f46e5' : '#64748b' }} />
            <span>AI Copilot</span>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#10b981',
              }}
            />
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => navigate('create-job')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            <Plus size={14} />
            <span>New Requisition</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          3. MAIN WORKSPACE CANVAS + RIGHT DOCKED COPILOT ASSISTANT
          ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: copilotOpen ? 'minmax(0, 1fr) 360px' : '1fr',
          flex: 1,
          alignItems: 'start',
          position: 'relative',
        }}
      >
        {/* Left Primary View Container */}
        <div style={{ padding: '20px 24px', minWidth: 0 }}>
          {/* VIEW MODE 1: DENSE TABLE (Notion/Airtable style) */}
          {viewMode === 'table' && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                overflow: 'hidden',
              }}
            >
              {/* Table Header Bar with Count */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                    Candidate Roster
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      padding: '2px 8px',
                      borderRadius: 9999,
                      fontWeight: 600,
                    }}
                  >
                    {sortedCandidates.length} evaluated
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#64748b' }}>
                  <span>Sort by:</span>
                  <button
                    onClick={() => {
                      if (sortField === 'matchScore') {
                        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                      } else {
                        setSortField('matchScore');
                        setSortDirection('desc');
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: sortField === 'matchScore' ? '#0f172a' : '#64748b',
                      fontWeight: sortField === 'matchScore' ? 600 : 400,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>Match Fit</span>
                    <ArrowUpDown size={12} />
                  </button>
                  <button
                    onClick={() => {
                      if (sortField === 'experienceYears') {
                        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                      } else {
                        setSortField('experienceYears');
                        setSortDirection('desc');
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: sortField === 'experienceYears' ? '#0f172a' : '#64748b',
                      fontWeight: sortField === 'experienceYears' ? 600 : 400,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>Experience</span>
                    <ArrowUpDown size={12} />
                  </button>
                </div>
              </div>

              {/* Multi-Segment Pipeline Distribution Rail (Ref 4: 243b991bb2eaea65723c3504c08a2057.png) */}
              <div
                style={{
                  padding: '10px 16px 12px',
                  backgroundColor: '#fafbfc',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11 }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>Pipeline Distribution:</span>
                    <span style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22c55e' }} />
                      Qualified ({candidates.filter((c) => c.status === 'Qualified').length})
                    </span>
                    <span style={{ color: '#6b21a8', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#a855f7' }} />
                      Shortlisted ({candidates.filter((c) => c.status === 'Shortlisted').length})
                    </span>
                    <span style={{ color: '#1e40af', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                      Interviewing ({candidates.filter((c) => c.status === 'Interviewing').length})
                    </span>
                    <span style={{ color: '#854d0e', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#eab308' }} />
                      Review ({candidates.filter((c) => c.status === 'Review').length})
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'var(--font-family-base)' }}>
                    VELOCITY: 3.8 DAYS / STAGE
                  </span>
                </div>

                <div
                  style={{
                    height: 5,
                    width: '100%',
                    borderRadius: 9999,
                    backgroundColor: '#e2e8f0',
                    display: 'flex',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(candidates.filter((c) => c.status === 'Qualified').length / candidates.length) * 100}%`,
                      backgroundColor: '#22c55e',
                    }}
                    title="Qualified"
                  />
                  <div
                    style={{
                      width: `${(candidates.filter((c) => c.status === 'Shortlisted').length / candidates.length) * 100}%`,
                      backgroundColor: '#a855f7',
                    }}
                    title="Shortlisted"
                  />
                  <div
                    style={{
                      width: `${(candidates.filter((c) => c.status === 'Interviewing').length / candidates.length) * 100}%`,
                      backgroundColor: '#3b82f6',
                    }}
                    title="Interviewing"
                  />
                  <div
                    style={{
                      width: `${(candidates.filter((c) => c.status === 'Review').length / candidates.length) * 100}%`,
                      backgroundColor: '#eab308',
                    }}
                    title="Review"
                  />
                </div>
              </div>

              {/* Table Element */}
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                    fontSize: 12,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                        color: '#64748b',
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      <th style={{ width: 40, padding: '10px 12px', textAlign: 'center' }}>
                        <CustomCheckbox
                          checked={
                            sortedCandidates.length > 0 &&
                            selectedIds.length === sortedCandidates.length
                          }
                          onChange={() => handleToggleSelectAll()}
                          size={15}
                        />
                      </th>
                      {visibleColumns.code && (
                        <th style={{ padding: '10px 12px', width: 90 }}>Code</th>
                      )}
                      {visibleColumns.candidate && (
                        <th
                          style={{ padding: '10px 12px', position: 'relative', cursor: 'pointer' }}
                          onClick={() => setActiveColMenu(activeColMenu === 'candidate' ? null : 'candidate')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span>Candidate & Role</span>
                            <ChevronDown size={11} style={{ opacity: 0.6 }} />
                          </div>
                          {activeColMenu === 'candidate' && (
                            <div
                              ref={colMenuRef}
                              style={{
                                position: 'absolute',
                                top: '100%',
                                left: 10,
                                backgroundColor: '#ffffff',
                                borderRadius: 8,
                                boxShadow: '0 12px 24px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06)',
                                padding: 4,
                                zIndex: 120,
                                minWidth: 160,
                                textTransform: 'none',
                                fontWeight: 500,
                                color: '#0f172a',
                              }}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSortField('name');
                                  setSortDirection('asc');
                                  setActiveColMenu(null);
                                }}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', fontSize: 12, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4 }}
                              >
                                <span>↑ Sort Name A–Z</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSortField('name');
                                  setSortDirection('desc');
                                  setActiveColMenu(null);
                                }}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', fontSize: 12, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4 }}
                              >
                                <span>↓ Sort Name Z–A</span>
                              </button>
                            </div>
                          )}
                        </th>
                      )}
                      {visibleColumns.department && (
                        <th style={{ padding: '10px 12px' }}>Specialization</th>
                      )}
                      {visibleColumns.matchScore && (
                        <th
                          style={{ padding: '10px 12px', position: 'relative', cursor: 'pointer' }}
                          onClick={() => setActiveColMenu(activeColMenu === 'matchScore' ? null : 'matchScore')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span>Precision Match</span>
                            <ChevronDown size={11} style={{ opacity: 0.6 }} />
                          </div>
                          {activeColMenu === 'matchScore' && (
                            <div
                              ref={colMenuRef}
                              style={{
                                position: 'absolute',
                                top: '100%',
                                left: 10,
                                backgroundColor: '#ffffff',
                                borderRadius: 8,
                                boxShadow: '0 12px 24px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06)',
                                padding: 4,
                                zIndex: 120,
                                minWidth: 170,
                                textTransform: 'none',
                                fontWeight: 500,
                                color: '#0f172a',
                              }}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSortField('matchScore');
                                  setSortDirection('desc');
                                  setActiveColMenu(null);
                                }}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', fontSize: 12, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4 }}
                              >
                                <span>↓ Sort Highest Match</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSortField('matchScore');
                                  setSortDirection('asc');
                                  setActiveColMenu(null);
                                }}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', fontSize: 12, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4 }}
                              >
                                <span>↑ Sort Lowest Match</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFilterRules((prev) => [
                                    ...prev,
                                    { id: `rule-${Date.now()}`, field: 'matchScore', operator: 'gte', value: '85' },
                                  ]);
                                  setFilterPopoverOpen(true);
                                  setActiveColMenu(null);
                                }}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', fontSize: 12, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4 }}
                              >
                                <span>🔍 Filter Score ≥ 85%</span>
                              </button>
                            </div>
                          )}
                        </th>
                      )}
                      {visibleColumns.experience && (
                        <th
                          style={{ padding: '10px 12px', position: 'relative', cursor: 'pointer' }}
                          onClick={() => setActiveColMenu(activeColMenu === 'experience' ? null : 'experience')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span>Experience</span>
                            <ChevronDown size={11} style={{ opacity: 0.6 }} />
                          </div>
                          {activeColMenu === 'experience' && (
                            <div
                              ref={colMenuRef}
                              style={{
                                position: 'absolute',
                                top: '100%',
                                left: 10,
                                backgroundColor: '#ffffff',
                                borderRadius: 8,
                                boxShadow: '0 12px 24px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06)',
                                padding: 4,
                                zIndex: 120,
                                minWidth: 170,
                                textTransform: 'none',
                                fontWeight: 500,
                                color: '#0f172a',
                              }}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSortField('experienceYears');
                                  setSortDirection('desc');
                                  setActiveColMenu(null);
                                }}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', fontSize: 12, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4 }}
                              >
                                <span>↓ Most Experienced First</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuickExpFilter('Senior');
                                  setActiveColMenu(null);
                                }}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', fontSize: 12, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4 }}
                              >
                                <span>⭐ Show Senior (5+ yrs)</span>
                              </button>
                            </div>
                          )}
                        </th>
                      )}
                      {visibleColumns.status && (
                        <th style={{ padding: '10px 12px' }}>Stage Status</th>
                      )}
                      {visibleColumns.actions && (
                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCandidates.map((candidate, idx) => {
                      const isExpanded = expandedRowIds.includes(candidate.id);
                      const isSelected = selectedIds.includes(candidate.id);
                      const isFocused = idx === focusedRowIndex;
                      const deptStyle = getDeptColor(idx);
                      const monoCode = `CAN-${String(idx + 1).padStart(3, '0')}`;

                      return (
                        <React.Fragment key={candidate.id}>
                          <tr
                            onClick={() => setFocusedRowIndex(idx)}
                            style={{
                              borderBottom: isExpanded ? 'none' : '1px solid #f1f5f9',
                              borderLeft: isFocused ? '3px solid #2563eb' : '3px solid transparent',
                              backgroundColor: isFocused
                                ? '#eff6ff'
                                : isSelected
                                ? '#f8fafc'
                                : idx % 2 === 0
                                ? '#ffffff'
                                : '#fafbfc',
                              transition: 'background-color 0.15s ease',
                              cursor: 'pointer',
                            }}
                          >
                            {/* Checkbox */}
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <CustomCheckbox
                                checked={isSelected}
                                onChange={() => handleToggleSelectRow(candidate.id)}
                                size={15}
                              />
                            </td>

                            {/* Candidate Mono Code (Ref 10: 2edeb9efff5103e50fe694a0ce49bcf3.jpg) */}
                            {visibleColumns.code && (
                              <td style={{ padding: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <button
                                    onClick={() => handleToggleExpandRow(candidate.id)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#94a3b8',
                                      cursor: 'pointer',
                                      padding: 0,
                                      display: 'flex',
                                    }}
                                  >
                                    {isExpanded ? (
                                      <ChevronDown size={14} />
                                    ) : (
                                      <ChevronRight size={14} />
                                    )}
                                  </button>
                                  <span
                                    style={{
                                      fontFamily: 'var(--font-family-base)',
                                      fontSize: 11,
                                      color: '#475569',
                                      fontWeight: 600,
                                      backgroundColor: '#f1f5f9',
                                      padding: '2px 6px',
                                      borderRadius: 4,
                                    }}
                                  >
                                    {monoCode}
                                  </span>
                                </div>
                              </td>
                            )}

                            {/* Candidate Name & Title */}
                            {visibleColumns.candidate && (
                              <td style={{ padding: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <div
                                    style={{
                                      width: 28,
                                      height: 28,
                                      borderRadius: '50%',
                                      backgroundColor: '#0f172a',
                                      color: '#ffffff',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: 11,
                                      fontWeight: 700,
                                      flexShrink: 0,
                                    }}
                                  >
                                    {candidate.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')}
                                  </div>
                                  <div>
                                    <div
                                      style={{
                                        fontWeight: 600,
                                        color: '#0f172a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                      }}
                                    >
                                      <span>{candidate.name}</span>
                                      <CheckCircle2 size={12} style={{ color: '#10b981' }} />
                                    </div>
                                    <div style={{ fontSize: 11, color: '#64748b' }}>
                                      {candidate.title} • {candidate.location}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            )}

                            {/* Department / Track with Colored Status Dot (Ref 14: f18d23524634da20b75b3b94d6925fef.jpg) */}
                            {visibleColumns.department && (
                              <td style={{ padding: '12px' }}>
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '3px 8px',
                                    borderRadius: 9999,
                                    backgroundColor: deptStyle.bg,
                                    color: deptStyle.text,
                                    border: `1px solid ${deptStyle.border}`,
                                    fontSize: 11,
                                    fontWeight: 500,
                                  }}
                                >
                                  <span
                                    style={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: '50%',
                                      backgroundColor: deptStyle.dot,
                                    }}
                                  />
                                  <span>{candidate.skills[0] || 'Engineering'}</span>
                                </span>
                              </td>
                            )}

                            {/* Match Precision with Weekly Delta (Ref 16: 091b617340c206e5c9ced281d4b05cc4.jpg) */}
                            {visibleColumns.matchScore && (
                              <td style={{ padding: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      fontSize: 13,
                                      fontVariantNumeric: 'tabular-nums',
                                      color:
                                        candidate.matchScore >= 90
                                          ? '#166534'
                                          : candidate.matchScore >= 80
                                          ? '#0369a1'
                                          : '#854d0e',
                                    }}
                                  >
                                    {candidate.matchScore}%
                                  </span>
                                  <span
                                    style={{
                                      fontSize: 10,
                                      color: '#10b981',
                                      backgroundColor: '#f0fdf4',
                                      padding: '1px 5px',
                                      borderRadius: 4,
                                      fontWeight: 600,
                                    }}
                                  >
                                    +4.2% avg
                                  </span>
                                </div>
                              </td>
                            )}

                            {/* Experience with MTWTF tag (Ref 16) */}
                            {visibleColumns.experience && (
                              <td style={{ padding: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <span style={{ fontWeight: 600 }}>
                                    {candidate.experienceYears} yrs
                                  </span>
                                  <span
                                    style={{
                                      fontSize: 10,
                                      backgroundColor: '#f1f5f9',
                                      color: '#64748b',
                                      padding: '1px 4px',
                                      borderRadius: 3,
                                      letterSpacing: '0.04em',
                                      fontWeight: 600,
                                    }}
                                  >
                                    MTWTF
                                  </span>
                                </div>
                              </td>
                            )}

                            {/* Status with Vertical Colored Indicator Line (Ref 16) */}
                            {visibleColumns.status && (
                              <td style={{ padding: '12px' }}>
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '3px 8px',
                                    borderRadius: 4,
                                    backgroundColor:
                                      candidate.status === 'Qualified'
                                        ? '#f0fdf4'
                                        : candidate.status === 'Shortlisted'
                                        ? '#faf5ff'
                                        : '#eff6ff',
                                    color:
                                      candidate.status === 'Qualified'
                                        ? '#166534'
                                        : candidate.status === 'Shortlisted'
                                        ? '#6b21a8'
                                        : '#1e40af',
                                    fontSize: 11,
                                    fontWeight: 600,
                                  }}
                                >
                                  <span
                                    style={{
                                      width: 2,
                                      height: 10,
                                      backgroundColor:
                                        candidate.status === 'Qualified'
                                          ? '#22c55e'
                                          : candidate.status === 'Shortlisted'
                                          ? '#a855f7'
                                          : '#3b82f6',
                                    }}
                                  />
                                  <span>{candidate.status}</span>
                                </span>
                              </td>
                            )}

                            {/* Actions Menu Popover */}
                            {visibleColumns.actions && (
                              <td style={{ padding: '12px', textAlign: 'right' }}>
                                <div
                                  style={{
                                    position: 'relative',
                                    display: 'inline-block',
                                  }}
                                >
                                  <button
                                    onClick={() =>
                                      setRowMenuId(rowMenuId === candidate.id ? null : candidate.id)
                                    }
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#64748b',
                                      padding: 4,
                                      borderRadius: 4,
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <MoreVertical size={14} />
                                  </button>

                                  {rowMenuId === candidate.id && (
                                    <div
                                      ref={rowMenuRef}
                                      style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '100%',
                                        marginTop: 4,
                                        width: 180,
                                        backgroundColor: '#1e293b',
                                        borderRadius: 8,
                                        boxShadow:
                                          '0 10px 25px -5px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
                                        padding: 4,
                                        zIndex: 100,
                                        textAlign: 'left',
                                      }}
                                    >
                                      <button
                                        onClick={() => {
                                          shortlistCandidate(candidate.id);
                                          setRowMenuId(null);
                                        }}
                                        style={{
                                          width: '100%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 8,
                                          padding: '8px 10px',
                                          fontSize: 12,
                                          color: '#ffffff',
                                          background: 'none',
                                          border: 'none',
                                          borderRadius: 4,
                                          cursor: 'pointer',
                                        }}
                                      >
                                        <UserCheck size={13} style={{ color: '#10b981' }} />
                                        <span>Shortlist Candidate</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setActiveCandidateId(candidate.id);
                                          handleSelectViewMode('dossier');
                                          setRowMenuId(null);
                                        }}
                                        style={{
                                          width: '100%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 8,
                                          padding: '8px 10px',
                                          fontSize: 12,
                                          color: '#ffffff',
                                          background: 'none',
                                          border: 'none',
                                          borderRadius: 4,
                                          cursor: 'pointer',
                                        }}
                                      >
                                        <FileText size={13} style={{ color: '#38bdf8' }} />
                                        <span>View Dossier Brief</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          createOutreachMessage({
                                            candidateId: candidate.id,
                                            candidateName: candidate.name,
                                            candidateEmail: candidate.email,
                                            jobId: candidate.appliedJobId || 'job-101',
                                            jobTitle: candidate.appliedJobTitle || 'Engineer',
                                            subject: `Discussion regarding ${candidate.appliedJobTitle}`,
                                            body: `Hello ${candidate.name},\n\nWe reviewed your experience and would love to connect.`,
                                            tone: 'Engaging',
                                          });
                                          showToast(
                                            `Outreach draft prepared for ${candidate.name}`,
                                            'success'
                                          );
                                          setRowMenuId(null);
                                        }}
                                        style={{
                                          width: '100%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 8,
                                          padding: '8px 10px',
                                          fontSize: 12,
                                          color: '#ffffff',
                                          background: 'none',
                                          border: 'none',
                                          borderRadius: 4,
                                          cursor: 'pointer',
                                        }}
                                      >
                                        <Mail size={13} style={{ color: '#fbbf24' }} />
                                        <span>Draft AI Outreach</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            )}
                          </tr>

                          {/* Expandable Sub-Row (Refs 12, 14, 17) */}
                          {isExpanded && (
                            <tr
                              style={{
                                backgroundColor: '#f8fafc',
                                borderBottom: '1px solid #e2e8f0',
                              }}
                            >
                              <td colSpan={7} style={{ padding: '12px 16px 16px 48px' }}>
                                <div
                                  style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: 8,
                                    border: '1px solid #e2e8f0',
                                    padding: 14,
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                  }}
                                >
                                  {/* Sub-row header */}
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      marginBottom: 10,
                                      borderBottom: '1px solid #f1f5f9',
                                      paddingBottom: 8,
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <Bot size={14} style={{ color: '#4f46e5' }} />
                                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
                                        AI Evaluation Insights & Sourcing Provenance
                                      </span>
                                    </div>
                                    <span
                                      style={{
                                        fontSize: 10,
                                        fontFamily: 'var(--font-family-base)',
                                        color: '#64748b',
                                      }}
                                    >
                                      INFERENCE LATENCY: 245ms • CONFIDENCE: 99.4%
                                    </span>
                                  </div>

                                  <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.5, marginBottom: 12 }}>
                                    {candidate.aiAnalysisExplanation}
                                  </div>

                                  {/* Strengths & Potential Gaps Pills */}
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div
                                      style={{
                                        backgroundColor: '#f0fdf4',
                                        border: '1px solid #bbf7d0',
                                        borderRadius: 6,
                                        padding: '8px 12px',
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: 11,
                                          fontWeight: 700,
                                          color: '#166534',
                                          display: 'block',
                                          marginBottom: 4,
                                        }}
                                      >
                                        Key Strengths ({candidate.strengths.length})
                                      </span>
                                      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#166534' }}>
                                        {candidate.strengths.map((str, sIdx) => (
                                          <li key={sIdx}>{str}</li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div
                                      style={{
                                        backgroundColor: '#fffbeb',
                                        border: '1px solid #fef3c7',
                                        borderRadius: 6,
                                        padding: '8px 12px',
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: 11,
                                          fontWeight: 700,
                                          color: '#92400e',
                                          display: 'block',
                                          marginBottom: 4,
                                        }}
                                      >
                                        Areas for Recruiter Follow-Up ({candidate.potentialGaps.length})
                                      </span>
                                      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#92400e' }}>
                                        {candidate.potentialGaps.map((gap, gIdx) => (
                                          <li key={gIdx}>{gap}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>

                                  {/* Historical Version Differential with Diagonal Stripes (Ref 14: f18d23524634da20b75b3b94d6925fef.jpg) */}
                                  <div
                                    style={{
                                      marginTop: 12,
                                      padding: '8px 12px',
                                      borderRadius: 6,
                                      border: '1px dashed #cbd5e1',
                                      background: 'repeating-linear-gradient(45deg, #f8fafc, #f8fafc 8px, #f1f5f9 8px, #f1f5f9 16px)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      fontSize: 11,
                                      color: '#64748b',
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <span style={{ fontWeight: 600, color: '#475569' }}>Historical Version v1.0:</span>
                                      <span>Initial ingestion match was 84% prior to rubric calibration.</span>
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-family-base)', fontSize: 10, color: '#10b981', fontWeight: 600 }}>
                                      +7% DELTA RECALIBRATED
                                    </span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bottom Quick-Add Row (Ref 14: f18d23524634da20b75b3b94d6925fef.jpg) */}
              <div
                style={{
                  padding: '12px 16px',
                  borderTop: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <button
                  onClick={() => navigate('create-job')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    color: '#64748b',
                    background: 'none',
                    border: 'none',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} />
                  <span>+ Ingest new candidate or upload resume bundle</span>
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Keyboard Shortcuts Hint (Ref 6: 920dba95d421aa4879c1b70e83f29021.png) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
                    <span style={{ backgroundColor: '#e2e8f0', color: '#1e293b', padding: '1px 5px', borderRadius: 3, fontFamily: 'var(--font-family-base)', fontSize: 10, fontWeight: 700 }}>J / K</span>
                    <span>Navigate</span>
                    <span style={{ color: '#cbd5e1' }}>•</span>
                    <span style={{ backgroundColor: '#e2e8f0', color: '#1e293b', padding: '1px 5px', borderRadius: 3, fontFamily: 'var(--font-family-base)', fontSize: 10, fontWeight: 700 }}>X</span>
                    <span>Select</span>
                    <span style={{ color: '#cbd5e1' }}>•</span>
                    <span style={{ backgroundColor: '#e2e8f0', color: '#1e293b', padding: '1px 5px', borderRadius: 3, fontFamily: 'var(--font-family-base)', fontSize: 10, fontWeight: 700 }}>↵</span>
                    <span>Expand</span>
                    <span style={{ color: '#cbd5e1' }}>•</span>
                    <span style={{ backgroundColor: '#e2e8f0', color: '#1e293b', padding: '1px 5px', borderRadius: 3, fontFamily: 'var(--font-family-base)', fontSize: 10, fontWeight: 700 }}>1–4</span>
                    <span>Views</span>
                  </div>

                  <span style={{ fontSize: 11, color: '#94a3b8' }}>
                    Showing {sortedCandidates.length} of {candidates.length} records
                  </span>
                </div>
              </div>

              {/* Collaboration Notes Container (Ref 7: f54bcf618ae2ce1b7f05a76f83df5b34.jpg) */}
              <div
                style={{
                  marginTop: 16,
                  backgroundColor: '#ffffff',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  padding: 16,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                      Recruiter Working Notes & Collaboration
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '1px 6px',
                        borderRadius: 9999,
                        fontWeight: 600,
                      }}
                    >
                      {teamNotes.length} Active Notes
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {['AR', 'PS', 'MK'].map((init, i) => (
                        <div
                          key={i}
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            backgroundColor: i === 0 ? '#3b82f6' : i === 1 ? '#10b981' : '#8b5cf6',
                            color: '#ffffff',
                            fontSize: 9,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #ffffff',
                            marginLeft: i > 0 ? -6 : 0,
                          }}
                        >
                          {init}
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: '#64748b' }}>Hiring Squad Connected</span>
                    <button
                      onClick={() => setCollaborationNotesOpen(!collaborationNotesOpen)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ChevronDown
                        size={14}
                        style={{
                          transform: collaborationNotesOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </button>
                  </div>
                </div>

                {collaborationNotesOpen && (
                  <>
                    {/* Notes Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginBottom: 12 }}>
                      {teamNotes.map((note) => (
                        <div
                          key={note.id}
                          style={{
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: 8,
                            padding: 12,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{note.author}</span>
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 600,
                                padding: '1px 5px',
                                borderRadius: 4,
                                backgroundColor: note.tag.includes('High') ? '#fef2f2' : '#f0fdf4',
                                color: note.tag.includes('High') ? '#991b1b' : '#166534',
                              }}
                            >
                              {note.tag}
                            </span>
                          </div>
                          <p style={{ fontSize: 12, color: '#334155', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                            {note.text}
                          </p>
                          <span style={{ fontSize: 10, color: '#94a3b8' }}>{note.time} • {note.role}</span>
                        </div>
                      ))}
                    </div>

                    {/* Add quick note input */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        value={newNoteInput}
                        onChange={(e) => setNewNoteInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newNoteInput.trim()) {
                            setTeamNotes((prev) => [
                              ...prev,
                              {
                                id: `note-${Date.now()}`,
                                author: 'You (Recruiter)',
                                role: 'Talent Lead',
                                text: newNoteInput.trim(),
                                time: 'Just now',
                                tag: 'Status: Open',
                              },
                            ]);
                            setNewNoteInput('');
                          }
                        }}
                        placeholder="+ Add working note for the hiring team (Press Enter to post)..."
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid #cbd5e1',
                          fontSize: 12,
                          backgroundColor: '#f8fafc',
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newNoteInput.trim()) {
                            setTeamNotes((prev) => [
                              ...prev,
                              {
                                id: `note-${Date.now()}`,
                                author: 'You (Recruiter)',
                                role: 'Talent Lead',
                                text: newNoteInput.trim(),
                                time: 'Just now',
                                tag: 'Status: Open',
                              },
                            ]);
                            setNewNoteInput('');
                          }
                        }}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 6,
                          border: 'none',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Post Note
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* VIEW MODE 2: STAGE KANBAN (Ref 11 & 18) */}
          {viewMode === 'kanban' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(240px, 1fr))',
                gap: 16,
                alignItems: 'start',
              }}
            >
              {(['Qualified', 'Shortlisted', 'Interviewing', 'Review'] as CandidateStatus[]).map(
                (stage) => {
                  const stageCandidates = sortedCandidates.filter((c) => c.status === stage);

                  return (
                    <div
                      key={stage}
                      style={{
                        backgroundColor: '#f1f5f9',
                        borderRadius: 10,
                        padding: 12,
                        border: '1px solid #e2e8f0',
                        minHeight: 480,
                      }}
                    >
                      {/* Column Header Banner */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 12,
                          paddingBottom: 8,
                          borderBottom: '1px solid #e2e8f0',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                            {stage}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              backgroundColor: '#ffffff',
                              color: '#475569',
                              padding: '1px 6px',
                              borderRadius: 9999,
                              fontWeight: 600,
                              border: '1px solid #cbd5e1',
                            }}
                          >
                            {stageCandidates.length}
                          </span>
                        </div>
                        <Plus size={14} style={{ color: '#64748b', cursor: 'pointer' }} />
                      </div>

                      {/* Kanban Cards (Ref 18: ad520f87e81ea391aeeb9438246ccd2d.jpg) */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {stageCandidates.map((cand) => (
                          <div
                            key={cand.id}
                            onClick={() => {
                              setActiveCandidateId(cand.id);
                              handleSelectViewMode('dossier');
                            }}
                            style={{
                              backgroundColor: '#ffffff',
                              borderRadius: 8,
                              padding: 12,
                              border: '1px solid #cbd5e1',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                              cursor: 'pointer',
                              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 6,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 10,
                                  fontFamily: 'var(--font-family-base)',
                                  color: '#64748b',
                                  fontWeight: 600,
                                  backgroundColor: '#f1f5f9',
                                  padding: '1px 5px',
                                  borderRadius: 3,
                                }}
                              >
                                {cand.id.toUpperCase()}
                              </span>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: '#10b981',
                                }}
                              >
                                {cand.matchScore}%
                              </span>
                            </div>

                            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                              {cand.name}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: '#64748b',
                                marginBottom: 8,
                              }}
                            >
                              {cand.title}
                            </div>

                            {/* Skills Badges */}
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                              {cand.skills.slice(0, 3).map((sk, sIdx) => (
                                <span
                                  key={sIdx}
                                  style={{
                                    fontSize: 10,
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    color: '#475569',
                                    padding: '1px 5px',
                                    borderRadius: 3,
                                  }}
                                >
                                  {sk}
                                </span>
                              ))}
                            </div>

                            {/* Card Footer */}
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
                              <span>{cand.experienceYears}y exp</span>
                              <span style={{ color: '#2563eb', fontWeight: 600 }}>Dossier ›</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* VIEW MODE 3: SPLIT DOSSIER CANVAS (Ref 19: 4d23e0d8f4ff0c29fd5adec2a7c94612.jpg) */}
          {viewMode === 'dossier' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(320px, 1fr) minmax(420px, 1.25fr)',
                gap: 24,
                alignItems: 'start',
              }}
            >
              {/* Left Side: Candidate Evaluation Controls Form */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  padding: 20,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Evaluation Parameters
                  </span>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>
                    Dossier Configuration
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>
                      Active Candidate
                    </label>
                    <select
                      value={activeCandidateId}
                      onChange={(e) => setActiveCandidateId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 13,
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {candidates.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.title} ({c.matchScore}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>
                      Target Compensation Bracket
                    </label>
                    <input
                      type="text"
                      value={dossierComp}
                      onChange={(e) => setDossierComp(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 13,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>
                      Hiring Manager Executive Brief
                    </label>
                    <textarea
                      rows={4}
                      value={dossierNotes}
                      onChange={(e) => setDossierNotes(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 13,
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  {/* Stage Advancement Button */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button
                      onClick={() => {
                        shortlistCandidate(activeCandidate.id);
                        showToast(`Promoted ${activeCandidate.name} to Shortlisted`, 'success');
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: 6,
                        border: 'none',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <UserCheck size={14} />
                      <span>Approve Candidate</span>
                    </button>
                    <button
                      onClick={() => {
                        createOutreachMessage({
                          candidateId: activeCandidate.id,
                          candidateName: activeCandidate.name,
                          candidateEmail: activeCandidate.email,
                          jobId: activeCandidate.appliedJobId || 'job-101',
                          jobTitle: activeCandidate.appliedJobTitle || 'Staff Engineer',
                          subject: `Executive Exchange: ${activeCandidate.name}`,
                          body: dossierNotes,
                          tone: 'Executive',
                        });
                        showToast(`Sent dossier to Hiring Manager review queue`, 'success');
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Send size={14} />
                      <span>Send to HM</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side: Live Printable Executive Briefing Document Canvas (Ref 19) */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 12,
                  border: '1px solid #cbd5e1',
                  padding: 32,
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.08)',
                  position: 'relative',
                }}
              >
                {/* Document Header with Seal */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    borderBottom: '2px solid #0f172a',
                    paddingBottom: 20,
                    marginBottom: 24,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: 'var(--font-family-base)',
                        color: '#64748b',
                        letterSpacing: '0.08em',
                      }}
                    >
                      CONFIDENTIAL TALENT DOSSIER
                    </span>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                      {activeCandidate.name}
                    </h2>
                    <div style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>
                      Target Role: {activeCandidate.title}
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: 'right',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      padding: '10px 14px',
                    }}
                  >
                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>MATCH ACCURACY</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>
                      {activeCandidate.matchScore}%
                    </div>
                    <div style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>
                      GRADE A VERIFIED
                    </div>
                    <button
                      onClick={handlePrintDossier}
                      style={{
                        marginTop: 6,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 8px',
                        borderRadius: 4,
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        fontSize: 10,
                        fontWeight: 600,
                        color: '#334155',
                        cursor: 'pointer',
                      }}
                    >
                      <Printer size={11} />
                      <span>Print Brief</span>
                    </button>
                  </div>
                </div>

                {/* Candidate Overview Meta Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 16,
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: 8,
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Total Experience</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                      {activeCandidate.experienceYears} Years Production
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Location & Visa</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                      {activeCandidate.location} (Authorized)
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Compensation Target</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                      {dossierComp}
                    </span>
                  </div>
                </div>

                {/* AI Executive Reasoning */}
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                    Executive Fit Summary
                  </h4>
                  <p style={{ fontSize: 12, lineHeight: 1.6, color: '#334155' }}>
                    {activeCandidate.aiAnalysisExplanation}
                  </p>
                </div>

                {/* Reference 20: Multidimensional Evaluation Radar */}
                <div
                  style={{
                    marginBottom: 20,
                    padding: '16px 20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#4338ca', letterSpacing: '0.04em' }}>
                        REFERENCE 20 IMPLEMENTATION
                      </span>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '2px 0 0' }}>
                        Multidimensional Evaluation Radar
                      </h4>
                    </div>
                    <span style={{ fontSize: 11, color: '#64748b' }}>
                      5-Vector Assessment
                    </span>
                  </div>
                  <CompetencyRadarChart candidate={activeCandidate} size={280} showLegend={true} />
                </div>

                {/* Verified Skills Breakdown */}
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                    Primary Competency Vectors
                  </h4>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {activeCandidate.skills.map((skill, skIdx) => (
                      <span
                        key={skIdx}
                        style={{
                          fontSize: 11,
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#0f172a',
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontWeight: 500,
                        }}
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recruiter Endorsement Block */}
                <div
                  style={{
                    borderTop: '1px dashed #cbd5e1',
                    paddingTop: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>EVALUATOR ENDORSEMENT</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
                      Talent Acquisition Lead (Demo)
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
                      color: '#475569',
                      borderBottom: '1px solid #cbd5e1',
                      padding: '0 12px',
                    }}
                  >
                    ScoutAI Certified
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 4: AI LOGIC NODES CANVAS (Ref 13 & 15) */}
          {viewMode === 'pipeline' && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                padding: 24,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                  backgroundColor: '#ffffff',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                    Candidate Ingestion & Match Execution Graph
                  </h3>
                  <p style={{ fontSize: 12, color: '#64748b' }}>
                    Visual flow representation of AI scoring, vector embedding, and bias compliance checks.
                  </p>
                </div>

                <button
                  disabled={simulatingPipeline}
                  onClick={handleRunPipelineSimulation}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: 'none',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: simulatingPipeline ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Zap size={14} />
                  <span>{simulatingPipeline ? 'Executing simulation...' : '▶ Run Pipeline Test'}</span>
                </button>
              </div>

              {/* Node Graph Cards (Ref 15: 760028c2c3399a5ce1b81533d691104d.jpg) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, minmax(200px, 1fr))',
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                {/* Node 1: Trigger */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    padding: 14,
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#d97706',
                      marginBottom: 6,
                    }}
                  >
                    <Zap size={12} />
                    <span>TRIGGER</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                    Candidate Ingest
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>
                    POST /api/webhooks/talent-inbound
                  </div>
                  <div style={{ fontSize: 10, color: '#10b981', fontWeight: 600 }}>0.0 sec latency</div>
                </div>

                {/* Node 2: Action */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    padding: 14,
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#2563eb',
                      marginBottom: 6,
                    }}
                  >
                    <Workflow size={12} />
                    <span>ACTION</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                    Resume Extraction
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>
                    Parse PDF, sanitize PII, vector tokenization
                  </div>
                  <div style={{ fontSize: 10, color: '#10b981', fontWeight: 600 }}>0.2 sec latency</div>
                </div>

                {/* Node 3: AI Inference */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #818cf8',
                    padding: 14,
                    boxShadow: '0 4px 12px -2px rgba(99, 102, 241, 0.15)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#4f46e5',
                      marginBottom: 6,
                    }}
                  >
                    <Sparkles size={12} />
                    <span>AI INFERENCE</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                    Claude 3.5 Scoring
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>
                    Compare against 6 role rubric vectors
                  </div>
                  <div style={{ fontSize: 10, color: '#4f46e5', fontWeight: 600 }}>
                    1,240 tokens consumed
                  </div>
                </div>

                {/* Node 4: Output */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    padding: 14,
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#16a34a',
                      marginBottom: 6,
                    }}
                  >
                    <CheckCircle2 size={12} />
                    <span>OUTPUT</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                    Dossier & Audit Trail
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>
                    Bias check verified, push to candidate roster
                  </div>
                  <div style={{ fontSize: 10, color: '#16a34a', fontWeight: 600 }}>Status: Ready</div>
                </div>
              </div>

              {/* Live Trace Logs Console */}
              <div
                style={{
                  backgroundColor: '#0f172a',
                  color: '#f8fafc',
                  borderRadius: 8,
                  padding: 16,
                  fontFamily: 'var(--font-family-base)',
                  fontSize: 11,
                  lineHeight: 1.6,
                }}
              >
                <div
                  style={{
                    color: '#94a3b8',
                    borderBottom: '1px solid #334155',
                    paddingBottom: 6,
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>EXECUTION TRACE LOGS</span>
                  <span>SYSTEM: HEALTHY</span>
                </div>
                {pipelineLogs.map((log, idx) => (
                  <div key={idx}>{log}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            4. RIGHT-DOCKED AI COPILOT & MODEL METRICS DRAWER (Refs 10, 20)
            ========================================================================= */}
        {copilotOpen && (
          <aside
            style={{
              backgroundColor: '#ffffff',
              borderLeft: '1px solid #e2e8f0',
              height: '100%',
              minHeight: 'calc(100vh - 120px)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 20px rgba(0,0,0,0.02)',
            }}
          >
            {/* Copilot Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={16} style={{ color: '#4f46e5' }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                    Intelligence Copilot
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    backgroundColor: '#f0fdf4',
                    color: '#166534',
                    border: '1px solid #bbf7d0',
                    padding: '2px 6px',
                    borderRadius: 9999,
                    fontWeight: 600,
                  }}
                >
                  Active • v3.4
                </span>
              </div>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>
                Synthesize match anomalies, summarize top candidates, or batch-draft executive outreach.
              </p>

              {/* Sub-tabs (Ref 20: 8fa4f00de9bd38a8514ed42bab988586.jpg) */}
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  marginTop: 12,
                  borderBottom: '1px solid #f1f5f9',
                  paddingBottom: 4,
                }}
              >
                {(['overview', 'metrics', 'traces'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCopilotTab(tab)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px 0',
                      fontSize: 12,
                      fontWeight: copilotTab === tab ? 700 : 500,
                      color: copilotTab === tab ? '#0f172a' : '#64748b',
                      borderBottom: copilotTab === tab ? '2px solid #0f172a' : 'none',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab: Overview (Interactive Prompt & Analysis) */}
            {copilotTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 16 }}>
                {/* Key Metrics Bento (Ref 20) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      padding: 10,
                    }}
                  >
                    <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>LATENCY</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>245ms</div>
                    <div style={{ fontSize: 10, color: '#10b981' }}>↓ 18ms speedup</div>
                  </div>
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      padding: 10,
                    }}
                  >
                    <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>CONFIDENCE</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>99.4%</div>
                    <div style={{ fontSize: 10, color: '#10b981' }}>↑ 0.6% precision</div>
                  </div>
                </div>

                {/* Suggestion Prompts Chips (Ref 10: 2edeb9efff5103e50fe694a0ce49bcf3.jpg) */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
                    Suggested Actions
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      'Rank top 3 matches for backend architecture',
                      'Highlight risk gaps across active candidates',
                      'Draft personalized outreach for shortlisted profiles',
                    ].map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSendCopilotMessage(prompt)}
                        style={{
                          textAlign: 'left',
                          fontSize: 11,
                          padding: '6px 10px',
                          borderRadius: 6,
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          color: '#334155',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>{prompt}</span>
                        <ChevronRight size={12} style={{ color: '#94a3b8' }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages Stream */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    marginBottom: 16,
                    maxHeight: 280,
                  }}
                >
                  {copilotMessages.map((msg, mIdx) => (
                    <div
                      key={mIdx}
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        fontSize: 12,
                        lineHeight: 1.5,
                        backgroundColor: msg.sender === 'user' ? '#0f172a' : '#f8fafc',
                        color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                        border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '92%',
                      }}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                {/* Prompt Input Box */}
                <div style={{ position: 'relative', marginTop: 'auto' }}>
                  <input
                    type="text"
                    value={copilotInput}
                    onChange={(e) => setCopilotInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendCopilotMessage();
                    }}
                    placeholder="Ask Copilot about candidates..."
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 12px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: 12,
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => handleSendCopilotMessage()}
                    style={{
                      position: 'absolute',
                      right: 6,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#4f46e5',
                      cursor: 'pointer',
                      padding: 4,
                    }}
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Metrics Bento */}
            {copilotTab === 'metrics' && (
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
                  Neural Engine Telemetry
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Hourly Ingestion Rate</div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>14.2k / hour</div>
                  </div>
                  <div style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Error Rate</div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>0.04%</div>
                  </div>
                  <div style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Vector Tokens Consumed</div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>2,410,920</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Traces */}
            {copilotTab === 'traces' && (
              <div style={{ padding: 16, fontSize: 11, fontFamily: 'var(--font-family-base)' }}>
                <div style={{ color: '#64748b', marginBottom: 8 }}>RECENT VERIFICATION LOGS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div>[14:22:01] Model: claude-3-5-sonnet matched cand-1 (91%)</div>
                  <div>[14:21:44] Bias check passed on candidate cohort</div>
                  <div>[14:20:10] Ingested 4 new applicants from Lever</div>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* =========================================================================
          5. FLOATING MULTI-SELECT ACTION DOCK (Ref 8: 4fb29d17d43b522da270c54951a8f683.png)
          ========================================================================= */}
      {selectedIds.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            borderRadius: 9999,
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
            zIndex: 300,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600 }}>
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
              }}
            >
              ✓
            </span>
            <span>{selectedIds.length} Candidates Selected</span>
          </div>

          <div style={{ height: 16, width: 1, backgroundColor: '#334155' }} />

          <button
            onClick={handleBatchShortlist}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <UserCheck size={14} style={{ color: '#10b981' }} />
            <span>Shortlist</span>
          </button>

          <button
            onClick={handleBatchOutreach}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Mail size={14} style={{ color: '#38bdf8' }} />
            <span>AI Outreach</span>
          </button>

          {selectedIds.length >= 2 && (
            <button
              onClick={() => setCompareModalOpen(true)}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.45)',
                color: '#93c5fd',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 9999,
              }}
            >
              <GitCompare size={14} style={{ color: '#60a5fa' }} />
              <span>Compare ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={() => {
              const toExport = candidates.filter((c) => selectedIds.includes(c.id));
              handleExportCSV(toExport.length > 0 ? toExport : sortedCandidates);
              setSelectedIds([]);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Download size={14} style={{ color: '#cbd5e1' }} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setSelectedIds([])}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 2,
              display: 'flex',
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* =========================================================================
          6. DESIGN REFERENCE SHOWCASE LIGHTBOX MODAL (All 20 References Mapped)
          ========================================================================= */}
      {showReferenceModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 24,
          }}
          onClick={() => setShowReferenceModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 14,
              maxWidth: 880,
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  20 Design Reference Implementations
                </h3>
                <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>
                  Verification matrix mapping each reference file from Downloads to its live ScoutAI component.
                </p>
              </div>
              <button
                onClick={() => setShowReferenceModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '16px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: 1, file: 'bc56f35e8ee29a4d525fddf2b30ae4b0.jpg', title: 'Floating Filter Popover', location: 'Top Toolbar "Filters (N)" button', desc: 'Floating card popover with category tabs, checklists, and seniority counters.' },
                { id: 2, file: '1a8c1231b71a0d272ee2e6b76af46b31.png', title: 'Operational Header Drawer', location: 'Top Header Bell Notification Icon', desc: 'Segmented tabs (Activity | Interviews | Requisitions) with colored vertical accent ribbons.' },
                { id: 3, file: '3b2da56d0f98673d03f2d8662018b627.png', title: 'Top Action Header Bar', location: 'Global App Header', desc: 'Capsule widgets, circular icon pills, and date filter segments.' },
                { id: 4, file: '243b991bb2eaea65723c3504c08a2057.png', title: 'Multi-Segment Pipeline Rail', location: 'Top of Candidate Table', desc: 'Multi-colored distribution bar breaking down Qualified, Shortlisted, and Interviewing stages.' },
                { id: 5, file: 'ad4635c44bfa9071f067030de7fde1fe.jpg', title: 'Capability & Trust Badges', location: 'Top Trust Pill Rail', desc: 'Capsule announcement pills for SOC 2 Type II, 99.4% Match Accuracy, and Fair-Hiring AI v3.4.' },
                { id: 6, file: '920dba95d421aa4879c1b70e83f29021.png', title: 'Condition Tag System', location: 'Filter Popover & Quick Chips', desc: 'Filter chips with remove [×] buttons and keyboard navigation cues.' },
                { id: 7, file: 'f54bcf618ae2ce1b7f05a76f83df5b34.jpg', title: 'Squad Working Notes Card', location: 'Beneath Candidate Table', desc: 'Collaborative notes container with squad avatar stack, priority tags, and quick-add input.' },
                { id: 8, file: '4fb29d17d43b522da270c54951a8f683.png', title: 'Floating Multi-Select Action Dock', location: 'Bottom Center Viewport', desc: 'Pill dock that slides up when rows are selected (Shortlist | AI Outreach | Export CSV).' },
                { id: 9, file: 'c52644afe1c61981064a1e4a2f90d20a.png', title: 'Column Header Action Menus', location: 'Table Column Headers', desc: 'Dropdown menus on header click (Sort Ascending, Sort Descending, Quick Filter).' },
                { id: 10, file: '2edeb9efff5103e50fe694a0ce49bcf3.jpg', title: 'SKU Table & AI Copilot Drawer', location: 'Right-Docked Drawer & Table', desc: 'Dense roster with mono reference IDs [CAN-001] and right-hand intelligence drawer.' },
                { id: 11, file: '393708a555b189af90b515e664ad86b8.jpg', title: 'Segmented View Switcher', location: 'Workspace Toolbar Mode Tabs', desc: 'Mode selector for Dense Table, Pipeline Kanban, Split Dossier, and AI Logic Nodes.' },
                { id: 12, file: '59adea8897a056b51562b357a7a4ee8b.jpg', title: 'Candidate Differential Matrix & Hierarchy', location: 'Multi-Select Compare Modal & Sub-rows', desc: 'Side-by-side technical candidate comparison matrix, matrix CSV export, and expandable sub-rows.' },
                { id: 13, file: '16954e2811169d4de46ddc00d64b0557.jpg', title: 'Execution Trace Canvas', location: 'AI Logic Nodes Mode', desc: 'Step execution cards, interactive pipeline simulation runner, and live execution trace console.' },
                { id: 14, file: 'f18d23524634da20b75b3b94d6925fef.jpg', title: 'Notion/Airtable Compact Grid', location: 'Dense Table Mode', desc: 'Row checkboxes, colored status dots, striped previous version diffs, and + Add row footer.' },
                { id: 15, file: '760028c2c3399a5ce1b81533d691104d.jpg', title: 'Visual AI Pipeline Graph', location: 'AI Logic Nodes Mode', desc: 'Dot-matrix canvas with Trigger, Extraction, Claude 3.5 Scoring, and Output cards.' },
                { id: 16, file: '091b617340c206e5c9ced281d4b05cc4.jpg', title: 'High-Density Metric Indicators', location: 'Table Rows & Column Manager', desc: 'MTWTF availability tags, weekly delta percentage tags (+4.2% avg), and vertical status pipes.' },
                { id: 17, file: '3b7e10ce952c3e304a8b14d9b17d79b4.jpg', title: 'Relational Database Header', location: 'Top Workspace Breadcrumb', desc: 'Private Tenant DB lock indicator, breadcrumbs, and view mode indicators.' },
                { id: 18, file: 'ad520f87e81ea391aeeb9438246ccd2d.jpg', title: 'Linear Sprint Kanban Board', location: 'Pipeline Kanban Mode', desc: 'Sprint column cards with priority badges, candidate avatars, and stage counters.' },
                { id: 19, file: '4d23e0d8f4ff0c29fd5adec2a7c94612.jpg', title: 'Split Dossier Canvas Preview', location: 'Split Dossier Mode', desc: 'Left configuration form side-by-side with formatted printable executive briefing sheet.' },
                { id: 20, file: '8fa4f00de9bd38a8514ed42bab988586.jpg', title: 'Multidimensional Radar & Bento Grid', location: 'Split Dossier & AI Copilot Drawer', desc: '5-vector SVG competency radar chart (Architecture, Code, Scalability, Leadership, Domain) + 4-cell Bento telemetry grid.' },
              ].map((ref) => (
                <div
                  key={ref.id}
                  onClick={() => setSelectedPreviewRef(ref as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span
                      style={{
                        fontSize: 11,
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      #{ref.id}
                    </span>

                    <img
                      src={`./references/${ref.file}`}
                      alt={ref.title}
                      style={{
                        width: 54,
                        height: 38,
                        objectFit: 'cover',
                        borderRadius: 4,
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#f1f5f9',
                        flexShrink: 0,
                      }}
                      loading="lazy"
                    />

                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                        {ref.title}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>
                        {ref.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        backgroundColor: '#eef2ff',
                        color: '#4338ca',
                        padding: '3px 8px',
                        borderRadius: 4,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {ref.location}
                    </span>
                    <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 600 }}>
                      Inspect ›
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                padding: '12px 24px',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowReferenceModal(false)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: 'none',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close Showcase
              </button>
            </div>
          </div>
        </div>
      )}
      {/* High-Resolution Reference Image Lightbox */}
      {selectedPreviewRef && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 24,
            animation: 'fadeIn 0.15s ease-out',
          }}
          onClick={() => setSelectedPreviewRef(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              maxWidth: 960,
              width: '100%',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    REF #{selectedPreviewRef.id}
                  </span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    {selectedPreviewRef.file}
                  </span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '4px 0 0' }}>
                  {selectedPreviewRef.title}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {selectedPreviewRef.location.includes('AI Logic') && (
                  <button
                    onClick={() => {
                      handleSelectViewMode('pipeline');
                      setSelectedPreviewRef(null);
                      setShowReferenceModal(false);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Jump to Logic Nodes
                  </button>
                )}
                {selectedPreviewRef.location.includes('Kanban') && (
                  <button
                    onClick={() => {
                      handleSelectViewMode('kanban');
                      setSelectedPreviewRef(null);
                      setShowReferenceModal(false);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Jump to Kanban
                  </button>
                )}
                {selectedPreviewRef.location.includes('Dossier') && (
                  <button
                    onClick={() => {
                      handleSelectViewMode('dossier');
                      setSelectedPreviewRef(null);
                      setShowReferenceModal(false);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Jump to Dossier
                  </button>
                )}
                {selectedPreviewRef.location.includes('Table') && (
                  <button
                    onClick={() => {
                      handleSelectViewMode('table');
                      setSelectedPreviewRef(null);
                      setShowReferenceModal(false);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Jump to Dense Table
                  </button>
                )}

                <button
                  onClick={() => setSelectedPreviewRef(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Close lightbox"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* High-Resolution Screenshot Image Container */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 20,
                backgroundColor: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={`./references/${selectedPreviewRef.file}`}
                alt={selectedPreviewRef.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '65vh',
                  objectFit: 'contain',
                  borderRadius: 8,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                }}
              />
            </div>

            {/* Lightbox Footer Notes */}
            <div
              style={{
                padding: '14px 24px',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#4338ca', display: 'block' }}>
                  IMPLEMENTATION LOCATION: {selectedPreviewRef.location.toUpperCase()}
                </span>
                <span style={{ fontSize: 12.5, color: '#334155', marginTop: 2, display: 'block' }}>
                  {selectedPreviewRef.desc}
                </span>
              </div>

              <button
                onClick={() => setSelectedPreviewRef(null)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                }}
              >
                Back to Showcase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reference 12: Candidate Differential Matrix Modal */}
      <CandidateComparisonModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        candidates={candidates.filter((c) => selectedIds.includes(c.id))}
        onShortlist={(id) => {
          shortlistCandidate(id);
          showToast('Updated candidate status in comparison matrix', 'success');
        }}
        onOutreach={(c) => {
          createOutreachMessage({
            candidateId: c.id,
            candidateName: c.name,
            candidateEmail: c.email,
            jobId: c.appliedJobId || 'job-101',
            jobTitle: c.appliedJobTitle || 'Staff Engineer',
            subject: 'ScoutAI Differential Shortlist: ' + c.name,
            body: 'Hi ' + c.name + ',\\n\\nFollowing our comparative technical review for the ' + (c.appliedJobTitle || 'Staff Engineer') + ' role, we would love to connect this week.',
            tone: 'Professional',
          });
          showToast('Drafted outreach for ' + c.name, 'success');
        }}
        onRemoveCandidate={(id) => {
          setSelectedIds((prev) => prev.filter((i) => i !== id));
        }}
      />
    </div>
  );
};
