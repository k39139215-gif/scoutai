import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';

export const SourcingView: React.FC = () => {
  const { jobs, candidates, selectedJobId, shortlistCandidate, navigate } = useApp();

  const [targetJobId, setTargetJobId] = useState<string>(selectedJobId || (jobs[0] ? jobs[0].id : 'job-101'));
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [hasScanned, setHasScanned] = useState(true);

  const scanSteps = [
    'Analyzing role specifications & skill requirements...',
    'Scanning 247 simulated candidate profiles in talent pool...',
    'Evaluating requirement overlaps & experience depth...',
    'Generating advisory ranking and match breakdown...',
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

  const matchingCandidates = candidates.filter(
    (c) => !targetJobId || c.appliedJobId === targetJobId || c.matchScore >= 85
  );

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
            AI Candidate Sourcing
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Autonomous talent pool matching and ranking against active job requirements.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            value={targetJobId}
            onChange={(e) => setTargetJobId(e.target.value)}
            className="form-select"
            style={{ width: 240, height: 32, fontSize: 'var(--font-size-xs)' }}
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                Role: {j.title}
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            size="sm"
            icon={isScanning ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={13} />}
            disabled={isScanning}
            onClick={handleRunSourcing}
          >
            {isScanning ? 'Scanning...' : 'Run Sourcing'}
          </Button>
        </div>
      </div>

      {/* Sourcing Simulation Progress Card */}
      {isScanning && (
        <div
          className="snow-card"
          style={{
            padding: '20px 24px',
            background: 'var(--color-bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
              Sourcing Engine in Progress
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {scanSteps.map((stepLabel, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 'var(--font-size-xs)',
                  color:
                    idx < scanStep
                      ? 'var(--color-success-text)'
                      : idx === scanStep
                      ? 'var(--color-text-primary)'
                      : 'var(--color-text-muted)',
                }}
              >
                {idx < scanStep ? (
                  <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} />
                ) : idx === scanStep ? (
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      border: '1px solid var(--color-border)',
                      display: 'inline-block',
                    }}
                  />
                )}
                <span style={{ fontWeight: idx === scanStep ? 600 : 400 }}>{stepLabel}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sourcing Intelligence Stats Banner */}
      {!isScanning && hasScanned && (
        <div
          className="snow-card"
          style={{
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            background: 'var(--color-bg-surface)',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Talent Pool Analyzed
            </div>
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, margin: '2px 0' }}>247</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Indian tech profiles</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Qualified Matches
            </div>
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, margin: '2px 0', color: 'var(--color-accent-blue)' }}>
              42
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Core skills satisfied</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              High-Confidence (85%+)
            </div>
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, margin: '2px 0', color: 'var(--color-success-text)' }}>
              12
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Recommended for shortlist</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Button
              variant="secondary"
              size="sm"
              icon={<Check size={13} />}
              onClick={handleBatchShortlist}
            >
              Shortlist 90%+ Matches
            </Button>
          </div>
        </div>
      )}

      {/* Sourced Candidates Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>
            Ranked Sourcing Matches ({matchingCandidates.length})
          </h3>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
            Sorted by highest advisory compatibility
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12 }}>
          {matchingCandidates.map((cand) => (
            <div
              key={cand.id}
              className="snow-card"
              style={{
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 14,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div
                      onClick={() => navigate('candidate-detail', { candidateId: cand.id })}
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-blue)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                    >
                      {cand.name}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: 1 }}>
                      {cand.title} • {cand.experienceYears} yrs exp
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', marginTop: 1 }}>
                      {cand.location}
                    </div>
                  </div>

                  <span className="snow-badge snow-badge-success" style={{ fontSize: '11px' }}>
                    {cand.matchScore}% Match
                  </span>
                </div>

                {/* Skills tags */}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 10 }}>
                  {cand.skills.map((sk) => (
                    <span
                      key={sk}
                      style={{
                        fontSize: '10.5px',
                        background: 'var(--color-bg-canvas)',
                        border: '1px solid var(--color-border)',
                        padding: '1px 5px',
                        borderRadius: 'var(--radius-xs)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Key Strength snippet */}
                <p
                  style={{
                    fontSize: '11.5px',
                    color: 'var(--color-text-secondary)',
                    marginTop: 8,
                    lineHeight: 1.4,
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
                  paddingTop: 10,
                  borderTop: '1px solid var(--color-divider)',
                }}
              >
                <Button
                  variant={cand.status === 'Shortlisted' ? 'success' : 'secondary'}
                  size="sm"
                  icon={<CheckCircle2 size={12} />}
                  onClick={() => shortlistCandidate(cand.id)}
                >
                  {cand.status === 'Shortlisted' ? 'Shortlisted' : 'Shortlist'}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  iconRight={<ArrowRight size={12} />}
                  onClick={() => navigate('candidate-detail', { candidateId: cand.id })}
                >
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
