import React, { useState } from 'react';
import { Calendar, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Drawer } from './Drawer';
import { SegmentedControl } from './SegmentedControl';

export interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Official BoardUI Notifications Drawer Component
 * Displays system alerts, recruiter milestones, and upcoming interviews with rich status pills.
 */
export const Notifications: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const { interviews, aiActivity, navigate } = useApp();
  const [filter, setFilter] = useState<'all' | 'activity' | 'interviews'>('all');

  const upcomingInterviews = interviews.filter((i) => i.status === 'Scheduled');

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications & Activity"
      subtitle="Recruitment milestones, candidate evaluations, and scheduled rounds."
      width={440}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Segmented Filter */}
        <SegmentedControl
          size="sm"
          value={filter}
          onChange={(val) => setFilter(val as typeof filter)}
          options={[
            { value: 'all', label: 'All', count: aiActivity.length + upcomingInterviews.length },
            { value: 'activity', label: 'Activity', count: aiActivity.length },
            { value: 'interviews', label: 'Interviews', count: upcomingInterviews.length },
          ]}
        />

        {/* List of Notification Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Scheduled Interviews */}
          {(filter === 'all' || filter === 'interviews') &&
            upcomingInterviews.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  navigate('candidate-detail', { candidateId: item.candidateId });
                  onClose();
                }}
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  cursor: 'pointer',
                  transition: 'background 0.12s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Calendar size={15} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                      {item.candidateName}
                    </span>
                    <span style={{ fontSize: 12, color: '#0284c7', fontWeight: 600 }}>
                      {item.time}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#475569', marginTop: 2, margin: 0 }}>
                    {item.type} • {item.jobTitle}
                  </p>
                </div>
              </div>
            ))}

          {/* Activity Stream */}
          {(filter === 'all' || filter === 'activity') &&
            aiActivity.slice(0, 10).map((act) => (
              <div
                key={act.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: '#f1f5f9',
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Info size={15} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                      {act.type}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>
                      {act.actor}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#475569', marginTop: 2, margin: 0 }}>
                    {act.details}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Drawer>
  );
};
