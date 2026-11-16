import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Kanban,
  Table as TableIcon,
  Calendar,
  X,
  Briefcase,
  Users,
  Check,
  Star,
  MoreVertical,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  ExternalLink,
  BarChart2,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import type { Candidate, CandidateStatus } from '../types';

// Untitled UI & Gr8r Studio Exact Design Tokens (media_1794853242242_4e5b84f6 & media_1794853227719_bfbed3a8)
const TOKENS = {
  bgCanvas: '#ffffff',
  bgSubtle: '#f9fafb',
  border: '#eaecf0',
  borderDark: '#d0d5dd',
  borderLight: '#f2f4f7',

  // Typography
  textPrimary: '#101828',
  textSecondary: '#344054',
  textMuted: '#475467',
  textLight: '#667085',
  textDisabled: '#98a2b3',

  // Accent & Status Colors (from Image 1 & 5)
  successText: '#027a48',
  successBg: '#ecfdf3',
  successBorder: '#a6f4c5',

  warningText: '#b54708',
  warningBg: '#fffaeb',
  warningBorder: '#fedf89',

  errorText: '#b42318',
  errorBg: '#fef3f2',
  errorBorder: '#fecdca',

  grayTagText: '#344054',
  grayTagBg: '#f2f4f7',

  brandPrimary: '#101828',
};

