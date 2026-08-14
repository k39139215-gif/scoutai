import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Input, Textarea } from '../components/common/Input';
import type { JobPriority } from '../types';

export const CreateJobView: React.FC = () => {
  const { createJob, navigate } = useApp();

  const [title, setTitle] = useState('');
  const [client, setClient] = useState('Razorpay (Fintech Payments)');
  const [department, setDepartment] = useState('Backend Systems');
  const [location, setLocation] = useState('Bengaluru, Karnataka (Hybrid)');
  const [experienceLevel, setExperienceLevel] = useState('Senior (5-8 yrs)');
  const [salaryRange, setSalaryRange] = useState('₹32L – ₹48L INR');
  const [skillsInput, setSkillsInput] = useState('Go, Distributed Systems, Redis, Kafka, PostgreSQL, Kubernetes');
  const [priority, setPriority] = useState<JobPriority>('High');
  const [description, setDescription] = useState(
    'Architect high-throughput distributed payment settlement pipelines handling 25,000+ TPS. Collaborate with site reliability engineers and product stakeholders.'
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Job title is required';
    if (!client.trim()) newErrors.client = 'Client is required';
    if (!skillsInput.trim()) newErrors.skills = 'At least one skill is required';
    if (!description.trim()) newErrors.description = 'Job description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newJobId = createJob({
      title,
      client,
      department,
      location,
      employmentType: 'Full-time',
      experienceLevel,
      salaryRange,
      skills,
      priority,
      status: 'Open',
      description,
    });

    navigate('job-workspace', { jobId: newJobId });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 780, margin: '0 auto' }}>
      {/* Top Nav */}
      <button
        onClick={() => navigate('jobs')}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-xs)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: 0,
          alignSelf: 'flex-start',
        }}
      >
        <ArrowLeft size={14} />
        <span>Back to Jobs</span>
      </button>

      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          Create Job Requisition
        </h1>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
          Define role specifications, required technical competencies, and compensation parameters.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="snow-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Row 1: Title & Client */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            <Input
              label="Job Title"
              required
              placeholder="e.g. Senior Backend Engineer (Go)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
            />

            <div className="form-group">
              <label className="form-label">Client Account</label>
              <select
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="form-select"
              >
                <option value="Razorpay (Fintech Payments)">Razorpay (Fintech Payments)</option>
                <option value="Swiggy (Consumer Tech)">Swiggy (Consumer Tech)</option>
                <option value="BrowserStack (Developer Tooling)">BrowserStack (Developer Tooling)</option>
                <option value="Postman (API Platform)">Postman (API Platform)</option>
                <option value="Pine Labs (Merchant Commerce)">Pine Labs (Merchant Commerce)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Department, Location & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-select"
              >
                <option value="Backend Systems">Backend Systems</option>
                <option value="Frontend Architecture">Frontend Architecture</option>
                <option value="Infrastructure & SRE">Infrastructure & SRE</option>
                <option value="Data & Analytics">Data & Analytics</option>
                <option value="Applied AI & ML">Applied AI & ML</option>
                <option value="Security Engineering">Security Engineering</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-select"
              >
                <option value="Bengaluru, Karnataka (Hybrid)">Bengaluru (Hybrid)</option>
                <option value="Bengaluru, Karnataka (On-site)">Bengaluru (On-site)</option>
                <option value="Hyderabad, Telangana (Hybrid)">Hyderabad (Hybrid)</option>
                <option value="Pune, Maharashtra (Hybrid)">Pune (Hybrid)</option>
                <option value="Gurugram, Haryana (Hybrid)">Gurugram (Hybrid)</option>
                <option value="Remote (India)">Remote (India)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as JobPriority)}
                className="form-select"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Row 3: Experience & Compensation */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            <Input
              label="Experience Level"
              required
              placeholder="e.g. Senior (5-8 yrs)"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            />

            <Input
              label="Compensation (Annual CTC)"
              required
              placeholder="e.g. ₹32L – ₹48L INR"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
            />
          </div>

          {/* Row 4: Required Skills */}
          <Input
            label="Required Technical Skills (Comma separated)"
            required
            placeholder="e.g. Go, Distributed Systems, Kafka, Redis, PostgreSQL"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            helperText="Used by AI matching engine to evaluate candidate compatibility."
            error={errors.skills}
          />

          {/* Row 5: Job Description */}
          <Textarea
            label="Job Description"
            required
            rows={4}
            placeholder="Outline primary scope and architectural challenges..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
          />

          {/* Form Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 8,
              paddingTop: 14,
              borderTop: '1px solid var(--color-divider)',
            }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('jobs')}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              icon={<Check size={14} />}
            >
              Publish Requisition
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
