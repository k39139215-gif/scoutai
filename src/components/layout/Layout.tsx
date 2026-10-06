import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* 1. Left Narrow Sidebar Rail (164px) */}
      <Sidebar
        isOpenOnMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Application Surface */}
      <div
        id="main"
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          background: 'var(--bg)',
        }}
      >
        {/* Top Utility Bar */}
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Global Status Strip */}
        <div
          style={{
            padding: '7px 24px',
            background: '#fafafa',
            borderBottom: '1px solid var(--line)',
            fontSize: 12.5,
            color: '#71717a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600, color: '#18181b' }}>ScoutAI Enterprise</span>
            <span>•</span>
            <span>247 active candidates in talent pool · Real-time advisory rankings</span>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#15803d',
              background: '#dcfce7',
              padding: '2px 8px',
              borderRadius: 4,
              border: '1px solid #bbf7d0',
            }}
          >
            LIVE WORKSPACE
          </span>
        </div>

        {/* Dynamic Screen View (Spacious, Scrollable Canvas) */}
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
          <div style={{ padding: '20px 24px 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