export const ScoutNextGenView: React.FC = () => {
  const { candidates, jobs, shortlistCandidate, updateCandidateStatus, navigate } = useApp();
  const { showToast } = useToast();

  // Active view toggle: 'table' (Untitled UI Image 4) or 'kanban' (Gr8r Studio)
  const [viewLayout, setViewLayout] = useState<'table' | 'kanban'>('table');

  // Filter tabs (Untitled UI Image 4: View all, Documents, Spreadsheets...)
  const [activeTab, setActiveTab] = useState<'all' | 'Qualified' | 'Shortlisted' | 'Interviewing' | 'Review'>('all');

  // Segmented Control (Untitled UI Image 2: High | Medium | Low with signal bars)
  const [prioritySegment, setPrioritySegment] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Selected candidates for table checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Action dropdown menu state (Untitled UI Image 5)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Undo Toast state (Untitled UI Image 5 exact bottom toast)
  const [undoToast, setUndoToast] = useState<{
    visible: boolean;
    candidateName: string;
    action: string;
    prevStatus?: CandidateStatus;
    candidateId?: string;
  } | null>(null);

  // Pinned candidates (Untitled UI Pinned Cards row)
  const pinnedCandidates = useMemo(() => {
    return candidates.slice(0, 3);
  }, [candidates]);

  // Filtered candidate cohort
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // Tab filter
      const matchTab = activeTab === 'all' || c.status === activeTab;

      // Priority segment filter (from Image 2)
      const matchPriority =
        prioritySegment === 'all' ||
        (prioritySegment === 'high' && c.matchScore >= 90) ||
        (prioritySegment === 'medium' && c.matchScore >= 85 && c.matchScore < 90) ||
        (prioritySegment === 'low' && c.matchScore < 85);

      // Search query
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchTab && matchPriority && matchSearch;
    });
  }, [candidates, activeTab, prioritySegment, searchQuery]);

  // Handle select all checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredCandidates.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Handle individual row select
  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // Perform candidate action with Untitled UI Toast (Image 5)
  const handleAction = (candidate: Candidate, actionName: string, newStatus?: CandidateStatus) => {
    setOpenMenuId(null);
    if (newStatus) {
      const prev = candidate.status;
      updateCandidateStatus(candidate.id, newStatus);
      setUndoToast({
        visible: true,
        candidateName: candidate.name,
        action: actionName,
        prevStatus: prev,
        candidateId: candidate.id,
      });
    } else if (actionName === 'shortlist') {
      shortlistCandidate(candidate.id);
      setUndoToast({
        visible: true,
        candidateName: candidate.name,
        action: 'shortlisted for client review',
      });
    } else {
      showToast(`${actionName} triggered for ${candidate.name}`, 'info');
    }
  };

  // Undo action from Toast
  const handleUndo = () => {
    if (undoToast?.candidateId && undoToast?.prevStatus) {
      updateCandidateStatus(undoToast.candidateId, undoToast.prevStatus);
      showToast(`Restored ${undoToast.candidateName} back to ${undoToast.prevStatus}`, 'info');
    }
    setUndoToast(null);
  };

  // Workflows mock data (Exact Image 1 media_1794853224937_ffd9d477)
  const workflowsList = [
    { title: 'AI Screening & Resume Parser', version: 'V1', status: 'Active', runs: '142' },
    { title: 'Salary Benchmark Calibration', version: 'V2', status: 'Paused', runs: '38' },
    { title: 'Technical Rubric Generator', version: 'V3', status: 'Draft', runs: '24' },
    { title: 'Executive Offer Pipeline', version: 'V1', status: 'Archived', runs: '12' },
  ];

  // Recent activity mock data (Exact Image 1 media_1794853224937_ffd9d477)
  const recentActivities = [
    { name: 'Leo Marchetti', action: 'updated candidate status', target: 'Sarah Chen · Shortlisted', time: '12m ago', avatar: 'LM' },
    { name: 'Aqib Javed', action: 'scheduled technical round', target: 'Rajesh Menon · Tomorrow 2:30 PM', time: '34m ago', avatar: 'AJ' },
    { name: 'Dr. Sameer Kulkarni', action: 'submitted interview scorecard', target: 'Ananya Sharma · Grade A (94%)', time: '1h ago', avatar: 'SK' },
    { name: 'Aarav Mehta', action: 'ingested candidates via ATS', target: '6 candidates from Greenhouse', time: '3h ago', avatar: 'AM' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        fontFamily: 'var(--font-family-base, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        color: TOKENS.textPrimary,
        maxWidth: 1600,
        margin: '0 auto',
        paddingBottom: 60,
      }}
    >
      {/* ───────────────────────────────────────────────────────────
          1. UNTITLED UI HEADER (Image 4: All files / Manage cloud files)
      ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: TOKENS.textPrimary,
              letterSpacing: '-0.025em',
              margin: 0,
            }}
          >
            All Candidates
          </h1>
          <p style={{ fontSize: 14, color: TOKENS.textMuted, margin: '4px 0 0 0' }}>
            Manage active requisitions, pipeline dossiers, and candidate screening across {jobs.length} roles.
          </p>
        </div>

        {/* View Switcher: Table View (Untitled UI) | Kanban Board (Gr8r Studio) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'inline-flex', background: TOKENS.bgSubtle, padding: 3, borderRadius: 8, border: `1px solid ${TOKENS.border}` }}>
            <button
              type="button"
              onClick={() => setViewLayout('table')}
              style={{
                height: 32,
                padding: '0 12px',
                borderRadius: 6,
                border: 'none',
                background: viewLayout === 'table' ? '#ffffff' : 'transparent',
                color: viewLayout === 'table' ? TOKENS.textPrimary : TOKENS.textMuted,
                fontSize: 13,
                fontWeight: viewLayout === 'table' ? 600 : 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: viewLayout === 'table' ? '0 1px 3px rgba(16, 24, 40, 0.08)' : 'none',
              }}
            >
              <TableIcon size={14} />
              <span>Table View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewLayout('kanban')}
              style={{
                height: 32,
                padding: '0 12px',
                borderRadius: 6,
                border: 'none',
                background: viewLayout === 'kanban' ? '#ffffff' : 'transparent',
                color: viewLayout === 'kanban' ? TOKENS.textPrimary : TOKENS.textMuted,
                fontSize: 13,
                fontWeight: viewLayout === 'kanban' ? 600 : 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: viewLayout === 'kanban' ? '0 1px 3px rgba(16, 24, 40, 0.08)' : 'none',
              }}
            >
              <Kanban size={14} />
              <span>Kanban Board</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('create-job')}
            style={{
              height: 36,
              padding: '0 16px',
              borderRadius: 8,
              border: 'none',
              background: TOKENS.brandPrimary,
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 1px 2px rgba(16, 24, 40, 0.05)',
            }}
          >
            <Plus size={15} />
            <span>Post Requisition</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          2. UNTITLED UI 4-ACTION CARDS (Image 4 Exact Header Grid)
             New document / New spreadsheet / New project / New team
             -> Adapted to ScoutAI: Requisition / Ingest / Interview / Match
      ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        {[
          { label: 'Post Requisition', icon: Briefcase, action: () => navigate('create-job'), desc: 'Draft new hiring requirements' },
          { label: 'Ingest Candidates', icon: Users, action: () => showToast('ATS Ingestion Sync started from Greenhouse', 'info'), desc: 'Sync resumes & LinkedIn profiles' },
          { label: 'Schedule Interview', icon: Calendar, action: () => navigate('interviews'), desc: 'Coordinate technical screen' },
          { label: 'AI Talent Match', icon: Sparkles, action: () => showToast('Autonomous AI match matrix recomputed', 'success'), desc: '5-dimensional rubric scoring' },
        ].map((actionCard, i) => {
          const Icon = actionCard.icon;
          return (
            <div
              key={i}
              onClick={actionCard.action}
              style={{
                background: '#ffffff',
                border: `1px solid ${TOKENS.border}`,
                borderRadius: 12,
                padding: '16px 18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 2px rgba(16, 24, 40, 0.03)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = TOKENS.borderDark;
                e.currentTarget.style.boxShadow = '0 4px 8px -2px rgba(16, 24, 40, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = TOKENS.border;
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(16, 24, 40, 0.03)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: TOKENS.bgSubtle,
                    border: `1px solid ${TOKENS.borderLight}`,
                    display: 'grid',
                    placeItems: 'center',
                    color: TOKENS.textPrimary,
                  }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: TOKENS.textPrimary }}>{actionCard.label}</div>
                  <div style={{ fontSize: 11.5, color: TOKENS.textLight }}>{actionCard.desc}</div>
                </div>
              </div>
              <Plus size={16} style={{ color: TOKENS.textDisabled }} />
            </div>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────
          3. UNTITLED UI PINNED HIGHLIGHT CARDS (Image 4 Exact Row)
             Q4_2028 Reporting / Dashboard tech requirements / FY_2027-28 Financials
             -> Adapted to ScoutAI: Top Pinned Candidate Matches with Star
      ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
        {pinnedCandidates.map((c) => (
          <div
            key={c.id}
            onClick={() => handleAction(c, 'view dossier')}
            style={{
              background: '#ffffff',
              border: `1px solid ${TOKENS.border}`,
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(16, 24, 40, 0.03)',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = TOKENS.borderDark)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = TOKENS.border)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: TOKENS.bgSubtle,
                  border: `1px solid ${TOKENS.borderLight}`,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 700,
                  fontSize: 12,
                  color: TOKENS.textPrimary,
                }}
              >
                {c.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TOKENS.textPrimary }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: TOKENS.textLight }}>
                  {c.title.split('(')[0]} · <strong style={{ color: TOKENS.successText }}>{c.matchScore}% Match</strong>
                </div>
              </div>
            </div>
            <Star size={15} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
          </div>
        ))}
      </div>

      {/* ───────────────────────────────────────────────────────────
          4. UNTITLED UI SUBHEADER & SEGMENTED CONTROLS (Image 2 & Image 4)
             View all / Documents / Spreadsheets ... + High / Med / Low Signal
      ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          paddingBottom: 4,
          borderBottom: `1px solid ${TOKENS.border}`,
        }}
      >
        {/* Left: Tab items (View all, Screened, Shortlisted, Interviewing) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'View all', count: candidates.length },
            { id: 'Qualified', label: 'Screened & Qualified', count: candidates.filter((c) => c.status === 'Qualified').length },
            { id: 'Shortlisted', label: 'Shortlisted', count: candidates.filter((c) => c.status === 'Shortlisted').length },
            { id: 'Interviewing', label: 'Interviewing', count: candidates.filter((c) => c.status === 'Interviewing').length },
            { id: 'Review', label: 'Hiring Review', count: candidates.filter((c) => c.status === 'Review').length },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  height: 34,
                  padding: '0 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: active ? TOKENS.bgSubtle : 'transparent',
                  color: active ? TOKENS.textPrimary : TOKENS.textMuted,
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    padding: '1px 6px',
                    borderRadius: 9999,
                    background: active ? '#ffffff' : TOKENS.bgSubtle,
                    border: `1px solid ${TOKENS.borderLight}`,
                    color: active ? TOKENS.textPrimary : TOKENS.textLight,
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Search, Priority Segmenter (Image 2 Exact), and Filter button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Exact Segmented Control from Image 2 (media_1794853227719_bfbed3a8.png) */}
          <div
            style={{
              display: 'inline-flex',
              background: '#f2f4f7',
              padding: 3,
              borderRadius: 8,
              gap: 2,
            }}
          >
            {[
              { id: 'all', label: 'All', icon: BarChart2 },
              { id: 'high', label: 'High', icon: BarChart2 },
              { id: 'medium', label: 'Medium', icon: BarChart2 },
              { id: 'low', label: 'Low', icon: BarChart2 },
            ].map((seg) => {
              const active = prioritySegment === seg.id;
              const Icon = seg.icon;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setPrioritySegment(seg.id as any)}
                  style={{
                    height: 28,
                    padding: '0 10px',
                    borderRadius: 6,
                    border: 'none',
                    background: active ? '#ffffff' : 'transparent',
                    color: active ? TOKENS.textPrimary : TOKENS.textMuted,
                    fontSize: 12,
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    boxShadow: active ? '0 1px 3px rgba(16, 24, 40, 0.08)' : 'none',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <Icon size={12} style={{ color: active ? TOKENS.textPrimary : TOKENS.textLight }} />
                  <span>{seg.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: 220 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 9, color: TOKENS.textLight }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              style={{
                width: '100%',
                height: 32,
                paddingLeft: 30,
                paddingRight: 10,
                borderRadius: 8,
                border: `1px solid ${TOKENS.borderDark}`,
                background: '#ffffff',
                fontSize: 12.5,
                outline: 'none',
                color: TOKENS.textPrimary,
              }}
            />
          </div>

          {/* Filters Button */}
          <button
            type="button"
            onClick={() => showToast('Filters drawer opened', 'info')}
            style={{
              height: 32,
              padding: '0 12px',
              borderRadius: 8,
              border: `1px solid ${TOKENS.borderDark}`,
              background: '#ffffff',
              color: TOKENS.textSecondary,
              fontSize: 12.5,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <SlidersHorizontal size={13} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          5. UNTITLED UI HIGH-DENSITY TABLE (Image 4 & Image 5 Exact Layout)
      ─────────────────────────────────────────────────────────── */}
      {viewLayout === 'table' && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 12,
            border: `1px solid ${TOKENS.border}`,
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.03)',
            overflow: 'visible',
            position: 'relative',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#ffffff', borderBottom: `1px solid ${TOKENS.border}` }}>
                <th style={{ width: 44, padding: '12px 16px' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredCandidates.length && filteredCandidates.length > 0}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer', borderRadius: 4 }}
                  />
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: TOKENS.textLight, fontSize: 12 }}>Candidate & Role</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: TOKENS.textLight, fontSize: 12 }}>Target Requisition</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: TOKENS.textLight, fontSize: 12 }}>Verified Skills</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: TOKENS.textLight, fontSize: 12 }}>AI Match</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: TOKENS.textLight, fontSize: 12 }}>Lead Recruiter</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: TOKENS.textLight, fontSize: 12 }}>Last Evaluated</th>
                <th style={{ width: 44, padding: '12px 16px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((c) => {
                const isSelected = selectedIds.includes(c.id);
                return (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: `1px solid ${TOKENS.borderLight}`,
                      background: isSelected ? TOKENS.bgSubtle : 'transparent',
                      transition: 'background 0.1s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = TOKENS.bgSubtle;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {/* Checkbox */}
                    <td style={{ padding: '12px 16px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(c.id)}
                        style={{ cursor: 'pointer', borderRadius: 4 }}
                      />
                    </td>

                    {/* Candidate Name & Email */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            background: TOKENS.brandPrimary,
                            color: '#ffffff',
                            display: 'grid',
                            placeItems: 'center',
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          {c.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: TOKENS.textPrimary }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: TOKENS.textLight }}>{c.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Target Requisition */}
                    <td style={{ padding: '12px 16px', color: TOKENS.textSecondary }}>
                      <div style={{ fontWeight: 500 }}>{c.title}</div>
                      <div style={{ fontSize: 11.5, color: TOKENS.textLight }}>{c.experienceYears} Years Production</div>
                    </td>

                    {/* Verified Skills */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {c.skills.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            style={{
                              fontSize: 11,
                              background: TOKENS.bgSubtle,
                              color: TOKENS.textSecondary,
                              padding: '2px 7px',
                              borderRadius: 4,
                              border: `1px solid ${TOKENS.borderLight}`,
                            }}
                          >
                            {s}
                          </span>
                        ))}
                        {c.skills.length > 2 && (
                          <span style={{ fontSize: 11, color: TOKENS.textLight, padding: '2px 4px' }}>
                            +{c.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* AI Match Accuracy Badge */}
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: c.matchScore >= 90 ? TOKENS.successText : TOKENS.warningText,
                          background: c.matchScore >= 90 ? TOKENS.successBg : TOKENS.warningBg,
                          border: `1px solid ${c.matchScore >= 90 ? TOKENS.successBorder : TOKENS.warningBorder}`,
                          padding: '2px 8px',
                          borderRadius: 9999,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: c.matchScore >= 90 ? TOKENS.successText : TOKENS.warningText,
                          }}
                        />
                        {c.matchScore}% Match
                      </span>
                    </td>

                    {/* Lead Recruiter (Untitled UI Uploaded by pattern) */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: '50%',
                            background: '#e0e7ff',
                            color: '#4338ca',
                            display: 'grid',
                            placeItems: 'center',
                            fontWeight: 700,
                            fontSize: 10,
                          }}
                        >
                          AM
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 500, color: TOKENS.textPrimary }}>Aarav Mehta</div>
                          <div style={{ fontSize: 11, color: TOKENS.textLight }}>aarav@scoutai.com</div>
                        </div>
                      </div>
                    </td>

                    {/* Last Evaluated Date */}
                    <td style={{ padding: '12px 16px', color: TOKENS.textMuted, fontSize: 12 }}>
                      Aug 15, 2026
                    </td>

                    {/* Action Menu (Untitled UI Image 5 Exact Menu) */}
                    <td style={{ padding: '12px 16px', position: 'relative' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === c.id ? null : c.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: TOKENS.textLight,
                          cursor: 'pointer',
                          padding: 4,
                          borderRadius: 4,
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Menu (Exact Image 5 media_1794853260141_34b54a61) */}
                      {openMenuId === c.id && (
                        <div
                          style={{
                            position: 'absolute',
                            right: 20,
                            top: 40,
                            width: 210,
                            background: '#ffffff',
                            borderRadius: 10,
                            border: `1px solid ${TOKENS.border}`,
                            boxShadow: '0 12px 24px -4px rgba(16, 24, 40, 0.12), 0 4px 6px -2px rgba(16, 24, 40, 0.04)',
                            padding: '6px',
                            zIndex: 100,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleAction(c, 'View Dossier')}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              border: 'none',
                              background: 'transparent',
                              borderRadius: 6,
                              textAlign: 'left',
                              fontSize: 12.5,
                              color: TOKENS.textSecondary,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = TOKENS.bgSubtle)}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <ExternalLink size={14} />
                            <span>View Full Dossier</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAction(c, 'shortlisted for client', 'Shortlisted')}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              border: 'none',
                              background: 'transparent',
                              borderRadius: 6,
                              textAlign: 'left',
                              fontSize: 12.5,
                              color: TOKENS.textSecondary,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = TOKENS.bgSubtle)}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <UserCheck size={14} />
                            <span>Shortlist for Client</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAction(c, 'interview scheduled', 'Interviewing')}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              border: 'none',
                              background: 'transparent',
                              borderRadius: 6,
                              textAlign: 'left',
                              fontSize: 12.5,
                              color: TOKENS.textSecondary,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = TOKENS.bgSubtle)}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Calendar size={14} />
                            <span>Schedule Interview</span>
                          </button>

                          <div style={{ height: 1, background: TOKENS.borderLight, margin: '4px 0' }} />

                          <button
                            type="button"
                            onClick={() => handleAction(c, 'archived candidate', 'Archived')}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              border: 'none',
                              background: 'transparent',
                              borderRadius: 6,
                              textAlign: 'left',
                              fontSize: 12.5,
                              color: TOKENS.errorText,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = TOKENS.errorBg)}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Trash2 size={14} />
                            <span>Archive Candidate</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Untitled UI Pagination Bar (Image 4 Exact Layout) */}
          <div
            style={{
              padding: '12px 20px',
              borderTop: `1px solid ${TOKENS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 13,
              color: TOKENS.textMuted,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>Page 1 of 3</span>
              <span style={{ color: TOKENS.textDisabled }}>|</span>
              <span>Rows per page: <strong>7</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                type="button"
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 6,
                  border: `1px solid ${TOKENS.borderDark}`,
                  background: '#ffffff',
                  color: TOKENS.textSecondary,
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronsLeft size={14} />
              </button>
              <button
                type="button"
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 6,
                  border: `1px solid ${TOKENS.borderDark}`,
                  background: '#ffffff',
                  color: TOKENS.textSecondary,
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={14} />
              </button>

              <button
                type="button"
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 6,
                  border: `1px solid ${TOKENS.brandPrimary}`,
                  background: TOKENS.brandPrimary,
                  color: '#ffffff',
                  fontWeight: 600,
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                1
              </button>
              <button
                type="button"
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 6,
                  border: `1px solid ${TOKENS.borderDark}`,
                  background: '#ffffff',
                  color: TOKENS.textSecondary,
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                2
              </button>
              <button
                type="button"
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 6,
                  border: `1px solid ${TOKENS.borderDark}`,
                  background: '#ffffff',
                  color: TOKENS.textSecondary,
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                3
              </button>

              <button
                type="button"
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 6,
                  border: `1px solid ${TOKENS.borderDark}`,
                  background: '#ffffff',
                  color: TOKENS.textSecondary,
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronRight size={14} />
              </button>
              <button
                type="button"
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 6,
                  border: `1px solid ${TOKENS.borderDark}`,
                  background: '#ffffff',
                  color: TOKENS.textSecondary,
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronsRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          5B. KANBAN BOARD VIEW (Gr8r Studio Reference HW5e_yKbQAAnb-T)
      ─────────────────────────────────────────────────────────── */}
      {viewLayout === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, alignItems: 'start' }}>
          {(['Qualified', 'Shortlisted', 'Interviewing', 'Review'] as CandidateStatus[]).map((stage) => {
            const colCandidates = filteredCandidates.filter((c) => c.status === stage);
            return (
              <div
                key={stage}
                style={{
                  background: TOKENS.bgSubtle,
                  borderRadius: 12,
                  border: `1px solid ${TOKENS.border}`,
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: stage === 'Shortlisted' ? TOKENS.successText : TOKENS.brandPrimary }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: TOKENS.textPrimary }}>{stage}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: TOKENS.textMuted, background: '#ffffff', padding: '1px 6px', borderRadius: 9999, border: `1px solid ${TOKENS.border}` }}>
                    {colCandidates.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {colCandidates.map((cand) => (
                    <div
                      key={cand.id}
                      style={{
                        background: '#ffffff',
                        border: `1px solid ${TOKENS.border}`,
                        borderRadius: 10,
                        padding: '12px 14px',
                        boxShadow: '0 1px 2px rgba(16, 24, 40, 0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: TOKENS.successText, background: TOKENS.successBg, padding: '2px 6px', borderRadius: 4 }}>
                          {cand.matchScore}% Match
                        </span>
                        <span style={{ fontSize: 11, color: TOKENS.textLight }}>{cand.experienceYears}y exp</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5, color: TOKENS.textPrimary }}>{cand.name}</div>
                        <div style={{ fontSize: 12, color: TOKENS.textLight }}>{cand.title}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {cand.skills.slice(0, 3).map((s) => (
                          <span key={s} style={{ fontSize: 10.5, background: TOKENS.bgSubtle, color: TOKENS.textSecondary, padding: '2px 5px', borderRadius: 4 }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          6. WORKFLOWS & RECENT ACTIVITY SECTION (Exact Image 1 media_1794853224937_ffd9d477)
      ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 16 }}>
        {/* Workflows Table (Image 1 Exact) */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 12,
            border: `1px solid ${TOKENS.border}`,
            padding: '20px',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.03)',
          }}
        >
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: TOKENS.textPrimary, margin: 0 }}>
              Workflows
            </h3>
            <p style={{ fontSize: 12.5, color: TOKENS.textMuted, margin: '2px 0 0 0' }}>
              Automated talent indexing, salary calibration, and panel scoring pipelines.
            </p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${TOKENS.border}`, color: TOKENS.textLight }}>
                <th style={{ padding: '8px 10px', fontWeight: 600 }}>Title</th>
                <th style={{ padding: '8px 10px', fontWeight: 600 }}>Version</th>
                <th style={{ padding: '8px 10px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '8px 10px', fontWeight: 600 }}>Runs</th>
              </tr>
            </thead>
            <tbody>
              {workflowsList.map((wf, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${TOKENS.borderLight}` }}>
                  <td style={{ padding: '10px', fontWeight: 500, color: TOKENS.textPrimary }}>{wf.title}</td>
                  <td style={{ padding: '10px', color: TOKENS.textLight }}>{wf.version}</td>
                  <td style={{ padding: '10px' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: 4,
                        background:
                          wf.status === 'Active'
                            ? TOKENS.successBg
                            : wf.status === 'Paused'
                            ? TOKENS.warningBg
                            : TOKENS.grayTagBg,
                        color:
                          wf.status === 'Active'
                            ? TOKENS.successText
                            : wf.status === 'Paused'
                            ? TOKENS.warningText
                            : TOKENS.grayTagText,
                      }}
                    >
                      {wf.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px', color: TOKENS.textMuted }}>{wf.runs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activity List (Image 1 Exact) */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 12,
            border: `1px solid ${TOKENS.border}`,
            padding: '20px',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.03)',
          }}
        >
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: TOKENS.textPrimary, margin: 0 }}>
              Recent activity
            </h3>
            <p style={{ fontSize: 12.5, color: TOKENS.textMuted, margin: '2px 0 0 0' }}>
              Real-time audit log of recruiter determinations and pipeline updates.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentActivities.map((act, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: TOKENS.bgSubtle,
                      border: `1px solid ${TOKENS.borderLight}`,
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                      fontSize: 10.5,
                      color: TOKENS.textPrimary,
                    }}
                  >
                    {act.avatar}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, color: TOKENS.textPrimary }}>{act.name}</span>{' '}
                    <span style={{ color: TOKENS.textLight }}>{act.action}</span>{' '}
                    <strong style={{ color: TOKENS.textSecondary }}>{act.target}</strong>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: TOKENS.textDisabled }}>{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          7. UNTITLED UI EXACT TOAST NOTIFICATION (Image 5 media_1794853260141_34b54a61)
             "Dashboard requirements v2" deleted · Dismiss · Restore file
      ─────────────────────────────────────────────────────────── */}
      {undoToast && undoToast.visible && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 380,
            background: '#ffffff',
            borderRadius: 12,
            border: `1px solid ${TOKENS.border}`,
            boxShadow: '0 12px 24px -4px rgba(16, 24, 40, 0.12), 0 4px 6px -2px rgba(16, 24, 40, 0.04)',
            padding: '16px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            animation: 'boarduiDropdownEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: TOKENS.successBg,
                  display: 'grid',
                  placeItems: 'center',
                  color: TOKENS.successText,
                }}
              >
                <Check size={16} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TOKENS.textPrimary }}>
                  "{undoToast.candidateName}" {undoToast.action}
                </div>
                <div style={{ fontSize: 11.5, color: TOKENS.textMuted }}>
                  Changes have been updated in pipeline registry.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setUndoToast(null)}
              style={{ background: 'none', border: 'none', color: TOKENS.textLight, cursor: 'pointer', padding: 2 }}
            >
              <X size={15} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, paddingLeft: 42 }}>
            <button
              type="button"
              onClick={() => setUndoToast(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: 12,
                fontWeight: 600,
                color: TOKENS.textMuted,
                cursor: 'pointer',
              }}
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={handleUndo}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: 12,
                fontWeight: 600,
                color: TOKENS.textPrimary,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <RotateCcw size={12} />
              <span>Restore state</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
