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
      {/* iOS Status bar */}
      <div
        style={{
          height: 44,
          background: theme.headerBackground,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          fontSize: 12,
          fontWeight: 600,
          color: theme.textColor,
        }}
      >
        <div>9:41</div>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <div>📶</div>
          <div>📡</div>
          <div>🔋</div>
        </div>
      </div>

      {/* Header with URL bar */}
      <div
        style={{
          height: headerHeight,
          background: theme.headerBackground,
          borderBottom: `1px solid ${theme.borderColor}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          justifyContent: 'center',
        }}
      >
        {/* iOS Safari URL bar */}
        <div
          style={{
            width: '90%',
            height: 32,
            background: '#e9e9eb',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 12px',
            fontSize: 14,
            color: '#000',
            fontWeight: 500,
          }}
        >
          <span style={{ marginRight: 8, fontSize: 12 }}>🔒</span>
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {domainName}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, background: theme.background }}>
        {children}
      </div>

      {/* Bottom toolbar */}
      <div
        style={{
          height: 44,
          background: theme.headerBackground,
          borderTop: `1px solid ${theme.borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 16px',
        }}
      >
        <div style={{ fontSize: 16 }}>◀</div>
        <div style={{ fontSize: 16 }}>▶</div>
        <div style={{ fontSize: 16 }}>□</div>
        <div style={{ fontSize: 16 }}>⊕</div>
        <div style={{ fontSize: 16 }}>≡</div>
      </div>
    </div>
  );
}; 
