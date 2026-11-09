import React, { useState } from 'react';
import {
  Calendar,
  User,
  Plus,
  CheckCircle2,
  Video,
  Copy,
  Check,
  Clock,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input, Textarea } from '../components/common/Input';
import { CustomSelect } from '../components/common/CustomDropdown';
import { DatePicker, SegmentedControl } from '../components/boardui';
import { isDevMode } from '../utils/devMode';
import { formatDate, formatTime, getRelativeDateLabel } from '../utils/formatters';
import { getNearestUpcomingInterview } from '../data/recruitmentData';
import { useToast } from '../context/ToastContext';

export const InterviewsView: React.FC = () => {
  const {
    interviews,
    candidates,
    scheduleInterview,
    cancelInterview,
    navigate,
  } = useApp();

  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New interview form state
  const [candidateId, setCandidateId] = useState(candidates[0]?.id || 'cand-1');
  const [interviewer, setInterviewer] = useState('Dr. Sameer Kulkarni (VP of AI)');
  const [date, setDate] = useState('2026-08-22');
  const [time, setTime] = useState('16:00 IST');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [type, setType] = useState<
    'Technical Screen' | 'System Architecture' | 'Hiring Manager Round' | 'Culture & Alignment'
  >('Technical Screen');
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
    showToast('Interview session scheduled successfully', 'success');
  };

  const handleCopyLink = (interviewId: string, url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(interviewId);
      showToast('Meeting link copied to clipboard', 'info');
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      setCopiedId(interviewId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleConfirmCancel = () => {
    if (!cancelModalId) return;
    cancelInterview(cancelModalId);
    setCancelModalId(null);
    showToast('Interview cancelled successfully', 'info');
  };

  const filteredInterviews = interviews.filter((i) => {
    if (statusFilter === 'All') return true;
    return i.status === statusFilter;
  });

  const nextInterview = getNearestUpcomingInterview(interviews);
  const scheduledCount = interviews.filter((i) => i.status === 'Scheduled').length;
  const completedCount = interviews.filter((i) => i.status === 'Completed').length;
  const cancelledCount = interviews.filter((i) => i.status === 'Cancelled').length;

  const interviewToCancel = interviews.find((i) => i.id === cancelModalId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Header with Title & Action */}
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
              background: '#0f172a',
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

      {/* 2. Top Summary Stat Cards (Clean 3-metric overview instead of duplicating 1st card) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 12,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
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
            <div style={{ fontSize: 12.5, fontWeight: 500, color: '#64748b' }}>Scheduled Sessions</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
              {scheduledCount}
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 12,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#f0fdf4',
              color: '#16a34a',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: '#64748b' }}>Upcoming This Week</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
              {interviews.length}
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 12,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#f8fafc',
              color: '#64748b',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: '#64748b' }}>Awaiting Feedback</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
              0
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Toolbar (BoardUI Segmented Control - Flat without heavy multi-layer boxes) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '10px 0',
        }}
      >
        <SegmentedControl
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'All', label: 'All', count: interviews.length },
            { value: 'Scheduled', label: 'Scheduled', count: scheduledCount },
            { value: 'Completed', label: 'Completed', count: completedCount },
            { value: 'Cancelled', label: 'Cancelled', count: cancelledCount },
          ]}
          size="md"
        />

        <span style={{ fontSize: 13, color: '#71717a' }}>
          Showing <strong style={{ color: '#0f172a' }}>{filteredInterviews.length}</strong> of{' '}
          {interviews.length} sessions
        </span>
      </div>

      {/* 4. Interviews Grid - Flat clean cards without nested border boxes */}
      {filteredInterviews.length === 0 ? (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 12,
            padding: '48px 24px',
            textAlign: 'center',
            color: '#71717a',
            fontSize: 13,
          }}
        >
          No interview sessions found with status "{statusFilter}".
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 16,
          }}
        >
          {filteredInterviews.map((item) => {
            const isNext = item.id === nextInterview?.interview.id;
            const cand = candidates.find((c) => c.id === item.candidateId);
            const relativeDate = getRelativeDateLabel(item.date);
            const dateStr = formatDate(item.date);
            const timeStr = formatTime(item.time);

            // Clean sanitized notes to eliminate any double "Focus" copy bug
            const cleanNotes = item.notes
              ? item.notes.replace(/^(focus:\s*|focus\s+on\s*)/i, '').trim()
              : '';

            return (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  border: isNext ? '1.5px solid #c7d2fe' : '1px solid #e4e4e7',
                  borderRadius: 12,
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 16,
                  boxShadow: isNext
                    ? '0 4px 12px -2px rgba(67, 56, 202, 0.08), 0 2px 4px -1px rgba(67, 56, 202, 0.04)'
                    : '0 1px 3px rgba(0, 0, 0, 0.02)',
                  position: 'relative',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                {/* Top Section: Avatar, Candidate Name, Match Score, Badges */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: isNext ? '#1e1b4b' : '#0f172a',
                          color: '#ffffff',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 13,
                          fontWeight: 600,
                          flexShrink: 0,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {item.candidateName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span
                            onClick={() => navigate('candidate-detail', { candidateId: item.candidateId })}
                            style={{
                              fontSize: 14.5,
                              fontWeight: 600,
                              color: '#0f172a',
                              cursor: 'pointer',
                              letterSpacing: '-0.01em',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#4338ca')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
                          >
                            {item.candidateName}
                          </span>
                          {cand && (
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                padding: '1px 6px',
                                borderRadius: 9999,
                                background: '#f0fdf4',
                                color: '#166534',
                                border: '1px solid #bbf7d0',
                                fontVariantNumeric: 'tabular-nums',
                              }}
                            >
                              {cand.matchScore}% fit
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 12.5,
                            color: '#64748b',
                            marginTop: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.jobTitle}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      {isNext && (
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 9999,
                            background: '#eef2ff',
                            color: '#4338ca',
                            border: '1px solid #c7d2fe',
                          }}
                        >
                          Next Session
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          padding: '2px 8px',
                          borderRadius: 6,
                          background:
                            item.status === 'Scheduled'
                              ? '#eff6ff'
                              : item.status === 'Completed'
                              ? '#f0fdf4'
                              : '#fef2f2',
                          color:
                            item.status === 'Scheduled'
                              ? '#1d4ed8'
                              : item.status === 'Completed'
                              ? '#15803d'
                              : '#b91c1c',
                          border: `1px solid ${
                            item.status === 'Scheduled'
                              ? '#bfdbfe'
                              : item.status === 'Completed'
                              ? '#bbf7d0'
                              : '#fecaca'
                          }`,
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Clean detail rows directly inside card (no nested gray boxed panels) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                    {/* Date, Time & Round Type */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                        <Calendar size={14} style={{ color: '#4338ca', flexShrink: 0 }} />
                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {relativeDate === 'Today' || relativeDate === 'Tomorrow'
                            ? `${relativeDate} (${dateStr}) • ${timeStr}`
                            : `${dateStr} • ${timeStr}`}{' '}
                          <span style={{ color: '#64748b', fontWeight: 400 }}>({item.durationMinutes} min)</span>
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: '#f1f5f9',
                          color: '#334155',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {item.type}
                      </span>
                    </div>

                    {/* Interviewer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: '#475569' }}>
                      <User size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
                      <span>
                        Interviewer: <strong style={{ color: '#0f172a', fontWeight: 500 }}>{item.interviewer}</strong>
                      </span>
                    </div>

                    {/* Meeting Link Pill with Copy Icon */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 6,
                          padding: '4px 10px',
                          fontSize: 12,
                          color: '#334155',
                          maxWidth: '100%',
                        }}
                      >
                        <Video size={13} style={{ color: '#4338ca', flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                          {item.locationOrLink.replace(/^https?:\/\//, '')}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(item.id, item.locationOrLink)}
                          aria-label="Copy meeting link"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: copiedId === item.id ? '#16a34a' : '#64748b',
                            cursor: 'pointer',
                            padding: '2px 4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            marginLeft: 4,
                          }}
                        >
                          {copiedId === item.id ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>

                    {/* Focus Summary */}
                    {cleanNotes && (
                      <div
                        style={{
                          fontSize: 12.5,
                          lineHeight: 1.5,
                          color: '#475569',
                          background: '#f8fafc',
                          borderLeft: '3px solid #6366f1',
                          padding: '6px 12px',
                          borderRadius: '0 6px 6px 0',
                          marginTop: 4,
                        }}
                      >
                        <strong style={{ color: '#0f172a' }}>Focus:</strong> {cleanNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 14,
                    borderTop: '1px solid #f1f5f9',
                    gap: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => navigate('candidate-detail', { candidateId: item.candidateId })}
                    style={{
                      height: 32,
                      padding: '0 12px',
                      borderRadius: 6,
                      fontSize: 12.5,
                      fontWeight: 500,
                      background: '#ffffff',
                      border: '1px solid #e4e4e7',
                      color: '#0f172a',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.12s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#e4e4e7';
                    }}
                  >
                    View Profile
                  </button>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {item.status === 'Scheduled' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setCancelModalId(item.id)}
                          style={{
                            height: 32,
                            padding: '0 10px',
                            borderRadius: 6,
                            fontSize: 12.5,
                            fontWeight: 500,
                            background: 'transparent',
                            border: '1px solid transparent',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'color 0.12s ease, background 0.12s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#dc2626';
                            e.currentTarget.style.background = '#fef2f2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#94a3b8';
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          Cancel
                        </button>

                        <a
                          href={item.locationOrLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            height: 32,
                            padding: '0 14px',
                            borderRadius: 6,
                            fontSize: 12.5,
                            fontWeight: 500,
                            background: '#0f172a',
                            color: '#ffffff',
                            textDecoration: 'none',
                            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
                            transition: 'background 0.12s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#1e293b')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#0f172a')}
                        >
                          <Video size={13} />
                          <span>Join Room</span>
                          <ExternalLink size={11} style={{ opacity: 0.7 }} />
                        </a>
                      </>
                    )}

                    {item.status === 'Completed' && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 12.5,
                          fontWeight: 500,
                          color: '#15803d',
                        }}
                      >
                        <CheckCircle2 size={14} />
                        <span>Completed</span>
                      </span>
                    )}

                    {item.status === 'Cancelled' && (
                      <span style={{ fontSize: 12.5, color: '#94a3b8' }}>Cancelled</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Schedule Interview Modal */}
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

      {/* 6. Cancel Confirmation Modal (Prevents accidental one-click cancellation) */}
      <Modal
        isOpen={!!cancelModalId}
        onClose={() => setCancelModalId(null)}
        title="Cancel Interview Session?"
        description={
          interviewToCancel
            ? `Are you sure you want to cancel the ${interviewToCancel.type} with ${interviewToCancel.candidateName}?`
            : 'Are you sure you want to cancel this interview?'
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setCancelModalId(null)}>
              Keep Session
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmCancel}
            >
              Yes, Cancel Session
            </Button>
          </>
        }
      >
        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: 0 }}>
          This will update the interview status to <strong>Cancelled</strong> and log an event in the audit trail.
          The candidate and interviewer ({interviewToCancel?.interviewer}) can be rescheduled at any time.
        </p>
      </Modal>
    </div>
  );
};
