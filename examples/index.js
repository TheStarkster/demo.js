import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ComprehensiveDemo from './ComprehensiveDemo';
import CursorShowcase from './CursorShowcase';

const tabButton = (active) => ({
  padding: '8px 16px',
  border: 'none',
  borderBottom: active ? '2px solid #3498db' : '2px solid transparent',
  background: 'transparent',
  cursor: 'pointer',
  fontWeight: active ? 'bold' : 'normal'
});

const App = () => {
  const [tab, setTab] = useState('demo');
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
        <button style={tabButton(tab === 'demo')} onClick={() => setTab('demo')}>Comprehensive Demo</button>
        <button style={tabButton(tab === 'cursors')} onClick={() => setTab('cursors')}>Cursor Showcase</button>
      </div>
      {tab === 'demo' ? <ComprehensiveDemo /> : <CursorShowcase />}
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
