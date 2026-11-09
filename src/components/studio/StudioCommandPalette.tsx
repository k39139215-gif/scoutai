import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  LayoutGrid,
  Columns3,
  FileText,
  Workflow,
  Sparkles,
  Zap,
  Download,
  Image,
  Filter,
  Check,
  X,
  Command,
  UserPlus,
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Views' | 'Actions' | 'Filters' | 'References';
  icon: React.ReactNode;
  shortcut?: string;
  run: () => void;
}

interface StudioCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: 'table' | 'kanban' | 'dossier' | 'pipeline') => void;
  onToggleCopilot: () => void;
  onOpenReferences: () => void;
  onRunSimulation: () => void;
  onExportCSV: () => void;
  onQuickFilter: (type: string) => void;
  onSelectAll: () => void;
  onNewCandidate?: () => void;
}

export const StudioCommandPalette: React.FC<StudioCommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectMode,
  onToggleCopilot,
  onOpenReferences,
  onRunSimulation,
  onExportCSV,
  onQuickFilter,
  onSelectAll,
  onNewCandidate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    // Views
    {
      id: 'view-table',
      title: 'Dense Engineering Table',
      subtitle: 'Monospace figures, delta indicators, and collapsible audit rows (Ref 14)',
      category: 'Views',
      icon: <LayoutGrid size={15} style={{ color: '#3b82f6' }} />,
      shortcut: '1',
      run: () => onSelectMode('table'),
    },
    {
      id: 'view-kanban',
      title: 'Pipeline Kanban Board',
      subtitle: 'Velocity cards organized by recruitment stage (Refs 11, 18)',
      category: 'Views',
      icon: <Columns3 size={15} style={{ color: '#a855f7' }} />,
      shortcut: '2',
      run: () => onSelectMode('kanban'),
    },
    {
      id: 'view-dossier',
      title: 'Executive Split Dossier & Radar',
      subtitle: 'Printable executive brief with official verified seal and 5-axis radar (Refs 19, 20)',
      category: 'Views',
      icon: <FileText size={15} style={{ color: '#10b981' }} />,
      shortcut: '3',
      run: () => onSelectMode('dossier'),
    },
    {
      id: 'view-pipeline',
      title: 'AI Logic Nodes Canvas',
      subtitle: 'Visual neural match graph and trace runner (Refs 13, 15)',
      category: 'Views',
      icon: <Workflow size={15} style={{ color: '#f59e0b' }} />,
      shortcut: '4',
      run: () => onSelectMode('pipeline'),
    },

    // Actions
    {
      id: 'act-new-candidate',
      title: 'Ingest New Candidate Profile',
      subtitle: 'Add verified talent profile with automatic neural match prediction',
      category: 'Actions',
      icon: <UserPlus size={15} style={{ color: '#0f172a' }} />,
      shortcut: 'N',
      run: () => onNewCandidate?.(),
    },
    {
      id: 'act-simulation',
      title: 'Run AI Pipeline Simulation',
      subtitle: 'Test candidate cohort against neural scoring vectors and latency metrics',
      category: 'Actions',
      icon: <Zap size={15} style={{ color: '#eab308' }} />,
      shortcut: '↵',
      run: onRunSimulation,
    },
    {
      id: 'act-export',
      title: 'Export Candidates CSV',
      subtitle: 'Download complete talent dataset with scores, experience, and roles',
      category: 'Actions',
      icon: <Download size={15} style={{ color: '#94a3b8' }} />,
      run: onExportCSV,
    },
    {
      id: 'act-copilot',
      title: 'Toggle AI Copilot & Telemetry Drawer',
      subtitle: 'Open real-time GPU inference stats, token counts, and assistant',
      category: 'Actions',
      icon: <Sparkles size={15} style={{ color: '#6366f1' }} />,
      run: onToggleCopilot,
    },
    {
      id: 'act-select-all',
      title: 'Select All Filtered Candidates',
      subtitle: 'Stage all active candidates for batch shortlist or multi-outreach',
      category: 'Actions',
      icon: <Check size={15} style={{ color: '#10b981' }} />,
      run: onSelectAll,
    },

    // Filters
    {
      id: 'filter-senior',
      title: 'Filter: Senior Staff (5+ Years)',
      subtitle: 'Narrow roster to senior and principal engineering leaders',
      category: 'Filters',
      icon: <Filter size={15} style={{ color: '#64748b' }} />,
      run: () => onQuickFilter('Senior'),
    },
    {
      id: 'filter-all',
      title: 'Reset All Roster Filters',
      subtitle: 'Show all evaluated candidates across all experience bands',
      category: 'Filters',
      icon: <Filter size={15} style={{ color: '#64748b' }} />,
      run: () => onQuickFilter('All'),
    },

    // References
    {
      id: 'ref-lightbox',
      title: 'Open 20 Reference Designs Showcase',
      subtitle: 'Full-resolution gallery mapping all 20 reference designs from Downloads',
      category: 'References',
      icon: <Image size={15} style={{ color: '#ec4899' }} />,
      shortcut: 'Refs',
      run: onOpenReferences,
    },
  ];

  const filteredCommands = commands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filteredCommands[selectedIndex];
        if (cmd) {
          cmd.run();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        zIndex: 1200,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 620,
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Search size={18} style={{ color: '#94a3b8' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, view mode, or action..."
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: 14,
              fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontSize: 12,
                color: '#94a3b8',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                padding: '2px 6px',
                borderRadius: 4,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontFamily: 'monospace',
              }}
            >
              ESC
            </span>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                padding: 2,
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Command List */}
        <div
          style={{
            maxHeight: 380,
            overflowY: 'auto',
            padding: '8px 6px',
          }}
        >
          {filteredCommands.length === 0 ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: 13,
              }}
            >
              No commands matching "{query}"
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.run();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    border: isSelected ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {cmd.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: isSelected ? '#ffffff' : '#e2e8f0',
                        }}
                      >
                        {cmd.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>
                        {cmd.subtitle}
                      </div>
                    </div>
                  </div>

                  {cmd.shortcut && (
                    <span
                      style={{
                        fontSize: 12,
                        fontFamily: 'monospace',
                        color: isSelected ? '#93c5fd' : '#64748b',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        padding: '2px 6px',
                        borderRadius: 4,
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      {cmd.shortcut}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hint Bar */}
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#64748b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>
              Use <strong style={{ color: '#cbd5e1' }}>↑↓</strong> to navigate
            </span>
            <span>
              <strong style={{ color: '#cbd5e1' }}>↵</strong> to select
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Command size={11} />
            <span>K Quick Launcher</span>
          </div>
        </div>
      </div>
    </div>
  );
};
