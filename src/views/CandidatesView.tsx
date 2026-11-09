import React, { useState } from 'react';
import {
  MapPin,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  Plus,
  Search,
  SlidersHorizontal,
  SearchCheck,
  Download,
  Share2,
  FileText,
  Send,
  X,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/common/Badge';
import { CandidateProfileDrawer } from '../components/candidates/CandidateProfileDrawer';
import { isDevMode } from '../utils/devMode';
import { CustomSelect, CustomMenu } from '../components/common/CustomDropdown';
import { SegmentedControl, Pagination, Checkbox } from '../components/boardui';
import { Tooltip } from '../components/common/Tooltip';

export const CandidatesView: React.FC = () => {
  const { candidates, shortlistCandidate, navigate } = useApp();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState<string>('all');
  const [matchFilter, setMatchFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expFilter, setExpFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('match');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<string>('10');

  // Collapsible filter groups
  const [collapsedFilters, setCollapsedFilters] = useState<Record<string, boolean>>({
    match: false,
    status: false,
    exp: false,
  });

  const toggleFilterGroup = (grp: string) => {
    setCollapsedFilters((prev) => ({ ...prev, [grp]: !prev[grp] }));
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesScore = true;
    if (matchFilter === '90+') matchesScore = c.matchScore >= 90;
    else if (matchFilter === '80+') matchesScore = c.matchScore >= 80;
    else if (matchFilter === '70+') matchesScore = c.matchScore >= 70;

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    let matchesExp = true;
    if (expFilter === 'senior') matchesExp = c.experienceYears >= 6;
    else if (expFilter === 'mid') matchesExp = c.experienceYears >= 3 && c.experienceYears < 6;
    else if (expFilter === 'junior') matchesExp = c.experienceYears < 3;

    return (
      matchesSearch &&
      matchesScore &&
      matchesStatus &&
      matchesExp &&
      (activeTab === 'all' || c.status === 'Shortlisted')
    );
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
    return a.name.localeCompare(b.name);
  });

  const handleSelectAll = (checked: boolean | React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = typeof checked === 'boolean' ? checked : checked.target.checked;
    if (isChecked) {
      setSelectedIds(sortedCandidates.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activeCandidate = candidates.find((c) => c.id === activeCandidateId);

  const activeFiltersCount =
    (matchFilter !== 'All' ? 1 : 0) +
    (statusFilter !== 'All' ? 1 : 0) +
    (expFilter !== 'All' ? 1 : 0) +
    (department !== 'all' ? 1 : 0);

  const clearAllFilters = () => {
    setMatchFilter('All');
    setStatusFilter('All');
    setExpFilter('All');
    setDepartment('all');
    setSearchQuery('');
  };

  // Candidate Actions Dropdown Menu Items
  const aiMenuItems = [
    {
      id: 'sourcing',
      label: 'Criteria Matching',
      description: 'Run criteria matching across active requisitions',
      icon: <SearchCheck size={14} />,
      onClick: () => navigate('sourcing'),
    },
    {
      id: 'outreach',
      label: 'Draft Outreach Sequences',
      description: 'Prepare candidate correspondence drafts',
      icon: <Send size={14} />,
      onClick: () => navigate('outreach'),
    },
    {
      id: 'analytics',
      label: 'Market Salary Insights',
      description: 'Benchmark compensation and talent pool distributions',
      icon: <FileText size={14} />,
      onClick: () => navigate('analytics'),
    },
  ];

  // Import Dropdown Menu Items
  const importMenuItems = [
    {
      id: 'csv',
      label: 'Import CSV File',
      description: 'Bulk upload candidate profiles via spreadsheet',
      icon: <Download size={15} />,
      onClick: () => navigate('sourcing'),
    },
    {
      id: 'linkedin',
      label: 'Sync LinkedIn Recruiter',
      description: 'Import sourced prospects directly into pipeline',
      icon: <Share2 size={15} />,
      onClick: () => navigate('sourcing'),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 16 }}>
      {/* 1. Page Header (Modern SaaS Proportions: 22px title, rich subtitle, custom menus) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          paddingBottom: 4,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Candidates
          </h1>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Review candidate profiles, evaluate AI fit recommendations, and build targeted pipelines.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Reference Studio View Switcher Button */}
          {isDevMode() && (
            <button
              type="button"
              onClick={() => navigate('talent-studio')}
              style={{
                height: 32,
                padding: '0 12px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#0f172a',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <span style={{ color: '#818cf8' }}>✨</span>
              <span>Studio Desk (Refs)</span>
            </button>
          )}
          {/* Custom AI Action Menu */}
          <CustomMenu
            align="right"
            menuWidth={260}
            trigger={
              <button
                type="button"
                className="pill"
                style={{
                  height: 32,
                  padding: '0 12px',
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#ffffff',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'background-color 0.1s ease',
                }}
              >
                <SearchCheck size={14} style={{ color: 'var(--text-muted)' }} />
                <span>Talent Actions</span>
                <ChevronDown size={13} style={{ opacity: 0.7 }} />
              </button>
            }
            items={aiMenuItems}
          />

          {/* Custom Import Menu */}
          <CustomMenu
            align="right"
            menuWidth={240}
            trigger={
              <button
                type="button"
                className="pill"
                style={{
                  height: 36,
                  padding: '0 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  background: '#ffffff',
                  border: '1px solid #e4e4e7',
                  color: '#18181b',
                  cursor: 'pointer',
                }}
              >
                <Download size={14} style={{ color: '#71717a' }} />
                <span>Import</span>
                <ChevronDown size={14} style={{ opacity: 0.6 }} />
              </button>
            }
            items={importMenuItems}
          />

          {/* Primary Action Button */}
          <button
            onClick={() => navigate('create-job')}
            className="btn-dark"
            style={{
              height: 36,
              padding: '0 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: '#18181b',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Plus size={15} />
            <span>Post Job</span>
          </button>
        </div>
      </div>

      {/* 2. Secondary Control Toolbar (Custom Dropdowns & Filter Controls) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px',
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: 12,
          flexWrap: 'wrap',
        }}
      >
        {/* Custom Department Select Dropdown */}
        <CustomSelect
          value={department}
          onChange={setDepartment}
          options={[
            { value: 'all', label: 'All Departments' },
            { value: 'eng', label: 'Engineering & Tech' },
            { value: 'design', label: 'Product & Design' },
            { value: 'ai', label: 'Applied AI & ML' },
          ]}
          size="md"
          menuWidth={200}
        />

        {/* Toggle Filters Button */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          type="button"
          style={{
            height: 36,
            padding: '0 12px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            background: filtersOpen ? '#eef2ff' : '#ffffff',
            color: filtersOpen ? '#4338ca' : '#334155',
            border: filtersOpen ? '1px solid #c7d2fe' : '1px solid #e4e4e7',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <SlidersHorizontal size={14} style={{ color: filtersOpen ? '#4338ca' : '#64748b' }} />
          <span>{filtersOpen ? 'Hide Filters' : 'Show Filters'}</span>
          {activeFiltersCount > 0 && (
            <span
              style={{
                marginLeft: 2,
                padding: '1px 6px',
                borderRadius: 9999,
                background: filtersOpen ? '#e0e7ff' : '#f1f5f9',
                color: filtersOpen ? '#3730a3' : '#64748b',
                fontSize: 11.5,
                fontWeight: 600,
              }}
            >
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Search Input */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 11,
              color: '#71717a',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates, skills, role…"
            style={{
              height: 36,
              width: 260,
              padding: '0 32px 0 32px',
              fontSize: 13,
              borderRadius: 8,
              border: '1px solid #e4e4e7',
              background: '#ffffff',
              color: '#18181b',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocusCapture={(e) => (e.currentTarget.style.borderColor = '#18181b')}
            onBlurCapture={(e) => (e.currentTarget.style.borderColor = '#e4e4e7')}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 8,
                background: 'transparent',
                border: 'none',
                color: '#71717a',
                cursor: 'pointer',
                padding: 2,
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* View Tabs: All vs Shortlisted (BoardUI Segmented Control) */}
        <SegmentedControl
          size="md"
          value={activeTab}
          onChange={(val) => setActiveTab(val as 'all' | 'saved')}
          options={[
            { value: 'all', label: 'All Candidates', count: candidates.length },
            {
              value: 'saved',
              label: 'Shortlisted',
              count: candidates.filter((c) => c.status === 'Shortlisted').length,
            },
          ]}
        />

        <div style={{ flex: 1 }} />

        {/* Right Action Group with zoom protection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
          {/* Custom Sort Select Dropdown */}
          <CustomSelect
            value={sortBy}
            onChange={(val) => setSortBy(val as any)}
            options={[
              { value: 'match', label: 'Sort: Highest Match Score' },
              { value: 'experience', label: 'Sort: Most Experience' },
              { value: 'name', label: 'Sort: Candidate Name (A-Z)' },
            ]}
            size="md"
            menuWidth={230}
          />

          {/* Save View Action */}
          <button
            type="button"
            className="pill"
            style={{
              height: 36,
              padding: '0 14px',
              fontSize: 13,
              fontWeight: 500,
              borderRadius: 8,
              background: '#ffffff',
              border: '1px solid #e4e4e7',
              color: '#334155',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.12s ease',
            }}
            onClick={() => showToast('Current view configuration saved to presets', 'info')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e4e4e7';
            }}
          >
            Save View
          </button>
        </div>
      </div>

      {/* 3. Main Workspace: Two-Panel Filter Sidebar + Candidate Data Table */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          flex: 1,
          minHeight: 0,
          alignItems: 'flex-start',
        }}
      >
        {/* Left Filter Column (Spacious 240px width with comfortable click targets) */}
        {filtersOpen && (
          <aside
            style={{
              width: 240,
              flexShrink: 0,
              background: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: 8,
              padding: '14px 14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 8,
                borderBottom: '1px solid #f4f4f5',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: '#18181b' }}>Filters</span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  style={{
                    fontSize: 12,
                    color: '#ef4444',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Filter Group 1: Match Confidence */}
            <div>
              <button
                type="button"
                onClick={() => toggleFilterGroup('match')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '6px 0',
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: '#18181b',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#3b82f6',
                    }}
                  />
                  <span>Match Confidence</span>
                </div>
                <span>
                  {collapsedFilters.match ? (
                    <ChevronRight size={13} style={{ color: '#71717a' }} />
                  ) : (
                    <ChevronDown size={13} style={{ color: '#71717a' }} />
                  )}
                </span>
              </button>

              {!collapsedFilters.match && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
                  {[
                    { val: 'All', label: 'Any Score' },
                    { val: '90+', label: '90%+ Exceptional' },
                    { val: '80+', label: '80%+ Strong Match' },
                    { val: '70+', label: '70%+ Moderate Match' },
                  ].map((opt) => {
                    const isSelected = matchFilter === opt.val;
                    return (
                      <button
                        key={opt.val}
                        onClick={() => setMatchFilter(opt.val)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: isSelected ? 600 : 400,
                          background: isSelected ? '#f4f4f5' : 'transparent',
                          color: isSelected ? '#18181b' : '#3f3f46',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'background 0.1s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = '#fafafa';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check size={13} style={{ color: '#18181b' }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filter Group 2: Pipeline Stage */}
            <div style={{ borderTop: '1px solid #f4f4f5', paddingTop: 10 }}>
              <button
                type="button"
                onClick={() => toggleFilterGroup('status')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '6px 0',
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: '#18181b',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#10b981',
                    }}
                  />
                  <span>Pipeline Stage</span>
                </div>
                <span>
                  {collapsedFilters.status ? (
                    <ChevronRight size={13} style={{ color: '#71717a' }} />
                  ) : (
                    <ChevronDown size={13} style={{ color: '#71717a' }} />
                  )}
                </span>
              </button>

              {!collapsedFilters.status && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
                  {['All', 'Qualified', 'Shortlisted', 'Interviewing', 'Review'].map((st) => {
                    const isSelected = statusFilter === st;
                    return (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: isSelected ? 600 : 400,
                          background: isSelected ? '#f4f4f5' : 'transparent',
                          color: isSelected ? '#18181b' : '#3f3f46',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'background 0.1s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = '#fafafa';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span>{st === 'All' ? 'All Stages' : st}</span>
                        {isSelected && <Check size={13} style={{ color: '#18181b' }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filter Group 3: Experience Level */}
            <div style={{ borderTop: '1px solid #f4f4f5', paddingTop: 10 }}>
              <button
                type="button"
                onClick={() => toggleFilterGroup('exp')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '6px 0',
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: '#18181b',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span>Experience Level</span>
                <span>
                  {collapsedFilters.exp ? (
                    <ChevronRight size={13} style={{ color: '#71717a' }} />
                  ) : (
                    <ChevronDown size={13} style={{ color: '#71717a' }} />
                  )}
                </span>
              </button>

              {!collapsedFilters.exp && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
                  {[
                    { val: 'All', label: 'All Experience' },
                    { val: 'senior', label: 'Senior (6+ Years)' },
                    { val: 'mid', label: 'Mid-Level (3-5 Years)' },
                    { val: 'junior', label: 'Junior (0-2 Years)' },
                  ].map((opt) => {
                    const isSelected = expFilter === opt.val;
                    return (
                      <button
                        key={opt.val}
                        onClick={() => setExpFilter(opt.val)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: isSelected ? 600 : 400,
                          background: isSelected ? '#f4f4f5' : 'transparent',
                          color: isSelected ? '#18181b' : '#3f3f46',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'background 0.1s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = '#fafafa';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check size={13} style={{ color: '#18181b' }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Right Data Table Container - Single Unified Table Card */}
        <div
          className="table-card-container"
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Table Scroll Area */}
          <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #e4e4e7' }}>
                  <th className="col-sticky-first" style={{ width: 44, padding: '12px 14px', textAlign: 'center' }}>
                    <Checkbox
                      checked={
                        sortedCandidates.length > 0 &&
                        selectedIds.length === sortedCandidates.length
                      }
                      indeterminate={
                        selectedIds.length > 0 &&
                        selectedIds.length < sortedCandidates.length
                      }
                      onChange={(checked: boolean) => handleSelectAll(checked)}
                      size="sm"
                      ariaLabel="Select all candidates"
                    />
                  </th>
                  <th
                    style={{
                      padding: '10px 16px',
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      minWidth: 200,
                    }}
                  >
                    Candidate
                  </th>
                  <th
                    className="col-hide-xs"
                    style={{
                      padding: '10px 16px',
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Target Role
                  </th>
                  <th
                    className="col-hide-sm"
                    style={{
                      padding: '10px 14px',
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      width: 95,
                    }}
                  >
                    Experience
                  </th>
                  <th
                    className="col-hide-md"
                    style={{
                      padding: '10px 14px',
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      width: 130,
                    }}
                  >
                    Location
                  </th>
                  <th
                    style={{
                      padding: '10px 16px',
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      width: 135,
                    }}
                  >
                    Match Fit
                  </th>
                  <th
                    style={{
                      padding: '10px 16px',
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      width: 115,
                    }}
                  >
                    Status
                  </th>
                  <th
                    className="col-sticky-action"
                    style={{
                      padding: '10px 18px',
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      textAlign: 'right',
                      width: 175,
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedCandidates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        padding: '48px 20px',
                        textAlign: 'center',
                        color: '#71717a',
                        fontSize: 14,
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: '#f4f4f5',
                            display: 'grid',
                            placeItems: 'center',
                            color: '#71717a',
                          }}
                        >
                          <Search size={18} />
                        </div>
                        <span style={{ fontWeight: 600, color: '#18181b' }}>No candidates found</span>
                        <span style={{ fontSize: 13 }}>Try adjusting your search query or filter parameters.</span>
                        <button
                          onClick={clearAllFilters}
                          style={{
                            marginTop: 8,
                            padding: '6px 14px',
                            background: '#ffffff',
                            border: '1px solid #e4e4e7',
                            borderRadius: 6,
                            fontSize: 13,
                            cursor: 'pointer',
                            fontWeight: 500,
                          }}
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedCandidates.map((c, idx) => {
                    const isSelected = selectedIds.includes(c.id);
                    const isLastRow = idx === sortedCandidates.length - 1;
                    return (
                      <tr
                        key={c.id}
                        style={{
                          height: 56,
                          borderBottom: isLastRow ? 'none' : '1px solid #f4f4f5',
                          background: isSelected ? '#f4f6ff' : 'transparent',
                          transition: 'background 0.12s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = '#fafafa';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {/* Checkbox */}
                        <td className="col-sticky-first" style={{ padding: '0 14px', textAlign: 'center' }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleToggleSelect(c.id)}
                            size="sm"
                            ariaLabel={`Select ${c.name}`}
                          />
                        </td>

                        {/* Candidate Identity (36px Avatar, 14px Semi-bold Name, Muted current company) */}
                        <td
                          style={{ padding: '0 16px', cursor: 'pointer' }}
                          onClick={() => setActiveCandidateId(c.id)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: '50%',
                                background: '#18181b',
                                color: '#ffffff',
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: 12,
                                fontWeight: 600,
                                flexShrink: 0,
                              }}
                            >
                              {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <Tooltip content={c.name}>
                                <div
                                  style={{
                                    fontSize: 13.5,
                                    fontWeight: 600,
                                    color: '#18181b',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: 160,
                                  }}
                                >
                                  {c.name}
                                </div>
                              </Tooltip>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: '#71717a',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: 160,
                                  marginTop: 1,
                                }}
                              >
                                {c.title}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Applied */}
                        <td className="col-hide-xs" style={{ padding: '0 16px', fontSize: 13, color: '#3f3f46' }}>
                          <Tooltip content={c.appliedJobTitle}>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>
                              {c.appliedJobTitle}
                            </div>
                          </Tooltip>
                        </td>

                        {/* Experience */}
                        <td className="col-hide-sm" style={{ padding: '0 14px', fontSize: 13, color: '#3f3f46', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                          {c.experienceYears} Yrs
                        </td>

                        {/* Location */}
                        <td className="col-hide-md" style={{ padding: '0 14px', fontSize: 13, color: '#71717a', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <MapPin size={12} style={{ color: '#a1a1aa' }} />
                            <span>{c.location}</span>
                          </div>
                        </td>

                        {/* AI Match Fit Pill */}
                        <td style={{ padding: '0 16px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '3px 9px',
                              borderRadius: 9999,
                              fontSize: 12,
                              fontWeight: 600,
                              background: c.matchScore >= 90 ? '#ecfdf5' : '#eff6ff',
                              border: c.matchScore >= 90 ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
                              color: c.matchScore >= 90 ? '#065f46' : '#1e40af',
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: c.matchScore >= 90 ? '#10b981' : '#3b82f6',
                              }}
                            />
                            <span>{c.matchScore}% Match</span>
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '0 16px', whiteSpace: 'nowrap' }}>
                          <StatusBadge status={c.status} />
                        </td>

                        {/* Actions (Shortlist & View Profile buttons) */}
                        <td className="col-sticky-action" style={{ padding: '0 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                            <button
                              type="button"
                              onClick={() => shortlistCandidate(c.id)}
                              style={{
                                height: 30,
                                padding: '0 10px',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 500,
                                background: c.status === 'Shortlisted' ? '#ecfdf5' : '#ffffff',
                                border: c.status === 'Shortlisted' ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                                color: c.status === 'Shortlisted' ? '#047857' : '#475569',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 5,
                                lineHeight: 1,
                                transition: 'all 0.12s ease',
                              }}
                              onMouseEnter={(e) => {
                                if (c.status !== 'Shortlisted') {
                                  e.currentTarget.style.background = '#f8fafc';
                                  e.currentTarget.style.borderColor = '#cbd5e1';
                                  e.currentTarget.style.color = '#0f172a';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (c.status !== 'Shortlisted') {
                                  e.currentTarget.style.background = '#ffffff';
                                  e.currentTarget.style.borderColor = '#e2e8f0';
                                  e.currentTarget.style.color = '#475569';
                                }
                              }}
                            >
                              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle2 size={13} style={{ color: c.status === 'Shortlisted' ? '#10b981' : '#94a3b8' }} />
                              </span>
                              <span style={{ lineHeight: 1 }}>{c.status === 'Shortlisted' ? 'Saved' : 'Shortlist'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setActiveCandidateId(c.id)}
                              style={{
                                height: 30,
                                padding: '0 10px',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 500,
                                background: '#ffffff',
                                border: '1px solid #cbd5e1',
                                color: '#0f172a',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 5,
                                lineHeight: 1,
                                transition: 'all 0.12s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#0f172a';
                                e.currentTarget.style.color = '#ffffff';
                                e.currentTarget.style.borderColor = '#0f172a';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#ffffff';
                                e.currentTarget.style.color = '#0f172a';
                                e.currentTarget.style.borderColor = '#cbd5e1';
                              }}
                            >
                              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Eye size={13} />
                              </span>
                              <span style={{ lineHeight: 1 }}>View Profile</span>
                              <ChevronRight size={12} style={{ opacity: 0.6, marginLeft: -1 }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* 4. Official BoardUI Table Pagination Bar */}
          <Pagination
            currentPage={1}
            totalPages={1}
            totalItems={sortedCandidates.length}
            pageSize={Number(rowsPerPage)}
            onPageChange={() => {}}
            onPageSizeChange={(sz) => setRowsPerPage(String(sz))}
          />
        </div>
      </div>

      {/* 5. Detail Drawer for Candidate Profile (Slide-Over with Rich Tabs & AI Breakdown) */}
      <CandidateProfileDrawer
        candidate={activeCandidate || null}
        isOpen={!!activeCandidate}
        onClose={() => setActiveCandidateId(null)}
      />
    </div>
  );
};
