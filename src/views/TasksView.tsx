import React, { useState } from 'react';
import {
  Plus,
  Clock,
  User,
  CheckSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import type { TaskCategory, JobPriority } from '../types';

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
            Recruiter Tasks
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Manage candidate evaluations, outreach reviews, and hiring manager follow-ups.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={14} />}
          onClick={() => setModalOpen(true)}
        >
          Add Task
        </Button>
      </div>

      {/* Filter Row */}
      <div
        className="snow-card"
        style={{
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', gap: 4 }}>
          {['All', 'Pending', 'In Progress', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: statusFilter === st ? 600 : 500,
                border: '1px solid',
                borderColor: statusFilter === st ? 'var(--color-primary)' : 'var(--color-border)',
                background: statusFilter === st ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                color: statusFilter === st ? '#ffffff' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
          {filteredTasks.length} tasks
        </span>
      </div>

      {/* Task List */}
      <div className="snow-card" style={{ padding: '4px 0', overflow: 'hidden' }}>
        {filteredTasks.length === 0 ? (
          <div style={{ padding: 36, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
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
                    padding: '12px 20px',
                    borderBottom: '1px solid var(--color-divider)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 14,
                    background: isCompleted ? 'var(--color-bg-canvas)' : 'var(--color-bg-surface)',
                    transition: 'background var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                    {/* Checkbox Toggle */}
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => toggleTaskStatus(t.id)}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: 'var(--color-primary)',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    />

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 600,
                          color: isCompleted ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                        }}
                      >
                        {t.title}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 3, flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '10.5px',
                            background: 'var(--color-bg-subtle)',
                            padding: '1px 5px',
                            borderRadius: 'var(--radius-xs)',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          {t.category}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          <Clock size={11} />
                          <span>Due {t.dueDate}</span>
                        </div>

                        {t.relatedCandidateName && (
                          <span
                            onClick={() =>
                              t.relatedCandidateId &&
                              navigate('candidate-detail', { candidateId: t.relatedCandidateId })
                            }
                            style={{
                              fontSize: '11px',
                              color: 'var(--color-text-secondary)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <User size={10} />
                            <span>{t.relatedCandidateName}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <StatusBadge status={t.priority} />
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
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
        <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            label="Task Description"
            required
            placeholder="e.g. Review portfolio and schedule technical screen for Neha Gupta"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="form-select"
              >
                <option value="Review Candidate">Review Candidate</option>
                <option value="Approve Outreach">Approve Outreach</option>
                <option value="Schedule Interview">Schedule Interview</option>
                <option value="Review Application">Review Application</option>
                <option value="Follow Up With Client">Follow Up With Client</option>
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
