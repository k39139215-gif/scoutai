import React from 'react';
import {
  Building2,
  MapPin,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';

export const ClientsView: React.FC = () => {
  const { clients, navigate } = useApp();

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
          <h1
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Client Accounts
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Hiring partner requisitions, candidate pipeline status, and key recruitment contacts.
          </p>
        </div>

        <span className="snow-badge snow-badge-default" style={{ fontSize: '11px' }}>4 Active Accounts</span>
      </div>

      {/* Clients Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        {clients.map((client) => (
          <div
            key={client.id}
            className="snow-card"
            style={{
              padding: '20px 22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {client.name}
                  </h3>
                  <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
                    {client.industry}
                  </span>
                </div>
                <div style={{ padding: 5, background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <Building2 size={15} style={{ color: 'var(--color-text-primary)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '11.5px', color: 'var(--color-text-muted)', marginBottom: 14 }}>
                <MapPin size={11} />
                <span>{client.location}</span>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: 4 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Hiring Fulfillment</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{client.hiringProgress}%</span>
                </div>
                <div
                  style={{
                    height: 4,
                    width: '100%',
                    background: 'var(--color-bg-subtle)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${client.hiringProgress}%`,
                      background: 'var(--color-primary)',
                      borderRadius: 'var(--radius-full)',
                    }}
                  />
                </div>
              </div>

              {/* Stats Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                  padding: '10px 12px',
                  background: 'var(--color-bg-canvas)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>{client.openJobsCount}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>Open Roles</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>{client.activeCandidatesCount}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>In Pipeline</div>
                </div>
              </div>

              {/* Contact Info */}
              <div style={{ marginTop: 12, fontSize: '11.5px', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div><strong>Talent Lead:</strong> {client.keyContact}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Mail size={11} style={{ color: 'var(--color-text-muted)' }} />
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
                paddingTop: 12,
                borderTop: '1px solid var(--color-divider)',
              }}
            >
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {client.recentActivity}
              </span>

              <Button
                variant="primary"
                size="sm"
                iconRight={<ArrowRight size={12} />}
                onClick={() => navigate('jobs')}
              >
                View Jobs
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
