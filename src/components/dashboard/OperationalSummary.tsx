import React from 'react';
import { Briefcase, Users, CheckCircle2, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../boardui/StatCard';
import { getNearestUpcomingInterview, TALENT_POOL_TOTAL } from '../../data/recruitmentData';

export const OperationalSummary: React.FC = () => {
  const { jobs, candidates, interviews, navigate } = useApp();

  const openJobsCount = jobs.filter((j) => j.status === 'Open').length;
  const activeCandidatesCount = candidates.filter((c) => c.status !== 'Archived').length;
  const shortlistedCandidatesCount = candidates.filter((c) => c.status === 'Shortlisted').length;
  const upcomingInterviews = interviews.filter((i) => i.status === 'Scheduled');
  const upcomingInterviewsCount = upcomingInterviews.length;
  const nextInterview = getNearestUpcomingInterview(interviews);
  const interviewSubtitle = nextInterview ? nextInterview.displaySubtitle : 'No pending rounds';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: 14,
      }}
    >
      {/* 1. Open Roles */}
      <StatCard
        title="Open Requisitions"
        value={openJobsCount}
        subtitle={`Across ${jobs.length} active requisitions`}
        delta="+2 this month"
        deltaType="positive"
        icon={<Briefcase size={15} />}
        sparklineData={[2, 3, 3, 4, 3, 4]}
        onClick={() => navigate('jobs')}
      />

      {/* 2. Active Candidates */}
      <StatCard
        title="Active Pipeline"
        value={activeCandidatesCount}
        subtitle={`${TALENT_POOL_TOTAL} profiles in passive pool`}
        delta="6 dossiers in review"
        deltaType="positive"
        icon={<Users size={15} />}
        sparklineData={[4, 5, 5, 7, 6, 6]}
        onClick={() => navigate('candidates')}
      />

      {/* 3. Shortlisted */}
      <StatCard
        title="Shortlisted Candidates"
        value={shortlistedCandidatesCount}
        subtitle="Ready for client interview review"
        delta="33% pass rate"
        deltaType="positive"
        icon={<CheckCircle2 size={15} />}
        sparklineData={[1, 1, 2, 2, 2, 2]}
        onClick={() => navigate('candidates')}
      />

      {/* 4. Upcoming Interviews */}
      <StatCard
        title="Scheduled Interviews"
        value={upcomingInterviewsCount}
        subtitle={interviewSubtitle}
        delta="On track"
        deltaType="neutral"
        icon={<Calendar size={15} />}
        sparklineData={[1, 2, 1, 3, 2, 2]}
        onClick={() => navigate('interviews')}
      />
    </div>
  );
};
