import React from 'react';
import { motion } from 'framer-motion';
import { BaseCursorProps } from './types';
import { BaseCursor } from './BaseCursor';
import { hexToRgba } from './utils';

export const DotCursor: React.FC<BaseCursorProps> = (props) => {
  const { size = 16, color = '#FF5757' } = props;
  const clickColor = hexToRgba(color, 0.7);

  return (
    <BaseCursor
      {...props}
      renderCursor={(isClicking) => (
        <motion.div
          animate={{ 
            scale: isClicking ? 1.5 : 1,
            backgroundColor: isClicking ? clickColor : color,
          }}
          transition={{ duration: 0.2 }}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: color,
            transform: `translate(-${size / 2}px, -${size / 2}px)`,
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
          }}
        />
      )}
    />
  );
}; 