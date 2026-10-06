import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomSelect } from '../components/common/CustomDropdown';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
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
            AI Candidate Sourcing
          </h1>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Autonomous talent pool matching and ranking against active job requirements.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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

          <button
            className="btn-dark"
            disabled={isScanning}
            onClick={handleRunSourcing}
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
              cursor: isScanning ? 'not-allowed' : 'pointer',
              opacity: isScanning ? 0.7 : 1,
            }}
          >
            {isScanning ? (
              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Sparkles size={14} />
            )}
            <span>{isScanning ? 'Scanning...' : 'Run Sourcing'}</span>
          </button>
        </div>
      </div>

      {/* Sourcing Simulation Progress Card */}
      {isScanning && (
        <div
          style={{
            padding: '20px 24px',
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 13.5, fontWeight: 600, color: '#18181b' }}>
              Sourcing Engine in Progress
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
                  fontSize: 13,
                  color:
                    idx < scanStep
                      ? '#16a34a'
                      : idx === scanStep
                      ? '#18181b'
                      : '#a1a1aa',
                }}
              >
                {idx < scanStep ? (
                  <CheckCircle2 size={15} style={{ color: '#16a34a' }} />
                ) : idx === scanStep ? (
                  <Loader2 size={15} style={{ animation: 'spin 1s linear infinite', color: '#18181b' }} />
                ) : (
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      border: '1px solid #d4d4d8',
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
          style={{
            padding: '18px 22px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 10,
          }}
        >
          <div>
            <div style={{ fontSize: 11.5, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Talent Pool Analyzed
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, margin: '4px 0', color: '#18181b' }}>247</div>
            <div style={{ fontSize: 12, color: '#71717a' }}>Indian tech profiles</div>
          </div>

          <div>
            <div style={{ fontSize: 11.5, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Qualified Matches
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, margin: '4px 0', color: '#2563eb' }}>
              42
            </div>
            <div style={{ fontSize: 12, color: '#71717a' }}>Core skills satisfied</div>
          </div>

          <div>
            <div style={{ fontSize: 11.5, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              High-Confidence (85%+)
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, margin: '4px 0', color: '#16a34a' }}>
              12
            </div>
            <div style={{ fontSize: 12, color: '#71717a' }}>Recommended for shortlist</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
            <button
              type="button"
              onClick={handleBatchShortlist}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                height: 34,
                padding: '0 14px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 500,
                background: '#ffffff',
                border: '1px solid #e4e4e7',
                color: '#18181b',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f4f4f5';
                e.currentTarget.style.borderColor = '#d4d4d8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#e4e4e7';
              }}
            >
              <Check size={13} />
              <span>Shortlist 90%+ Matches</span>
            </button>
          </div>
        </div>
      )}

      {/* Sourced Candidates Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#18181b' }}>
            Ranked Sourcing Matches ({matchingCandidates.length})
          </h3>
          <span style={{ fontSize: 12, color: '#71717a' }}>
            Sorted by highest advisory compatibility
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
          {matchingCandidates.map((cand) => (
            <div
              key={cand.id}
              style={{
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 16,
                background: '#ffffff',
                border: '1px solid #e4e4e7',
                borderRadius: 10,
                transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d4d4d8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e4e4e7';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div
                      onClick={() => navigate('candidate-detail', { candidateId: cand.id })}
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#18181b',
                        cursor: 'pointer',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#18181b')}
                    >
                      {cand.name}
                    </div>
                    <div style={{ fontSize: 12.5, color: '#71717a', marginTop: 2 }}>
                      {cand.title} • {cand.experienceYears} yrs exp
                    </div>
                    <div style={{ fontSize: 11.5, color: '#a1a1aa', marginTop: 1 }}>
                      {cand.location}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 5,
                      background: '#dcfce7',
                      color: '#15803d',
                      border: '1px solid #bbf7d0',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cand.matchScore}% Match
                  </span>
                </div>

                {/* Skills tags */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 12 }}>
                  {cand.skills.map((sk) => (
                    <span
                      key={sk}
                      style={{
                        fontSize: 11,
                        background: '#fafafa',
                        border: '1px solid #e4e4e7',
                        padding: '2px 7px',
                        borderRadius: 4,
                        color: '#52525b',
                      }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Key Strength snippet */}
                <p
                  style={{
                    fontSize: 12.5,
                    color: '#52525b',
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
                  paddingTop: 12,
                  borderTop: '1px solid #f4f4f5',
                }}
              >
                <button
                  type="button"
                  onClick={() => shortlistCandidate(cand.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    height: 32,
                    padding: '0 12px',
                    borderRadius: 6,
                    fontSize: 12.5,
                    fontWeight: 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    background: cand.status === 'Shortlisted' ? '#dcfce7' : '#ffffff',
                    border: cand.status === 'Shortlisted' ? '1px solid #86efac' : '1px solid #e4e4e7',
                    color: cand.status === 'Shortlisted' ? '#15803d' : '#18181b',
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>{cand.status === 'Shortlisted' ? 'Shortlisted' : 'Shortlist'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('candidate-detail', { candidateId: cand.id })}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    height: 32,
                    padding: '0 12px',
                    borderRadius: 6,
                    fontSize: 12.5,
                    fontWeight: 500,
                    background: '#ffffff',
                    border: '1px solid #e4e4e7',
                    color: '#18181b',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f4f4f5';
                    e.currentTarget.style.borderColor = '#d4d4d8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#e4e4e7';
                  }}
                >
                  <span>Review Profile</span>
                  <ArrowRight size={13} style={{ color: '#71717a' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
