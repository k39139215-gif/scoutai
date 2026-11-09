import React, { useState } from 'react';
import {
  Shield,
  Search,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomSelect } from '../components/common/CustomDropdown';
import { isDevMode } from '../utils/devMode';

export const SecurityView: React.FC = () => {
  const { securityAudit, settings, navigate } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState<string>('All');

  const filteredAudit = securityAudit.filter((aud) => {
    const matchesSearch =
      aud.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aud.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aud.actor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesResult = resultFilter === 'All' || aud.result === resultFilter;

    return matchesSearch && matchesResult;
  });

  const formatTimestamp = (raw: string) => {
    if (!raw) return { main: 'Recent Event', sub: '' };
    try {
      const d = new Date(raw.replace(' ', 'T'));
      if (isNaN(d.getTime())) return { main: raw, sub: '' };
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
      return { main: `${dateStr} • ${timeStr}`, sub: 'Verified System Log' };
    } catch {
      return { main: raw, sub: '' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: '#18181b',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Security & Audit Trail
            </h1>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                padding: '2px 8px',
                borderRadius: 9999,
                background: '#f1f5f9',
                color: '#475569',
              }}
            >
              Access Controls (Demo)
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Access control policies, authenticated sessions, and system administrative audit trail.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isDevMode() && (
            <button
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
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Sparkles size={14} />
              Studio Desk (Refs)
            </button>
          )}
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 500,
              color: '#71717a',
              padding: '6px 12px',
              background: '#ffffff',
              borderRadius: 8,
              border: '1px solid #e4e4e7',
            }}
          >
            Session: <strong style={{ color: '#18181b' }}>{settings.profile.email}</strong>
          </div>
        </div>
      </div>

      {/* 2. Security Status Banner */}
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

      {/* 3. Access Overview Cards */}
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
          <div style={{ fontSize: 11.5, color: '#166534', fontWeight: 500 }}>
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
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
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
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
            Configured log retention schedule
          </div>
        </div>
      </div>

      {/* 4. Audit Log Table */}
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
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#18181b', margin: 0 }}>
              System Audit Trail ({filteredAudit.length})
            </h3>
            <p style={{ fontSize: 12.5, color: '#71717a', marginTop: 2, margin: 0 }}>
              Record of user operations, status modifications, and data accesses.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  height: 36,
                  width: 240,
                  padding: '0 32px 0 32px',
                  fontSize: 13,
                  borderRadius: 8,
                  border: '1px solid #e4e4e7',
                  background: '#ffffff',
                  color: '#18181b',
                  outline: 'none',
                }}
                onFocusCapture={(e) => (e.currentTarget.style.borderColor = '#18181b')}
                onBlurCapture={(e) => (e.currentTarget.style.borderColor = '#e4e4e7')}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
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

            {/* Result Filter Dropdown */}
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
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '10px 14px', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)' }}>Timestamp</th>
                <th style={{ padding: '10px 14px', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)' }}>Actor</th>
                <th style={{ padding: '10px 14px', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)' }}>Action</th>
                <th style={{ padding: '10px 14px', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)' }}>Target</th>
                <th style={{ padding: '10px 14px', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)' }}>IP location</th>
                <th style={{ padding: '10px 14px', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)', textAlign: 'right' }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudit.map((aud) => (
                <tr
                  key={aud.id}
                  style={{
                    height: 52,
                    borderBottom: '1px solid #f4f4f5',
                    transition: 'background 0.12s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0 18px' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#18181b' }}>
                      {formatTimestamp(aud.timestamp).main}
                    </div>
                    <div style={{ fontSize: 11, color: '#71717a', marginTop: 1 }}>
                      {formatTimestamp(aud.timestamp).sub}
                    </div>
                  </td>
                  <td style={{ padding: '0 16px', fontSize: 13, fontWeight: 500, color: '#18181b' }}>
                    {aud.actor}
                  </td>
                  <td style={{ padding: '0 16px', fontSize: 13, fontWeight: 600, color: '#18181b' }}>
                    {aud.action}
                  </td>
                  <td style={{ padding: '0 16px', fontSize: 13, color: '#52525b' }}>
                    {aud.target}
                  </td>
                  <td style={{ padding: '0 16px', fontSize: 12, color: '#71717a' }}>
                    {aud.ipAddress}
                  </td>
                  <td style={{ padding: '0 18px', textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: 6,
                        background:
                          aud.result === 'Success'
                            ? '#dcfce7'
                            : aud.result === 'Warning'
                            ? '#fef9c3'
                            : '#fee2e2',
                        color:
                          aud.result === 'Success'
                            ? '#15803d'
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
  );
};

