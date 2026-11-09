import React from 'react';
import {
  Building2,
  MapPin,
  Mail,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isDevMode } from '../utils/devMode';

export const ClientsView: React.FC = () => {
  const { clients, navigate } = useApp();

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
          <h1
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Client Accounts
          </h1>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Hiring partner requisitions, candidate pipeline status, and key recruitment contacts.
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
            <strong style={{ color: '#18181b' }}>{clients.length}</strong> Active Partner Accounts
          </div>
        </div>
      </div>

      {/* 2. Clients Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 16,
        }}
      >
        {clients.map((client) => (
          <div
            key={client.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: 8,
              padding: '20px 22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 18,
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#18181b', margin: 0 }}>
                    {client.name}
                  </h3>
                  <span style={{ fontSize: 12.5, color: '#71717a', display: 'block', marginTop: 2 }}>
                    {client.industry}
                  </span>
                </div>
                <div
                  style={{
                    padding: 8,
                    background: '#f4f4f5',
                    borderRadius: 6,
                    color: '#18181b',
                  }}
                >
                  <Building2 size={16} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#71717a', marginBottom: 14 }}>
                <MapPin size={13} />
                <span>{client.location}</span>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: '#71717a' }}>Hiring Fulfillment</span>
                  <span style={{ fontWeight: 600, color: '#18181b' }}>{client.hiringProgress}%</span>
                </div>
                <div
                  style={{
                    height: 6,
                    width: '100%',
                    background: '#f4f4f5',
                    borderRadius: 9999,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${client.hiringProgress}%`,
                      background: '#18181b',
                      borderRadius: 9999,
                    }}
                  />
                </div>
              </div>

              {/* Stats Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                  padding: '12px 14px',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div>
                  <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#18181b', fontFeatureSettings: '"tnum"' }}>{client.openJobsCount}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: '#71717a' }}>Open Requisitions</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#18181b', fontFeatureSettings: '"tnum"' }}>{client.activeCandidatesCount}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: '#71717a' }}>Candidates in Pipeline</div>
                </div>
              </div>

              {/* Contact Info */}
              <div style={{ marginTop: 14, fontSize: 'var(--font-size-sm)', color: '#52525b', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div><strong>Talent Lead:</strong> {client.keyContact}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#71717a' }}>
                  <Mail size={12} />
                  <span>{client.email}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 14,
                borderTop: '1px solid #f4f4f5',
                gap: 12,
              }}
            >
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: '#71717a',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={client.recentActivity}
              >
                {client.recentActivity}
              </span>

              <button
                type="button"
                className="btn-dark"
                onClick={() => navigate('jobs')}
                style={{
                  height: 'var(--control-height)',
                  padding: '0 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'var(--color-primary-button)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <span>View Jobs</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
