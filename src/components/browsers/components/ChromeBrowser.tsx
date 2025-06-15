import React from 'react';
import { BrowserTheme } from '../types';

interface ChromeBrowserProps {
  theme: BrowserTheme;
  headerHeight: number;
  url?: string;
  children: React.ReactNode;
}

export const ChromeBrowser: React.FC<ChromeBrowserProps> = ({
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
          gap: 12,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 6 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#ff5f57',
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#febc2e',
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#28c840',
            }}
          />
        </div>

        {/* Simple URL bar */}
        <div
          style={{
            flex: 1,
            height: 24,
            background: theme.background,
            border: `1px solid ${theme.borderColor}`,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            fontSize: 13,
            color: theme.textColor,
          }}
        >
          <span style={{ marginRight: 6 }}>🔒</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
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