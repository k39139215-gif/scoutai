import React from 'react';
import { useApp } from '../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { jobs, candidates } = useApp();

  const totalShortlisted = candidates.filter((c) => c.status === 'Shortlisted').length;
  const totalInterviewing = candidates.filter((c) => c.status === 'Interviewing').length;

  // Funnel stages with disciplined neutral graphite ramp
  const funnelStages = [
    { label: 'Talent pool evaluated', count: 247, percentage: 100, color: '#0f172a' },
    { label: 'Qualified on core skills', count: 42, percentage: 70, color: '#1e293b' },
    { label: 'Recruiter shortlisted', count: totalShortlisted > 0 ? totalShortlisted + 10 : 14, percentage: 48, color: '#334155' },
    { label: 'Technical screens', count: totalInterviewing > 0 ? totalInterviewing + 4 : 6, percentage: 28, color: '#475569' },
    { label: 'Final offer stage', count: 2, percentage: 14, color: '#64748b' },
  ];

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
              fontSize: 20,
              fontWeight: 600,
              color: '#0f172a',
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
      </div>

      {/* 2. Top-Level Metric Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: '16px 18px',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
            Criteria match accuracy
          </span>
          <div className="metric-val" style={{ fontSize: 26, fontWeight: 600, margin: '6px 0 2px', color: '#0f172a' }}>
            94.8%
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
            Based on 247 evaluations
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: '16px 18px',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
            Average evaluation latency
          </span>
          <div className="metric-val" style={{ fontSize: 26, fontWeight: 600, margin: '6px 0 2px', color: '#0f172a' }}>
            1.8s
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
            Per candidate profile
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: '16px 18px',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
            Hours saved per requisition
          </span>
          <div className="metric-val" style={{ fontSize: 26, fontWeight: 600, margin: '6px 0 2px', color: '#0f172a' }}>
            14.2h
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
            Automated ranking vs manual
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: '16px 18px',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
            Outreach draft acceptance
          </span>
          <div className="metric-val" style={{ fontSize: 26, fontWeight: 600, margin: '6px 0 2px', color: '#0f172a' }}>
            92.5%
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
            Recruiter draft approval rate
          </div>
        </div>
      </div>

      {/* 3. Main Visuals Grid: Funnel + Skills Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 16,
        }}
      >
        {/* Recruitment Pipeline Funnel */}
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
              Progression from initial talent scan to final hire
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {funnelStages.map((stg, i) => (
              <div key={stg.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {i + 1}. {stg.label}
                  </span>
                  <span className="tabular-nums" style={{ fontWeight: 500, color: '#0f172a' }}>
                    {stg.count} candidates ({stg.percentage}%)
                  </span>
                </div>
                {/* Progress Bar */}
                <div
                  style={{
                    height: 6,
                    width: '100%',
                    background: 'var(--bg-subtle)',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${stg.percentage}%`,
                      background: stg.color,
                      borderRadius: 3,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
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
