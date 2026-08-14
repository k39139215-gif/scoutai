import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input, Textarea } from '../components/common/Input';
import type { PrivacyRequest } from '../types';

export const PrivacyComplianceView: React.FC = () => {
  const { privacyRequests, updatePrivacyRequestStatus, createPrivacyRequest } = useApp();

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
              Privacy & Data Governance
            </h1>
            <span className="snow-badge snow-badge-warning" style={{ fontSize: '10.5px' }}>Review Required</span>
          </div>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Candidate data inventory, subject access management, and retention policy controls.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={14} />}
          onClick={() => setModalOpen(true)}
        >
          Log Data Request
        </Button>
      </div>

      {/* Compliance Notice Banner (Clean & Restrained) */}
      <div
        style={{
          padding: '12px 16px',
          background: 'var(--color-bg-subtle)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.45,
        }}
      >
        <AlertTriangle size={15} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: 1 }} />
        <div>
          <strong>Product Governance Notice:</strong> Software mechanisms for managing candidate records, access requests, and retention schedules. Independent legal review is required for regulatory compliance under Indian privacy frameworks (DPDP Act).
        </div>
      </div>

      {/* Data Inventory & Policy Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
        }}
      >
        <div className="snow-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Candidate Records
          </span>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 600, margin: '4px 0 1px' }}>
            247 Profiles
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Demo talent pool
          </div>
        </div>

        <div className="snow-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Retention Target
          </span>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 600, margin: '4px 0 1px', color: 'var(--color-accent-blue)' }}>
            24 Months
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Configurable in Settings
          </div>
        </div>

        <div className="snow-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Storage Security
          </span>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 600, margin: '4px 0 1px', color: 'var(--color-success-text)' }}>
            Simulated
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            No external PII leakage
          </div>
        </div>
      </div>

      {/* Data Subject Requests Queue */}
      <div className="snow-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>
              Subject Access & Deletion Requests ({privacyRequests.length})
            </h3>
            <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: 1 }}>
              Track and fulfill candidate data export, correction, or erasure requests.
            </p>
          </div>
        </div>

        <div className="snow-table-container">
          <table className="snow-table">
            <thead>
              <tr>
                <th>Candidate & Email</th>
                <th>Request Type</th>
                <th>Requested Date</th>
                <th>Review Notes</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {privacyRequests.map((req) => (
                <tr key={req.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{req.candidateName}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
                      {req.email}
                    </div>
                  </td>
                  <td>
                    <span className="snow-badge snow-badge-blue" style={{ fontSize: '10.5px' }}>{req.requestType}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 'var(--font-size-xs)' }}>{req.requestedAt}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
                      {req.reviewNotes}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={req.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <select
                      value={req.status}
                      onChange={(e) => updatePrivacyRequestStatus(req.id, e.target.value as any)}
                      style={{
                        padding: '3px 6px',
                        fontSize: '11px',
                        fontWeight: 500,
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-bg-canvas)',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="Pending Review">Pending Review</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Request Modal */}
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
        <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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

          <div className="form-group">
            <label className="form-label">Request Type</label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value as any)}
              className="form-select"
            >
              <option value="Data Access (SAR)">Data Access (Subject Access Request)</option>
              <option value="Data Correction">Data Correction / Update</option>
              <option value="Data Erasure">Data Erasure / Deletion</option>
              <option value="Consent Revocation">Consent Revocation</option>
            </select>
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
