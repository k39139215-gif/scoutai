import React, { useState } from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Send,
  CheckCircle2,
  ArrowLeft,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import { AIMatchCard } from '../components/common/AIMatchCard';
import { Modal } from '../components/common/Modal';
import { Drawer } from '../components/common/Drawer';
import { Input, Textarea } from '../components/common/Input';
import type { OutreachTone } from '../types';

export const CandidateDetailView: React.FC = () => {
  const {
    candidates,
    selectedCandidateId,
    shortlistCandidate,
    outreachMessages,
    interviews,
    aiActivity,
    createOutreachMessage,
    scheduleInterview,
    navigate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'experience' | 'resume' | 'outreach' | 'activity'>('experience');

  // Modal / Drawer states
  const [outreachDrawerOpen, setOutreachDrawerOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [copiedResume, setCopiedResume] = useState(false);

  // Outreach form state
  const [outreachTone, setOutreachTone] = useState<OutreachTone>('Professional');
  const [outreachSubject, setOutreachSubject] = useState('');
  const [outreachBody, setOutreachBody] = useState('');

  // Interview form state
  const [interviewDate, setInterviewDate] = useState('2026-08-20');
  const [interviewTime, setInterviewTime] = useState('15:00 IST');
  const [interviewer, setInterviewer] = useState('Naveen Varma (Engineering Manager)');
  const [interviewType, setInterviewType] = useState<'Technical Screen' | 'System Architecture' | 'Hiring Manager Round' | 'Culture & Alignment'>('Technical Screen');
  const [interviewDuration, setInterviewDuration] = useState(45);
  const [interviewNotes, setInterviewNotes] = useState('Focus on frontend architecture, state management, and performance.');

  const candidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  if (!candidate) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Candidate not found.</p>
        <Button onClick={() => navigate('candidates')} style={{ marginTop: 12 }}>
          Back to Candidates Directory
        </Button>
      </div>
    );
  }

  // Prepopulate outreach
  const handleOpenOutreach = () => {
    setOutreachSubject(`Exploring ${candidate.appliedJobTitle} role at ScoutAI`);
    setOutreachBody(`Hi ${candidate.name.split(' ')[0]},

I came across your background in ${candidate.skills.slice(0, 3).join(', ')} and was very impressed by your accomplishments.

We are currently expanding our engineering team for the ${candidate.appliedJobTitle} role. Given your experience in ${candidate.experienceList[0]?.company || 'modern web development'}, your technical profile seems like an excellent match for our upcoming initiatives.

Would you be open for an informal 15-minute introductory conversation this week to discuss details?

Best regards,
Aarav Mehta
Lead Technical Recruiter, ScoutAI`);
    setOutreachDrawerOpen(true);
  };

  const handleSendOutreach = () => {
    createOutreachMessage({
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      jobId: candidate.appliedJobId,
      jobTitle: candidate.appliedJobTitle,
      subject: outreachSubject,
      body: outreachBody,
      tone: outreachTone,
    });
    setOutreachDrawerOpen(false);
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleInterview({
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateTitle: candidate.title,
      jobId: candidate.appliedJobId,
      jobTitle: candidate.appliedJobTitle,
      interviewer,
      date: interviewDate,
      time: interviewTime,
      durationMinutes: interviewDuration,
      type: interviewType,
      locationOrLink: 'https://meet.scoutai.internal/demo-room-502',
      notes: interviewNotes,
    });
    setInterviewModalOpen(false);
  };

  const candidateOutreach = outreachMessages.filter((m) => m.candidateId === candidate.id);
  const candidateInterviews = interviews.filter((i) => i.candidateId === candidate.id);
  const candidateActivities = aiActivity.filter((a) => a.target.includes(candidate.name));

  const copyResume = () => {
    navigator.clipboard.writeText(candidate.resumeText);
    setCopiedResume(true);
    setTimeout(() => setCopiedResume(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Breadcrumb & Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <button
          onClick={() => navigate('candidates')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-xs)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: 0,
          }}
        >
          <ArrowLeft size={14} />
          <span>All Candidates</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            variant="secondary"
            size="sm"
            icon={<Send size={13} />}
            onClick={handleOpenOutreach}
          >
            Draft Outreach
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Calendar size={13} />}
            onClick={() => setInterviewModalOpen(true)}
          >
            Schedule Interview
          </Button>

          <Button
            variant={candidate.status === 'Shortlisted' ? 'success' : 'primary'}
            size="sm"
            icon={<CheckCircle2 size={13} />}
            onClick={() => shortlistCandidate(candidate.id)}
          >
            {candidate.status === 'Shortlisted' ? 'Shortlisted Candidate' : 'Shortlist Candidate'}
          </Button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="snow-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--color-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--font-size-md)',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {candidate.name.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                  {candidate.name}
                </h1>
                <StatusBadge status={candidate.status} />
              </div>

              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                {candidate.title} • {candidate.experienceYears} Years Experience
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={11} />
                  <span>{candidate.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Mail size={11} />
                  <span>{candidate.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Phone size={11} />
                  <span>{candidate.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Briefcase size={11} />
                  <span>Applied for {candidate.appliedJobTitle}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 600,
                color: 'var(--color-success-text)',
              }}
            >
              {candidate.matchScore}%
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Advisory Match
            </div>
          </div>
        </div>

        {/* Candidate Skills Chips */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--color-divider)' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', alignSelf: 'center', marginRight: 4 }}>
            Candidate Skills:
          </span>
          {candidate.skills.map((s) => (
            <span
              key={s}
              style={{
                fontSize: '11px',
                background: 'var(--color-bg-canvas)',
                border: '1px solid var(--color-border)',
                padding: '2px 7px',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* AI Match Analysis Card */}
      <AIMatchCard candidate={candidate} />

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--color-border)', paddingBottom: 2 }}>
        <button
          onClick={() => setActiveTab('experience')}
          style={{
            padding: '7px 14px',
            border: 'none',
            background: 'transparent',
            fontSize: 'var(--font-size-sm)',
            fontWeight: activeTab === 'experience' ? 600 : 500,
            color: activeTab === 'experience' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            borderBottom: activeTab === 'experience' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Experience & Education
        </button>

        <button
          onClick={() => setActiveTab('resume')}
          style={{
            padding: '7px 14px',
            border: 'none',
            background: 'transparent',
            fontSize: 'var(--font-size-sm)',
            fontWeight: activeTab === 'resume' ? 600 : 500,
            color: activeTab === 'resume' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            borderBottom: activeTab === 'resume' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Formatted Resume
        </button>

        <button
          onClick={() => setActiveTab('outreach')}
          style={{
            padding: '7px 14px',
            border: 'none',
            background: 'transparent',
            fontSize: 'var(--font-size-sm)',
            fontWeight: activeTab === 'outreach' ? 600 : 500,
            color: activeTab === 'outreach' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            borderBottom: activeTab === 'outreach' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Outreach & Interviews ({candidateOutreach.length + candidateInterviews.length})
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          style={{
            padding: '7px 14px',
            border: 'none',
            background: 'transparent',
            fontSize: 'var(--font-size-sm)',
            fontWeight: activeTab === 'activity' ? 600 : 500,
            color: activeTab === 'activity' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            borderBottom: activeTab === 'activity' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Candidate Activity Log
        </button>
      </div>

      {/* Tab 1: Experience & Education */}
      {activeTab === 'experience' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Work Experience */}
          <div className="snow-card" style={{ padding: '20px 24px' }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 14 }}>
              Professional Work Experience
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {candidate.experienceList.map((exp, i) => (
                <div
                  key={i}
                  style={{
                    paddingLeft: 14,
                    borderLeft: '2px solid var(--color-border)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: -5,
                      top: 4,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--color-primary)',
                    }}
                  />
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {exp.title}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', margin: '1px 0 4px' }}>
                    {exp.company} • {exp.period}
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="snow-card" style={{ padding: '20px 24px' }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 12 }}>
              Academic Background
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {candidate.educationList.map((edu, i) => (
                <div key={i}>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{edu.degree}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: 1 }}>
                    {edu.institution} • Graduated {edu.year}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Resume */}
      {activeTab === 'resume' && (
        <div className="snow-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={15} />
              <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>Extracted Resume Text</h3>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={copiedResume ? <Check size={13} /> : <Copy size={13} />}
              onClick={copyResume}
            >
              {copiedResume ? 'Copied' : 'Copy Text'}
            </Button>
          </div>
          <pre
            style={{
              background: 'var(--color-bg-canvas)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              fontSize: '11.5px',
              lineHeight: 1.6,
              fontFamily: 'var(--font-family-mono)',
              whiteSpace: 'pre-wrap',
              color: 'var(--color-text-primary)',
            }}
          >
            {candidate.resumeText}
          </pre>
        </div>
      )}

      {/* Tab 3: Outreach & Interviews */}
      {activeTab === 'outreach' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Outreach list */}
          <div className="snow-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                Outreach History ({candidateOutreach.length})
              </h3>
              <Button variant="secondary" size="sm" icon={<Send size={12} />} onClick={handleOpenOutreach}>
                New Outreach Draft
              </Button>
            </div>

            {candidateOutreach.length === 0 ? (
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                No outreach drafted for this candidate yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {candidateOutreach.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      padding: 12,
                      background: 'var(--color-bg-canvas)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <div style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>{msg.subject}</div>
                      <StatusBadge status={msg.status} />
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', whiteSpace: 'pre-line', lineHeight: 1.4 }}>
                      {msg.body}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interviews list */}
          <div className="snow-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                Scheduled Interviews ({candidateInterviews.length})
              </h3>
              <Button variant="secondary" size="sm" icon={<Calendar size={12} />} onClick={() => setInterviewModalOpen(true)}>
                Schedule Interview
              </Button>
            </div>

            {candidateInterviews.length === 0 ? (
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                No interviews currently scheduled.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {candidateInterviews.map((int) => (
                  <div
                    key={int.id}
                    style={{
                      padding: 12,
                      background: 'var(--color-bg-canvas)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>
                        {int.type} • {int.interviewer}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                        {int.date} at {int.time} ({int.durationMinutes} mins)
                      </div>
                    </div>
                    <StatusBadge status={int.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Activity Log */}
      {activeTab === 'activity' && (
        <div className="snow-card" style={{ padding: '20px 24px' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 12 }}>
            Audit Trail & Event History
          </h3>
          {candidateActivities.length === 0 ? (
            <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
              No recorded events for this candidate.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {candidateActivities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--color-divider)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                      {act.type} • <span style={{ fontWeight: 400, color: 'var(--color-text-secondary)' }}>{act.actor}</span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      {act.details}
                    </div>
                  </div>
                  <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>{act.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Outreach Drawer */}
      <Drawer
        isOpen={outreachDrawerOpen}
        onClose={() => setOutreachDrawerOpen(false)}
        title={`Outreach for ${candidate.name}`}
        subtitle={`Role: ${candidate.appliedJobTitle}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOutreachDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={<Send size={13} />} onClick={handleSendOutreach}>
              Save Draft
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Message Tone</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['Professional', 'Engaging', 'Executive'] as OutreachTone[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setOutreachTone(t)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: outreachTone === t ? 'var(--color-primary)' : 'var(--color-border)',
                    background: outreachTone === t ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                    color: outreachTone === t ? '#ffffff' : 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Subject Line"
            value={outreachSubject}
            onChange={(e) => setOutreachSubject(e.target.value)}
          />

          <Textarea
            label="Message Body (Editable)"
            rows={9}
            value={outreachBody}
            onChange={(e) => setOutreachBody(e.target.value)}
            helperText="AI generated draft. Human review required before approval."
          />
        </div>
      </Drawer>

      {/* Interview Scheduling Modal */}
      <Modal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        title={`Schedule Interview: ${candidate.name}`}
        description={`Role: ${candidate.appliedJobTitle}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setInterviewModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={<Calendar size={13} />} onClick={handleScheduleInterview}>
              Confirm Interview
            </Button>
          </>
        }
      >
        <form onSubmit={handleScheduleInterview} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Input
              label="Date"
              type="date"
              required
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
            />
            <Input
              label="Time (IST)"
              required
              placeholder="e.g. 15:00 IST"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="form-group">
              <label className="form-label">Round</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value as any)}
                className="form-select"
              >
                <option value="Technical Screen">Technical Screen</option>
                <option value="System Architecture">System Architecture</option>
                <option value="Hiring Manager Round">Hiring Manager Round</option>
                <option value="Culture & Alignment">Culture & Alignment</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Duration</label>
              <select
                value={interviewDuration}
                onChange={(e) => setInterviewDuration(Number(e.target.value))}
                className="form-select"
              >
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
                <option value={90}>90 Minutes</option>
              </select>
            </div>
          </div>

          <Input
            label="Interviewer"
            required
            placeholder="e.g. Sameer Kulkarni (VP Engineering)"
            value={interviewer}
            onChange={(e) => setInterviewer(e.target.value)}
          />

          <Textarea
            label="Notes / Focus"
            rows={3}
            value={interviewNotes}
            onChange={(e) => setInterviewNotes(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
};
