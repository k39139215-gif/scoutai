import React from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard, FunnelBarList } from '../components/boardui';
import { isDevMode } from '../utils/devMode';
import { computeFunnelStages } from '../data/recruitmentData';

export const AnalyticsView: React.FC = () => {
  const { jobs, candidates, navigate } = useApp();

  // Unified Funnel stages with stated bases and verified drop-off metrics
  const funnelStages = computeFunnelStages(candidates);

  // Top skill distribution in demo pool
  const skillsDistribution = [
    { skill: 'React & TypeScript', count: 88, pct: 36 },
    { skill: 'Go & Distributed Systems', count: 54, pct: 22 },
    { skill: 'Python / ML Pipelines / RAG', count: 46, pct: 19 },
    { skill: 'Figma & Design Systems', count: 32, pct: 13 },
    { skill: 'AWS & Kubernetes', count: 27, pct: 10 },
  ];

  const deptBreakdown = [
    { dept: 'Engineering', count: jobs.filter((j) => j.department === 'Engineering').length || 3, open: 2 },
    { dept: 'Platform Engineering', count: jobs.filter((j) => j.department === 'Platform Engineering').length || 2, open: 1 },
    { dept: 'AI & Data Intelligence', count: jobs.filter((j) => j.department === 'AI & Data Intelligence').length || 2, open: 1 },
    { dept: 'Product & Design', count: jobs.filter((j) => j.department === 'Product & Design').length || 1, open: 1 },
    { dept: 'Infrastructure', count: jobs.filter((j) => j.department === 'Infrastructure').length || 1, open: 0 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Header */}
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
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
            }}
          >
            Pipeline Analytics
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Hiring conversion metrics, candidate competency distributions, and operational velocity.
          </p>
        </div>
        {isDevMode() && (
          <button
            onClick={() => navigate('talent-studio')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              height: 36,
              padding: '0 13px',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#3b82f6',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles size={14} />
            Studio Desk (Refs)
          </button>
        )}
      </div>

      {/* 2. Top-Level Metric Summary Cards (BoardUI StatCard) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}
      >
        <StatCard
          title="Criteria match accuracy"
          value="94.8%"
          delta="+2.4%"
          deltaType="positive"
          subtitle="Sample metric • 247 evaluations"
          sparklineData={[88, 89, 91, 92, 93, 94.8]}
        />

        <StatCard
          title="Average evaluation latency"
          value="1.8s"
          delta="-0.4s"
          deltaType="positive"
          subtitle="Sample metric • Per profile"
          sparklineData={[2.4, 2.2, 2.1, 1.9, 1.8]}
        />

        <StatCard
          title="Hours saved per requisition"
          value="14.2h"
          delta="+3.1h"
          deltaType="positive"
          subtitle="Sample metric • Estimated saving"
          sparklineData={[9.5, 11.0, 12.4, 13.5, 14.2]}
        />

        <StatCard
          title="Outreach draft acceptance"
          value="92.5%"
          delta="+4.1%"
          deltaType="positive"
          subtitle="Sample metric • Recruiter approved"
          sparklineData={[82, 85, 87, 90, 92.5]}
        />
      </div>

      {/* 3. Main Visuals Grid: Funnel + Skills Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 16,
        }}
      >
        {/* Recruitment Pipeline Funnel (BoardUI FunnelBarList) */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: '20px 22px',
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 600, color: '#0f172a', margin: 0 }}>
              Recruitment Conversion Funnel
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Progression from initial talent scan to final hire with stage velocity
            </p>
          </div>

          <FunnelBarList stages={funnelStages} />
        </div>

        {/* Skills Distribution & Department Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Skill Distribution */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
              padding: '20px 22px',
            }}
          >
            <h3 style={{ fontSize: 14.5, fontWeight: 600, color: '#0f172a', margin: '0 0 14px' }}>
              Skill Distribution Across Talent Pool
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {skillsDistribution.map((item) => (
                <div key={item.skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.skill}</span>
                    <span className="tabular-nums" style={{ color: 'var(--text-muted)', fontSize: 12 }}>{item.count} profiles ({item.pct}%)</span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      width: '100%',
                      background: 'var(--bg-subtle)',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${item.pct * 2.5}%`,
                        background: '#0f172a',
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Breakdown */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
              padding: '20px 22px',
            }}
          >
            <h3 style={{ fontSize: 14.5, fontWeight: 600, color: '#0f172a', margin: '0 0 12px' }}>
              Requisitions by Department
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {deptBreakdown.map((d) => (
                <div
                  key={d.dept}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: 12.5,
                  }}
                >
                  <span style={{ fontWeight: 500, color: '#0f172a' }}>{d.dept}</span>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                    <span className="tabular-nums" style={{ color: 'var(--text-muted)' }}>{d.count} total</span>
                    <span className="tabular-nums" style={{ color: '#166534', fontWeight: 500 }}>{d.open} open</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
