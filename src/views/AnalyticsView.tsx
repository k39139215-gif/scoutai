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
    { label: 'Talent Pool Evaluated', count: 247, percentage: 100, color: '#18181b' },
    { label: 'Qualified on Core Skills', count: 42, percentage: 70, color: '#2563eb' },
    { label: 'Recruiter Shortlisted', count: totalShortlisted > 0 ? totalShortlisted + 10 : 14, percentage: 48, color: '#16a34a' },
    { label: 'Technical Interviewing', count: totalInterviewing > 0 ? totalInterviewing + 4 : 6, percentage: 28, color: '#7c3aed' },
    { label: 'Final Offer Stage', count: 2, percentage: 14, color: '#ea580c' },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Header */}
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
            Recruitment Analytics
          </h1>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Pipeline velocity, candidate conversion funnel, and skill distribution benchmarks.
          </p>
        </div>

        <div
          style={{
            fontSize: 12.5,
            color: '#71717a',
            padding: '6px 12px',
            background: '#ffffff',
            borderRadius: 8,
            border: '1px solid #e4e4e7',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Info size={14} style={{ color: '#2563eb' }} />
          <span>Live Demo Benchmark Metrics</span>
        </div>
      </div>

      {/* 2. Top Level KPI Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 14,
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 8,
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Average Match Score
          </span>
          <div style={{ fontSize: 26, fontWeight: 700, margin: '6px 0 2px', color: '#16a34a' }}>
            89.4%
          </div>
          <div style={{ fontSize: 12, color: '#71717a' }}>
            247 candidate evaluations
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 8,
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Avg Sourcing Latency
          </span>
          <div style={{ fontSize: 26, fontWeight: 700, margin: '6px 0 2px', color: '#2563eb' }}>
            1.8s
          </div>
          <div style={{ fontSize: 12, color: '#71717a' }}>
            Autonomous scan runtime
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 8,
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Time Saved / Requisition
          </span>
          <div style={{ fontSize: 26, fontWeight: 700, margin: '6px 0 2px', color: '#18181b' }}>
            14.2 hrs
          </div>
          <div style={{ fontSize: 12, color: '#71717a' }}>
            Automated ranking vs manual
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 8,
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Outreach Acceptance
          </span>
          <div style={{ fontSize: 26, fontWeight: 700, margin: '6px 0 2px', color: '#7c3aed' }}>
            92.5%
          </div>
          <div style={{ fontSize: 12, color: '#71717a' }}>
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
            border: '1px solid #e4e4e7',
            borderRadius: 8,
            padding: '20px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#18181b', margin: 0 }}>
              Recruitment Conversion Funnel
            </h3>
            <p style={{ fontSize: 12.5, color: '#71717a', marginTop: 3 }}>
              Progression from initial talent scan to final hire
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {funnelStages.map((stg, i) => (
              <div key={stg.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ fontWeight: 500, color: '#18181b' }}>
                    {i + 1}. {stg.label}
                  </span>
                  <span style={{ fontWeight: 600, color: '#18181b' }}>
                    {stg.count} Candidates
                  </span>
                </div>
                {/* Progress Bar */}
                <div
                  style={{
                    height: 8,
                    width: '100%',
                    background: '#f4f4f5',
                    borderRadius: 9999,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${stg.percentage}%`,
                      background: stg.color,
                      borderRadius: 9999,
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
              border: '1px solid #e4e4e7',
              borderRadius: 8,
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <h3 style={{ fontSize: 14.5, fontWeight: 600, color: '#18181b', margin: '0 0 14px' }}>
              Top Sourced Skills Distribution (Indian Tech Hubs)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {skillsDistribution.map((item) => (
                <div key={item.skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
                    <span style={{ color: '#18181b', fontWeight: 500 }}>{item.skill}</span>
                    <span style={{ color: '#71717a' }}>{item.count} ({item.pct}%)</span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      width: '100%',
                      background: '#f4f4f5',
                      borderRadius: 9999,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${item.pct * 2.2}%`,
                        background: '#18181b',
                        borderRadius: 9999,
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
              border: '1px solid #e4e4e7',
              borderRadius: 8,
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <h3 style={{ fontSize: 14.5, fontWeight: 600, color: '#18181b', margin: '0 0 14px' }}>
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
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    fontSize: 12.5,
                  }}
                >
                  <span style={{ fontWeight: 500, color: '#18181b' }}>{d.dept}</span>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: '#71717a' }}>{d.count} Total</span>
                    <span style={{ color: '#16a34a', fontWeight: 600 }}>{d.open} Active</span>
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

