import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';

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
import { AIActivityView } from './views/AIActivityView';
import { AnalyticsView } from './views/AnalyticsView';
import { ClientsView } from './views/ClientsView';
import { PrivacyComplianceView } from './views/PrivacyComplianceView';
import { SecurityView } from './views/SecurityView';
import { SettingsView } from './views/SettingsView';

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
        return <AIActivityView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'clients':
        return <ClientsView />;
      case 'privacy':
        return <PrivacyComplianceView />;
      case 'security':
        return <SecurityView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return <Layout>{renderView()}</Layout>;
};

export function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <MainViewRouter />
      </AppProvider>
    </ToastProvider>
  );
}

export default App;
