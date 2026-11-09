import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { CommandPalette } from './components/boardui';

// Primary Views
import { DashboardView } from './views/DashboardView';
import { JobsView } from './views/JobsView';
import { CreateJobView } from './views/CreateJobView';
import { JobWorkspaceView } from './views/JobWorkspaceView';
import { CandidatesView } from './views/CandidatesView';
import { CandidateDetailView } from './views/CandidateDetailView';
import { SourcingView } from './views/SourcingView';
import { OutreachView } from './views/OutreachView';
import { InterviewsView } from './views/InterviewsView';
import { TasksView } from './views/TasksView';
import { AuditTrailView } from './views/AuditTrailView';
import { AnalyticsView } from './views/AnalyticsView';
import { ClientsView } from './views/ClientsView';
import { PrivacyComplianceView } from './views/PrivacyComplianceView';
import { SettingsView } from './views/SettingsView';
import { TalentStudioView } from './views/TalentStudioView';

const MainViewRouter: React.FC = () => {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'jobs':
        return <JobsView />;
      case 'create-job':
        return <CreateJobView />;
      case 'job-workspace':
        return <JobWorkspaceView />;
      case 'candidates':
        return <CandidatesView />;
      case 'talent-studio':
        return <TalentStudioView />;
      case 'candidate-detail':
        return <CandidateDetailView />;
      case 'sourcing':
        return <SourcingView />;
      case 'outreach':
        return <OutreachView />;
      case 'interviews':
        return <InterviewsView />;
      case 'tasks':
        return <TasksView />;
      case 'ai-activity':
        return <AuditTrailView initialTab="operations" />;
      case 'analytics':
        return <AnalyticsView />;
      case 'clients':
        return <ClientsView />;
      case 'privacy':
        return <PrivacyComplianceView />;
      case 'security':
        return <AuditTrailView initialTab="security" />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return <Layout>{renderView()}</Layout>;
};

export function App() {
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ToastProvider>
      <AppProvider>
        <MainViewRouter />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
      </AppProvider>
    </ToastProvider>
  );
}

export default App;
