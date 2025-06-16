import React, { useState } from 'react';
import { MockBrowser } from './MockBrowser';
import { BrowserType } from './types';

interface BrowserShowcaseProps {
  children?: React.ReactNode;
}

export const BrowserShowcase: React.FC<BrowserShowcaseProps> = ({ 
  children = <div style={{ padding: 20, textAlign: 'center' }}>
    <h2>Sample Content</h2>
    <p>This is sample content displayed within the browser mockup.</p>
    <button style={{ padding: '8px 16px', marginTop: 16 }}>Click me</button>
  </div>
}) => {
  const [selectedBrowser, setSelectedBrowser] = useState<BrowserType>('chrome');
  const [customUrl, setCustomUrl] = useState('https://example.com');

  const browserTypes: BrowserType[] = [
    'chrome',
    'safari', 
    'firefox',
    'edge',
    'ios-safari',
    'android-chrome'
  ];

  return (
    <div style={{ padding: 20, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <h1 style={{ marginBottom: 30, textAlign: 'center' }}>Simplified Browser Mockups</h1>
      
      {/* Controls */}
      <div style={{ 
        marginBottom: 30, 
        padding: 20, 
        background: '#f8f9fa', 
        borderRadius: 8,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 20,
        alignItems: 'center'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: 500 }}>Browser Type:</label>
          <select 
            value={selectedBrowser} 
            onChange={(e) => setSelectedBrowser(e.target.value as BrowserType)}
            style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ddd' }}
          >
            {browserTypes.map(browser => (
              <option key={browser} value={browser}>
                {browser.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: 500 }}>URL:</label>
          <input 
            type="text" 
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ddd', width: 200 }}
            placeholder="https://example.com"
          />
        </div>
      </div>

      {/* Browser Demo */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: 20,
        background: '#ffffff',
        borderRadius: 8,
        minHeight: 400,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <MockBrowser
          type={selectedBrowser}
          url={customUrl}
        >
          {children}
        </MockBrowser>
      </div>

      {/* Feature List */}
      <div style={{ marginTop: 40 }}>
        <h2>Features</h2>
        <ul style={{ lineHeight: 1.6 }}>
          <li><strong>6 Browser Types:</strong> Chrome, Safari, Firefox, Edge, iOS Safari, Android Chrome</li>
          <li><strong>Simple & Clean:</strong> Focused on essential visual elements that make each browser recognizable</li>
          <li><strong>Responsive:</strong> Automatic mobile vs desktop layout</li>
          <li><strong>Customizable URL:</strong> Show your own URL in the address bar</li>
          <li><strong>Lightweight:</strong> No complex configuration needed</li>
          <li><strong>TypeScript:</strong> Full type safety</li>
        </ul>
      </div>

      {/* Usage Examples */}
      <div style={{ marginTop: 40 }}>
        <h2>Usage Examples</h2>
        <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, fontFamily: 'monospace' }}>
          <pre>{`// Basic usage
<MockBrowser type="chrome">
  <YourContent />
</MockBrowser>

// With custom URL
<MockBrowser 
  type="safari"
  url="https://yoursite.com"
>
  <YourWebsite />
</MockBrowser>

// Mobile browser
<MockBrowser
  type="ios-safari"
  url="https://app.com"
>
  <YourMobileApp />
</MockBrowser>`}</pre>
        </div>
      </div>
    </div>
  );
}; 
