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
  Calendar,
  X,
  ChevronLeft,
  Check,
  Copy,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/common/Badge';
import { Drawer } from '../components/common/Drawer';
import { CustomSelect, CustomMenu } from '../components/common/CustomDropdown';

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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
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
              fontSize: 22,
              fontWeight: 600,
              color: '#18181b',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Find Candidates
          </h1>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Review candidate profiles, evaluate AI fit recommendations, and build targeted pipelines.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Reference Studio View Switcher Button */}
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
          borderRadius: 8,
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
            background: filtersOpen ? '#18181b' : '#ffffff',
            color: filtersOpen ? '#ffffff' : '#18181b',
            border: filtersOpen ? '1px solid #18181b' : '1px solid #e4e4e7',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <SlidersHorizontal size={14} style={{ color: filtersOpen ? '#ffffff' : '#71717a' }} />
          <span>{filtersOpen ? 'Hide Filters' : 'Show Filters'}</span>
          {activeFiltersCount > 0 && (
            <span
              style={{
                marginLeft: 2,
                padding: '1px 6px',
                borderRadius: 9999,
                background: filtersOpen ? '#3f3f46' : '#f4f4f5',
                color: filtersOpen ? '#ffffff' : '#18181b',
                fontSize: 11,
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

        {/* View Tabs: All vs Shortlisted */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f4f4f5',
            padding: 3,
            borderRadius: 7,
            gap: 2,
          }}
        >
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: activeTab === 'all' ? 600 : 500,
              background: activeTab === 'all' ? '#ffffff' : 'transparent',
              color: activeTab === 'all' ? '#18181b' : '#71717a',
              border: 'none',
              cursor: 'pointer',
              boxShadow: activeTab === 'all' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.12s ease',
            }}
          >
            All Candidates ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: activeTab === 'saved' ? 600 : 500,
              background: activeTab === 'saved' ? '#ffffff' : 'transparent',
              color: activeTab === 'saved' ? '#18181b' : '#71717a',
              border: 'none',
              cursor: 'pointer',
              boxShadow: activeTab === 'saved' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.12s ease',
            }}
          >
            Shortlisted ({candidates.filter((c) => c.status === 'Shortlisted').length})
          </button>
        </div>

        <div style={{ flex: 1 }} />

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
            padding: '0 12px',
            fontSize: 13,
            borderRadius: 8,
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            color: '#71717a',
            cursor: 'pointer',
          }}
          onClick={() => alert('Current view configuration saved to presets!')}
        >
          Save View
        </button>
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

        {/* Right Data Table Container */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Table Header & Rows */}
          <div style={{ overflowX: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #e4e4e7' }}>
                  <th style={{ width: 44, padding: '12px 14px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={
                        sortedCandidates.length > 0 &&
                        selectedIds.length === sortedCandidates.length
                      }
                      onChange={handleSelectAll}
                      style={{ cursor: 'pointer', width: 15, height: 15, accentColor: '#18181b' }}
                    />
                  </th>
                  <th
                    style={{
                      padding: '10px 14px',
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Candidate
                  </th>
                  <th
                    style={{
                      padding: '10px 14px',
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Target role
                  </th>
                  <th
                    style={{
                      padding: '10px 14px',
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Experience
                  </th>
                  <th
                    style={{
                      padding: '10px 14px',
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Location
                  </th>
                  <th
                    style={{
                      padding: '10px 14px',
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Match fit
                  </th>
                  <th
                    style={{
                      padding: '10px 14px',
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: '10px 14px',
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      textAlign: 'right',
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
                  sortedCandidates.map((c) => {
                    const isSelected = selectedIds.includes(c.id);
                    return (
                      <tr
                        key={c.id}
                        style={{
                          height: 56,
                          borderBottom: '1px solid #f4f4f5',
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
                        <td style={{ padding: '0 14px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(c.id)}
                            style={{ cursor: 'pointer', width: 15, height: 15, accentColor: '#18181b' }}
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
                              <div
                                style={{
                                  fontSize: 13.5,
                                  fontWeight: 600,
                                  color: '#18181b',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {c.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: '#71717a',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  marginTop: 1,
                                }}
                              >
                                {c.title}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Applied */}
                        <td style={{ padding: '0 16px', fontSize: 13, color: '#3f3f46' }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 190 }}>
                            {c.appliedJobTitle}
                          </div>
                        </td>

                        {/* Experience */}
                        <td style={{ padding: '0 14px', fontSize: 13, color: '#3f3f46', whiteSpace: 'nowrap' }}>
                          {c.experienceYears} Yrs
                        </td>

                        {/* Location */}
                        <td style={{ padding: '0 14px', fontSize: 13, color: '#71717a', whiteSpace: 'nowrap' }}>
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
                        <td style={{ padding: '0 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                            <button
                              onClick={() => shortlistCandidate(c.id)}
                              style={{
                                height: 30,
                                padding: '0 10px',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 500,
                                background: c.status === 'Shortlisted' ? '#dcfce7' : '#ffffff',
                                border: c.status === 'Shortlisted' ? '1px solid #bbf7d0' : '1px solid #e4e4e7',
                                color: c.status === 'Shortlisted' ? '#15803d' : '#18181b',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                transition: 'all 0.1s ease',
                              }}
                              onMouseEnter={(e) => {
                                if (c.status !== 'Shortlisted') e.currentTarget.style.background = '#f4f4f5';
                              }}
                              onMouseLeave={(e) => {
                                if (c.status !== 'Shortlisted') e.currentTarget.style.background = '#ffffff';
                              }}
                            >
                              <CheckCircle2 size={12} />
                              <span>{c.status === 'Shortlisted' ? 'Saved' : 'Shortlist'}</span>
                            </button>

                            <button
                              onClick={() => setActiveCandidateId(c.id)}
                              style={{
                                height: 30,
                                padding: '0 10px',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 500,
                                background: '#ffffff',
                                border: '1px solid #e4e4e7',
                                color: '#18181b',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                transition: 'background 0.1s ease',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#f4f4f5')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                            >
                              <Eye size={12} style={{ color: '#71717a' }} />
                              <span>View</span>
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

          {/* 4. Table Pagination Bar (Custom Dropdowns & Clean Spacing) */}
          <div
            style={{
              height: 52,
              padding: '0 20px',
              borderTop: '1px solid #e4e4e7',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 13,
              color: '#71717a',
            }}
          >
            <div>
              Showing <span style={{ fontWeight: 600, color: '#18181b' }}>{sortedCandidates.length}</span> of{' '}
              <span style={{ fontWeight: 600, color: '#18181b' }}>{candidates.length}</span> candidate profiles
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Custom Rows Per Page Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12.5 }}>Rows per page:</span>
                <CustomSelect
                  value={rowsPerPage}
                  onChange={setRowsPerPage}
                  direction="up"
                  align="right"
                  options={[
                    { value: '10', label: '10' },
                    { value: '25', label: '25' },
                    { value: '50', label: '50' },
                  ]}
                  size="sm"
                  menuWidth={80}
                />
              </div>

              {/* Prev / Next Pagination Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  type="button"
                  disabled
                  style={{
                    height: 30,
                    padding: '0 8px',
                    borderRadius: 6,
                    border: '1px solid #e4e4e7',
                    background: '#ffffff',
                    color: '#a1a1aa',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'not-allowed',
                    fontSize: 12.5,
                  }}
                >
                  <ChevronLeft size={14} />
                  <span>Prev</span>
                </button>
                <span
                  style={{
                    padding: '0 10px',
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: '#18181b',
                  }}
                >
                  1
                </span>
                <button
                  type="button"
                  disabled
                  style={{
                    height: 30,
                    padding: '0 8px',
                    borderRadius: 6,
                    border: '1px solid #e4e4e7',
                    background: '#ffffff',
                    color: '#a1a1aa',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'not-allowed',
                    fontSize: 12.5,
                  }}
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Detail Drawer for Candidate Profile (Slide-Over with Rich Tabs & AI Breakdown) */}
      {activeCandidate && (
        <Drawer
          isOpen={!!activeCandidate}
          onClose={() => setActiveCandidateId(null)}
          title={activeCandidate.name}
          subtitle={`${activeCandidate.title} • ${activeCandidate.experienceYears} Years Experience`}
          maxWidth={560}
          footer={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 12 }}>
              <button
                onClick={() => shortlistCandidate(activeCandidate.id)}
                style={{
                  height: 36,
                  padding: '0 14px',
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontWeight: 600,
                  background: activeCandidate.status === 'Shortlisted' ? '#f0fdf4' : '#ffffff',
                  border: activeCandidate.status === 'Shortlisted' ? '1px solid #bbf7d0' : '1px solid #cbd5e1',
                  color: activeCandidate.status === 'Shortlisted' ? '#166534' : '#334155',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease',
                }}
              >
                <CheckCircle2
                  size={14}
                  style={{ color: activeCandidate.status === 'Shortlisted' ? '#166534' : '#64748b' }}
                />
                <span>{activeCandidate.status === 'Shortlisted' ? 'Shortlisted' : 'Shortlist Candidate'}</span>
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => {
                    navigate('outreach');
                    setActiveCandidateId(null);
                  }}
                  style={{
                    height: 36,
                    padding: '0 14px',
                    borderRadius: 6,
                    fontSize: 12.5,
                    fontWeight: 600,
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Send size={13} style={{ color: '#64748b' }} />
                  <span>Draft Outreach</span>
                </button>

                <button
                  onClick={() => {
                    navigate('interviews');
                    setActiveCandidateId(null);
                  }}
                  style={{
                    height: 36,
                    padding: '0 14px',
                    borderRadius: 6,
                    fontSize: 12.5,
                    fontWeight: 600,
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.12)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Calendar size={13} style={{ color: '#94a3b8' }} />
                  <span>Schedule Interview</span>
                </button>
              </div>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Candidate Header Summary Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                background: '#f8fafc',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#0f172a',
                    color: '#ffffff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {activeCandidate.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>
                    {activeCandidate.name}
                  </div>
                  <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 2 }}>
                    Applied for <span style={{ color: '#334155', fontWeight: 600 }}>{activeCandidate.appliedJobTitle}</span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.02em',
                    color: activeCandidate.matchScore >= 90 ? '#166534' : '#4338ca',
                  }}
                >
                  {activeCandidate.matchScore}%
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#64748b' }}>
                  Compatibility fit
                </div>
              </div>
            </div>

            {/* Profile Fit Synthesis */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <SearchCheck size={14} style={{ color: '#4338ca' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Candidate Profile Synthesis
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.55, margin: 0 }}>
                {activeCandidate.aiAnalysisExplanation || activeCandidate.summary}
              </p>
            </div>

            {/* Skills Badges */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                Verified skills & technologies
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {activeCandidate.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 6,
                      padding: '4px 10px',
                      fontSize: 12,
                      fontWeight: 500,
                      color: '#334155',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Work Experience Timeline */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                Career History
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeCandidate.experienceList.map((exp, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px 16px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{exp.title}</span>
                      <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 500 }}>{exp.period}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', fontWeight: 500, marginTop: 2 }}>{exp.company}</div>
                    <p style={{ fontSize: 12, color: '#64748b', marginTop: 6, lineHeight: 1.5, margin: '6px 0 0' }}>
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Transcript */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText size={13} style={{ color: '#64748b' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Parsed Resume Snippet
                  </span>
                </div>
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
                    background: '#eef2ff',
                    border: '1px solid #e0e7ff',
                    padding: '3px 8px',
                    borderRadius: 4,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <Copy size={11} />
                  <span>Copy Text</span>
                </button>
              </div>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '14px 16px',
                  fontSize: 11.5,
                  color: '#334155',
                  lineHeight: 1.65,
                  maxHeight: 160,
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  letterSpacing: '-0.015em',
                }}
              >
                {activeCandidate.resumeText}
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
