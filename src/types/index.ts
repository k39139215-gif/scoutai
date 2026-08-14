export type JobStatus = 'Draft' | 'Open' | 'Paused' | 'Closed';
export type JobPriority = 'High' | 'Medium' | 'Low';
export type CandidateStatus = 'Qualified' | 'Shortlisted' | 'Interviewing' | 'Review' | 'Archived';
export type OutreachStatus = 'Draft' | 'Approved' | 'Sent — Demo';
export type OutreachTone = 'Professional' | 'Engaging' | 'Executive';
export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskCategory = 'Review Candidate' | 'Approve Outreach' | 'Schedule Interview' | 'Review Application' | 'Follow Up With Client';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Contract' | 'Remote' | 'Hybrid';
  experienceLevel: string;
  skills: string[];
  description: string;
  client: string;
  priority: JobPriority;
  status: JobStatus;
  createdAt: string;
  applicantsCount: number;
  shortlistedCount: number;
  salaryRange: string;
}

export interface CandidateExperience {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface CandidateEducation {
  degree: string;
  institution: string;
  year: string;
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  experienceYears: number;
  location: string;
  email: string;
  phone: string;
  skills: string[];
  status: CandidateStatus;
  matchScore: number;
  appliedJobId: string;
  appliedJobTitle: string;
  summary: string;
  experienceList: CandidateExperience[];
  educationList: CandidateEducation[];
  strengths: string[];
  potentialGaps: string[];
  aiAnalysisExplanation: string;
  resumeText: string;
  appliedDate: string;
}

export interface OutreachMessage {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  jobTitle: string;
  subject: string;
  body: string;
  tone: OutreachTone;
  status: OutreachStatus;
  createdAt: string;
  sentAt?: string;
  approvedAt?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateTitle: string;
  jobId: string;
  jobTitle: string;
  interviewer: string;
  date: string;
  time: string;
  durationMinutes: number;
  type: 'Technical Screen' | 'System Architecture' | 'Hiring Manager Round' | 'Culture & Alignment';
  status: InterviewStatus;
  locationOrLink: string;
  notes?: string;
}

export interface RecruiterTask {
  id: string;
  title: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: JobPriority;
  dueDate: string;
  relatedCandidateId?: string;
  relatedCandidateName?: string;
  relatedJobId?: string;
}

export interface AIActivityEvent {
  id: string;
  timestamp: string;
  type:
    | 'Candidate Analyzed'
    | 'Match Generated'
    | 'Sourcing Completed'
    | 'Outreach Drafted'
    | 'Human Approval'
    | 'Candidate Shortlisted'
    | 'Interview Scheduled'
    | 'Job Created'
    | 'Status Changed';
  target: string;
  actor: string;
  details: string;
  isHumanAction?: boolean;
}

export interface ClientAccount {
  id: string;
  name: string;
  industry: string;
  openJobsCount: number;
  activeCandidatesCount: number;
  hiringProgress: number; // percentage 0-100
  keyContact: string;
  email: string;
  location: string;
  recentActivity: string;
}

export interface PrivacyRequest {
  id: string;
  candidateName: string;
  email: string;
  requestType: 'Data Access (SAR)' | 'Data Correction' | 'Data Erasure' | 'Consent Revocation';
  status: 'Pending Review' | 'In Progress' | 'Completed';
  requestedAt: string;
  reviewNotes: string;
}

export interface SecurityAuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  ipAddress: string;
  result: 'Success' | 'Warning' | 'Blocked';
}

export interface AppSettings {
  profile: {
    name: string;
    email: string;
    role: string;
    department: string;
  };
  workspace: {
    organizationName: string;
    region: string;
    timezone: string;
  };
  notifications: {
    emailAlerts: boolean;
    candidateShortlistAlerts: boolean;
    interviewReminders: boolean;
    dailyActivityDigest: boolean;
  };
  aiPreferences: {
    advisoryDetailLevel: 'concise' | 'in-depth';
    autoHighlightGaps: boolean;
    enableSmartOutreachTemplates: boolean;
  };
  security: {
    sessionTimeoutMinutes: number;
    auditLogRetentionDays: number;
  };
  privacy: {
    candidateDataRetentionMonths: number;
    requireConsentForSourcing: boolean;
  };
}

export type AppView =
  | 'dashboard'
  | 'jobs'
  | 'create-job'
  | 'job-workspace'
  | 'candidates'
  | 'candidate-detail'
  | 'sourcing'
  | 'outreach'
  | 'interviews'
  | 'tasks'
  | 'ai-activity'
  | 'analytics'
  | 'clients'
  | 'privacy'
  | 'security'
  | 'settings';
