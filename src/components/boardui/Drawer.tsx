import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string;
  position?: 'right' | 'left';
}

/**
 * Official BoardUI Drawer Component
 * Figma source: Board UI -> Overlays -> Side Sheet Drawer
 * Features smooth sliding spring motion, backdrop blur, accessible ESC handler,
 * and header/body/footer architecture.
 */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 460,
  position = 'right',
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        justifyContent: position === 'right' ? 'flex-end' : 'flex-start',
      }}
    >
      {/* Blurred Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.35)',
          backdropFilter: 'blur(3px)',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Slide-over Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'relative',
          width,
          maxWidth: '90vw',
          height: '100%',
          background: '#ffffff',
          boxShadow: '-8px 0 28px rgba(15, 23, 42, 0.16)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          animation: 'boarduiDrawerSlide 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            background: '#ffffff',
          }}
        >
          <div>
            {title && (
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#0f172a',
                  letterSpacing: '-0.01em',
                  margin: 0,
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p style={{ fontSize: 12.5, color: '#64748b', marginTop: 2, margin: 0 }}>
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0f172a';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748b';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
          }}
        >
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 10,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
