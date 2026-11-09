import React, { useState } from 'react';
import {
  Send,
  RefreshCw,
  CheckCircle2,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { CustomSelect } from '../components/common/CustomDropdown';
import { SegmentedControl, Composer } from '../components/boardui';
import type { OutreachTone } from '../types';

export const OutreachView: React.FC = () => {
  const {
    candidates,
    outreachMessages,
    createOutreachMessage,
    approveOutreachMessage,
    sendOutreachMessage,
    navigate,
  } = useApp();

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidates[0]?.id || 'cand-1');
  const [tone, setTone] = useState<OutreachTone>('Professional');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  // Auto-fill template when candidate or tone changes
  const handleGenerateTemplate = (candidateObj = selectedCandidate, toneVal = tone) => {
    setIsGenerating(true);
    setTimeout(() => {
      let subj = '';
      let msgBody = '';

      if (toneVal === 'Professional') {
        subj = `Opportunity: ${candidateObj.appliedJobTitle} at ScoutAI Partner`;
        msgBody = `Hi ${candidateObj.name.split(' ')[0]},

I reviewed your experience in ${candidateObj.skills.slice(0, 3).join(', ')} and was impressed by your work at ${candidateObj.experienceList[0]?.company || 'your previous roles'}.

We are currently recruiting for a ${candidateObj.appliedJobTitle} position. Your technical accomplishments and background in ${candidateObj.skills[0]} align strongly with the technical challenges our engineering teams are solving.

Would you be open for a brief 15-minute introductory call this week to learn more about the team and scope?

Best regards,
Aarav Mehta
Lead Technical Recruiter, ScoutAI`;
      } else if (toneVal === 'Engaging') {
        subj = `Hey ${candidateObj.name.split(' ')[0]} — Impressive work on ${candidateObj.skills[0]}!`;
        msgBody = `Hey ${candidateObj.name.split(' ')[0]},

Your background in ${candidateObj.skills.slice(0, 2).join(' and ')} caught our eye!

We're scaling up our engineering squad for the ${candidateObj.appliedJobTitle} role, and your profile looks like a great match for what we're building.

Would love to grab 10 minutes over a quick virtual coffee to share more about our tech stack and roadmap. Let me know if you're open to chatting!

Cheers,
Aarav Mehta`;
      } else {
        subj = `Executive Invitation: ${candidateObj.appliedJobTitle} Technical Leadership`;
        msgBody = `Dear ${candidateObj.name},

I am writing regarding a strategic engineering appointment for a ${candidateObj.appliedJobTitle}.

Given your track record across ${candidateObj.skills.slice(0, 3).join(', ')}, your expertise is highly relevant to the architectural milestones planned for our client's platform this year.

I would welcome the opportunity to discuss this initiative in confidence. Please let me know your availability for a brief consultation.

Sincerely,
Aarav Mehta
Lead Talent Advisor, ScoutAI`;
      }

      setSubject(subj);
      setBody(msgBody);
      setIsGenerating(false);
    }, 280);
  };

  React.useEffect(() => {
    if (selectedCandidate) {
      handleGenerateTemplate(selectedCandidate, tone);
    }
  }, [selectedCandidate, tone]);

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    createOutreachMessage({
      candidateId: selectedCandidate.id,
      candidateName: selectedCandidate.name,
      candidateEmail: selectedCandidate.email,
      jobId: selectedCandidate.appliedJobId,
      jobTitle: selectedCandidate.appliedJobTitle,
      subject,
      body,
      tone,
    });
  };

  const filteredMessages = outreachMessages.filter((m) => {
    if (statusFilter === 'All') return true;
    return m.status === statusFilter;
  });

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
            Candidate Outreach
          </h1>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Draft tailored candidate messaging, review copy inline, and approve outreach dispatches.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => navigate('talent-studio')}
            style={{
              height: 32,
              padding: '0 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: '#eef2ff',
              border: '1px solid #c7d2fe',
              color: '#4338ca',
              cursor: 'pointer',
              transition: 'all 0.12s ease',
            }}
          >
            <Sparkles size={13} />
            <span>Studio Desk (Refs)</span>
          </button>

          <div
            style={{
              fontSize: 12,
              color: '#71717a',
              padding: '5px 12px',
              background: '#fafafa',
              borderRadius: 6,
              border: '1px solid #e4e4e7',
            }}
          >
            Simulation: No live emails sent
          </div>
        </div>
      </div>

      {/* Main Grid: Composer on left, Messages list on right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: 20,
        }}
      >
        {/* Left Column: AI Outreach Generator & Editor */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 10,
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{ borderBottom: '1px solid #f4f4f5', paddingBottom: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#18181b' }}>Generate & Review Outreach</h3>
            <p style={{ fontSize: 12.5, color: '#71717a', marginTop: 2 }}>
              Drafts personalized messages based on candidate profile and role criteria.
            </p>
          </div>

          <form onSubmit={handleSaveDraft} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Candidate Selector */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: 13, fontWeight: 500, color: '#18181b' }}>
                Target Candidate
              </label>
              <CustomSelect
                value={selectedCandidateId}
                onChange={(val) => {
                  setSelectedCandidateId(val);
                  const cand = candidates.find((c) => c.id === val);
                  if (cand) handleGenerateTemplate(cand, tone);
                }}
                options={candidates.map((c) => ({
                  value: c.id,
                  label: `${c.name} — ${c.title}`,
                  badge: `${c.matchScore}% Match`,
                }))}
                size="md"
                menuWidth="100%"
              />
            </div>

            {/* Subject */}
            <Input
              label="Subject Line"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            {/* BoardUI AI Composer with Variable Tokens and Tone Controls */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: 13, fontWeight: 500, color: '#18181b', marginBottom: 6 }}>
                Message Body (BoardUI AI Composer)
              </label>
              <Composer
                value={body}
                onChange={setBody}
                isGenerating={isGenerating}
                onRegenerate={() => handleGenerateTemplate(selectedCandidate, tone)}
                availableTokens={['{{first_name}}', '{{role}}', '{{client}}', '{{top_skill}}']}
                primaryActionLabel="Save & Queue Draft"
                toneControl={
                  <SegmentedControl
                    size="sm"
                    value={tone}
                    onChange={(val) => {
                      const t = val as OutreachTone;
                      setTone(t);
                      handleGenerateTemplate(selectedCandidate, t);
                    }}
                    options={[
                      { value: 'Professional', label: 'Professional' },
                      { value: 'Engaging', label: 'Engaging' },
                      { value: 'Executive', label: 'Executive' },
                    ]}
                  />
                }
              />
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 14,
                borderTop: '1px solid #f4f4f5',
              }}
            >
              <button
                type="button"
                onClick={() => handleGenerateTemplate(selectedCandidate, tone)}
                disabled={isGenerating}
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
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  opacity: isGenerating ? 0.6 : 1,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isGenerating) {
                    e.currentTarget.style.background = '#f4f4f5';
                    e.currentTarget.style.borderColor = '#d4d4d8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isGenerating) {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#e4e4e7';
                  }
                }}
              >
                <RefreshCw size={13} className={isGenerating ? 'spin' : ''} style={{ color: 'var(--text-muted)' }} />
                <span>{isGenerating ? 'Synthesizing...' : 'Regenerate Draft'}</span>
              </button>

              <button
                type="submit"
                className="btn-dark"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  height: 34,
                  padding: '0 16px',
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontWeight: 500,
                  background: '#18181b',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <FileText size={13} />
                <span>Save as Draft</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Outreach Pipeline & Tracking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: 10,
              padding: '20px 22px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#18181b' }}>Message Queue</h3>
                <p style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>
                  Manage drafts, approvals, and dispatch status.
                </p>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', gap: 4, background: '#f4f4f5', padding: 3, borderRadius: 6 }}>
                {['All', 'Draft', 'Approved', 'Sent — Demo'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    style={{
                      padding: '4px 9px',
                      borderRadius: 4,
                      fontSize: 11.5,
                      fontWeight: 500,
                      border: 'none',
                      background: statusFilter === st ? '#ffffff' : 'transparent',
                      color: statusFilter === st ? '#18181b' : '#71717a',
                      boxShadow: statusFilter === st ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: '#a1a1aa', fontSize: 13 }}>
                No messages match the selected status.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 8,
                      border: '1px solid #f4f4f5',
                      background: '#fafafa',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#18181b' }}>
                          {msg.candidateName}
                        </div>
                        <div style={{ fontSize: 12, color: '#71717a', marginTop: 1 }}>
                          {msg.jobTitle} • {msg.tone} Tone
                        </div>
                      </div>
                      <StatusBadge status={msg.status} />
                    </div>

                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#18181b' }}>
                      {msg.subject}
                    </div>

                    <p
                      style={{
                        fontSize: 12,
                        color: '#52525b',
                        whiteSpace: 'pre-line',
                        lineHeight: 1.45,
                        maxHeight: 90,
                        overflowY: 'auto',
                        padding: '8px 10px',
                        background: '#ffffff',
                        borderRadius: 6,
                        border: '1px solid #e4e4e7',
                      }}
                    >
                      {msg.body}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
                      <span style={{ fontSize: 11, color: '#a1a1aa' }}>
                        Created {msg.createdAt}
                      </span>

                      <div style={{ display: 'flex', gap: 8 }}>
                        {msg.status === 'Draft' && (
                          <button
                            type="button"
                            onClick={() => approveOutreachMessage(msg.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              height: 28,
                              padding: '0 10px',
                              borderRadius: 5,
                              fontSize: 12,
                              fontWeight: 500,
                              background: '#ffffff',
                              border: '1px solid #e4e4e7',
                              color: '#18181b',
                              cursor: 'pointer',
                            }}
                          >
                            <CheckCircle2 size={12} />
                            <span>Approve</span>
                          </button>
                        )}

                        {msg.status === 'Approved' && (
                          <button
                            type="button"
                            onClick={() => sendOutreachMessage(msg.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              height: 28,
                              padding: '0 10px',
                              borderRadius: 5,
                              fontSize: 12,
                              fontWeight: 500,
                              background: '#18181b',
                              color: '#ffffff',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <Send size={12} />
                            <span>Send (Demo)</span>
                          </button>
                        )}

                        {msg.status === 'Sent — Demo' && (
                          <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                            Dispatched
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
