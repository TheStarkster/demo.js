import React from 'react';
import { motion } from 'framer-motion';
import { BaseCursorProps } from './types';
import { BaseCursor } from './BaseCursor';
import { hexToRgba } from './utils';

export const DefaultCursor: React.FC<BaseCursorProps> = (props) => {
  const { size = 24, color = '#FF5757' } = props;
  const transparentColor = 'rgba(0, 0, 0, 0)';
  const clickBackgroundColor = hexToRgba(color, 0.2);

  return (
    <BaseCursor
      {...props}
      renderCursor={(isClicking) => (
        <motion.div
          animate={{ 
            scale: isClicking ? 0.8 : 1,
            backgroundColor: isClicking ? clickBackgroundColor : transparentColor
          }}
          transition={{ duration: 0.2 }}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `translate(-${size / 2}px, -${size / 2}px)`,
          }}
        >
          <motion.div
            animate={{ 
              scale: isClicking ? 1.5 : 1 
            }}
            transition={{ duration: 0.2 }}
            style={{
              width: 4,
              height: 4,
              backgroundColor: color,
              borderRadius: '50%',
            }}
          />
        </motion.div>
      )}
    />
  );
}; 