import React, { useState } from 'react';
import {
  Plus,
  Clock,
  User,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { CustomSelect } from '../components/common/CustomDropdown';
import { CustomCheckbox } from '../components/common/CustomCheckbox';
import type { TaskCategory, JobPriority } from '../types';
import { isDevMode } from '../utils/devMode';
import { formatDate, getRelativeDateLabel } from '../utils/formatters';

export const TasksView: React.FC = () => {
  const { tasks, toggleTaskStatus, createTask, navigate } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Review Candidate');
  const [priority, setPriority] = useState<JobPriority>('High');
  const [dueDate, setDueDate] = useState('2026-08-20');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    createTask({
      title: taskTitle,
      category,
      priority,
      status: 'Pending',
      dueDate,
    });
    setTaskTitle('');
    setModalOpen(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === 'All') return true;
    return t.status === statusFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Page Header */}
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
            Tasks
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            Manage candidate evaluations, outreach reviews, and hiring manager follow-ups.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isDevMode() && (
            <button
              onClick={() => navigate('talent-studio')}
              style={{
                height: 36,
                padding: '0 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#eef2ff',
                border: '1px solid #c7d2fe',
                color: '#4338ca',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
            >
              <Sparkles size={14} />
              <span>Studio Desk (Refs)</span>
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
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.15)',
            }}
          >
            <Plus size={15} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Summary Rail */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
        }}
      >
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 16px' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Pending Actions</div>
          <div className="metric-val" style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '2px 0' }}>
            {tasks.filter((t) => t.status !== 'Completed').length}
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>Awaiting recruiter determination</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 16px' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>High Priority</div>
          <div className="metric-val" style={{ fontSize: 20, fontWeight: 700, color: '#991b1b', margin: '2px 0' }}>
            {tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').length}
          </div>
          <div style={{ fontSize: 12, color: '#991b1b' }}>Requires urgent turnaround</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 16px' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Completed Tasks</div>
          <div className="metric-val" style={{ fontSize: 20, fontWeight: 700, color: '#166534', margin: '2px 0' }}>
            {tasks.filter((t) => t.status === 'Completed').length}
          </div>
          <div style={{ fontSize: 12, color: '#166534' }}>Verified and archived</div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 3, background: '#f1f5f9', padding: 3, borderRadius: 7 }}>
          {['All', 'Pending', 'In Progress', 'Completed'].map((st) => {
            const isSelected = statusFilter === st;
            const count = st === 'All' ? tasks.length : tasks.filter((t) => t.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontWeight: isSelected ? 600 : 500,
                  border: isSelected ? '1px solid #c7d2fe' : '1px solid transparent',
                  background: isSelected ? '#ffffff' : 'transparent',
                  color: isSelected ? '#4338ca' : '#475569',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 1px 2px rgba(67, 56, 202, 0.08)' : 'none',
                  transition: 'all 0.12s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{st}</span>
                <span
                  style={{
                    fontSize: 12,
                    padding: '0 5px',
                    borderRadius: 9999,
                    background: isSelected ? '#e0e7ff' : 'transparent',
                    color: isSelected ? '#3730a3' : '#94a3b8',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <span style={{ fontSize: 13, color: '#64748b' }}>
          Showing <strong style={{ color: '#0f172a' }}>{filteredTasks.length}</strong> of {tasks.length} tasks
        </span>
      </div>

      {/* 3. Task List Table / Container */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        {filteredTasks.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
            No tasks found with status "{statusFilter}".
          </div>
        ) : (
          <div>
            {filteredTasks.map((t) => {
              const isCompleted = t.status === 'Completed';

              return (
                <div
                  key={t.id}
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    background: isCompleted ? '#f8fafc' : '#ffffff',
                    transition: 'background 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isCompleted) e.currentTarget.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (!isCompleted) e.currentTarget.style.background = '#ffffff';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                    {/* Checkbox Toggle with Custom Checkbox component (zero bounding box) */}
                    <CustomCheckbox
                      checked={isCompleted}
                      onChange={() => toggleTaskStatus(t.id)}
                      ariaLabel={t.title}
                    />

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          color: isCompleted ? '#475569' : '#0f172a',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                        }}
                      >
                        {t.title}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: 12,
                            background: '#f1f5f9',
                            padding: '2px 7px',
                            borderRadius: 4,
                            color: '#475569',
                            fontWeight: 500,
                          }}
                        >
                          {t.category}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748b' }}>
                          <Clock size={12} />
                          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {getRelativeDateLabel(t.dueDate) === 'Today' || getRelativeDateLabel(t.dueDate) === 'Tomorrow' || getRelativeDateLabel(t.dueDate) === 'Yesterday'
                              ? `Due ${getRelativeDateLabel(t.dueDate)} (${formatDate(t.dueDate)})`
                              : `Due ${formatDate(t.dueDate)}`}
                          </span>
                        </div>

                        {t.relatedCandidateName && (
                          <span
                            onClick={() =>
                              t.relatedCandidateId &&
                              navigate('candidate-detail', { candidateId: t.relatedCandidateId })
                            }
                            style={{
                              fontSize: 12,
                              color: '#4338ca',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <User size={12} />
                            <span>{t.relatedCandidateName}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <StatusBadge status={t.priority} />
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Add Task Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Recruiter Task"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={<CheckSquare size={13} />} onClick={handleCreateTask}>
              Save Task
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            label="Task Description"
            required
            placeholder="e.g. Review portfolio and schedule technical screen for Neha Gupta"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>Category</label>
              <CustomSelect
                value={category}
                onChange={(val) => setCategory(val as TaskCategory)}
                options={[
                  { value: 'Review Candidate', label: 'Review Candidate' },
                  { value: 'Approve Outreach', label: 'Approve Outreach' },
                  { value: 'Schedule Interview', label: 'Schedule Interview' },
                  { value: 'Review Application', label: 'Review Application' },
                  { value: 'Follow Up With Client', label: 'Follow Up With Client' },
                ]}
                size="md"
                menuWidth="100%"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>Priority</label>
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

          <Input
            label="Due Date"
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
};
