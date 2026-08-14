import React, { useState } from 'react';
import {
  Shield,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SecurityView: React.FC = () => {
  const { securityAudit, settings } = useApp();

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1
              style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Security & Audit Trail
            </h1>
            <span className="snow-badge snow-badge-default" style={{ fontSize: '10.5px' }}>Simulated Controls</span>
          </div>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Access control policies, authenticated sessions, and system administrative audit trail.
          </p>
        </div>

        <div
          style={{
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            padding: '4px 10px',
            background: 'var(--color-bg-canvas)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
          }}
        >
          Session: {settings.profile.email}
        </div>
      </div>

      {/* Security Disclaimer Strip */}
      <div
        style={{
          padding: '10px 14px',
          background: 'var(--color-bg-subtle)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <Shield size={14} style={{ color: 'var(--color-accent-blue)', flexShrink: 0 }} />
        <span>
          <strong>Prototype Security Notice:</strong> Session records, IP stamps, and audit logs are simulated for demonstration.
        </span>
      </div>

      {/* Access Overview Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
        }}
      >
        <div className="snow-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Current Privilege
          </span>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, margin: '4px 0 1px' }}>
            {settings.profile.role}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success-text)' }}>
            Full Requisition Access
          </div>
        </div>

        <div className="snow-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Session Timeout
          </span>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, margin: '4px 0 1px', color: 'var(--color-accent-blue)' }}>
            {settings.security.sessionTimeoutMinutes} Minutes
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Configurable in Settings
          </div>
        </div>

        <div className="snow-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Audit Log Retention
          </span>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, margin: '4px 0 1px' }}>
            {settings.security.auditLogRetentionDays} Days
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Tamper-evident storage
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="snow-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>
              System Audit Trail ({filteredAudit.length})
            </h3>
            <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: 1 }}>
              Record of user actions, status modifications, and data accesses.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 180 }}>
              <Search
                size={13}
                style={{
                  position: 'absolute',
                  left: 9,
                  top: 9,
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                type="text"
                placeholder="Search audit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: 28, height: 30, fontSize: 'var(--font-size-xs)' }}
              />
            </div>

            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="form-select"
              style={{ width: 120, height: 30, fontSize: 'var(--font-size-xs)' }}
            >
              <option value="All">Result: All</option>
              <option value="Success">Success</option>
              <option value="Warning">Warning</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>

        <div className="snow-table-container">
          <table className="snow-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Target</th>
                <th>IP Location</th>
                <th style={{ textAlign: 'right' }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudit.map((aud) => (
                <tr key={aud.id}>
                  <td>
                    <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-family-mono)' }}>
                      {aud.timestamp}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 500 }}>{aud.actor}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {aud.action}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                      {aud.target}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{aud.ipAddress}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span
                      className={`snow-badge ${
                        aud.result === 'Success'
                          ? 'snow-badge-success'
                          : aud.result === 'Warning'
                          ? 'snow-badge-warning'
                          : 'snow-badge-danger'
                      }`}
                      style={{ fontSize: '10.5px' }}
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
