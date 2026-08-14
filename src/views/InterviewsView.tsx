import React, { useState } from 'react';
import {
  Calendar,
  User,
  Plus,
  CheckCircle2,
  XCircle,
  Video,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input, Textarea } from '../components/common/Input';

export const InterviewsView: React.FC = () => {
  const {
    interviews,
    candidates,
    scheduleInterview,
    cancelInterview,
    completeInterview,
    navigate,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);

  // New interview form state
  const [candidateId, setCandidateId] = useState(candidates[0]?.id || 'cand-1');
  const [interviewer, setInterviewer] = useState('Sameer Kulkarni (VP Engineering)');
  const [date, setDate] = useState('2026-08-22');
  const [time, setTime] = useState('16:00 IST');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [type, setType] = useState<'Technical Screen' | 'System Architecture' | 'Hiring Manager Round' | 'Culture & Alignment'>('Technical Screen');
  const [notes, setNotes] = useState('Evaluate distributed concurrency patterns and system design.');

  const selectedCandidate = candidates.find((c) => c.id === candidateId) || candidates[0];

  const handleCreateInterview = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleInterview({
      candidateId: selectedCandidate.id,
      candidateName: selectedCandidate.name,
      candidateTitle: selectedCandidate.title,
      jobId: selectedCandidate.appliedJobId,
      jobTitle: selectedCandidate.appliedJobTitle,
      interviewer,
      date,
      time,
      durationMinutes,
      type,
      locationOrLink: 'https://meet.scoutai.internal/demo-room-304',
      notes,
    });
    setModalOpen(false);
  };

  const filteredInterviews = interviews.filter((i) => {
    if (statusFilter === 'All') return true;
    return i.status === statusFilter;
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
            Interviews Schedule
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Manage upcoming technical rounds, panel assessments, and candidate interview schedules.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={14} />}
          onClick={() => setModalOpen(true)}
        >
          Schedule Interview
        </Button>
      </div>

      {/* Filter Row */}
      <div
        className="snow-card"
        style={{
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', gap: 4 }}>
          {['All', 'Scheduled', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: statusFilter === st ? 600 : 500,
                border: '1px solid',
                borderColor: statusFilter === st ? 'var(--color-primary)' : 'var(--color-border)',
                background: statusFilter === st ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                color: statusFilter === st ? '#ffffff' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
          Showing {filteredInterviews.length} of {interviews.length} interviews
        </span>
      </div>

      {/* Interviews Grid */}
      {filteredInterviews.length === 0 ? (
        <div className="snow-card" style={{ padding: '36px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
          No interviews found with status "{statusFilter}".
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
          {filteredInterviews.map((item) => (
            <div
              key={item.id}
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
                      onClick={() => navigate('candidate-detail', { candidateId: item.candidateId })}
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-blue)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                    >
                      {item.candidateName}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: 1 }}>
                      {item.jobTitle}
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div
                  style={{
                    background: 'var(--color-bg-canvas)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                    margin: '12px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                    <Calendar size={13} style={{ color: 'var(--color-accent-blue)' }} />
                    <span>{item.date} • {item.time} ({item.durationMinutes} min)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
                    <User size={12} style={{ color: 'var(--color-text-muted)' }} />
                    <span>Interviewer: {item.interviewer}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
                    <Video size={12} style={{ color: 'var(--color-text-muted)' }} />
                    <span style={{ fontFamily: 'var(--font-family-mono)', fontSize: '10.5px' }}>
                      {item.locationOrLink}
                    </span>
                  </div>
                </div>

                {item.notes && (
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    <strong>Focus:</strong> {item.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
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
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('candidate-detail', { candidateId: item.candidateId })}
                >
                  Profile
                </Button>

                <div style={{ display: 'flex', gap: 6 }}>
                  {item.status === 'Scheduled' && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<XCircle size={12} />}
                        onClick={() => cancelInterview(item.id)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        icon={<CheckCircle2 size={12} />}
                        onClick={() => completeInterview(item.id)}
                      >
                        Complete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule Interview Round"
        description="Book a technical assessment session with candidate"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={<Calendar size={13} />} onClick={handleCreateInterview}>
              Confirm Schedule
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateInterview} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Candidate</label>
            <select
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              className="form-select"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.appliedJobTitle}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Input
              label="Date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Input
              label="Time (IST)"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="form-group">
              <label className="form-label">Round Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="form-select"
              >
                <option value="Technical Screen">Technical Screen</option>
                <option value="System Architecture">System Architecture</option>
                <option value="Hiring Manager Round">Hiring Manager Round</option>
                <option value="Culture & Alignment">Culture & Alignment</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Duration (Minutes)</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
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
            label="Assigned Interviewer"
            required
            value={interviewer}
            onChange={(e) => setInterviewer(e.target.value)}
          />

          <Textarea
            label="Assessment Focus"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
};
