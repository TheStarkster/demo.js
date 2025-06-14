import React from 'react';
import { createRoot } from 'react-dom/client';
import ComprehensiveDemo from './ComprehensiveDemo';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ComprehensiveDemo />
  </React.StrictMode>
); 