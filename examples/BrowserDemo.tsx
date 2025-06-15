import React, { useState } from 'react';
import { Demo, createStep, MockBrowser, BrowserType } from '../src';

const BrowserDemo: React.FC = () => {
  const [browser, setBrowser] = useState<BrowserType>('chrome');
  const steps = [
    createStep({
      name: 'Welcome',
      content: (
        <div className="demo-step">
          <h2>Mock Browser Demo</h2>
          <p>Select a browser style using the dropdown below.</p>
        </div>
      ),
      duration: 3000,
    }),
    createStep({
      name: 'Second',
      content: (
        <div className="demo-step">
          <p>The demo is running inside a simulated browser frame.</p>
        </div>
      ),
      duration: 3000,
    }),
  ];

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <select value={browser} onChange={(e) => setBrowser(e.target.value as BrowserType)} style={{ marginBottom: '10px' }}>
        <option value="chrome">Chrome</option>
        <option value="safari">Safari</option>
        <option value="ios-safari">iOS Safari (mobile)</option>
        <option value="android-chrome">Android Chrome (mobile)</option>
      </select>
      <MockBrowser type={browser} style={{ marginTop: 10 }}>
        <Demo steps={steps} autoPlay loop={false} />
      </MockBrowser>
    </div>
  );
};

export default BrowserDemo;
