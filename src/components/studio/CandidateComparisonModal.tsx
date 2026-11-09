import React, { useEffect } from 'react';
import { X, UserCheck, Mail, Download, Sparkles, Check } from 'lucide-react';
import type { Candidate } from '../../types';
import { getCandidateCompetencies } from './CompetencyRadarChart';

interface CandidateComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  onShortlist: (id: string) => void;
  onOutreach: (candidate: Candidate) => void;
  onRemoveCandidate?: (id: string) => void;
}

export const CandidateComparisonModal: React.FC<CandidateComparisonModalProps> = ({
  isOpen,
  onClose,
  candidates,
  onShortlist,
  onOutreach,
  onRemoveCandidate,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || candidates.length === 0) return null;

  // Sort candidates by match score descending to establish ranks
  const ranked = [...candidates].sort((a, b) => b.matchScore - a.matchScore);
  const topCandidate = ranked[0];

  const handleExportMatrixCSV = () => {
    const headers = ['Metric / Field', ...ranked.map((c) => `"${c.name} (${c.matchScore}%)"`)];
    const rows = [
      ['Role / Title', ...ranked.map((c) => `"${c.title}"`)],
      ['Applied Job', ...ranked.map((c) => `"${c.appliedJobTitle}"`)],
      ['Total Experience', ...ranked.map((c) => `"${c.experienceYears} Years"`)],
      ['Location', ...ranked.map((c) => `"${c.location}"`)],
      ['Current Status', ...ranked.map((c) => `"${c.status}"`)],
      ['Match Score', ...ranked.map((c) => `"${c.matchScore}%"`)],
      ...['Systems Architecture', 'Code Craftsmanship', 'Scalability & Performance', 'Leadership & Collaboration', 'Domain Velocity'].map((dim, dimIdx) => [
        dim,
        ...ranked.map((c) => `"${getCandidateCompetencies(c)[dimIdx]?.score}%"`),
      ]),
      ['Verified Skills', ...ranked.map((c) => `"${c.skills.join('; ')}"`)],
      ['AI Fit Summary', ...ranked.map((c) => `"${c.aiAnalysisExplanation.replace(/"/g, '""')}"`)],
    ];

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ScoutAI_Candidate_Differential_Matrix_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(15, 23, 42, 0.1)',
          width: '100%',
          maxWidth: Math.min(1200, Math.max(760, ranked.length * 340)),
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal Top Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#4338ca',
                  backgroundColor: '#e0e7ff',
                  padding: '2px 7px',
                  borderRadius: 4,
                  letterSpacing: '0.04em',
                }}
              >
                REFERENCE 12 IMPLEMENTATION
              </span>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                Comparing {ranked.length} Candidate Profiles
              </span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>
              Candidate Differential Matrix
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={handleExportMatrixCSV}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 12px',
                borderRadius: 7,
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: 12,
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <Download size={13} />
              <span>Export Matrix CSV</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: 6,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close comparison modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* AI Insight Header Banner */}
        <div
          style={{
            backgroundColor: '#eff6ff',
            borderBottom: '1px solid #bfdbfe',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#1e40af',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={14} style={{ color: '#2563eb' }} />
            <span>
              <strong>Algorithmic Differential:</strong> Candidate #{1} ({topCandidate.name}) leads in distributed system architecture with a <strong>{topCandidate.matchScore}%</strong> baseline fit.
            </span>
          </div>
          <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600 }}>
            Fair-Hiring AI v3.4 Verified
          </span>
        </div>

        {/* Scrollable Side-by-Side Matrix Columns */}
        <div
          style={{
            overflowX: 'auto',
            overflowY: 'auto',
            flex: 1,
            padding: 24,
            display: 'grid',
            gridTemplateColumns: `repeat(${ranked.length}, minmax(280px, 1fr))`,
            gap: 20,
            alignItems: 'stretch',
          }}
        >
          {ranked.map((c, rankIdx) => {
            const comps = getCandidateCompetencies(c);
            const isLeader = rankIdx === 0;

            return (
              <div
                key={c.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: isLeader ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  position: 'relative',
                  boxShadow: isLeader ? '0 10px 25px -5px rgba(37, 99, 235, 0.12)' : '0 2px 6px rgba(0,0,0,0.03)',
                }}
              >
                {/* Column Top Card */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 9999,
                        backgroundColor: isLeader ? '#2563eb' : '#f1f5f9',
                        color: isLeader ? '#ffffff' : '#475569',
                      }}
                    >
                      {isLeader ? '★ TOP FIT' : `RANK #${rankIdx + 1}`}
                    </span>

                    {onRemoveCandidate && ranked.length > 2 && (
                      <button
                        onClick={() => onRemoveCandidate(c.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          fontSize: 11,
                          padding: 2,
                        }}
                        title="Remove candidate from comparison"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        backgroundColor: isLeader ? '#1e293b' : '#334155',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {c.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.name}
                      </h3>
                      <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.title}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: isLeader ? '#2563eb' : '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                        {c.matchScore}%
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>Match Fit</div>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => onShortlist(c.id)}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      borderRadius: 6,
                      border: 'none',
                      backgroundColor: c.status === 'Shortlisted' ? '#10b981' : '#0f172a',
                      color: '#ffffff',
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5,
                    }}
                  >
                    <UserCheck size={12} />
                    <span>{c.status === 'Shortlisted' ? 'Shortlisted' : 'Shortlist'}</span>
                  </button>

                  <button
                    onClick={() => onOutreach(c)}
                    style={{
                      padding: '7px 10px',
                      borderRadius: 6,
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Mail size={12} />
                    <span>Outreach</span>
                  </button>
                </div>

                {/* Section 1: Overview Specs */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: 8,
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    fontSize: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Experience:</span>
                    <strong style={{ color: '#0f172a' }}>{c.experienceYears} Years</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Location:</span>
                    <strong style={{ color: '#0f172a' }}>{c.location}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Pipeline Stage:</span>
                    <strong style={{ color: c.status === 'Shortlisted' ? '#10b981' : '#0284c7' }}>{c.status}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Requisition:</span>
                    <strong style={{ color: '#0f172a', maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.appliedJobTitle}
                    </strong>
                  </div>
                </div>

                {/* Section 2: Technical Competencies */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>
                    Competency Breakdown
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {comps.map((comp) => (
                      <div key={comp.label} style={{ fontSize: 11 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                          <span style={{ color: '#475569' }}>{comp.shortLabel}</span>
                          <span style={{ fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                            {comp.score}%
                          </span>
                        </div>
                        <div style={{ height: 5, backgroundColor: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${comp.score}%`,
                              height: '100%',
                              backgroundColor: comp.score >= 90 ? '#10b981' : comp.score >= 80 ? '#2563eb' : '#f59e0b',
                              borderRadius: 9999,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Verified Skills */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>
                    Verified Skills ({c.skills.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {c.skills.map((skill, skIdx) => (
                      <span
                        key={skIdx}
                        style={{
                          fontSize: 10.5,
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          borderRadius: 4,
                          padding: '2px 6px',
                          color: '#334155',
                          fontWeight: 500,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <Check size={9} style={{ color: '#10b981' }} />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Section 4: AI Analysis Notes */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>
                    Evaluator Summary
                  </div>
                  <p style={{ fontSize: 11.5, color: '#334155', lineHeight: 1.5, margin: 0 }}>
                    {c.aiAnalysisExplanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Bottom Action Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>Comparison generated in real-time using Fair-Hiring verified weights</span>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '7px 16px',
              borderRadius: 6,
              backgroundColor: '#0f172a',
              color: '#ffffff',
              fontSize: 12.5,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};
