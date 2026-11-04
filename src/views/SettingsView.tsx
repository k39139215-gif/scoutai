import React, { useState } from 'react';
import {
  User,
  Building,
  Bell,
  SlidersHorizontal,
  Lock,
  Shield,
  Save,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { CustomSelect } from '../components/common/CustomDropdown';
import { ToggleSwitch } from '../components/common/ToggleSwitch';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, navigate } = useApp();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'workspace' | 'notifications' | 'ai' | 'security' | 'privacy'
  >('profile');

  // Form local state initialized with settings
  const [profileName, setProfileName] = useState(settings.profile.name);
  const [profileEmail, setProfileEmail] = useState(settings.profile.email);
  const [profileRole, setProfileRole] = useState(settings.profile.role);
  const [profileDept, setProfileDept] = useState(settings.profile.department);

  const [orgName, setOrgName] = useState(settings.workspace.organizationName);
  const [region, setRegion] = useState(settings.workspace.region);
  const [timezone, setTimezone] = useState(settings.workspace.timezone);

  const [emailAlerts, setEmailAlerts] = useState(settings.notifications.emailAlerts);
  const [shortlistAlerts, setShortlistAlerts] = useState(settings.notifications.candidateShortlistAlerts);
  const [interviewReminders, setInterviewReminders] = useState(settings.notifications.interviewReminders);
  const [dailyDigest, setDailyDigest] = useState(settings.notifications.dailyActivityDigest);

  const [advisoryDetail, setAdvisoryDetail] = useState(settings.aiPreferences.advisoryDetailLevel);
  const [autoHighlightGaps, setAutoHighlightGaps] = useState(settings.aiPreferences.autoHighlightGaps);
  const [smartTemplates, setSmartTemplates] = useState(settings.aiPreferences.enableSmartOutreachTemplates);

  const [sessionTimeout, setSessionTimeout] = useState(settings.security.sessionTimeoutMinutes);
  const [auditRetention, setAuditRetention] = useState(settings.security.auditLogRetentionDays);

  const [dataRetention, setDataRetention] = useState(settings.privacy.candidateDataRetentionMonths);
  const [requireConsent, setRequireConsent] = useState(settings.privacy.requireConsentForSourcing);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      profile: {
        name: profileName,
        email: profileEmail,
        role: profileRole,
        department: profileDept,
      },
      workspace: {
        organizationName: orgName,
        region,
        timezone,
      },
      notifications: {
        emailAlerts,
        candidateShortlistAlerts: shortlistAlerts,
        interviewReminders,
        dailyActivityDigest: dailyDigest,
      },
      aiPreferences: {
        advisoryDetailLevel: advisoryDetail,
        autoHighlightGaps,
        enableSmartOutreachTemplates: smartTemplates,
      },
      security: {
        sessionTimeoutMinutes: sessionTimeout,
        auditLogRetentionDays: auditRetention,
      },
      privacy: {
        candidateDataRetentionMonths: dataRetention,
        requireConsentForSourcing: requireConsent,
      },
    });
    showToast('Settings successfully updated!', 'success');
  };

  const tabs: { id: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={14} /> },
    { id: 'workspace', label: 'Workspace', icon: <Building size={14} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
    { id: 'ai', label: 'Evaluation Model', icon: <SlidersHorizontal size={14} /> },
    { id: 'security', label: 'Security & Access', icon: <Lock size={14} /> },
    { id: 'privacy', label: 'Privacy & Retention', icon: <Shield size={14} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900, margin: '0 auto' }}>
      {/* 1. Header */}
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
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Organization Settings
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            Manage recruiter profiles, AI matching parameters, session rules, and retention schedules.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            onClick={() => navigate('talent-studio')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              height: 36,
              padding: '0 13px',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#3b82f6',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles size={14} />
            Studio Desk (Refs)
          </button>
          <button
            onClick={handleSave}
          style={{
            height: 36,
            padding: '0 16px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            background: '#0f172a',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.12)',
            transition: 'background-color 0.15s ease',
          }}
        >
          <Save size={14} />
          <span>Save Changes</span>
        </button>
        </div>
      </div>

      {/* 2. Tabs Navigation */}
      <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 8, flexWrap: 'wrap', border: '1px solid #e2e8f0' }}>
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: isSelected ? 600 : 500,
                border: 'none',
                background: isSelected ? '#ffffff' : 'transparent',
                color: isSelected ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.12s ease',
              }}
            >
              <span style={{ color: isSelected ? '#0f172a' : '#94a3b8' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Form Container */}
      <form onSubmit={handleSave} className="snow-card" style={{ padding: '24px 28px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}>
        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: 10 }}>
              Recruiter Profile
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              <Input
                label="Full Name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
              <Input
                label="Email Address"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
              />
              <Input
                label="Role Title"
                value={profileRole}
                onChange={(e) => setProfileRole(e.target.value)}
              />
              <Input
                label="Department"
                value={profileDept}
                onChange={(e) => setProfileDept(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Workspace */}
        {activeTab === 'workspace' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: 10 }}>
              Workspace Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              <Input
                label="Organization Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
              <Input
                label="Operating Region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
              <Input
                label="Default Timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === 'notifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: 10 }}>
              Notification Preferences
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>Email Alert Broadcasts</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    Receive alerts for new candidate applications and high matches.
                  </div>
                </div>
                <ToggleSwitch
                  checked={emailAlerts}
                  onChange={setEmailAlerts}
                  ariaLabel="Email Alert Broadcasts"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>Candidate Shortlist Notifications</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    Notify talent team when candidates are shortlisted for client review.
                  </div>
                </div>
                <ToggleSwitch
                  checked={shortlistAlerts}
                  onChange={setShortlistAlerts}
                  ariaLabel="Candidate Shortlist Notifications"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>Interview Schedule Reminders</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    Send reminders 1 hour before scheduled technical interviews.
                  </div>
                </div>
                <ToggleSwitch
                  checked={interviewReminders}
                  onChange={setInterviewReminders}
                  ariaLabel="Interview Schedule Reminders"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>Daily Operations Digest</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    Summarize candidate matches and scheduled assessments every morning.
                  </div>
                </div>
                <ToggleSwitch
                  checked={dailyDigest}
                  onChange={setDailyDigest}
                  ariaLabel="Daily Operations Digest"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: AI Preferences */}
        {activeTab === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: 10 }}>
              AI Match & Sourcing Parameters
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Advisory Explanation Detail</label>
              <CustomSelect
                value={advisoryDetail}
                onChange={(val) => setAdvisoryDetail(val as any)}
                options={[
                  { value: 'concise', label: 'Concise Bullet Points (Recommended)' },
                  { value: 'in-depth', label: 'In-Depth Paragraphs & Criteria Mapping' },
                ]}
                size="md"
                menuWidth={320}
              />
              <span style={{ fontSize: 12, color: '#64748b' }}>
                Controls the verbosity of match explanation cards across the candidate review workspace.
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>Auto-Highlight Skill Gaps</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  Highlight missing required competencies on candidate profile review cards.
                </div>
              </div>
              <ToggleSwitch
                checked={autoHighlightGaps}
                onChange={setAutoHighlightGaps}
                ariaLabel="Auto-Highlight Skill Gaps"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>Smart Outreach Draft Generation</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  Enable automatic personalized drafts when opening candidate outreach drawer.
                </div>
              </div>
              <ToggleSwitch
                checked={smartTemplates}
                onChange={setSmartTemplates}
                ariaLabel="Smart Outreach Draft Generation"
              />
            </div>
          </div>
        )}

        {/* Tab 5: Security */}
        {activeTab === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: 10 }}>
              Security & Session Rules
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Session Inactivity Timeout</label>
                <CustomSelect
                  value={String(sessionTimeout)}
                  onChange={(val) => setSessionTimeout(Number(val))}
                  options={[
                    { value: '15', label: '15 Minutes' },
                    { value: '30', label: '30 Minutes' },
                    { value: '60', label: '60 Minutes (Default)' },
                    { value: '120', label: '120 Minutes' },
                  ]}
                  size="md"
                  menuWidth={240}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Audit Trail Retention</label>
                <CustomSelect
                  value={String(auditRetention)}
                  onChange={(val) => setAuditRetention(Number(val))}
                  options={[
                    { value: '30', label: '30 Days' },
                    { value: '60', label: '60 Days' },
                    { value: '90', label: '90 Days (Default)' },
                    { value: '365', label: '365 Days' },
                  ]}
                  size="md"
                  menuWidth={240}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Privacy */}
        {activeTab === 'privacy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: 10 }}>
              Candidate Privacy & Retention Schedules
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Candidate Profile Retention Period</label>
              <CustomSelect
                value={String(dataRetention)}
                onChange={(val) => setDataRetention(Number(val))}
                options={[
                  { value: '12', label: '12 Months' },
                  { value: '24', label: '24 Months (Default)' },
                  { value: '36', label: '36 Months' },
                ]}
                size="md"
                menuWidth={260}
              />
              <span style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                Configure according to organizational data retention guidelines. Legal review required.
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #f1f5f9', marginTop: 8 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>Require Verified Sourcing Consent</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  Enforce consent audit check before adding sourced profiles to active pipelines.
                </div>
              </div>
              <ToggleSwitch
                checked={requireConsent}
                onChange={setRequireConsent}
                ariaLabel="Require Verified Sourcing Consent"
              />
            </div>
          </div>
        )}

        {/* Footer save */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: 18,
            marginTop: 18,
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <button
            type="submit"
            style={{
              height: 36,
              padding: '0 16px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.12)',
            }}
          >
            <Save size={14} />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
