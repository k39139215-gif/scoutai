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
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

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
  };

  const tabs: { id: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={14} /> },
    { id: 'workspace', label: 'Workspace', icon: <Building size={14} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
    { id: 'ai', label: 'AI Preferences', icon: <Sparkles size={14} /> },
    { id: 'security', label: 'Security', icon: <Lock size={14} /> },
    { id: 'privacy', label: 'Privacy & Retention', icon: <Shield size={14} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 880, margin: '0 auto' }}>
      {/* Header */}
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
            Settings
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Manage recruiter profiles, AI matching parameters, session rules, and retention schedules.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={<Save size={13} />} onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--color-border)', paddingBottom: 2, flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              border: 'none',
              background: 'transparent',
              fontSize: 'var(--font-size-xs)',
              fontWeight: activeTab === tab.id ? 600 : 500,
              color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, borderBottom: '1px solid var(--color-divider)', paddingBottom: 10 }}>
              AI Match & Sourcing Parameters
            </h3>

            <div className="form-group">
              <label className="form-label">Advisory Explanation Detail</label>
              <select
                value={advisoryDetail}
                onChange={(e) => setAdvisoryDetail(e.target.value as any)}
                className="form-select"
              >
                <option value="in-depth">In-Depth (Detailed skill match breakdown & rationale)</option>
                <option value="concise">Concise (High-level summary bullets only)</option>
              </select>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-divider)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>Auto-Highlight Skill Gaps</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
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

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-divider)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>Smart Outreach Draft Generation</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
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
        )}

        {/* Tab 5: Security */}
        {activeTab === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, borderBottom: '1px solid var(--color-divider)', paddingBottom: 10 }}>
              Security & Session Rules
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Session Inactivity Timeout (Minutes)</label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="form-select"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes (Default)</option>
                  <option value={120}>120 Minutes</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Audit Trail Retention (Days)</label>
                <select
                  value={auditRetention}
                  onChange={(e) => setAuditRetention(Number(e.target.value))}
                  className="form-select"
                >
                  <option value={30}>30 Days</option>
                  <option value={60}>60 Days</option>
                  <option value={90}>90 Days (Default)</option>
                  <option value={365}>365 Days</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Privacy */}
        {activeTab === 'privacy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, borderBottom: '1px solid var(--color-divider)', paddingBottom: 10 }}>
              Candidate Privacy & Retention Schedules
            </h3>

            <div className="form-group">
              <label className="form-label">Candidate Profile Retention Period</label>
              <select
                value={dataRetention}
                onChange={(e) => setDataRetention(Number(e.target.value))}
                className="form-select"
              >
                <option value={12}>12 Months</option>
                <option value={24}>24 Months (Default)</option>
                <option value={36}>36 Months</option>
              </select>
              <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', marginTop: 2 }}>
                Configure according to organizational data retention guidelines. Legal review required.
              </span>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-divider)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>Require Verified Sourcing Consent</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
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
            paddingTop: 16,
            marginTop: 16,
            borderTop: '1px solid var(--color-divider)',
          }}
        >
          <Button type="submit" variant="primary" size="sm" icon={<Save size={13} />}>
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
