import React, { useState } from 'react';
import {
  User,
  Building,
  Bell,
  Sparkles,
  Lock,
  Shield,
  Save,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Input } from '../components/common/Input';
import { CustomSelect } from '../components/common/CustomDropdown';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useApp();

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
    alert('Settings successfully updated!');
  };

  const tabs: { id: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={14} /> },
    { id: 'workspace', label: 'Workspace', icon: <Building size={14} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
    { id: 'ai', label: 'AI Parameters', icon: <Sparkles size={14} /> },
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
              color: '#18181b',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Organization Settings
          </h1>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Manage recruiter profiles, AI matching parameters, session rules, and retention schedules.
          </p>
        </div>

        <button
          className="btn-dark"
          onClick={handleSave}
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
          <Save size={14} />
          <span>Save Changes</span>
        </button>
      </div>

      {/* 2. Tabs Navigation */}
      <div style={{ display: 'flex', gap: 3, background: '#f4f4f5', padding: 3, borderRadius: 8, flexWrap: 'wrap' }}>
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
                fontSize: 13,
                fontWeight: isSelected ? 600 : 500,
                border: 'none',
                background: isSelected ? '#ffffff' : 'transparent',
                color: isSelected ? '#18181b' : '#71717a',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.12s ease',
              }}
            >
              <span style={{ color: isSelected ? '#18181b' : '#a1a1aa' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Form Container */}
      <form onSubmit={handleSave} className="snow-card" style={{ padding: '24px 28px' }}>
        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, borderBottom: '1px solid var(--color-divider)', paddingBottom: 10 }}>
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
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, borderBottom: '1px solid var(--color-divider)', paddingBottom: 10 }}>
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
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, borderBottom: '1px solid var(--color-divider)', paddingBottom: 10 }}>
              Notification Preferences
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-divider)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>Email Alert Broadcasts</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    Receive alerts for new candidate applications and high matches.
                  </div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                  />
                  <span className="slider" />
                </label>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-divider)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>Candidate Shortlist Notifications</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    Notify talent team when candidates are shortlisted for client review.
                  </div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={shortlistAlerts}
                    onChange={(e) => setShortlistAlerts(e.target.checked)}
                  />
                  <span className="slider" />
                </label>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-divider)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>Interview Schedule Reminders</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    Send reminders 1 hour before scheduled technical interviews.
                  </div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={interviewReminders}
                    onChange={(e) => setInterviewReminders(e.target.checked)}
                  />
                  <span className="slider" />
                </label>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-divider)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>Daily Operations Digest</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    Summarize candidate matches and scheduled assessments every morning.
                  </div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={dailyDigest}
                    onChange={(e) => setDailyDigest(e.target.checked)}
                  />
                  <span className="slider" />
                </label>
              </label>
            </div>
          </div>
        )}

        {/* Tab 4: AI Preferences */}
        {activeTab === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#18181b', margin: 0, borderBottom: '1px solid #f4f4f5', paddingBottom: 12 }}>
              AI Match & Sourcing Parameters
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#18181b' }}>Advisory Explanation Detail</label>
              <CustomSelect
                value={advisoryDetail}
                onChange={(val) => setAdvisoryDetail(val as any)}
                options={[
                  { value: 'in-depth', label: 'In-Depth (Detailed skill match breakdown & rationale)' },
                  { value: 'concise', label: 'Concise (High-level summary bullets only)' },
                ]}
                size="md"
                menuWidth="100%"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f4f4f5' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#18181b' }}>Auto-Highlight Skill Gaps</div>
                  <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>
                    Highlight missing required competencies on candidate profile review cards.
                  </div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={autoHighlightGaps}
                    onChange={(e) => setAutoHighlightGaps(e.target.checked)}
                  />
                  <span className="slider" />
                </label>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#18181b' }}>Smart Outreach Draft Generation</div>
                  <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>
                    Enable automatic personalized drafts when opening candidate outreach drawer.
                  </div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={smartTemplates}
                    onChange={(e) => setSmartTemplates(e.target.checked)}
                  />
                  <span className="slider" />
                </label>
              </label>
            </div>
          </div>
        )}

        {/* Tab 5: Security */}
        {activeTab === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#18181b', margin: 0, borderBottom: '1px solid #f4f4f5', paddingBottom: 12 }}>
              Security & Session Rules
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#18181b' }}>Session Inactivity Timeout</label>
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
                <label style={{ fontSize: 13, fontWeight: 500, color: '#18181b' }}>Audit Trail Retention</label>
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
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#18181b', margin: 0, borderBottom: '1px solid #f4f4f5', paddingBottom: 12 }}>
              Candidate Privacy & Retention Schedules
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#18181b' }}>Candidate Profile Retention Period</label>
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
              <span style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>
                Configure according to organizational data retention guidelines. Legal review required.
              </span>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #f4f4f5', marginTop: 8 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#18181b' }}>Require Verified Sourcing Consent</div>
                <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>
                  Enforce consent audit check before adding sourced profiles to active pipelines.
                </div>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={requireConsent}
                  onChange={(e) => setRequireConsent(e.target.checked)}
                />
                <span className="slider" />
              </label>
            </label>
          </div>
        )}

        {/* Footer save */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: 18,
            marginTop: 18,
            borderTop: '1px solid #f4f4f5',
          }}
        >
          <button
            type="submit"
            className="btn-dark"
            style={{
              height: 36,
              padding: '0 18px',
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
            <Save size={14} />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
