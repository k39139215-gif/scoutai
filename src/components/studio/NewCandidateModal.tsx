import React, { useState } from 'react';
import { X, Sparkles, UserPlus } from 'lucide-react';
import { CustomSelect } from '../common/CustomDropdown';
import { playTickSound, playSuccessSound } from '../../utils/soundEffects';
import type { CandidateStatus } from '../../types';

interface NewCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (candidateData: {
    name: string;
    title: string;
    experienceYears: number;
    location: string;
    email: string;
    skills: string[];
    status: CandidateStatus;
    matchScore: number;
  }) => void;
}

export const NewCandidateModal: React.FC<NewCandidateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [experienceYears, setExperienceYears] = useState(6);
  const [location, setLocation] = useState('Bangalore, India');
  const [skillsText, setSkillsText] = useState('Distributed Systems, Go, Kubernetes, Cloud Architecture');
  const [status, setStatus] = useState<CandidateStatus>('Qualified');

  if (!isOpen) return null;

  // Real-time simulated Match Score based on experience & technical stack
  const skillsArray = skillsText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const predictedMatchScore = Math.min(
    98,
    Math.max(72, Math.round(75 + experienceYears * 2 + Math.min(skillsArray.length * 2.5, 12)))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim()) return;

    playSuccessSound();
    onSubmit({
      name: name.trim(),
      title: title.trim(),
      experienceYears: Number(experienceYears) || 3,
      location: location.trim() || 'Remote, India',
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      skills: skillsArray.length > 0 ? skillsArray : ['Software Engineering'],
      status,
      matchScore: predictedMatchScore,
    });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 14,
          border: '1px solid #cbd5e1',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          width: '100%',
          maxWidth: 540,
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserPlus size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Direct Candidate Ingestion
              </h3>
              <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0 0' }}>
                Add verified talent profile with automated vector match scoring
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Candidate Name & Title */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Full Candidate Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohini Sen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 12,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Target Title / Specialization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Cloud Architect"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 12,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Experience & Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Experience (Years): {experienceYears} yrs
                </label>
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={experienceYears}
                  onChange={(e) => {
                    playTickSound();
                    setExperienceYears(Number(e.target.value));
                  }}
                  style={{ width: '100%', accentColor: '#0f172a' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 12,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Technical Skills */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                Key Technical Competencies (comma separated)
              </label>
              <input
                type="text"
                placeholder="Go, Kubernetes, Kafka, Distributed Systems"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 12,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Stage Status */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                Initial Pipeline Stage
              </label>
              <CustomSelect
                value={status}
                onChange={(val) => setStatus(val as CandidateStatus)}
                options={[
                  { value: 'Qualified', label: 'Qualified', badge: 'Tier 1' },
                  { value: 'Shortlisted', label: 'Shortlisted', badge: 'Active' },
                  { value: 'Interviewing', label: 'Interviewing', badge: 'In Progress' },
                  { value: 'Offer Extended', label: 'Offer Extended', badge: 'Final' },
                ]}
                style={{ width: '100%' }}
                size="md"
              />
            </div>

            {/* AI Predicted Match Banner */}
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 8,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} style={{ color: '#16a34a' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#166534' }}>
                  Predicted Neural Match Fit:
                </span>
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: '#15803d',
                  backgroundColor: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: 9999,
                  border: '1px solid #86efac',
                }}
              >
                {predictedMatchScore}% Grade A
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 10,
              marginTop: 20,
              paddingTop: 14,
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 18px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <UserPlus size={14} />
              <span>Ingest Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
