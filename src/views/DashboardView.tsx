import React from 'react';
import { SearchCheck, Plus, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isDevMode } from '../utils/devMode';
import { OperationalSummary } from '../components/dashboard/OperationalSummary';
import { HiringPipeline } from '../components/dashboard/HiringPipeline';
import { AttentionRequired } from '../components/dashboard/AttentionRequired';
import { TopCandidates } from '../components/dashboard/TopCandidates';
import { UpcomingInterviews } from '../components/dashboard/UpcomingInterviews';
import { AIActivityPreview } from '../components/dashboard/AIActivityPreview';
import { AgentThinking } from '../components/boardui/AgentThinking';

export const DashboardView: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Page Header with BoardUI AgentThinking */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1
              style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              Dashboard
            </h1>
            <AgentThinking label="AI Match Engine Active" size="sm" />
          </div>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, marginBottom: 0 }}>
            Active requisitions, candidate qualification flow, and pending recruiter actions.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isDevMode() && (
            <button
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
                background: '#eef2ff',
                border: '1px solid #c7d2fe',
                color: '#4338ca',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#e0e7ff')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#eef2ff')}
            >
              <Sparkles size={13} />
              <span>Studio Desk (Refs)</span>
            </button>
          )}

          <button
            onClick={() => navigate('sourcing')}
            style={{
              height: 'var(--control-height)',
              padding: '0 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#ffffff',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#94a3b8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
          >
            <SearchCheck size={14} style={{ color: 'var(--color-text-muted)' }} />
            <span>Match Candidates</span>
          </button>

          <button
            onClick={() => navigate('create-job')}
            style={{
              height: 'var(--control-height)',
              padding: '0 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--color-primary-button)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.15)',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-primary-button)')}
          >
            <Plus size={14} />
            <span>Post Requisition</span>
          </button>
        </div>
      </div>

      {/* 2. Operational Summary BoardUI StatCards */}
      <OperationalSummary />

      {/* 3. Priority 1: Active Pipelines + Recruiter Attention Items */}
      <div className="dashboard-priority-1-grid" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <HiringPipeline />
        <AttentionRequired />
      </div>

      {/* 4. Priority 2: Top Matched Candidates + Upcoming Interviews */}
      <div className="dashboard-priority-2-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
        <TopCandidates />
        <UpcomingInterviews />
      </div>

      {/* 5. Audit & Activity Stream */}
      <AIActivityPreview />
    </div>
  );
};
