import React from 'react';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  CheckSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';

export const DashboardView: React.FC = () => {
  const { jobs, candidates, interviews, tasks, aiActivity, navigate } = useApp();

  const openJobsCount = jobs.filter((j) => j.status === 'Open').length;
  const activeCandidatesCount = candidates.filter((c) => c.status !== 'Archived').length;
  const shortlistedCandidatesCount = candidates.filter((c) => c.status === 'Shortlisted').length;
  const upcomingInterviewsCount = interviews.filter((i) => i.status === 'Scheduled').length;
  const pendingTasksCount = tasks.filter((t) => t.status === 'Pending').length;

  const topQualifiedCandidates = [...candidates]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

  const upcomingInterviews = interviews
    .filter((i) => i.status === 'Scheduled')
    .slice(0, 3);

  const recentEvents = aiActivity.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header & Quick Actions */}
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
            Dashboard
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Overview of active Indian tech hiring pipelines, candidate evaluations, and upcoming assessments.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button variant="secondary" size="md" icon={<Sparkles size={14} />} onClick={() => navigate('sourcing')}>
            Run AI Sourcing
          </Button>
          <Button variant="primary" size="md" icon={<Briefcase size={14} />} onClick={() => navigate('create-job')}>
            Post Job
          </Button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        {/* Metric 1: Open Jobs */}
        <div
          className="snow-card-interactive"
          onClick={() => navigate('jobs')}
          style={{ padding: '16px 18px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Open Roles
            </span>
            <Briefcase size={14} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 600, margin: '8px 0 2px', letterSpacing: '-0.02em' }}>
            {openJobsCount}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
            Across {jobs.length} requisitions
          </div>
        </div>

        {/* Metric 2: Active Candidates */}
        <div
          className="snow-card-interactive"
          onClick={() => navigate('candidates')}
          style={{ padding: '16px 18px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Candidates
            </span>
            <Users size={14} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 600, margin: '8px 0 2px', letterSpacing: '-0.02em' }}>
            {activeCandidatesCount}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
            247 in talent pool
          </div>
        </div>

        {/* Metric 3: Shortlisted */}
        <div
          className="snow-card-interactive"
          onClick={() => navigate('candidates')}
          style={{ padding: '16px 18px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Shortlisted
            </span>
            <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} />
          </div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 600, margin: '8px 0 2px', letterSpacing: '-0.02em', color: 'var(--color-success-text)' }}>
            {shortlistedCandidatesCount}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
            Ready for hiring review
          </div>
        </div>

        {/* Metric 4: Upcoming Interviews */}
        <div
          className="snow-card-interactive"
          onClick={() => navigate('interviews')}
          style={{ padding: '16px 18px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Interviews
            </span>
            <Calendar size={14} style={{ color: 'var(--color-accent-blue)' }} />
          </div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 600, margin: '8px 0 2px', letterSpacing: '-0.02em' }}>
            {upcomingInterviewsCount}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
            Scheduled this week
          </div>
        </div>

        {/* Metric 5: Pending Tasks */}
        <div
          className="snow-card-interactive"
          onClick={() => navigate('tasks')}
          style={{ padding: '16px 18px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pending Tasks
            </span>
            <CheckSquare size={14} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 600, margin: '8px 0 2px', letterSpacing: '-0.02em' }}>
            {pendingTasksCount}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
            Action items to resolve
          </div>
        </div>
      </div>

      {/* Main Grid: Top Matched Candidates + Upcoming Interviews & Activity */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 24,
        }}
      >
        {/* Left Column: Top Matched Candidates Table */}
        <div className="snow-card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>
                Top Matched Candidates
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                Advisory ranking based on role criteria
              </p>
            </div>
            <Button variant="ghost" size="sm" iconRight={<ArrowRight size={13} />} onClick={() => navigate('candidates')}>
              View All
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topQualifiedCandidates.map((cand) => (
              <div
                key={cand.id}
                onClick={() => navigate('candidate-detail', { candidateId: cand.id })}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                  e.currentTarget.style.background = 'var(--color-bg-canvas)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.background = 'var(--color-bg-surface)';
                }}
              >
                <div>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {cand.name}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: 1 }}>
                    {cand.title} • {cand.location}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="snow-badge snow-badge-success" style={{ fontSize: '11px' }}>
                    {cand.matchScore}% Match
                  </span>
                  <StatusBadge status={cand.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Upcoming Interviews & Quick Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Upcoming Interviews Card */}
          <div className="snow-card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>Upcoming Interviews</h3>
                <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                  Confirmed assessment sessions
                </p>
              </div>
              <Button variant="ghost" size="sm" iconRight={<ArrowRight size={13} />} onClick={() => navigate('interviews')}>
                Schedule
              </Button>
            </div>

            {upcomingInterviews.length === 0 ? (
              <div style={{ padding: 18, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                No upcoming interviews scheduled.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {upcomingInterviews.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-bg-canvas)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                          {item.candidateName}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: 1 }}>
                          {item.type} • {item.interviewer}
                        </div>
                      </div>
                      <span className="snow-badge snow-badge-blue" style={{ fontSize: '10.5px' }}>
                        {item.date} • {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Operations Activity */}
          <div className="snow-card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>Recent Activity</h3>
              <span
                style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 500 }}
                onClick={() => navigate('ai-activity')}
              >
                View Full Log
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentEvents.map((evt) => (
                <div
                  key={evt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 12,
                    fontSize: '11.5px',
                    padding: '5px 0',
                    borderBottom: '1px solid var(--color-divider)',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{evt.type}</span>
                    <span style={{ color: 'var(--color-text-secondary)', marginLeft: 6 }}>{evt.target}</span>
                  </div>
                  <span style={{ color: 'var(--color-text-muted)', flexShrink: 0, fontSize: '10.5px' }}>
                    {evt.timestamp.split(' ')[1]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
