import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OperationalSummary } from '../components/dashboard/OperationalSummary';
import { HiringPipeline } from '../components/dashboard/HiringPipeline';
import { AttentionRequired } from '../components/dashboard/AttentionRequired';
import { TopCandidates } from '../components/dashboard/TopCandidates';
import { UpcomingInterviews } from '../components/dashboard/UpcomingInterviews';
import { AIActivityPreview } from '../components/dashboard/AIActivityPreview';

export const DashboardView: React.FC = () => {
  const { settings, navigate } = useApp();

  const userFirstName = settings.profile.name ? settings.profile.name.split(' ')[0] : 'Recruiter';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Page Header */}
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
            Hiring Operations — Good morning, {userFirstName}
          </h1>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Real-time pipeline overview, candidate matches, and active hiring operations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="pill ai"
            onClick={() => navigate('sourcing')}
            style={{
              height: 36,
              padding: '0 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: '#f5f3ff',
              border: '1px solid #ddd6fe',
              color: '#6d28d9',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={14} style={{ color: '#7c3aed' }} />
            <span>Run AI Sourcing</span>
          </button>

          <button
            className="btn-dark"
            onClick={() => navigate('create-job')}
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

      {/* 2. Primary Operational Summary KPI Bar */}
      <OperationalSummary />

      {/* 3. Priority 1: Active Hiring Pipeline + Attention Required */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.85fr) minmax(300px, 1.15fr)',
          gap: 14,
          alignItems: 'start',
        }}
        className="dashboard-priority-1-grid"
      >
        <HiringPipeline />
        <AttentionRequired />
      </div>

      {/* 4. Priority 2: Top Matched Candidates + Upcoming Interviews */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.3fr) minmax(300px, 1.1fr)',
          gap: 14,
          alignItems: 'start',
        }}
        className="dashboard-priority-2-grid"
      >
        <TopCandidates />
        <UpcomingInterviews />
      </div>

      {/* 5. Priority 3: AI Activity & System Stream */}
      <div>
        <AIActivityPreview />
      </div>

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 1024px) {
          .dashboard-priority-1-grid,
          .dashboard-priority-2-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
