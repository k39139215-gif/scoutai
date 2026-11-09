import React, { useState } from 'react';
import {
  SearchCheck,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Check,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomSelect } from '../components/common/CustomDropdown';
import { isDevMode } from '../utils/devMode';

export const SourcingView: React.FC = () => {
  const { jobs, candidates, selectedJobId, shortlistCandidate, navigate } = useApp();

  const [targetJobId, setTargetJobId] = useState<string>(selectedJobId || (jobs[0] ? jobs[0].id : 'job-101'));
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [hasScanned, setHasScanned] = useState(true);

  const scanSteps = [
    'Analyzing role specifications & required competencies...',
    'Scanning 247 profiles in talent repository...',
    'Evaluating requirement overlap & experience depth...',
    'Generating rubric compatibility breakdown...',
  ];

  const handleRunSourcing = () => {
    setIsScanning(true);
    setScanStep(0);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => {
        if (prev >= 3) {
          clearInterval(stepInterval);
          setIsScanning(false);
          setHasScanned(true);
          return 3;
        }
        return prev + 1;
      });
    }, 400);
  };

  const matchingCandidates = [...candidates]
    .filter((c) => !targetJobId || c.appliedJobId === targetJobId || c.matchScore >= 85)
    .sort((a, b) => b.matchScore - a.matchScore);

  const handleBatchShortlist = () => {
    matchingCandidates
      .filter((c) => c.matchScore >= 90 && c.status !== 'Shortlisted')
      .forEach((c) => shortlistCandidate(c.id));
  };

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
            Candidate Matching
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Cross-reference candidate profiles against active requisition criteria to compute compatibility rankings.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CustomSelect
            value={targetJobId}
            onChange={setTargetJobId}
            options={jobs.map((j) => ({
              value: j.id,
              label: `Role: ${j.title}`,
            }))}
            size="md"
            menuWidth={280}
          />

          {isDevMode() && (
            <button
              onClick={() => navigate('talent-studio')}
              style={{
                height: 36,
                padding: '0 14px',
                borderRadius: 8,
                fontSize: 13,
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
            >
              <Sparkles size={14} />
              <span>Studio Desk (Refs)</span>
            </button>
          )}

          <button
            className="btn-dark"
            disabled={isScanning}
            onClick={handleRunSourcing}
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
              cursor: isScanning ? 'not-allowed' : 'pointer',
              opacity: isScanning ? 0.7 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {isScanning ? (
              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <SearchCheck size={14} />
            )}
            <span>{isScanning ? 'Evaluating...' : 'Match Candidates'}</span>
          </button>
        </div>
      </div>

      {/* Sourcing Simulation Progress Card */}
      {isScanning && (
        <div
          style={{
            padding: '20px 22px',
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a' }}>
              Candidate Evaluation in Progress
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {scanSteps.map((stepLabel, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 12.5,
                  color:
                    idx < scanStep
                      ? '#166534'
                      : idx === scanStep
                      ? '#0f172a'
                      : 'var(--text-muted)',
                }}
              >
                {idx < scanStep ? (
                  <CheckCircle2 size={14} style={{ color: '#166534' }} />
                ) : idx === scanStep ? (
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite', color: '#0f172a' }} />
                ) : (
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      border: '1px solid var(--border-default)',
                      display: 'inline-block',
                    }}
                  />
                )}
                <span style={{ fontWeight: idx === scanStep ? 500 : 400 }}>{stepLabel}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sourcing Intelligence Stats Banner */}
      {!isScanning && hasScanned && (
        <div
          style={{
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
              Talent pool analyzed
            </div>
            <div className="metric-val" style={{ fontSize: 24, fontWeight: 600, margin: '4px 0', color: '#0f172a' }}>247</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Registered talent profiles</div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
              Qualified matches
            </div>
            <div className="metric-val" style={{ fontSize: 24, fontWeight: 600, margin: '4px 0', color: '#0f172a' }}>
              42
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Core requirements met</div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
              High compatibility (85%+)
            </div>
            <div className="metric-val" style={{ fontSize: 24, fontWeight: 600, margin: '4px 0', color: '#166534' }}>
              12
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ready for shortlist review</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
            <button
              type="button"
              onClick={handleBatchShortlist}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                height: 30,
                padding: '0 12px',
                borderRadius: 5,
                fontSize: 12,
                fontWeight: 500,
                background: '#ffffff',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'background-color 0.1s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
            >
              <Check size={13} />
              <span>Shortlist 90%+ Matches</span>
            </button>
          </div>
        </div>
      )}

      {/* Sourced Candidates Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
            Ranked Matches ({matchingCandidates.length})
          </h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Ranked by compatibility rubric
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
          {matchingCandidates.map((cand) => (
            <div
              key={cand.id}
              style={{
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 14,
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                transition: 'border-color 0.12s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div
                      onClick={() => navigate('candidate-detail', { candidateId: cand.id })}
                      style={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: '#0f172a',
                        cursor: 'pointer',
                        transition: 'color 0.1s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
                    >
                      {cand.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {cand.title} • {cand.experienceYears} yrs exp
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                      {cand.location}
                    </div>
                  </div>

                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: '#f0fdf4',
                      color: '#166534',
                      border: '1px solid #bbf7d0',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cand.matchScore}% Fit
                  </span>
                </div>

                {/* Skills tags */}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 10 }}>
                  {cand.skills.map((sk) => (
                    <span
                      key={sk}
                      style={{
                        fontSize: 12,
                        background: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                        padding: '1px 5px',
                        borderRadius: 3,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Key Strength snippet */}
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    marginTop: 10,
                    lineHeight: 1.45,
                  }}
                >
                  {cand.strengths[0]}
                </p>
              </div>

              {/* Action buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  paddingTop: 10,
                  borderTop: '1px solid #f3f4f6',
                }}
              >
                <button
                  type="button"
                  onClick={() => shortlistCandidate(cand.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    height: 28,
                    padding: '0 10px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'background-color 0.1s ease',
                    background: cand.status === 'Shortlisted' ? '#f0fdf4' : '#ffffff',
                    border: cand.status === 'Shortlisted' ? '1px solid #bbf7d0' : '1px solid var(--border-default)',
                    color: cand.status === 'Shortlisted' ? '#166534' : 'var(--text-primary)',
                  }}
                >
                  <CheckCircle2 size={12} />
                  <span>{cand.status === 'Shortlisted' ? 'Shortlisted' : 'Shortlist'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('candidate-detail', { candidateId: cand.id })}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    height: 28,
                    padding: '0 10px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500,
                    background: '#ffffff',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'background-color 0.1s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                >
                  <span>Review profile</span>
                  <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
