import React, { useState } from 'react';
import {
  Activity,
  User,
  Search,
  X,
  Shield,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomSelect } from '../components/common/CustomDropdown';
import { SegmentedControl } from '../components/boardui';
import { isDevMode } from '../utils/devMode';
import { formatDateTime } from '../utils/formatters';

interface AuditTrailViewProps {
  initialTab?: 'operations' | 'security';
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ initialTab = 'operations' }) => {
  const { aiActivity, securityAudit, settings, navigate } = useApp();

  const [activeTab, setActiveTab] = useState<'operations' | 'security'>(initialTab);

  // Operations filter state
  const [actorFilter, setActorFilter] = useState<'All' | 'System' | 'Recruiter'>('All');
  const [opsSearchQuery, setOpsSearchQuery] = useState('');

  // Security filter state
  const [secSearchQuery, setSecSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState<string>('All');

  // Filtered Operations
  const filteredEvents = aiActivity.filter((evt) => {
    const matchesActor =
      actorFilter === 'All' ||
      (actorFilter === 'System' && !evt.isHumanAction) ||
      (actorFilter === 'Recruiter' && evt.isHumanAction);

    const matchesSearch =
      evt.type.toLowerCase().includes(opsSearchQuery.toLowerCase()) ||
      evt.target.toLowerCase().includes(opsSearchQuery.toLowerCase()) ||
      evt.details.toLowerCase().includes(opsSearchQuery.toLowerCase()) ||
      evt.actor.toLowerCase().includes(opsSearchQuery.toLowerCase());

    return matchesActor && matchesSearch;
  });

  // Filtered Security
  const filteredAudit = securityAudit.filter((aud) => {
    const matchesSearch =
      aud.action.toLowerCase().includes(secSearchQuery.toLowerCase()) ||
      aud.target.toLowerCase().includes(secSearchQuery.toLowerCase()) ||
      aud.actor.toLowerCase().includes(secSearchQuery.toLowerCase());

    const matchesResult = resultFilter === 'All' || aud.result === resultFilter;

    return matchesSearch && matchesResult;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          paddingBottom: 2,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1
              style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              Audit Trail
            </h1>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                padding: '2px 8px',
                borderRadius: 4,
                background: '#f1f5f9',
                color: '#475569',
              }}
            >
              Access Controls (Demo)
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, marginBottom: 0 }}>
            Unified record of recruiter determinations, candidate evaluations, and security access logs.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isDevMode() && (
            <button
              onClick={() => navigate('talent-studio')}
              style={{
                height: 32,
                padding: '0 12px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: '#eef2ff',
                border: '1px solid #c7d2fe',
                color: '#4338ca',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
            >
              <Sparkles size={13} />
              <span>Studio Desk (Refs)</span>
            </button>
          )}

          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--text-secondary)',
              padding: '5px 10px',
              background: '#ffffff',
              borderRadius: 6,
              border: '1px solid var(--border-subtle)',
            }}
          >
            Session: <strong style={{ color: '#0f172a' }}>{settings.profile.email}</strong>
          </div>
        </div>
      </div>

      {/* 2. Top-Level Segmented Tabs (Operations vs Security) */}
      <SegmentedControl
        value={activeTab}
        onChange={(val) => setActiveTab(val as 'operations' | 'security')}
        size="md"
        options={[
          {
            value: 'operations',
            label: 'Operations Activity',
            icon: <Activity size={14} />,
            count: aiActivity.length,
          },
          {
            value: 'security',
            label: 'Security & Access',
            icon: <Lock size={14} />,
            count: securityAudit.length,
          },
        ]}
      />

      {/* 3. TAB CONTENT: Operations Activity */}
      {activeTab === 'operations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Filter and Search Bar */}
          <div
            style={{
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
            }}
          >
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-subtle)', padding: 3, borderRadius: 6 }}>
              <button
                onClick={() => setActorFilter('All')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: actorFilter === 'All' ? 600 : 500,
                  border: 'none',
                  background: actorFilter === 'All' ? '#ffffff' : 'transparent',
                  color: actorFilter === 'All' ? '#0f172a' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  boxShadow: actorFilter === 'All' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                All events ({aiActivity.length})
              </button>

              <button
                onClick={() => setActorFilter('System')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: actorFilter === 'System' ? 600 : 500,
                  border: 'none',
                  background: actorFilter === 'System' ? '#ffffff' : 'transparent',
                  color: actorFilter === 'System' ? '#0f172a' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  boxShadow: actorFilter === 'System' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Activity size={12} style={{ color: 'var(--text-muted)' }} />
                <span>System</span>
              </button>

              <button
                onClick={() => setActorFilter('Recruiter')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: actorFilter === 'Recruiter' ? 600 : 500,
                  border: 'none',
                  background: actorFilter === 'Recruiter' ? '#ffffff' : 'transparent',
                  color: actorFilter === 'Recruiter' ? '#0f172a' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  boxShadow: actorFilter === 'Recruiter' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <User size={12} style={{ color: 'var(--text-muted)' }} />
                <span>Recruiter</span>
              </button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', width: 260 }}>
              <Search
                size={13}
                style={{ position: 'absolute', left: 9, top: 9, color: 'var(--text-muted)', pointerEvents: 'none' }}
              />
              <input
                type="text"
                value={opsSearchQuery}
                onChange={(e) => setOpsSearchQuery(e.target.value)}
                placeholder="Filter operations entries..."
                style={{
                  width: '100%',
                  height: 32,
                  paddingLeft: 28,
                  paddingRight: 26,
                  fontSize: 12.5,
                  borderRadius: 6,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-canvas)',
                  color: '#0f172a',
                }}
              />
              {opsSearchQuery && (
                <button
                  onClick={() => setOpsSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: 7,
                    top: 8,
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Event List */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            {filteredEvents.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                No operations recorded matching current filters.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {filteredEvents.map((evt, idx) => (
                  <div
                    key={evt.id}
                    style={{
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      borderBottom: idx === filteredEvents.length - 1 ? 'none' : '1px solid #f3f4f6',
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 5,
                        background: 'var(--bg-subtle)',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid var(--border-subtle)',
                        marginTop: 1,
                      }}
                    >
                      {evt.isHumanAction ? <User size={13} /> : <Activity size={13} />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                            {evt.type}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 500,
                              padding: '1px 6px',
                              borderRadius: 4,
                              background: 'var(--bg-subtle)',
                              color: 'var(--text-muted)',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            {evt.actor}
                          </span>
                        </div>

                        <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
                          {formatDateTime(evt.timestamp)}
                        </span>
                      </div>

                      <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                        Target: <span style={{ fontWeight: 500, color: '#0f172a' }}>{evt.target}</span>
                      </div>

                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.45 }}>
                        {evt.details}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: Security & Access */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Security Notice Banner */}
          <div
            style={{
              padding: '12px 16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 13,
              color: '#334155',
            }}
          >
            <Shield size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
            <span>
              <strong>Access Governance Notice:</strong> Role-based access controls active. Session activity, client IPs, and workspace actions are logged in the audit trail.
            </span>
          </div>

          {/* Access Overview Cards */}
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
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '16px 18px',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
                Current privilege
              </span>
              <div style={{ fontSize: 17, fontWeight: 600, margin: '6px 0 2px', color: '#0f172a' }}>
                {settings.profile.role}
              </div>
              <div style={{ fontSize: 12, color: '#166534', fontWeight: 500 }}>
                Full Requisition Access
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '16px 18px',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
                Session timeout
              </span>
              <div className="metric-val" style={{ fontSize: 17, fontWeight: 600, margin: '6px 0 2px', color: '#0f172a' }}>
                {settings.security.sessionTimeoutMinutes} minutes
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Configurable in settings
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '16px 18px',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
                Audit log retention
              </span>
              <div className="metric-val" style={{ fontSize: 17, fontWeight: 600, margin: '6px 0 2px', color: '#0f172a' }}>
                {settings.security.auditLogRetentionDays} days
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Configured log retention schedule
              </div>
            </div>
          </div>

          {/* Audit Log Table */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <div
              style={{
                padding: '14px 20px',
                borderBottom: '1px solid #e4e4e7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <h3 style={{ fontSize: 14.5, fontWeight: 600, color: '#0f172a', margin: 0 }}>
                  System Audit Trail ({filteredAudit.length})
                </h3>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 2, margin: 0 }}>
                  Record of user operations, status modifications, and data accesses.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Search
                    size={14}
                    style={{
                      position: 'absolute',
                      left: 11,
                      color: '#71717a',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search audit trail…"
                    value={secSearchQuery}
                    onChange={(e) => setSecSearchQuery(e.target.value)}
                    style={{
                      height: 32,
                      width: 220,
                      padding: '0 28px 0 32px',
                      fontSize: 12.5,
                      borderRadius: 6,
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      outline: 'none',
                    }}
                  />
                  {secSearchQuery && (
                    <button
                      onClick={() => setSecSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: 8,
                        background: 'transparent',
                        border: 'none',
                        color: '#71717a',
                        cursor: 'pointer',
                        padding: 2,
                      }}
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                <CustomSelect
                  value={resultFilter}
                  onChange={setResultFilter}
                  options={[
                    { value: 'All', label: 'All Results' },
                    { value: 'Success', label: 'Success Only' },
                    { value: 'Warning', label: 'Warning Only' },
                    { value: 'Blocked', label: 'Blocked Only' },
                  ]}
                  size="md"
                  menuWidth={140}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#fafafa', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Timestamp</th>
                    <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Actor</th>
                    <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Action</th>
                    <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Target</th>
                    <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>IP location</th>
                    <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', textAlign: 'right' }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAudit.map((aud) => (
                    <tr
                      key={aud.id}
                      style={{
                        height: 48,
                        borderBottom: '1px solid #f4f4f5',
                        transition: 'background 0.12s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '0 14px' }}>
                        <div style={{ fontSize: 12.5, fontWeight: 500, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                          {formatDateTime(aud.timestamp)}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
                          Verified System Log
                        </div>
                      </td>
                      <td style={{ padding: '0 14px', fontSize: 12.5, fontWeight: 500, color: '#0f172a' }}>
                        {aud.actor}
                      </td>
                      <td style={{ padding: '0 14px', fontSize: 12.5, fontWeight: 600, color: '#0f172a' }}>
                        {aud.action}
                      </td>
                      <td style={{ padding: '0 14px', fontSize: 12.5, color: '#475569' }}>
                        {aud.target}
                      </td>
                      <td style={{ padding: '0 14px', fontSize: 12, color: '#64748b' }}>
                        {aud.ipAddress}
                      </td>
                      <td style={{ padding: '0 14px', textAlign: 'right' }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 4,
                            background:
                              aud.result === 'Success'
                                ? '#dcfce7'
                                : aud.result === 'Warning'
                                ? '#fef9c3'
                                : '#fee2e2',
                            color:
                              aud.result === 'Success'
                                ? '#166534'
                                : aud.result === 'Warning'
                                ? '#a16207'
                                : '#b91c1c',
                          }}
                        >
                          {aud.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
