import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  LayoutDashboard,
  Briefcase,
  Users,
  Target,
  Send,
  Calendar,
  CheckSquare,
  Shield,
  Settings,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandAction {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'Quick Filters';
  icon: React.ReactNode;
  shortcut?: string;
  run: () => void;
}

/**
 * Official BoardUI Command Palette Component (⌘K)
 * Figma source: Board UI -> Overlays -> Command Launcher
 * Features grouped quick search, keyboard navigation, and instant view switching.
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { navigate } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: CommandAction[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      title: 'Dashboard Overview',
      category: 'Navigation',
      icon: <LayoutDashboard size={15} style={{ color: '#4338ca' }} />,
      shortcut: 'G D',
      run: () => { navigate('dashboard'); onClose(); },
    },
    {
      id: 'nav-jobs',
      title: 'Job Requisitions',
      category: 'Navigation',
      icon: <Briefcase size={15} style={{ color: '#2563eb' }} />,
      shortcut: 'G J',
      run: () => { navigate('jobs'); onClose(); },
    },
    {
      id: 'nav-candidates',
      title: 'Candidates Directory',
      category: 'Navigation',
      icon: <Users size={15} style={{ color: '#047857' }} />,
      shortcut: 'G C',
      run: () => { navigate('candidates'); onClose(); },
    },
    {
      id: 'nav-sourcing',
      title: 'Candidate Matching (AI Fit)',
      category: 'Navigation',
      icon: <Target size={15} style={{ color: '#7c3aed' }} />,
      shortcut: 'G M',
      run: () => { navigate('sourcing'); onClose(); },
    },
    {
      id: 'nav-outreach',
      title: 'Outreach Cadence',
      category: 'Navigation',
      icon: <Send size={15} style={{ color: '#ea580c' }} />,
      shortcut: 'G O',
      run: () => { navigate('outreach'); onClose(); },
    },
    {
      id: 'nav-interviews',
      title: 'Interview Schedule',
      category: 'Navigation',
      icon: <Calendar size={15} style={{ color: '#0284c7' }} />,
      shortcut: 'G I',
      run: () => { navigate('interviews'); onClose(); },
    },
    {
      id: 'nav-tasks',
      title: 'Recruitment Tasks',
      category: 'Navigation',
      icon: <CheckSquare size={15} style={{ color: '#166534' }} />,
      shortcut: 'G T',
      run: () => { navigate('tasks'); onClose(); },
    },
    {
      id: 'nav-security',
      title: 'Audit Trail & Compliance',
      category: 'Navigation',
      icon: <Shield size={15} style={{ color: '#b45309' }} />,
      shortcut: 'G A',
      run: () => { navigate('ai-activity'); onClose(); },
    },
    {
      id: 'nav-settings',
      title: 'System Settings',
      category: 'Navigation',
      icon: <Settings size={15} style={{ color: '#475569' }} />,
      shortcut: 'G S',
      run: () => { navigate('settings'); onClose(); },
    },

    // Actions
    {
      id: 'act-new-job',
      title: 'Create New Requisition',
      category: 'Actions',
      icon: <Plus size={15} style={{ color: '#166534' }} />,
      shortcut: 'N J',
      run: () => { navigate('create-job'); onClose(); },
    },
    {
      id: 'act-match',
      title: 'Run AI Matching Batch',
      category: 'Actions',
      icon: <Target size={15} style={{ color: '#4338ca' }} />,
      shortcut: 'R M',
      run: () => { navigate('sourcing'); onClose(); },
    },
  ];

  const filtered = actions.filter((act) =>
    act.title.toLowerCase().includes(query.toLowerCase()) ||
    act.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].run();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 580,
          maxWidth: '92vw',
          background: '#ffffff',
          borderRadius: 14,
          border: '1px solid #cbd5e1',
          boxShadow: '0 20px 48px -8px rgba(15, 23, 42, 0.22), 0 4px 12px rgba(15, 23, 42, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'boarduiDropdownEnter 160ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Search Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff',
          }}
        >
          <Search size={18} style={{ color: '#4338ca', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or jump to page..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: 14,
              color: '#0f172a',
              outline: 'none',
            }}
          />
          <kbd
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#64748b',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: '6px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
              No matching commands found.
            </div>
          ) : (
            filtered.map((act, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={act.id}
                  onClick={act.run}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: isSelected ? '#eef2ff' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.08s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: isSelected ? '#ffffff' : '#f8fafc',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {act.icon}
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? '#4338ca' : '#0f172a',
                      }}
                    >
                      {act.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {act.shortcut && (
                      <kbd
                        style={{
                          fontSize: 12,
                          color: isSelected ? '#4338ca' : '#94a3b8',
                          background: isSelected ? '#ffffff' : '#f8fafc',
                          border: '1px solid #e2e8f0',
                          padding: '1px 6px',
                          borderRadius: 4,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {act.shortcut}
                      </kbd>
                    )}
                    {isSelected && <ArrowRight size={13} style={{ color: '#4338ca' }} />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid #f1f5f9',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#64748b',
          }}
        >
          <span>Navigate with ↑ ↓ keys</span>
          <span>Press ↵ to select</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
