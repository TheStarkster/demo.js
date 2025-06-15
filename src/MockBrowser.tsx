import React from 'react';

export type BrowserType =
  | 'safari'
  | 'chrome'
  | 'ios-safari'
  | 'android-chrome';

export interface MockBrowserProps {
  type?: BrowserType;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const MockBrowser: React.FC<MockBrowserProps> = ({
  type = 'chrome',
  style = {},
  children,
}) => {
  const isMobile = type === 'ios-safari' || type === 'android-chrome';
  const borderRadius = isMobile ? 20 : 8;

  const headerStyle: React.CSSProperties = {
    height: isMobile ? 40 : 28,
    background: '#f2f2f2',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    padding: isMobile ? '0 12px' : '0 8px',
    gap: 6,
  };

  const dot = (color: string) => (
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: color,
      }}
    />
  );

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius,
        overflow: 'hidden',
        width: isMobile ? 375 : '100%',
        margin: '0 auto',
        ...style,
      }}
    >
      <div style={headerStyle}>
        {isMobile ? (
          <div style={{ flex: 1, textAlign: 'center', fontSize: 12 }}>
            {type === 'ios-safari' ? 'Safari' : 'Chrome'}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 4 }}>
            {dot('#ff5f57')}
            {dot('#febc2e')}
            {dot('#28c840')}
          </div>
        )}
      </div>
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
};
