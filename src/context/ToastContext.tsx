import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  message: string;
  title?: string;
  action?: ToastAction;
}

interface ToastContextType {
  showToast: (
    message: string,
    type?: ToastItem['type'],
    actionOrTitle?: ToastAction | string,
    title?: string
  ) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      message: string,
      type: ToastItem['type'] = 'success',
      actionOrTitle?: ToastAction | string,
      title?: string
    ) => {
      let action: ToastAction | undefined;
      let finalTitle = title;

      if (typeof actionOrTitle === 'string') {
        finalTitle = actionOrTitle;
      } else if (actionOrTitle && typeof actionOrTitle === 'object' && 'label' in actionOrTitle) {
        action = actionOrTitle;
      }

      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, message, title: finalTitle, action };
      setToasts((prev) => [...prev.slice(-3), newToast]);

      // Give 5.5s if an undo action is attached, otherwise 3.6s
      const timeoutMs = action ? 5500 : 3600;
      setTimeout(() => {
        removeToast(id);
      }, timeoutMs);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Render Container - ScoutAI Native Light Floating Pill (Bottom Right) */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 8,
          pointerEvents: 'none',
          maxWidth: 460,
        }}
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isDanger = toast.type === 'danger';
          const isWarning = toast.type === 'warning';

          const iconBg = isSuccess
            ? '#f0fdf4'
            : isDanger
            ? '#fef2f2'
            : isWarning
            ? '#fffbeb'
            : '#eef2ff';

          const iconBorder = isSuccess
            ? '#bbf7d0'
            : isDanger
            ? '#fecaca'
            : isWarning
            ? '#fde68a'
            : '#c7d2fe';

          const iconColor = isSuccess
            ? '#166534'
            : isDanger
            ? '#991b1b'
            : isWarning
            ? '#92400e'
            : '#4338ca';

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '10px 14px 10px 12px',
                boxShadow:
                  '0 12px 32px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(15, 23, 42, 0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                maxWidth: 460,
                userSelect: 'none',
                animation: 'boarduiToastEnter 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 7,
                  background: iconBg,
                  border: `1px solid ${iconBorder}`,
                  color: iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isSuccess && <CheckCircle2 size={14} strokeWidth={2.2} />}
                {isDanger && <AlertCircle size={14} strokeWidth={2.2} />}
                {isWarning && <AlertCircle size={14} strokeWidth={2.2} />}
                {!isSuccess && !isDanger && !isWarning && <Info size={14} strokeWidth={2.2} />}
              </div>

              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                {toast.title && (
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                    {toast.title}:
                  </span>
                )}
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#1e293b',
                    lineHeight: 1.4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {toast.message}
                </span>
              </div>

              {/* Action Button (e.g. Undo for non-revertible actions) */}
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginLeft: 6,
                    flexShrink: 0,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
                    transition: 'background 0.12s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#334155')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#0f172a')}
                >
                  {toast.action.label}
                </button>
              )}

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss notification"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 3,
                  marginLeft: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 9999,
                  transition: 'color 0.12s ease, background-color 0.12s ease',
                  outline: 'none',
                  boxShadow: 'none',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#0f172a';
                  e.currentTarget.style.background = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <X size={13} strokeWidth={2} />
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
