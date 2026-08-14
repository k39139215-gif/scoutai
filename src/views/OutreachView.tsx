import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import { Input, Textarea } from '../components/common/Input';
import type { OutreachTone } from '../types';

export const OutreachView: React.FC = () => {
  const {
    candidates,
    outreachMessages,
    createOutreachMessage,
    approveOutreachMessage,
    sendOutreachMessage,
  } = useApp();

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidates[0]?.id || 'cand-1');
  const [tone, setTone] = useState<OutreachTone>('Professional');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  // Auto-fill template when candidate or tone changes
  const handleGenerateTemplate = (candidateObj = selectedCandidate, toneVal = tone) => {
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
    }, 100);
  };

  React.useEffect(() => {
    if (!subject && selectedCandidate) {
      handleGenerateTemplate(selectedCandidate, tone);
    }
  }, [selectedCandidateId]);

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
            Candidate Outreach
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Draft tailored candidate messaging, review copy inline, and approve outreach dispatches.
          </p>
        </div>

        <div
          style={{
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            padding: '4px 10px',
            background: 'var(--color-bg-canvas)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
          }}
        >
          Simulation: No live emails sent
        </div>
      </div>

      {/* Main Grid: Composer on left, Messages list on right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 20,
        }}
      >
        {/* Left Column: AI Outreach Generator & Editor */}
        <div className="snow-card" style={{ padding: '20px 24px' }}>
          <div style={{ borderBottom: '1px solid var(--color-divider)', paddingBottom: 12, marginBottom: 16 }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>Generate & Review Outreach</h3>
            <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: 1 }}>
              Drafts personalized messages based on candidate profile and role criteria.
            </p>
          </div>

          <form onSubmit={handleSaveDraft} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Candidate Selector */}
            <div className="form-group">
              <label className="form-label">Target Candidate</label>
              <select
                value={selectedCandidateId}
                onChange={(e) => {
                  setSelectedCandidateId(e.target.value);
                  const cand = candidates.find((c) => c.id === e.target.value);
                  if (cand) handleGenerateTemplate(cand, tone);
                }}
                className="form-select"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.title} ({c.matchScore}% Match)
                  </option>
                ))}
              </select>
            </div>

            {/* Tone Selector */}
            <div className="form-group">
              <label className="form-label">Tone Preset</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['Professional', 'Engaging', 'Executive'] as OutreachTone[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTone(t);
                      handleGenerateTemplate(selectedCandidate, t);
                    }}
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid',
                      borderColor: tone === t ? 'var(--color-primary)' : 'var(--color-border)',
                      background: tone === t ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                      color: tone === t ? '#ffffff' : 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <Input
              label="Subject Line"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            {/* Body */}
            <Textarea
              label="Message Body (Editable)"
              required
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              helperText="Human recruiter review is required before approving and dispatching."
            />

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 12,
                borderTop: '1px solid var(--color-divider)',
              }}
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon={<Sparkles size={12} />}
                onClick={() => handleGenerateTemplate(selectedCandidate, tone)}
              >
                Regenerate
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                icon={<FileText size={13} />}
              >
                Save as Draft
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Outreach Pipeline & Tracking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="snow-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>Message Queue</h3>
                <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                  Manage drafts, approvals, and dispatch status.
                </p>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', gap: 3 }}>
                {['All', 'Draft', 'Approved', 'Sent — Demo'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    style={{
                      padding: '3px 7px',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '11px',
                      border: '1px solid',
                      borderColor: statusFilter === st ? 'var(--color-primary)' : 'var(--color-border)',
                      background: statusFilter === st ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                      color: statusFilter === st ? '#ffffff' : 'var(--color-text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 16px', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                No messages match the selected status.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      padding: 12,
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-bg-canvas)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {msg.candidateName}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                          {msg.jobTitle} • {msg.tone} Tone
                        </div>
                      </div>
                      <StatusBadge status={msg.status} />
                    </div>

                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {msg.subject}
                    </div>

                    <p
                      style={{
                        fontSize: '11.5px',
                        color: 'var(--color-text-secondary)',
                        whiteSpace: 'pre-line',
                        lineHeight: 1.4,
                        maxHeight: 80,
                        overflowY: 'auto',
                        padding: 6,
                        background: 'var(--color-bg-surface)',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--color-border-subtle)',
                      }}
                    >
                      {msg.body}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
                      <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>
                        Created {msg.createdAt}
                      </span>

                      <div style={{ display: 'flex', gap: 6 }}>
                        {msg.status === 'Draft' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<CheckCircle2 size={12} />}
                            onClick={() => approveOutreachMessage(msg.id)}
                          >
                            Approve
                          </Button>
                        )}

                        {msg.status === 'Approved' && (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={<Send size={12} />}
                            onClick={() => sendOutreachMessage(msg.id)}
                          >
                            Send (Demo)
                          </Button>
                        )}

                        {msg.status === 'Sent — Demo' && (
                          <span style={{ fontSize: '11px', color: 'var(--color-success-text)', fontWeight: 600 }}>
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
