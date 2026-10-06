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
import { CustomSelect } from '../components/common/CustomDropdown';

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
            Interviews Schedule
          </h1>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Manage upcoming technical rounds, panel assessments, and candidate interview schedules.
          </p>
        </div>

        <button
          className="btn-dark"
          onClick={() => setModalOpen(true)}
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
            cursor: 'pointer',
          }}
        >
          <Plus size={15} />
          <span>Schedule Interview</span>
        </button>
      </div>

      {/* Filter Row */}
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 3, background: '#f4f4f5', padding: 3, borderRadius: 7 }}>
          {['All', 'Scheduled', 'Completed', 'Cancelled'].map((st) => {
            const isSelected = statusFilter === st;
            const count = st === 'All' ? interviews.length : interviews.filter((i) => i.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontWeight: isSelected ? 600 : 500,
                  border: 'none',
                  background: isSelected ? '#ffffff' : 'transparent',
                  color: isSelected ? '#18181b' : '#71717a',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.12s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{st}</span>
                <span
                  style={{
                    fontSize: 11,
                    padding: '0 5px',
                    borderRadius: 9999,
                    background: isSelected ? '#f4f4f5' : 'transparent',
                    color: isSelected ? '#18181b' : '#a1a1aa',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <span style={{ fontSize: 13, color: '#71717a' }}>
          Showing <strong style={{ color: '#18181b' }}>{filteredInterviews.length}</strong> of {interviews.length} interviews
        </span>
      </div>

      {/* Interviews Grid */}
      {filteredInterviews.length === 0 ? (
        <div className="snow-card" style={{ padding: '36px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
          No interviews found with status "{statusFilter}".
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          {filteredInterviews.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e4e4e7',
                borderRadius: 8,
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 16,
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div
                      onClick={() => navigate('candidate-detail', { candidateId: item.candidateId })}
                      style={{
                        fontSize: 14.5,
                        fontWeight: 600,
                        color: '#18181b',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#18181b')}
                    >
                      {item.candidateName}
                    </div>
                    <div style={{ fontSize: 12.5, color: '#71717a', marginTop: 2 }}>
                      {item.jobTitle}
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    padding: '12px 14px',
                    margin: '14px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                    <Calendar size={14} style={{ color: '#2563eb' }} />
                    <span>{item.date} • {item.time} ({item.durationMinutes} min)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: '#64748b' }}>
                    <User size={13} style={{ color: '#94a3b8' }} />
                    <span>Interviewer: {item.interviewer}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: '#64748b' }}>
                    <Video size={13} style={{ color: '#94a3b8' }} />
                    <span style={{ fontFamily: 'monospace', fontSize: 11.5, color: '#334155' }}>
                      {item.locationOrLink}
                    </span>
                  </div>
                </div>

                {item.notes && (
                  <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    <strong style={{ color: '#334155' }}>Focus:</strong> {item.notes}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#18181b' }}>Candidate</label>
            <CustomSelect
              value={candidateId}
              onChange={(val) => setCandidateId(val)}
              options={candidates.map((c) => ({
                value: c.id,
                label: `${c.name} — ${c.appliedJobTitle}`,
              }))}
              size="md"
              menuWidth="100%"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#18181b' }}>Round Type</label>
              <CustomSelect
                value={type}
                onChange={(val) => setType(val as any)}
                options={[
                  { value: 'Technical Screen', label: 'Technical Screen' },
                  { value: 'System Architecture', label: 'System Architecture' },
                  { value: 'Hiring Manager Round', label: 'Hiring Manager Round' },
                  { value: 'Culture & Alignment', label: 'Culture & Alignment' },
                ]}
                size="md"
                menuWidth="100%"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#18181b' }}>Duration</label>
              <CustomSelect
                value={String(durationMinutes)}
                onChange={(val) => setDurationMinutes(Number(val))}
                options={[
                  { value: '30', label: '30 Minutes' },
                  { value: '45', label: '45 Minutes' },
                  { value: '60', label: '60 Minutes' },
                  { value: '90', label: '90 Minutes' },
                ]}
                size="md"
                menuWidth="100%"
              />
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
