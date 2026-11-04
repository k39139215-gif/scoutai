import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', background: 'var(--bg-canvas)' }}>
      {/* 1. Left Navigation Rail (248px) */}
      <Sidebar
        isOpenOnMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Workspace Canvas */}
      <div
        id="main"
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          background: 'var(--bg-canvas)',
        }}
      >
        {/* Crisp Header */}
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Dynamic Screen View */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
          className="main-workspace-scroll"
        >
          <div
            style={{
              maxWidth: 1600,
              width: '100%',
              margin: '0 auto',
              padding: '24px 32px 48px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
