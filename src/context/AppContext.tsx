import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  AppView,
  Job,
  JobStatus,
  Candidate,
  CandidateStatus,
  OutreachMessage,
  Interview,
  RecruiterTask,
  AIActivityEvent,
  ClientAccount,
  PrivacyRequest,
  SecurityAuditEvent,
  AppSettings,
} from '../types';
import {
  initialJobs,
  initialCandidates,
  initialOutreach,
  initialInterviews,
  initialTasks,
  initialAIActivity,
  initialClients,
  initialPrivacyRequests,
  initialSecurityAudit,
  initialSettings,
} from '../data/mockData';
import { useToast } from './ToastContext';

interface AppContextType {
  currentView: AppView;
  selectedJobId: string | null;
  selectedCandidateId: string | null;
  jobs: Job[];
  candidates: Candidate[];
  outreachMessages: OutreachMessage[];
  interviews: Interview[];
  tasks: RecruiterTask[];
  aiActivity: AIActivityEvent[];
  clients: ClientAccount[];
  privacyRequests: PrivacyRequest[];
  securityAudit: SecurityAuditEvent[];
  settings: AppSettings;
  searchQuery: string;

  // Actions
  setSearchQuery: (q: string) => void;
  navigate: (view: AppView, params?: { jobId?: string; candidateId?: string }) => void;
  createJob: (jobData: Omit<Job, 'id' | 'createdAt' | 'applicantsCount' | 'shortlistedCount'>) => string;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  shortlistCandidate: (candidateId: string) => void;
  updateCandidateStatus: (candidateId: string, status: CandidateStatus) => void;
  createOutreachMessage: (
    msg: Omit<OutreachMessage, 'id' | 'createdAt' | 'status'>
  ) => string;
  approveOutreachMessage: (id: string) => void;
  sendOutreachMessage: (id: string) => void;
  scheduleInterview: (interviewData: Omit<Interview, 'id' | 'status'>) => string;
  cancelInterview: (id: string) => void;
  completeInterview: (id: string) => void;
  toggleTaskStatus: (taskId: string) => void;
  createTask: (task: Omit<RecruiterTask, 'id'>) => string;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updatePrivacyRequestStatus: (
    id: string,
    status: 'Pending Review' | 'In Progress' | 'Completed'
  ) => void;
  createPrivacyRequest: (req: Omit<PrivacyRequest, 'id' | 'requestedAt' | 'status'>) => void;
  resetToDemoDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'scoutai_prototype_store_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  // Load from localStorage or defaults
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedJobId, setSelectedJobId] = useState<string | null>('job-101');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>('cand-1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_jobs`);
      return saved ? JSON.parse(saved) : initialJobs;
    } catch {
      return initialJobs;
    }
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_candidates`);
      return saved ? JSON.parse(saved) : initialCandidates;
    } catch {
      return initialCandidates;
    }
  });

  const [outreachMessages, setOutreachMessages] = useState<OutreachMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_outreach`);
      return saved ? JSON.parse(saved) : initialOutreach;
    } catch {
      return initialOutreach;
    }
  });

  const [interviews, setInterviews] = useState<Interview[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_interviews`);
      return saved ? JSON.parse(saved) : initialInterviews;
    } catch {
      return initialInterviews;
    }
  });

  const [tasks, setTasks] = useState<RecruiterTask[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [aiActivity, setAiActivity] = useState<AIActivityEvent[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_aiActivity`);
      return saved ? JSON.parse(saved) : initialAIActivity;
    } catch {
      return initialAIActivity;
    }
  });

  const [clients] = useState<ClientAccount[]>(initialClients);

  const [privacyRequests, setPrivacyRequests] = useState<PrivacyRequest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_privacy`);
      return saved ? JSON.parse(saved) : initialPrivacyRequests;
    } catch {
      return initialPrivacyRequests;
    }
  });

  const [securityAudit, setSecurityAudit] = useState<SecurityAuditEvent[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_security`);
      return saved ? JSON.parse(saved) : initialSecurityAudit;
    } catch {
      return initialSecurityAudit;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_jobs`, JSON.stringify(jobs));
  }, [jobs]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_candidates`, JSON.stringify(candidates));
  }, [candidates]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_outreach`, JSON.stringify(outreachMessages));
  }, [outreachMessages]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_interviews`, JSON.stringify(interviews));
  }, [interviews]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_aiActivity`, JSON.stringify(aiActivity));
  }, [aiActivity]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_privacy`, JSON.stringify(privacyRequests));
  }, [privacyRequests]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_security`, JSON.stringify(securityAudit));
  }, [securityAudit]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [settings]);

  const logAIActivity = (
    type: AIActivityEvent['type'],
    target: string,
    details: string,
    isHumanAction: boolean = false
  ) => {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const newEvent: AIActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp,
      type,
      target,
      actor: isHumanAction ? `${settings.profile.name} (Recruiter)` : 'ScoutAI Operations Engine',
      details,
      isHumanAction,
    };
    setAiActivity((prev) => [newEvent, ...prev]);
  };

  const logSecurityEvent = (
    action: string,
    target: string,
    result: 'Success' | 'Warning' | 'Blocked' = 'Success'
  ) => {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const newAudit: SecurityAuditEvent = {
      id: `sec-${Date.now()}`,
      timestamp,
      actor: settings.profile.email,
      action,
      target,
      ipAddress: '103.24.12.88 (Bengaluru)',
      result,
    };
    setSecurityAudit((prev) => [newAudit, ...prev]);
  };

  const navigate = (view: AppView, params?: { jobId?: string; candidateId?: string }) => {
    if (params?.jobId) setSelectedJobId(params.jobId);
    if (params?.candidateId) setSelectedCandidateId(params.candidateId);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createJob = (
    jobData: Omit<Job, 'id' | 'createdAt' | 'applicantsCount' | 'shortlistedCount'>
  ): string => {
    const newId = `job-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString().substring(0, 10);
    const newJob: Job = {
      ...jobData,
      id: newId,
      createdAt: now,
      applicantsCount: 0,
      shortlistedCount: 0,
    };

    setJobs((prev) => [newJob, ...prev]);
    logAIActivity('Job Created', newJob.title, `New requisition created for ${newJob.client}.`, true);
    logSecurityEvent('Job Requisition Created', `Job #${newId} (${newJob.title})`);
    showToast(`Job "${newJob.title}" created successfully!`, 'success');
    return newId;
  };

  const updateJobStatus = (jobId: string, status: JobStatus) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status } : j))
    );
    const job = jobs.find((j) => j.id === jobId);
    const title = job ? job.title : jobId;
    logAIActivity('Status Changed', title, `Job status updated to ${status}.`, true);
    logSecurityEvent('Job Status Updated', `Job #${jobId} to ${status}`);
    showToast(`Job status updated to ${status}`, 'info');
  };

  const shortlistCandidate = (candidateId: string) => {
    let candidateName = 'Candidate';
    let targetJobId = '';

    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          candidateName = c.name;
          targetJobId = c.appliedJobId;
          const nextStatus: CandidateStatus =
            c.status === 'Shortlisted' ? 'Qualified' : 'Shortlisted';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );

    const candidate = candidates.find((c) => c.id === candidateId);
    const isNowShortlisted = candidate?.status !== 'Shortlisted';

    if (isNowShortlisted) {
      if (targetJobId) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === targetJobId
              ? { ...j, shortlistedCount: j.shortlistedCount + 1 }
              : j
          )
        );
      }
      logAIActivity(
        'Candidate Shortlisted',
        candidateName,
        `Recruiter shortlisted ${candidateName} for review.`,
        true
      );
      logSecurityEvent('Candidate Shortlisted', `Candidate #${candidateId} (${candidateName})`);
      showToast(`${candidateName} added to Shortlist!`, 'success');
    } else {
      if (targetJobId) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === targetJobId
              ? { ...j, shortlistedCount: Math.max(0, j.shortlistedCount - 1) }
              : j
          )
        );
      }
      logAIActivity(
        'Status Changed',
        candidateName,
        `Candidate status set back to Qualified.`,
        true
      );
      showToast(`${candidateName} removed from Shortlist`, 'info');
    }
  };

  const updateCandidateStatus = (candidateId: string, status: CandidateStatus) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status } : c))
    );
    const candidate = candidates.find((c) => c.id === candidateId);
    const name = candidate ? candidate.name : candidateId;
    logAIActivity('Status Changed', name, `Status changed to ${status}.`, true);
    showToast(`${name} marked as ${status}`, 'info');
  };

  const createOutreachMessage = (
    msg: Omit<OutreachMessage, 'id' | 'createdAt' | 'status'>
  ): string => {
    const newId = `msg-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString().substring(0, 10);
    const newMsg: OutreachMessage = {
      ...msg,
      id: newId,
      createdAt: now,
      status: 'Draft',
    };
    setOutreachMessages((prev) => [newMsg, ...prev]);
    logAIActivity(
      'Outreach Drafted',
      msg.candidateName,
      `AI generated personalized draft (${msg.tone} tone) for ${msg.jobTitle}.`,
      false
    );
    showToast(`Outreach draft generated for ${msg.candidateName}`, 'success');
    return newId;
  };

  const approveOutreachMessage = (id: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let candidateName = 'Candidate';
    setOutreachMessages((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          candidateName = m.candidateName;
          return { ...m, status: 'Approved', approvedAt: now };
        }
        return m;
      })
    );
    logAIActivity(
      'Human Approval',
      candidateName,
      `Recruiter reviewed and approved outreach message.`,
      true
    );
    logSecurityEvent('Outreach Approved', `Message #${id} for ${candidateName}`);
    showToast(`Outreach for ${candidateName} approved!`, 'success');
  };

  const sendOutreachMessage = (id: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let candidateName = 'Candidate';
    setOutreachMessages((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          candidateName = m.candidateName;
          return { ...m, status: 'Sent — Demo', sentAt: now };
        }
        return m;
      })
    );
    logAIActivity(
      'Human Approval',
      candidateName,
      `Simulated outreach dispatch completed (Sent — Demo).`,
      true
    );
    logSecurityEvent('Outreach Sent (Demo)', `Message #${id} for ${candidateName}`);
    showToast(`Outreach marked as Sent — Demo to ${candidateName}`, 'success');
  };

  const scheduleInterview = (interviewData: Omit<Interview, 'id' | 'status'>): string => {
    const newId = `int-${Date.now().toString().slice(-4)}`;
    const newInterview: Interview = {
      ...interviewData,
      id: newId,
      status: 'Scheduled',
    };
    setInterviews((prev) => [newInterview, ...prev]);

    // Also update candidate status to Interviewing if not already
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === interviewData.candidateId ? { ...c, status: 'Interviewing' } : c
      )
    );

    logAIActivity(
      'Interview Scheduled',
      interviewData.candidateName,
      `${interviewData.type} scheduled with ${interviewData.interviewer} on ${interviewData.date}.`,
      true
    );
    logSecurityEvent(
      'Interview Scheduled',
      `Interview #${newId} for ${interviewData.candidateName}`
    );
    showToast(`Interview scheduled with ${interviewData.candidateName}`, 'success');
    return newId;
  };

  const cancelInterview = (id: string) => {
    setInterviews((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Cancelled' } : i))
    );
    const int = interviews.find((i) => i.id === id);
    const candidateName = int ? int.candidateName : 'Interview';
    logAIActivity('Status Changed', candidateName, `Interview cancelled.`, true);
    showToast(`Interview cancelled`, 'info');
  };

  const completeInterview = (id: string) => {
    setInterviews((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Completed' } : i))
    );
    const int = interviews.find((i) => i.id === id);
    const candidateName = int ? int.candidateName : 'Interview';
    logAIActivity('Status Changed', candidateName, `Interview marked as Completed.`, true);
    showToast(`Interview completed`, 'success');
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
    showToast(`Task status updated`, 'info');
  };

  const createTask = (taskData: Omit<RecruiterTask, 'id'>): string => {
    const newId = `task-${Date.now().toString().slice(-4)}`;
    const newTask: RecruiterTask = {
      ...taskData,
      id: newId,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Task created: "${taskData.title}"`, 'success');
    return newId;
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      profile: { ...prev.profile, ...(newSettings.profile || {}) },
      workspace: { ...prev.workspace, ...(newSettings.workspace || {}) },
      notifications: { ...prev.notifications, ...(newSettings.notifications || {}) },
      aiPreferences: { ...prev.aiPreferences, ...(newSettings.aiPreferences || {}) },
      security: { ...prev.security, ...(newSettings.security || {}) },
      privacy: { ...prev.privacy, ...(newSettings.privacy || {}) },
    }));
    logSecurityEvent('Settings Updated', 'User & Workspace Configuration');
    showToast(`Settings saved successfully!`, 'success');
  };

  const updatePrivacyRequestStatus = (
    id: string,
    status: 'Pending Review' | 'In Progress' | 'Completed'
  ) => {
    setPrivacyRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    logSecurityEvent('Privacy Request Status Updated', `Request #${id} to ${status}`);
    showToast(`Privacy request status updated to ${status}`, 'info');
  };

  const createPrivacyRequest = (
    reqData: Omit<PrivacyRequest, 'id' | 'requestedAt' | 'status'>
  ) => {
    const newId = `priv-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString().substring(0, 10);
    const newReq: PrivacyRequest = {
      ...reqData,
      id: newId,
      requestedAt: now,
      status: 'Pending Review',
    };
    setPrivacyRequests((prev) => [newReq, ...prev]);
    logSecurityEvent('Privacy Request Logged', `Subject Request from ${reqData.candidateName}`);
    showToast(`Data request logged for ${reqData.candidateName}`, 'success');
  };

  const resetToDemoDefaults = () => {
    localStorage.removeItem(`${STORAGE_KEY}_jobs`);
    localStorage.removeItem(`${STORAGE_KEY}_candidates`);
    localStorage.removeItem(`${STORAGE_KEY}_outreach`);
    localStorage.removeItem(`${STORAGE_KEY}_interviews`);
    localStorage.removeItem(`${STORAGE_KEY}_tasks`);
    localStorage.removeItem(`${STORAGE_KEY}_aiActivity`);
    localStorage.removeItem(`${STORAGE_KEY}_privacy`);
    localStorage.removeItem(`${STORAGE_KEY}_security`);
    localStorage.removeItem(`${STORAGE_KEY}_settings`);

    setJobs(initialJobs);
    setCandidates(initialCandidates);
    setOutreachMessages(initialOutreach);
    setInterviews(initialInterviews);
    setTasks(initialTasks);
    setAiActivity(initialAIActivity);
    setPrivacyRequests(initialPrivacyRequests);
    setSecurityAudit(initialSecurityAudit);
    setSettings(initialSettings);
    setCurrentView('dashboard');
    showToast('Demo environment reset to initial defaults', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        selectedJobId,
        selectedCandidateId,
        jobs,
        candidates,
        outreachMessages,
        interviews,
        tasks,
        aiActivity,
        clients,
        privacyRequests,
        securityAudit,
        settings,
        searchQuery,
        setSearchQuery,
        navigate,
        createJob,
        updateJobStatus,
        shortlistCandidate,
        updateCandidateStatus,
        createOutreachMessage,
        approveOutreachMessage,
        sendOutreachMessage,
        scheduleInterview,
        cancelInterview,
        completeInterview,
        toggleTaskStatus,
        createTask,
        updateSettings,
        updatePrivacyRequestStatus,
        createPrivacyRequest,
        resetToDemoDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
