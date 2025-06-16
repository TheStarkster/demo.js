import React from 'react';
import { BrowserTheme } from '../types';

interface EdgeBrowserProps {
  theme: BrowserTheme;
  headerHeight: number;
  url?: string;
  children: React.ReactNode;
}

export const EdgeBrowser: React.FC<EdgeBrowserProps> = ({
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
          justifyContent: 'space-between',
          padding: '0 8px',
        }}
      >
        {/* URL bar */}
        <div
          style={{
            flex: 1,
            height: 24,
            background: theme.background,
            border: `1px solid ${theme.borderColor}`,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            padding: '0 8px',
            fontSize: 13,
            color: theme.textColor,
            marginRight: 8,
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{url}</span>
        </div>
        {/* Controls */}
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ fontSize: 10, padding: '2px 4px' }}>&#x2013;</div>
          <div style={{ fontSize: 10, padding: '2px 4px' }}>&#x25A1;</div>
          <div style={{ fontSize: 10, padding: '2px 4px', color: '#e81123' }}>×</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, background: theme.background }}>{children}</div>
    </div>
  );
};

