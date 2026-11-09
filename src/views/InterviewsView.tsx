import React, { useState } from 'react';
import {
  Calendar,
  User,
  Plus,
  CheckCircle2,
  XCircle,
  Video,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input, Textarea } from '../components/common/Input';
import { CustomSelect } from '../components/common/CustomDropdown';
import { DatePicker } from '../components/boardui';
import { isDevMode } from '../utils/devMode';
import { formatDate, formatTime, getRelativeDateLabel } from '../utils/formatters';
import { getNearestUpcomingInterview } from '../data/recruitmentData';

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

  const nextInterview = getNearestUpcomingInterview(interviews);

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
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Interviews
          </h1>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Manage upcoming technical rounds, panel assessments, and candidate interview schedules.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isDevMode() && (
            <button
              onClick={() => navigate('talent-studio')}
              style={{
                height: 36,
                padding: '0 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#eef2ff',
                border: '1px solid #c7d2fe',
                color: '#4338ca',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
            >
              <Sparkles size={14} />
              <span>Studio Desk (Refs)</span>
            </button>
          )}

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
      </div>

      {/* Nearest Upcoming Interview Hero Card */}
      {nextInterview && (
        <div
          style={{
            padding: '14px 18px',
            background: '#ffffff',
            border: '1px solid #c7d2fe',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            boxShadow: '0 1px 3px rgba(67, 56, 202, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: '#eef2ff',
                color: '#4338ca',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <Calendar size={18} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Next Scheduled Session ({nextInterview.relativeDateLabel})
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 1 }}>
                {nextInterview.interview.candidateName} • {nextInterview.interview.jobTitle}
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                {nextInterview.dateFormatted} • {nextInterview.timeFormatted} ({nextInterview.interview.durationMinutes} min) with {nextInterview.interview.interviewer}
              </div>
            </div>
          </div>

          <a
            href={nextInterview.interview.locationOrLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              height: 32,
              padding: '0 12px',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 500,
              background: '#0f172a',
              color: '#ffffff',
              textDecoration: 'none',
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.12)',
            }}
          >
            <Video size={13} />
            <span>Join Video Room</span>
          </a>
        </div>
      )}

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
                  border: isSelected ? '1px solid #c7d2fe' : '1px solid transparent',
                  background: isSelected ? '#ffffff' : 'transparent',
                  color: isSelected ? '#4338ca' : '#475569',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 1px 2px rgba(67, 56, 202, 0.08)' : 'none',
                  transition: 'all 0.12s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{st}</span>
                <span
                  style={{
                    fontSize: 12,
                    padding: '0 5px',
                    borderRadius: 9999,
                    background: isSelected ? '#e0e7ff' : '#e2e8f0',
                    color: isSelected ? '#3730a3' : '#64748b',
                    fontVariantNumeric: 'tabular-nums',
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
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {getRelativeDateLabel(item.date) === 'Today' || getRelativeDateLabel(item.date) === 'Tomorrow'
                        ? `${getRelativeDateLabel(item.date)} (${formatDate(item.date)}) • ${formatTime(item.time)}`
                        : `${formatDate(item.date)} • ${formatTime(item.time)}`}{' '}
                      ({item.durationMinutes} min)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: '#64748b' }}>
                    <User size={13} style={{ color: '#94a3b8' }} />
                    <span>Interviewer: {item.interviewer}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: '#64748b' }}>
                    <Video size={13} style={{ color: '#2563eb', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.locationOrLink}
                    </span>
                  </div>
                </div>

                {item.notes && (
                  <p style={{ fontSize: 12.5, color: '#52525b', lineHeight: 1.5, margin: 0, wordBreak: 'break-word' }}>
                    <strong style={{ color: '#18181b' }}>Focus:</strong> {item.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 12,
                  borderTop: '1px solid #f4f4f5',
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate('candidate-detail', { candidateId: item.candidateId })}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 30,
                    padding: '0 12px',
                    borderRadius: 6,
                    fontSize: 12,
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
                  Profile
                </button>

                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {item.status === 'Scheduled' && (
                    <>
                      <button
                        type="button"
                        onClick={() => cancelInterview(item.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          height: 30,
                          padding: '0 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 500,
                          background: '#ffffff',
                          border: '1px solid #e4e4e7',
                          color: '#dc2626',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                      >
                        <XCircle size={12} />
                        <span>Cancel</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => completeInterview(item.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          height: 30,
                          padding: '0 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 500,
                          background: '#dcfce7',
                          border: '1px solid #86efac',
                          color: '#15803d',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#bbf7d0')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#dcfce7')}
                      >
                        <CheckCircle2 size={12} />
                        <span>Complete</span>
                      </button>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#18181b' }}>Date</label>
              <DatePicker
                value={date}
                onChange={setDate}
                placeholder="Select date..."
                size="md"
                style={{ width: '100%' }}
              />
            </div>
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
