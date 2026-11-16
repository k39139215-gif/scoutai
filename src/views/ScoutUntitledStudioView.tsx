import React, { useState, useMemo } from 'react';
import {
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
  UserCheck,
  Sparkles,
  Wifi,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import type { Candidate, CandidateStatus } from '../types';

/* ─────────────────────────────────────────────────────────────────────────────
   EXACT DESIGN SYSTEM TOKENS (Sampled from Untitled UI media_1794853242242_4e5b84f6
   and media_1794853227719_bfbed3a8 & media_1794853260141_34b54a61)
───────────────────────────────────────────────────────────────────────────── */
const DS = {
  // Surfaces & Backgrounds
  surfaceWhite: '#ffffff',
  surfaceCard: '#fafafa',
  surfaceSubtle: '#f9fafb',
  surfaceActive: '#f2f4f7',
  
  // Borders
  borderLight: '#f2f4f7',
  borderDefault: '#eaecf0',
  borderDark: '#d0d5dd',

  // Typography (HSL: 220deg, 40%, 11%)
  textPrimary: '#101828',    // Deep Rich Ink
  textSecondary: '#344054',  // Slate Charcoal
  textMuted: '#475467',      // Balanced Neutral Gray
  textLight: '#667085',      // Column Header / Caption
  textDisabled: '#98a2b3',   // Muted Icons / Placeholders

  // Semantic Pill Tints (Image 1 & 5 exact match)
  successText: '#027a48',
  successBg: '#ecfdf3',
  successBorder: '#a6f4c5',

  warningText: '#b54708',
  warningBg: '#fffaeb',
  warningBorder: '#fedf89',

  errorText: '#b42318',
  errorBg: '#fef3f2',
  errorBorder: '#fecdca',

  brandDark: '#101828',
};

export const ScoutUntitledStudioView: React.FC = () => {
  const { candidates, jobs, shortlistCandidate, updateCandidateStatus, navigate } = useApp();
  const { showToast } = useToast();

  // Layout View Switcher: Table View (Untitled UI) or Kanban Board (Gr8r Studio)
  const [viewLayout, setViewLayout] = useState<'table' | 'kanban'>('table');

  // Filter Tabs (Image 4: View all, Documents, Spreadsheets...)
  const [activeTab, setActiveTab] = useState<'all' | 'Qualified' | 'Shortlisted' | 'Interviewing' | 'Review'>('all');

  // Exact 3-Bar Signal Segmented Control (Image 2: High | Medium | Low)
  const [prioritySegment, setPrioritySegment] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Live search query
  const [searchQuery, setSearchQuery] = useState('');

  // Table row multi-selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Action Menu Popover (Image 5)
  const [openMenuCandidateId, setOpenMenuCandidateId] = useState<string | null>(null);

  // Available offline toggle states per candidate (Image 5 toggle switch)
  const [offlineToggles, setOfflineToggles] = useState<Record<string, boolean>>({
    'cand-1': true,
    'cand-2': true,
  });

  // Undo Toast Notification (Image 5 exact floating toast)
  const [toastState, setToastState] = useState<{
    visible: boolean;
    candidateName: string;
    actionMessage: string;
    candidateId?: string;
    prevStatus?: CandidateStatus;
  } | null>(null);

  // Pinned Candidates (Image 4 Pinned Highlight Cards)
  const pinnedCandidates = useMemo(() => {
    return candidates.slice(0, 3);
  }, [candidates]);

  // Filtered candidate list
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchTab = activeTab === 'all' || c.status === activeTab;
      const matchPriority =
        prioritySegment === 'all' ||
        (prioritySegment === 'high' && c.matchScore >= 90) ||
        (prioritySegment === 'medium' && c.matchScore >= 85 && c.matchScore < 90) ||
        (prioritySegment === 'low' && c.matchScore < 85);
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchTab && matchPriority && matchSearch;
    });
  }, [candidates, activeTab, prioritySegment, searchQuery]);

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredCandidates.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // Perform candidate status change & show Image 5 Toast
  const handlePerformAction = (candidate: Candidate, actionName: string, newStatus?: CandidateStatus) => {
    setOpenMenuCandidateId(null);
    if (newStatus) {
      const prev = candidate.status;
      updateCandidateStatus(candidate.id, newStatus, true);
      setToastState({
        visible: true,
        candidateName: candidate.name,
        actionMessage: actionName,
        candidateId: candidate.id,
        prevStatus: prev,
      });
    } else if (actionName === 'shortlist') {
      shortlistCandidate(candidate.id);
      setToastState({
        visible: true,
        candidateName: candidate.name,
        actionMessage: 'shortlisted for client review',
      });
    } else {
      showToast(`${actionName} triggered for ${candidate.name}`, 'info');
    }
  };

  // Handle Restore / Undo from Toast
  const handleRestoreState = () => {
    if (toastState?.candidateId && toastState?.prevStatus) {
      updateCandidateStatus(toastState.candidateId, toastState.prevStatus);
      showToast(`Restored ${toastState.candidateName} back to "${toastState.prevStatus}"`, 'info');
    }
    setToastState(null);
  };

  // Toggle offline cache switch (Image 5)
  const toggleOffline = (candId: string) => {
    setOfflineToggles((prev) => ({
      ...prev,
      [candId]: !prev[candId],
    }));
    showToast(`Offline dossier cache ${offlineToggles[candId] ? 'disabled' : 'enabled'}`, 'info');
  };

  // Workflows Table mock data (Exact Image 1 media_1794853224937_ffd9d477)
  const workflows = [
    { title: 'AI Screening & Resume Parser', version: 'V1', status: 'Active', runs: '142' },
    { title: 'Salary Benchmark Calibration', version: 'V2', status: 'Paused', runs: '38' },
    { title: 'Technical Scorecard Generation', version: 'V3', status: 'Draft', runs: '24' },
    { title: 'Executive Offer Approval', version: 'V1', status: 'Archived', runs: '12' },
  ];

  // Recent Activity audit feed (Exact Image 1 media_1794853224937_ffd9d477)
  const recentActivities = [
    { name: 'Leo Marchetti', action: 'updated candidate status', target: 'Sarah Chen · Shortlisted', time: '12m ago', initials: 'LM' },
    { name: 'Aqib Javed', action: 'scheduled technical pairing', target: 'Rajesh Menon · Tomorrow 2:30 PM', time: '34m ago', initials: 'AJ' },
    { name: 'Dr. Sameer Kulkarni', action: 'evaluated rubric scorecard', target: 'Ananya Sharma · Grade A (94%)', time: '1h ago', initials: 'SK' },
    { name: 'Aarav Mehta', action: 'ingested candidates via ATS', target: '6 profiles from Greenhouse', time: '3h ago', initials: 'AM' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        fontFamily: 'var(--font-family-base, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        color: DS.textPrimary,
        maxWidth: 1600,
        margin: '0 auto',
        paddingBottom: 80,
      }}
    >
      {/* ───────────────────────────────────────────────────────────
          1. UNTITLED UI PAGE HEADER (Image 4 Exact Composition)
             "All files / Manage cloud files and projects here."
             -> "All Candidates / Manage candidate pipeline, technical dossiers..."
      ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: DS.textPrimary,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            All Candidates
          </h1>
          <p style={{ fontSize: 14, color: DS.textMuted, margin: '4px 0 0 0', fontWeight: 400 }}>
            Manage active requisitions, pipeline dossiers, and candidate screening across {jobs.length} open roles.
          </p>
        </div>

        {/* Action Controls: Table/Kanban Switcher & Primary Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              display: 'inline-flex',
              background: DS.surfaceSubtle,
              padding: 3,
              borderRadius: 8,
              border: `1px solid ${DS.borderDefault}`,
            }}
          >
            <button
              type="button"
              onClick={() => setViewLayout('table')}
              style={{
                height: 32,
                padding: '0 12px',
                borderRadius: 6,
                border: 'none',
                background: viewLayout === 'table' ? '#ffffff' : 'transparent',
                color: viewLayout === 'table' ? DS.textPrimary : DS.textMuted,
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
                color: viewLayout === 'kanban' ? DS.textPrimary : DS.textMuted,
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
              background: DS.brandDark,
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
          2. UNTITLED UI 4 QUICK-ACTION CARDS (Image 4 Exact Header Grid)
             New document / New spreadsheet / New project / New team
             -> Post Requisition / Ingest Candidates / Schedule Interview / AI Talent Match
      ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        {[
          { label: 'Post Requisition', icon: Briefcase, action: () => navigate('create-job'), desc: 'Draft new hiring requirements' },
          { label: 'Ingest Candidates', icon: Users, action: () => showToast('ATS Ingestion Sync started from Greenhouse', 'info'), desc: 'Sync resumes & LinkedIn profiles' },
          { label: 'Schedule Interview', icon: Calendar, action: () => navigate('interviews'), desc: 'Coordinate technical screen' },
          { label: 'AI Talent Match', icon: Sparkles, action: () => showToast('Autonomous AI match matrix recomputed', 'success'), desc: '5-dimensional rubric scoring' },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={card.action}
              style={{
                background: '#ffffff',
                border: `1px solid ${DS.borderDefault}`,
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
                e.currentTarget.style.borderColor = DS.borderDark;
                e.currentTarget.style.boxShadow = '0 4px 10px -2px rgba(16, 24, 40, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = DS.borderDefault;
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(16, 24, 40, 0.03)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: DS.surfaceSubtle,
                    border: `1px solid ${DS.borderLight}`,
                    display: 'grid',
                    placeItems: 'center',
                    color: DS.textPrimary,
                  }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: DS.textPrimary }}>{card.label}</div>
                  <div style={{ fontSize: 11.5, color: DS.textLight }}>{card.desc}</div>
                </div>
              </div>
              <Plus size={16} style={{ color: DS.textDisabled }} />
            </div>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────
          3. UNTITLED UI PINNED HIGHLIGHT CARDS (Image 4 Exact Row)
             Q4_2028 Reporting / Dashboard tech requirements / FY_2027-28 Financials
             -> Top Matched Pinned Candidates with Star
      ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
        {pinnedCandidates.map((c) => (
          <div
            key={c.id}
            onClick={() => handlePerformAction(c, 'view dossier')}
            style={{
              background: '#ffffff',
              border: `1px solid ${DS.borderDefault}`,
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(16, 24, 40, 0.03)',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = DS.borderDark)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = DS.borderDefault)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: DS.surfaceSubtle,
                  border: `1px solid ${DS.borderLight}`,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 700,
                  fontSize: 12,
                  color: DS.textPrimary,
                }}
              >
                {c.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: DS.textPrimary }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: DS.textLight }}>
                  {c.title.split('(')[0]} · <strong style={{ color: DS.successText }}>{c.matchScore}% Match</strong>
                </div>
              </div>
            </div>
            <Star size={15} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
          </div>
        ))}
      </div>

      {/* ───────────────────────────────────────────────────────────
          4. UNTITLED UI SUBHEADER & SEGMENTED CONTROL (Image 2 & 4 Exact)
             Tabs: View all / Qualified / Shortlisted ...
             Segmenter: High / Med / Low with 3-bar signal meter
      ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          paddingBottom: 4,
          borderBottom: `1px solid ${DS.borderDefault}`,
        }}
      >
        {/* Left: Tab items */}
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
                  background: active ? DS.surfaceSubtle : 'transparent',
                  color: active ? DS.textPrimary : DS.textMuted,
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
                    background: active ? '#ffffff' : DS.surfaceSubtle,
                    border: `1px solid ${DS.borderLight}`,
                    color: active ? DS.textPrimary : DS.textLight,
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Search, Exact 3-Bar Signal Segmenter (Image 2), and Filter button */}
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
              { id: 'all', label: 'All', bars: [true, true, true] },
              { id: 'high', label: 'High', bars: [true, true, true] },
              { id: 'medium', label: 'Medium', bars: [true, true, false] },
              { id: 'low', label: 'Low', bars: [true, false, false] },
            ].map((seg) => {
              const active = prioritySegment === seg.id;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setPrioritySegment(seg.id as any)}
                  style={{
                    height: 28,
                    padding: '0 11px',
                    borderRadius: 6,
                    border: 'none',
                    background: active ? '#ffffff' : 'transparent',
                    color: active ? DS.textPrimary : DS.textMuted,
                    fontSize: 12,
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: active ? '0 1px 3px rgba(16, 24, 40, 0.08)' : 'none',
                    transition: 'all 0.12s ease',
                  }}
                >
                  {/* Exact 3-Bar Cellular Signal Meter (Image 2) */}
                  <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 1.5, height: 10 }}>
                    <span style={{ width: 2.5, height: 4, borderRadius: 1, background: seg.bars[0] ? (active ? DS.textPrimary : DS.textLight) : '#d0d5dd' }} />
                    <span style={{ width: 2.5, height: 7, borderRadius: 1, background: seg.bars[1] ? (active ? DS.textPrimary : DS.textLight) : '#d0d5dd' }} />
                    <span style={{ width: 2.5, height: 10, borderRadius: 1, background: seg.bars[2] ? (active ? DS.textPrimary : DS.textLight) : '#d0d5dd' }} />
                  </div>
                  <span>{seg.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box with / shortcut */}
          <div style={{ position: 'relative', width: 220 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 9, color: DS.textLight }} />
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
                border: `1px solid ${DS.borderDark}`,
                background: '#ffffff',
                fontSize: 12.5,
                outline: 'none',
                color: DS.textPrimary,
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
              border: `1px solid ${DS.borderDark}`,
              background: '#ffffff',
              color: DS.textSecondary,
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
            border: `1px solid ${DS.borderDefault}`,
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.03)',
            overflow: 'visible',
            position: 'relative',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#ffffff', borderBottom: `1px solid ${DS.borderDefault}` }}>
                <th style={{ width: 44, padding: '12px 16px' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredCandidates.length && filteredCandidates.length > 0}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer', borderRadius: 4 }}
                  />
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 500, color: DS.textLight, fontSize: 12 }}>Candidate & Role</th>
                <th style={{ padding: '12px 16px', fontWeight: 500, color: DS.textLight, fontSize: 12 }}>Target Requisition</th>
                <th style={{ padding: '12px 16px', fontWeight: 500, color: DS.textLight, fontSize: 12 }}>Verified Skills</th>
                <th style={{ padding: '12px 16px', fontWeight: 500, color: DS.textLight, fontSize: 12 }}>AI Match</th>
                <th style={{ padding: '12px 16px', fontWeight: 500, color: DS.textLight, fontSize: 12 }}>Lead Recruiter</th>
                <th style={{ padding: '12px 16px', fontWeight: 500, color: DS.textLight, fontSize: 12 }}>Last Evaluated</th>
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
                      borderBottom: `1px solid ${DS.borderLight}`,
                      background: isSelected ? DS.surfaceSubtle : 'transparent',
                      transition: 'background 0.1s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = DS.surfaceSubtle;
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
                            background: DS.brandDark,
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
                          <div style={{ fontWeight: 600, color: DS.textPrimary }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: DS.textLight }}>{c.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Target Requisition */}
                    <td style={{ padding: '12px 16px', color: DS.textSecondary }}>
                      <div style={{ fontWeight: 500 }}>{c.title}</div>
                      <div style={{ fontSize: 11.5, color: DS.textLight }}>{c.experienceYears} Years Production</div>
                    </td>

                    {/* Verified Skills */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {c.skills.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            style={{
                              fontSize: 11,
                              background: DS.surfaceSubtle,
                              color: DS.textSecondary,
                              padding: '2px 7px',
                              borderRadius: 4,
                              border: `1px solid ${DS.borderLight}`,
                            }}
                          >
                            {s}
                          </span>
                        ))}
                        {c.skills.length > 2 && (
                          <span style={{ fontSize: 11, color: DS.textLight, padding: '2px 4px' }}>
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
                          color: c.matchScore >= 90 ? DS.successText : DS.warningText,
                          background: c.matchScore >= 90 ? DS.successBg : DS.warningBg,
                          border: `1px solid ${c.matchScore >= 90 ? DS.successBorder : DS.warningBorder}`,
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
                            background: c.matchScore >= 90 ? DS.successText : DS.warningText,
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
                          <div style={{ fontSize: 12, fontWeight: 500, color: DS.textPrimary }}>Aarav Mehta</div>
                          <div style={{ fontSize: 11, color: DS.textLight }}>aarav@scoutai.com</div>
                        </div>
                      </div>
                    </td>

                    {/* Last Evaluated Date */}
                    <td style={{ padding: '12px 16px', color: DS.textMuted, fontSize: 12 }}>
                      Aug 15, 2026
                    </td>

                    {/* Action Menu (Untitled UI Image 5 Exact Menu with Offline Toggle) */}
                    <td style={{ padding: '12px 16px', position: 'relative' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuCandidateId(openMenuCandidateId === c.id ? null : c.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: DS.textLight,
                          cursor: 'pointer',
                          padding: 4,
                          borderRadius: 4,
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Menu (Exact Image 5 media_1794853260141_34b54a61) */}
                      {openMenuCandidateId === c.id && (
                        <div
                          style={{
                            position: 'absolute',
                            right: 20,
                            top: 40,
                            width: 210,
                            background: '#ffffff',
                            borderRadius: 10,
                            border: `1px solid ${DS.borderDefault}`,
                            boxShadow: '0 12px 24px -4px rgba(16, 24, 40, 0.12), 0 4px 6px -2px rgba(16, 24, 40, 0.04)',
                            padding: '6px',
                            zIndex: 100,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handlePerformAction(c, 'View Dossier')}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              border: 'none',
                              background: 'transparent',
                              borderRadius: 6,
                              textAlign: 'left',
                              fontSize: 12.5,
                              color: DS.textSecondary,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = DS.surfaceSubtle)}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <ExternalLink size={14} />
                            <span>View Full Dossier</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePerformAction(c, 'shortlisted for client', 'Shortlisted')}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              border: 'none',
                              background: 'transparent',
                              borderRadius: 6,
                              textAlign: 'left',
                              fontSize: 12.5,
                              color: DS.textSecondary,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = DS.surfaceSubtle)}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <UserCheck size={14} />
                            <span>Shortlist for Client</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePerformAction(c, 'interview scheduled', 'Interviewing')}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              border: 'none',
                              background: 'transparent',
                              borderRadius: 6,
                              textAlign: 'left',
                              fontSize: 12.5,
                              color: DS.textSecondary,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = DS.surfaceSubtle)}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Calendar size={14} />
                            <span>Schedule Interview</span>
                          </button>

                          {/* Image 5: "Available offline" with toggle switch */}
                          <div
                            onClick={() => toggleOffline(c.id)}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: 6,
                              fontSize: 12.5,
                              color: DS.textSecondary,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = DS.surfaceSubtle)}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Wifi size={14} />
                              <span>Available offline</span>
                            </div>
                            {/* Toggle Switch (Image 5) */}
                            <div
                              style={{
                                width: 28,
                                height: 16,
                                borderRadius: 9999,
                                background: offlineToggles[c.id] ? DS.brandDark : '#d0d5dd',
                                position: 'relative',
                                transition: 'background 0.15s ease',
                              }}
                            >
                              <div
                                style={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  background: '#ffffff',
                                  position: 'absolute',
                                  top: 2,
                                  left: offlineToggles[c.id] ? 14 : 2,
                                  transition: 'left 0.15s ease',
                                }}
                              />
                            </div>
                          </div>

                          <div style={{ height: 1, background: DS.borderLight, margin: '4px 0' }} />

                          {/* Image 5: "Delete file" -> "Archive Candidate" with red trashcan */}
                          <button
                            type="button"
                            onClick={() => handlePerformAction(c, 'archived candidate', 'Archived')}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              border: 'none',
                              background: 'transparent',
                              borderRadius: 6,
                              textAlign: 'left',
                              fontSize: 12.5,
                              color: DS.errorText,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = DS.errorBg)}
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
              borderTop: `1px solid ${DS.borderDefault}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 13,
              color: DS.textMuted,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>Page 1 of 3</span>
              <span style={{ color: DS.textDisabled }}>|</span>
              <span>Rows per page: <strong>7</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                type="button"
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 6,
                  border: `1px solid ${DS.borderDark}`,
                  background: '#ffffff',
                  color: DS.textSecondary,
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
                  border: `1px solid ${DS.borderDark}`,
                  background: '#ffffff',
                  color: DS.textSecondary,
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
                  border: `1px solid ${DS.brandDark}`,
                  background: DS.brandDark,
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
                  border: `1px solid ${DS.borderDark}`,
                  background: '#ffffff',
                  color: DS.textSecondary,
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
                  border: `1px solid ${DS.borderDark}`,
                  background: '#ffffff',
                  color: DS.textSecondary,
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
                  border: `1px solid ${DS.borderDark}`,
                  background: '#ffffff',
                  color: DS.textSecondary,
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
                  border: `1px solid ${DS.borderDark}`,
                  background: '#ffffff',
                  color: DS.textSecondary,
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
                  background: DS.surfaceSubtle,
                  borderRadius: 12,
                  border: `1px solid ${DS.borderDefault}`,
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: stage === 'Shortlisted' ? DS.successText : DS.brandDark }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: DS.textPrimary }}>{stage}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: DS.textMuted, background: '#ffffff', padding: '1px 6px', borderRadius: 9999, border: `1px solid ${DS.borderDefault}` }}>
                    {colCandidates.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {colCandidates.map((cand) => (
                    <div
                      key={cand.id}
                      style={{
                        background: '#ffffff',
                        border: `1px solid ${DS.borderDefault}`,
                        borderRadius: 10,
                        padding: '12px 14px',
                        boxShadow: '0 1px 2px rgba(16, 24, 40, 0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: DS.successText, background: DS.successBg, padding: '2px 6px', borderRadius: 4 }}>
                          {cand.matchScore}% Match
                        </span>
                        <span style={{ fontSize: 11, color: DS.textLight }}>{cand.experienceYears}y exp</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5, color: DS.textPrimary }}>{cand.name}</div>
                        <div style={{ fontSize: 12, color: DS.textLight }}>{cand.title}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {cand.skills.slice(0, 3).map((s) => (
                          <span key={s} style={{ fontSize: 10.5, background: DS.surfaceSubtle, color: DS.textSecondary, padding: '2px 5px', borderRadius: 4 }}>
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
            border: `1px solid ${DS.borderDefault}`,
            padding: '20px',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.03)',
          }}
        >
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: DS.textPrimary, margin: 0 }}>
              Workflows
            </h3>
            <p style={{ fontSize: 12.5, color: DS.textMuted, margin: '2px 0 0 0' }}>
              Automated talent indexing, salary calibration, and panel scoring pipelines.
            </p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${DS.borderDefault}`, color: DS.textLight }}>
                <th style={{ padding: '8px 10px', fontWeight: 500 }}>Title</th>
                <th style={{ padding: '8px 10px', fontWeight: 500 }}>Version</th>
                <th style={{ padding: '8px 10px', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '8px 10px', fontWeight: 500 }}>Runs</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map((wf, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${DS.borderLight}` }}>
                  <td style={{ padding: '10px', fontWeight: 500, color: DS.textPrimary }}>{wf.title}</td>
                  <td style={{ padding: '10px', color: DS.textLight }}>{wf.version}</td>
                  <td style={{ padding: '10px' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: 4,
                        background:
                          wf.status === 'Active'
                            ? DS.successBg
                            : wf.status === 'Paused'
                            ? DS.warningBg
                            : '#f2f4f7',
                        color:
                          wf.status === 'Active'
                            ? DS.successText
                            : wf.status === 'Paused'
                            ? DS.warningText
                            : DS.textSecondary,
                      }}
                    >
                      {wf.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px', color: DS.textMuted }}>{wf.runs}</td>
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
            border: `1px solid ${DS.borderDefault}`,
            padding: '20px',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.03)',
          }}
        >
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: DS.textPrimary, margin: 0 }}>
              Recent activity
            </h3>
            <p style={{ fontSize: 12.5, color: DS.textMuted, margin: '2px 0 0 0' }}>
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
                      background: DS.surfaceSubtle,
                      border: `1px solid ${DS.borderLight}`,
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                      fontSize: 10.5,
                      color: DS.textPrimary,
                    }}
                  >
                    {act.initials}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, color: DS.textPrimary }}>{act.name}</span>{' '}
                    <span style={{ color: DS.textLight }}>{act.action}</span>{' '}
                    <strong style={{ color: DS.textSecondary }}>{act.target}</strong>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: DS.textDisabled }}>{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          7. UNTITLED UI EXACT TOAST NOTIFICATION (Image 5 Exact)
             "Dashboard requirements v2" deleted · Dismiss · Restore file
      ─────────────────────────────────────────────────────────── */}
      {toastState && toastState.visible && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 380,
            background: '#ffffff',
            borderRadius: 12,
            border: `1px solid ${DS.borderDefault}`,
            boxShadow: '0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16, 24, 40, 0.03)',
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
                  background: DS.successBg,
                  display: 'grid',
                  placeItems: 'center',
                  color: DS.successText,
                }}
              >
                <Check size={16} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: DS.textPrimary }}>
                  "{toastState.candidateName}" {toastState.actionMessage}
                </div>
                <div style={{ fontSize: 11.5, color: DS.textMuted }}>
                  Changes have been updated in pipeline registry.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setToastState(null)}
              style={{ background: 'none', border: 'none', color: DS.textLight, cursor: 'pointer', padding: 2 }}
            >
              <X size={15} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, paddingLeft: 42 }}>
            <button
              type="button"
              onClick={() => setToastState(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: 12,
                fontWeight: 600,
                color: DS.textMuted,
                cursor: 'pointer',
              }}
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={handleRestoreState}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: 12,
                fontWeight: 600,
                color: DS.textPrimary,
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
