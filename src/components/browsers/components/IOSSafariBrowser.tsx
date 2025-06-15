import React from 'react';
import { BrowserTheme } from '../types';

interface IOSSafariBrowserProps {
  theme: BrowserTheme;
  headerHeight: number;
  url?: string;
  children: React.ReactNode;
}

export const IOSSafariBrowser: React.FC<IOSSafariBrowserProps> = ({
  theme,
  headerHeight,
  url = 'https://example.com',
  children,
}) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Simple status bar */}
      <div
        style={{
          height: 20,
          background: theme.headerBackground,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 600,
          color: theme.textColor,
        }}
      >
        9:41 AM
      </div>

      {/* Header with URL bar */}
      <div
        style={{
          height: headerHeight - 20,
          background: theme.headerBackground,
          borderBottom: `1px solid ${theme.borderColor}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
        }}
      >
        {/* Simple URL/Search bar */}
        <div
          style={{
            flex: 1,
            height: 32,
            background: theme.background,
            border: `1px solid ${theme.borderColor}`,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            fontSize: 14,
            color: theme.textColor,
          }}
        >
          <span style={{ marginRight: 8 }}>🔍</span>
          <span
            style={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {url}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, background: theme.background }}>
        {children}
      </div>
    </div>
  );
}; 