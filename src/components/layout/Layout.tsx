import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenOnMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          background: 'var(--color-bg-canvas)',
        }}
      >
        {/* Header */}
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Global Demo Notice Strip (Clean & Restrained) */}
        <div
          style={{
            padding: '7px 24px',
            background: 'var(--color-bg-subtle)',
            borderBottom: '1px solid var(--color-divider)',
            fontSize: '11.5px',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div>
            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>ScoutAI Prototype</span>
            <span style={{ margin: '0 6px', color: 'var(--color-border-hover)' }}>•</span>
            <span>247 simulated candidate records. AI recommendations are advisory with human recruiter oversight.</span>
          </div>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontWeight: 500,
            }}
            className="demo-stamp"
          >
            Demo Environment
          </span>
        </div>

        {/* Dynamic Screen View */}
        <main
          style={{
            flex: 1,
            padding: '24px 32px 48px',
            maxWidth: 1400,
            width: '100%',
            margin: '0 auto',
          }}
          className="main-view-container"
        >
          <div className="view-container">
            {children}
          </div>
        </main>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 1024px) {
          .main-view-container {
            padding: 20px 20px 40px !important;
          }
        }
        @media (max-width: 768px) {
          .demo-stamp {
            display: none !important;
          }
          .main-view-container {
            padding: 16px 14px 32px !important;
          }
        }
      `}</style>
    </div>
  );
};
