import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  message: string;
  title?: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastItem['type'], title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastItem['type'] = 'success', title?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, message, title };
      setToasts((prev) => [...prev.slice(-3), newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 3600);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Render Container - Centered Floating Obsidian Pill */}
      <div
        style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'none',
          maxWidth: 460,
          width: 'calc(100% - 32px)',
        }}
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isDanger = toast.type === 'danger';
          const isWarning = toast.type === 'warning';

          const iconColor = isSuccess
            ? '#10b981'
            : isDanger
            ? '#ef4444'
            : isWarning
            ? '#f59e0b'
            : '#818cf8';

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                background: '#0f172a',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 9999,
                padding: '9px 16px 9px 14px',
                boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(15, 23, 42, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backdropFilter: 'blur(8px)',
                animation: 'scaleIn 180ms ease-out forwards',
              }}
            >
              <div style={{ color: iconColor, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                {isSuccess && <CheckCircle2 size={16} />}
                {isDanger && <AlertCircle size={16} />}
                {isWarning && <AlertCircle size={16} />}
                {!isSuccess && !isDanger && !isWarning && <Info size={16} />}
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                {toast.title && (
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#ffffff' }}>
                    {toast.title}:
                  </span>
                )}
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: '#f8fafc',
                    lineHeight: 1.4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {toast.message}
                </span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 2,
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: 4,
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
