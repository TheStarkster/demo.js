import React from 'react';
import { motion } from 'framer-motion';
import { BaseCursorProps } from './types';
import { BaseCursor } from './BaseCursor';
import { hexToRgba } from './utils';

export const CircleCursor: React.FC<BaseCursorProps> = (props) => {
  const { size = 40, color = '#FF5757' } = props;
  const transparentColor = 'rgba(0, 0, 0, 0)';
  const clickBackgroundColor = hexToRgba(color, 0.1);

  return (
    <BaseCursor
      {...props}
      renderCursor={(isClicking) => (
        <motion.div
          animate={{ 
            scale: isClicking ? 0.9 : 1,
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
              scale: isClicking ? 0.7 : 1 
            }}
            transition={{ duration: 0.2 }}
            style={{
              width: size - 10,
              height: size - 10,
              borderRadius: '50%',
              border: `2px dashed ${hexToRgba(color, 0.5)}`,
            }}
          />
        </motion.div>
      )}
    />
  );
}; 