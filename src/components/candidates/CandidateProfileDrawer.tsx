import React from 'react';
import {
  CheckCircle2,
  Send,
  Calendar,
  SearchCheck,
  FileText,
  Copy,
  MapPin,
  Briefcase,
} from 'lucide-react';
import type { Candidate } from '../../types';
import { Drawer } from '../boardui/Drawer';
import { Chip } from '../boardui/Chip';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export interface CandidateProfileDrawerProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CandidateProfileDrawer: React.FC<CandidateProfileDrawerProps> = ({
  candidate,
  isOpen,
  onClose,
}) => {
  const { shortlistCandidate, navigate } = useApp();
  const { showToast } = useToast();

  if (!candidate) return null;

  const isShortlisted = candidate.status === 'Shortlisted';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={candidate.name}
      subtitle={`${candidate.title} • ${candidate.experienceYears} Years Experience`}
      maxWidth={580}
      footer={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: 12,
          }}
        >
          <button
            type="button"
            onClick={() => shortlistCandidate(candidate.id)}
            style={{
              height: 36,
              padding: '0 14px',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 600,
              background: isShortlisted ? '#f0fdf4' : '#ffffff',
              border: isShortlisted ? '1px solid #bbf7d0' : '1px solid #cbd5e1',
              color: isShortlisted ? '#166534' : '#334155',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
            }}
          >
            <CheckCircle2
              size={14}
              style={{ color: isShortlisted ? '#166534' : '#64748b' }}
            />
            <span>{isShortlisted ? 'Shortlisted' : 'Shortlist Candidate'}</span>
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                navigate('outreach');
                onClose();
              }}
              style={{
                height: 36,
                padding: '0 14px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 600,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#94a3b8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
            >
              <Send size={13} style={{ color: '#64748b' }} />
              <span>Draft Outreach</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigate('interviews');
                onClose();
              }}
              style={{
                height: 36,
                padding: '0 14px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 600,
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.12)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1e293b')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#0f172a')}
            >
              <Calendar size={13} style={{ color: '#94a3b8' }} />
              <span>Schedule Interview</span>
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Candidate Header Summary Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 18px',
            background: '#f8fafc',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#0f172a',
                color: '#ffffff',
                display: 'grid',
                placeItems: 'center',
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              {candidate.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#0f172a',
                  letterSpacing: '-0.01em',
                }}
              >
                {candidate.name}
              </div>
              <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 2 }}>
                Applied for{' '}
                <span style={{ color: '#334155', fontWeight: 600 }}>
                  {candidate.appliedJobTitle}
                </span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
                color: candidate.matchScore >= 90 ? '#166534' : '#4338ca',
              }}
            >
              {candidate.matchScore}%
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>
              Compatibility fit
            </div>
          </div>
        </div>

        {/* Profile Fit Synthesis */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '14px 16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 6,
            }}
          >
            <SearchCheck size={14} style={{ color: '#4338ca' }} />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#0f172a',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Candidate Profile Synthesis
            </span>
          </div>
          <p
            style={{
              fontSize: 12.5,
              color: '#334155',
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            {candidate.aiAnalysisExplanation || candidate.summary}
          </p>
        </div>

        {/* Location & Experience Quick Bar */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            padding: '10px 14px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#475569' }}>
            <MapPin size={13} style={{ color: '#64748b' }} />
            <span>{candidate.location}</span>
          </div>
          <div style={{ width: 1, background: '#e2e8f0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#475569' }}>
            <Briefcase size={13} style={{ color: '#64748b' }} />
            <span>{candidate.experienceYears} Years Production Experience</span>
          </div>
        </div>

        {/* Skills Badges */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
            }}
          >
            Verified skills & technologies
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {candidate.skills.map((skill) => (
              <Chip key={skill} variant="neutral">
                {skill}
              </Chip>
            ))}
          </div>
        </div>

        {/* Work Experience Timeline */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 10,
            }}
          >
            Career History
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {candidate.experienceList.map((exp, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#0f172a',
                    }}
                  >
                    {exp.title}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: '#64748b',
                      fontWeight: 500,
                    }}
                  >
                    {exp.period}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#475569',
                    fontWeight: 500,
                    marginTop: 2,
                  }}
                >
                  {exp.company}
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: '#64748b',
                    marginTop: 6,
                    lineHeight: 1.5,
                    margin: '6px 0 0',
                  }}
                >
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Resume Transcript */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={13} style={{ color: '#64748b' }} />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Parsed Resume Snippet
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(candidate.resumeText);
                showToast('Resume snippet copied to clipboard', 'success');
              }}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#4338ca',
                background: '#eef2ff',
                border: '1px solid #e0e7ff',
                padding: '3px 8px',
                borderRadius: 4,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                transition: 'background-color 0.15s ease',
              }}
            >
              <Copy size={11} />
              <span>Copy Text</span>
            </button>
          </div>
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '14px 16px',
              fontSize: 12,
              color: '#334155',
              lineHeight: 1.65,
              maxHeight: 160,
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
              letterSpacing: '-0.015em',
            }}
          >
            {candidate.resumeText}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
