import React from 'react';
import { BrowserTheme } from '../types';

interface FirefoxBrowserProps {
  theme: BrowserTheme;
  headerHeight: number;
  url?: string;
  children: React.ReactNode;
}

export const FirefoxBrowser: React.FC<FirefoxBrowserProps> = ({
  theme,
  headerHeight,
  url = 'https://example.com',
  children,
}) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          height: headerHeight,
          background: theme.headerBackground,
          borderBottom: `1px solid ${theme.borderColor}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          gap: 8,
        }}
      >
        {/* Controls */}
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
        </div>
        {/* URL bar */}
        <div
          style={{
            flex: 1,
            height: 24,
            background: theme.background,
            border: `1px solid ${theme.borderColor}`,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            padding: '0 8px',
            fontSize: 13,
            color: theme.textColor,
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{url}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, background: theme.background }}>{children}</div>
    </div>
  );
};

