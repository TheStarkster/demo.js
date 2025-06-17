import React from 'react';
import { MockBrowserProps } from './types';
import { defaultDimensions, isMobile, getBorderRadius, getHeaderHeight } from './utils';
import { browserThemes } from './themes';
import { SafariBrowser } from './components/SafariBrowser';
import { IOSSafariBrowser } from './components/IOSSafariBrowser';

export const MockBrowser: React.FC<MockBrowserProps> = ({
  type = 'safari',
  dimensions,
  style = {},
  className = '',
  children,
  url,
}) => {
  // Get browser-specific configurations
  const isMobileBrowser = isMobile(type);
  const borderRadius = getBorderRadius(type);
  const headerHeight = getHeaderHeight(type);
  const theme = browserThemes[type];

  // Use provided dimensions or defaults
  const finalDimensions = dimensions || defaultDimensions[type];

  // Container styles
  const containerStyle: React.CSSProperties = {
    width: finalDimensions.width,
    height: finalDimensions.height,
    border: `1px solid ${theme.borderColor}`,
    borderRadius,
    overflow: 'hidden',
    boxShadow: isMobileBrowser 
      ? '0 4px 20px rgba(0, 0, 0, 0.1)' 
      : '0 2px 10px rgba(0, 0, 0, 0.05)',
    background: theme.background,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    ...style,
  };

  // Apply horizontal centering for mobile browsers only if no margin-related props in style
  if (isMobileBrowser && 
      !('margin' in style) && 
      !('marginLeft' in style) && 
      !('marginRight' in style)) {
    containerStyle.marginLeft = 'auto';
    containerStyle.marginRight = 'auto';
  }

  // Render the appropriate browser component
  const renderBrowserContent = () => {
    const commonProps = {
      theme,
      headerHeight,
      url,
      children,
    };

    switch (type) {
      case 'safari':
        return <SafariBrowser {...commonProps} />;

      case 'ios-safari':
        return <IOSSafariBrowser {...commonProps} />;

      default:
        return <SafariBrowser {...commonProps} />;
    }
  };

  return (
    <div className={className} style={containerStyle}>
      {renderBrowserContent()}
    </div>
  );
};

export * from './types'; 
