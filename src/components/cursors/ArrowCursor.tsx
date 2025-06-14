import React from 'react';
import { motion } from 'framer-motion';
import { BaseCursorProps } from './types';
import { BaseCursor } from './BaseCursor';
import { hexToRgba } from './utils';

export const ArrowCursor: React.FC<BaseCursorProps> = (props) => {
  const { size = 24, color = '#FF5757' } = props;
  const clickBackgroundColor = hexToRgba(color, 0.2);

  return (
    <BaseCursor
      {...props}
      renderCursor={(isClicking) => (
        <motion.div
          animate={{ 
            scale: isClicking ? 0.8 : 1,
            rotate: isClicking ? 5 : 0,
          }}
          transition={{ duration: 0.2 }}
          style={{
            width: size,
            height: size,
            transform: `translate(-${size / 4}px, -${size / 4}px)`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M3 2L12 21L15 14L22 11L3 2Z" 
              fill={isClicking ? clickBackgroundColor : 'white'} 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}
    />
  );
}; 