import React from 'react';
import { BrowserTheme } from '../types';

interface SafariBrowserProps {
  theme: BrowserTheme;
  headerHeight: number;
  url?: string;
  children: React.ReactNode;
}

export const SafariBrowser: React.FC<SafariBrowserProps> = ({
  theme,
  headerHeight,
  url = 'https://example.com',
  children,
}) => {
  // Extract domain name from URL
  const getDomainName = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return url.replace(/^https?:\/\//, '').split('/')[0];
    }
  };

  const domainName = getDomainName(url);

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
        {/* Traffic lights - Safari style with symbols */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#ff5f57',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 8,
              color: '#a02622',
            }}
          >
            ×
          </div>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#febc2e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 8,
              color: '#8f6000',
            }}
          >
            −
          </div>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#28c840',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 8,
              color: '#0f5132',
            }}
          >
            +
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Small address bar - macOS Safari style */}
        <div
          style={{
            width: '35%',
            height: 22,
            background: theme.background,
            border: `1px solid ${theme.borderColor}`,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            padding: '0 8px',
            fontSize: 12,
            color: theme.textColor,
            position: 'relative',
            justifyContent: 'center',
          }}
        >
          <span style={{ marginRight: 6, fontSize: 10 }}>🔒</span>
          <span style={{ fontWeight: 500 }}>
            {domainName}
          </span>
          
          {/* Reload button */}
          <div style={{ 
            position: 'absolute', 
            right: 6, 
            cursor: 'pointer', 
            fontSize: 12,
            color: '#888'
          }}>
            ↻
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, background: theme.background }}>
        {children}
      </div>
    </div>
  );
}; 
