import React from 'react';
import { SearchCheck, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OperationalSummary } from '../components/dashboard/OperationalSummary';
import { HiringPipeline } from '../components/dashboard/HiringPipeline';
import { AttentionRequired } from '../components/dashboard/AttentionRequired';
import { TopCandidates } from '../components/dashboard/TopCandidates';
import { UpcomingInterviews } from '../components/dashboard/UpcomingInterviews';
import { AIActivityPreview } from '../components/dashboard/AIActivityPreview';

export const DashboardView: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Page Header (Clean, Authoritative, No Slop Greetings) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          paddingBottom: 2,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
            }}
          >
            Hiring Operations
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Active requisitions, candidate qualification flow, and pending recruiter actions.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="pill"
            onClick={() => navigate('sourcing')}
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
            }}
          >
            <SearchCheck size={14} style={{ color: 'var(--text-muted)' }} />
            <span>Match Candidates</span>
          </button>

          <button
            className="btn-dark"
            onClick={() => navigate('create-job')}
            style={{
              height: 32,
              padding: '0 14px',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Plus size={14} />
            <span>Post Requisition</span>
          </button>
        </div>
      </div>

      {/* 2. Operational Summary KPI Cards */}
      <OperationalSummary />

      {/* 3. Priority 1: Active Pipelines + Recruiter Attention Items */}
      <div className="dashboard-priority-1-grid">
        <HiringPipeline />
        <AttentionRequired />
      </div>

      {/* 4. Priority 2: Top Matched Candidates + Upcoming Interviews */}
      <div className="dashboard-priority-2-grid">
        <TopCandidates />
        <UpcomingInterviews />
      </div>

      {/* 5. Audit & Activity Stream */}
      <AIActivityPreview />
    </div>
  );
};
