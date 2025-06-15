import React, { useEffect, useState } from 'react';
import { CursorWrapper, CursorVariant } from '../src';
import { DemoProvider } from '../src/DemoContext';

const variants: CursorVariant[] = ['default', 'dot', 'arrow', 'circle', 'pointer'];

const boxStyle: React.CSSProperties = {
  position: 'relative',
  width: '160px',
  height: '160px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden'
};

const buttonStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  background: 'purple',
  cursor: 'pointer'
};

const labelStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '8px',
  left: 0,
  right: 0,
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: 600,
  pointerEvents: 'none'
};

const CursorPreview: React.FC<{ variant: CursorVariant }> = ({ variant }) => {
  const [active, setActive] = useState(false);
  const targetId = `preview-${variant}`;

  useEffect(() => {
    setActive(true);
    const interval = setInterval(() => {
      setActive(false);
      setTimeout(() => setActive(true), 50);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={boxStyle}>
      <button id={targetId} style={buttonStyle}>Click</button>
      <CursorWrapper
        variant={variant}
        isActive={active}
        action={{ type: 'click', target: `#${targetId}`, delay: 200 }}
      />
      <div style={labelStyle}>{variant}</div>
    </div>
  );
};

const CursorShowcase: React.FC = () => {
  return (
    <DemoProvider
      steps={[]}
      clickActiveColor="#4caf50"
    >
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', padding: '20px' }}>
        {variants.map(v => (
          <CursorPreview key={v} variant={v} />
        ))}
      </div>
    </DemoProvider>
  );
};

export default CursorShowcase;
