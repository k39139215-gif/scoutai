import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Input, Textarea } from '../components/common/Input';
import { CustomSelect } from '../components/common/CustomDropdown';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 840, margin: '0 auto' }}>
      {/* Top Nav Back */}
      <button
        onClick={() => navigate('jobs')}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#71717a',
          fontSize: 13,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: 0,
          alignSelf: 'flex-start',
          fontWeight: 500,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#18181b')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
      >
        <ArrowLeft size={14} />
        <span>Back to Requisitions</span>
      </button>

      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: '#18181b',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          Create Job Requisition
        </h1>
        <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
          Define role specifications, required technical competencies, and compensation parameters.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: 8,
          padding: '24px 28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Row 1: Title & Client */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <Input
              label="Job Title"
              required
              placeholder="e.g. Senior Backend Engineer (Go)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#18181b' }}>Client Account</label>
              <CustomSelect
                value={client}
                onChange={setClient}
                options={[
                  { value: 'Razorpay (Fintech Payments)', label: 'Razorpay (Fintech Payments)' },
                  { value: 'Swiggy (Consumer Tech)', label: 'Swiggy (Consumer Tech)' },
                  { value: 'BrowserStack (Developer Tooling)', label: 'BrowserStack (Developer Tooling)' },
                  { value: 'Postman (API Platform)', label: 'Postman (API Platform)' },
                  { value: 'Pine Labs (Merchant Commerce)', label: 'Pine Labs (Merchant Commerce)' },
                ]}
                size="md"
                menuWidth="100%"
              />
            </div>
          </div>

          {/* Row 2: Department, Location & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#18181b' }}>Department</label>
              <CustomSelect
                value={department}
                onChange={setDepartment}
                options={[
                  { value: 'Backend Systems', label: 'Backend Systems' },
                  { value: 'Frontend Architecture', label: 'Frontend Architecture' },
                  { value: 'Infrastructure & SRE', label: 'Infrastructure & SRE' },
                  { value: 'Data & Analytics', label: 'Data & Analytics' },
                  { value: 'Applied AI & ML', label: 'Applied AI & ML' },
                  { value: 'Security Engineering', label: 'Security Engineering' },
                ]}
                size="md"
                menuWidth="100%"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#18181b' }}>Location</label>
              <CustomSelect
                value={location}
                onChange={setLocation}
                options={[
                  { value: 'Bengaluru, Karnataka (Hybrid)', label: 'Bengaluru (Hybrid)' },
                  { value: 'Bengaluru, Karnataka (On-site)', label: 'Bengaluru (On-site)' },
                  { value: 'Hyderabad, Telangana (Hybrid)', label: 'Hyderabad (Hybrid)' },
                  { value: 'Pune, Maharashtra (Hybrid)', label: 'Pune (Hybrid)' },
                  { value: 'Gurugram, Haryana (Hybrid)', label: 'Gurugram (Hybrid)' },
                  { value: 'Remote (India)', label: 'Remote (India)' },
                ]}
                size="md"
                menuWidth="100%"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#18181b' }}>Priority</label>
              <CustomSelect
                value={priority}
                onChange={(val) => setPriority(val as JobPriority)}
                options={[
                  { value: 'High', label: 'High Priority' },
                  { value: 'Medium', label: 'Medium Priority' },
                  { value: 'Low', label: 'Low Priority' },
                ]}
                size="md"
                menuWidth="100%"
              />
            </div>
          </div>

          {/* Row 3: Experience & Compensation */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
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
              gap: 10,
              paddingTop: 16,
              borderTop: '1px solid #f4f4f5',
            }}
          >
            <button
              type="button"
              onClick={() => navigate('jobs')}
              style={{
                height: 36,
                padding: '0 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                background: '#ffffff',
                border: '1px solid #e4e4e7',
                color: '#18181b',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-dark"
              style={{
                height: 36,
                padding: '0 18px',
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
              <Check size={14} />
              <span>Publish Requisition</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

