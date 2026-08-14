import React from 'react';
import {
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { candidates } = useApp();

  const totalShortlisted = candidates.filter((c) => c.status === 'Shortlisted').length;
  const totalInterviewing = candidates.filter((c) => c.status === 'Interviewing').length;

  // Funnel demo stages
  const funnelStages = [
    { label: 'Talent Pool Evaluated', count: 247, percentage: 100, color: 'var(--color-primary)' },
    { label: 'Qualified on Core Skills', count: 42, percentage: 70, color: 'var(--color-accent-blue)' },
    { label: 'Recruiter Shortlisted', count: totalShortlisted > 0 ? totalShortlisted + 10 : 14, percentage: 48, color: 'var(--color-success)' },
    { label: 'Technical Interviewing', count: totalInterviewing > 0 ? totalInterviewing + 4 : 6, percentage: 28, color: 'var(--color-text-secondary)' },
    { label: 'Final Offer Stage', count: 2, percentage: 14, color: 'var(--color-warning)' },
  ];

  // Top skill distribution in demo pool
  const skillsDistribution = [
    { skill: 'React & TypeScript', count: 88, pct: 36 },
    { skill: 'Go & Distributed Systems', count: 54, pct: 22 },
    { skill: 'Python / LangChain / RAG', count: 46, pct: 19 },
    { skill: 'Figma & Design Systems', count: 32, pct: 13 },
    { skill: 'AWS & Kubernetes', count: 27, pct: 10 },
  ];

  // Department distribution
  const deptBreakdown = [
    { dept: 'Backend Systems', count: 4, open: 2 },
    { dept: 'Frontend Architecture', count: 2, open: 1 },
    { dept: 'Applied AI & ML', count: 2, open: 1 },
    { dept: 'Product Design', count: 2, open: 1 },
    { dept: 'Infrastructure & SRE', count: 1, open: 0 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Recruitment Analytics
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Pipeline velocity, candidate conversion funnel, and skill distribution benchmarks.
          </p>
        </div>

        <div
          style={{
            fontSize: '11px',
            color: 'var(--color-text-secondary)',
            padding: '4px 10px',
            background: 'var(--color-bg-canvas)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <Info size={12} />
          <span>Demo benchmark figures</span>
        </div>
      </div>

      {/* Top Level KPI Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        <div className="snow-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Average Match Score
          </span>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 600, margin: '4px 0 1px', color: 'var(--color-success-text)' }}>
            89.4%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            247 candidate evaluations
          </div>
        </div>

        <div className="snow-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Avg Sourcing Latency
          </span>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 600, margin: '4px 0 1px', color: 'var(--color-accent-blue)' }}>
            1.8s
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            Matching scan runtime
          </div>
        </div>

        <div className="snow-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Time Saved / Requisition
          </span>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 600, margin: '4px 0 1px' }}>
            14.2 hrs
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            Automated ranking vs manual
          </div>
        </div>

        <div className="snow-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Outreach Acceptance
          </span>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 600, margin: '4px 0 1px' }}>
            92.5%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            Recruiter draft approval rate
          </div>
        </div>
      </div>

      {/* Main Visuals Grid: Funnel + Skills Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 20,
        }}
      >
        {/* Recruitment Pipeline Funnel */}
        <div className="snow-card" style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>
              Recruitment Conversion Funnel
            </h3>
            <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
              Progression from initial talent scan to final hire
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {funnelStages.map((stg, i) => (
              <div key={stg.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', marginBottom: 5 }}>
                  <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    {i + 1}. {stg.label}
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {stg.count} Candidates
                  </span>
                </div>
                {/* Progress Bar */}
                <div
                  style={{
                    height: 6,
                    width: '100%',
                    background: 'var(--color-bg-subtle)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${stg.percentage}%`,
                      background: stg.color,
                      borderRadius: 'var(--radius-full)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Distribution & Department Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Skill Distribution */}
          <div className="snow-card" style={{ padding: '18px 22px' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 12 }}>
              Top Sourced Skills Distribution (Indian Tech Hubs)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {skillsDistribution.map((item) => (
                <div key={item.skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: 4 }}>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{item.skill}</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{item.count} ({item.pct}%)</span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      width: '100%',
                      background: 'var(--color-bg-subtle)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${item.pct * 2.2}%`,
                        background: 'var(--color-primary)',
                        borderRadius: 'var(--radius-full)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="snow-card" style={{ padding: '18px 22px' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 12 }}>
              Requisitions by Department
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {deptBreakdown.map((d) => (
                <div
                  key={d.dept}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-bg-canvas)',
                    fontSize: '11.5px',
                  }}
                >
                  <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{d.dept}</span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{d.count} Total</span>
                    <span style={{ color: 'var(--color-success-text)', fontWeight: 600 }}>{d.open} Active</span>
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
