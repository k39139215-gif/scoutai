import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input, Textarea } from '../components/common/Input';
import { CustomSelect } from '../components/common/CustomDropdown';
import type { PrivacyRequest } from '../types';
import { isDevMode } from '../utils/devMode';
import { formatDate } from '../utils/formatters';
import { Tooltip } from '../components/common/Tooltip';

export const PrivacyComplianceView: React.FC = () => {
  const { privacyRequests, updatePrivacyRequestStatus, createPrivacyRequest, navigate } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState<PrivacyRequest['requestType']>('Data Access (SAR)');
  const [reviewNotes, setReviewNotes] = useState('');

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !email) return;
    createPrivacyRequest({
      candidateName,
      email,
      requestType,
      reviewNotes: reviewNotes || 'Candidate submitted formal request via portal.',
    });
    setCandidateName('');
    setEmail('');
    setReviewNotes('');
    setModalOpen(false);
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
              Privacy & Data Governance
            </h1>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                padding: '2px 8px',
                borderRadius: 9999,
                background: '#f1f5f9',
                color: '#475569',
                border: '1px solid #e2e8f0',
              }}
            >
              DPDP-aligned workflows (not legal advice)
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Candidate data inventory, subject access management, and retention policy controls.
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
          <button
            className="btn-dark"
            onClick={() => setModalOpen(true)}
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
            <Plus size={15} />
            <span>Log Data Request</span>
          </button>
        </div>
      </div>

      {/* 2. Compliance Notice Banner */}
      <div
        style={{
          padding: '14px 18px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          fontSize: 13,
          color: '#334155',
          lineHeight: 1.5,
        }}
      >
        <AlertTriangle size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: 1 }} />
        <div>
          <strong>Product Governance Notice:</strong> Software mechanisms for managing candidate records, access requests, and retention schedules are enforced. Independent legal review is recommended for formal regulatory compliance under India's Digital Personal Data Protection (DPDP) Act.
        </div>
      </div>

      {/* 3. Data Inventory & Policy Summary */}
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
            Candidate records
          </span>
          <div className="metric-val" style={{ fontSize: 24, fontWeight: 600, margin: '6px 0 2px', color: '#0f172a' }}>
            247 profiles
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
            Encrypted talent pool database
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
            Retention target
          </span>
          <div className="metric-val" style={{ fontSize: 24, fontWeight: 600, margin: '6px 0 2px', color: '#0f172a' }}>
            24 months
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
            Access policy
          </span>
          <div className="metric-val" style={{ fontSize: 24, fontWeight: 600, margin: '6px 0 2px', color: '#0f172a' }}>
            Enforced
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
            Role-scoped candidate privacy
          </div>
        </div>
      </div>

      {/* 4. Data Subject Requests Queue */}
      <div className="table-card-container">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e4e4e7' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#18181b', margin: 0 }}>
            Subject Access & Deletion Requests ({privacyRequests.length})
          </h3>
          <p style={{ fontSize: 12.5, color: '#71717a', marginTop: 2, margin: 0 }}>
            Track and fulfill candidate data export, correction, or erasure requests.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid var(--border-subtle)' }}>
                <th className="col-sticky-first" style={{ padding: '10px 14px', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)', minWidth: 220 }}>Candidate & email</th>
                <th style={{ padding: '10px 14px', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)' }}>Request type</th>
                <th className="col-hide-sm" style={{ padding: '10px 14px', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)' }}>Requested date</th>
                <th className="col-hide-md" style={{ padding: '10px 14px', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)' }}>Review notes</th>
                <th className="col-sticky-action" style={{ padding: '10px 14px', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)', textAlign: 'right', minWidth: 150 }}>Status & Action</th>
              </tr>
            </thead>
            <tbody>
              {privacyRequests.map((req) => (
                <tr
                  key={req.id}
                  style={{
                    height: 56,
                    borderBottom: '1px solid #f4f4f5',
                    transition: 'background 0.12s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="col-sticky-first" style={{ padding: '0 18px' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#18181b' }}>{req.candidateName}</div>
                    <div style={{ fontSize: 12, color: '#71717a', marginTop: 1 }}>
                      {req.email}
                    </div>
                  </td>
                  <td style={{ padding: '0 16px' }}>
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 500,
                        padding: '3px 8px',
                        borderRadius: 4,
                        background: '#eff6ff',
                        color: '#2563eb',
                      }}
                    >
                      {req.requestType}
                    </span>
                  </td>
                  <td className="col-hide-sm" style={{ padding: '0 16px', fontSize: 12.5, color: '#71717a', fontVariantNumeric: 'tabular-nums' }}>
                    {formatDate(req.requestedAt)}
                  </td>
                  <td className="col-hide-md" style={{ padding: '0 16px', fontSize: 13, color: '#52525b', maxWidth: 260 }}>
                    <Tooltip content={req.reviewNotes}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {req.reviewNotes}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="col-sticky-action" style={{ padding: '0 18px', textAlign: 'right' }}>
                    <CustomSelect
                      value={req.status}
                      onChange={(val) => updatePrivacyRequestStatus(req.id, val as any)}
                      options={[
                        { value: 'Pending Review', label: 'Pending Review' },
                        { value: 'In Progress', label: 'In Progress' },
                        { value: 'Completed', label: 'Completed' },
                      ]}
                      size="sm"
                      menuWidth={140}
                      align="right"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Log Request Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log Candidate Data Request"
        description="Record a formal data access, correction, or erasure request for legal review"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={<ShieldCheck size={13} />} onClick={handleCreateRequest}>
              Record Request
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            label="Candidate Full Name"
            required
            placeholder="e.g. Rahul Deshmukh"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />

          <Input
            label="Candidate Email"
            type="email"
            required
            placeholder="e.g. rahul.d.demo@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#18181b' }}>Request Type</label>
            <CustomSelect
              value={requestType}
              onChange={(val) => setRequestType(val as any)}
              options={[
                { value: 'Data Access (SAR)', label: 'Data Access (Subject Access Request)' },
                { value: 'Data Correction', label: 'Data Correction / Update' },
                { value: 'Data Erasure', label: 'Data Erasure / Deletion' },
                { value: 'Consent Revocation', label: 'Consent Revocation' },
              ]}
              size="md"
              menuWidth="100%"
            />
          </div>

          <Textarea
            label="Review Notes & Details"
            rows={3}
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
};

