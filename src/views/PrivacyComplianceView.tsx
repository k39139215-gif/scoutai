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
import { CustomSelect } from '../components/common/CustomDropdown';
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
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 9999,
                background: '#fef3c7',
                color: '#b45309',
                border: '1px solid #fde68a',
              }}
            >
              DPDP Act Compliance
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Candidate data inventory, subject access management, and retention policy controls.
          </p>
        </div>

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
            border: '1px solid #e4e4e7',
            borderRadius: 8,
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Candidate Records
          </span>
          <div style={{ fontSize: 24, fontWeight: 700, margin: '6px 0 2px', color: '#18181b' }}>
            247 Profiles
          </div>
          <div style={{ fontSize: 12, color: '#71717a' }}>
            Simulated talent pool database
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 8,
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Retention Target
          </span>
          <div style={{ fontSize: 24, fontWeight: 700, margin: '6px 0 2px', color: '#2563eb' }}>
            24 Months
          </div>
          <div style={{ fontSize: 12, color: '#71717a' }}>
            Configurable in Settings
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 8,
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Storage Security
          </span>
          <div style={{ fontSize: 24, fontWeight: 700, margin: '6px 0 2px', color: '#16a34a' }}>
            AES-256
          </div>
          <div style={{ fontSize: 12, color: '#71717a' }}>
            Zero external PII leakage
          </div>
        </div>
      </div>

      {/* 4. Data Subject Requests Queue */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
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
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #e4e4e7' }}>
                <th style={{ padding: '12px 18px', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Candidate & Email</th>
                <th style={{ padding: '12px 16px', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Request Type</th>
                <th style={{ padding: '12px 16px', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Requested Date</th>
                <th style={{ padding: '12px 16px', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Review Notes</th>
                <th style={{ padding: '12px 16px', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 18px', fontSize: 11.5, fontWeight: 600, color: '#71717a', textTransform: 'uppercase', textAlign: 'right' }}>Update</th>
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
                  <td style={{ padding: '0 18px' }}>
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
                  <td style={{ padding: '0 16px', fontSize: 12.5, color: '#71717a' }}>
                    {req.requestedAt}
                  </td>
                  <td style={{ padding: '0 16px', fontSize: 13, color: '#52525b' }}>
                    {req.reviewNotes}
                  </td>
                  <td style={{ padding: '0 16px' }}>
                    <StatusBadge status={req.status} />
                  </td>
                  <td style={{ padding: '0 18px', textAlign: 'right' }}>
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

