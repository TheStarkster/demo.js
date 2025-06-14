import React from 'react';
import { motion } from 'framer-motion';
import { BaseCursorProps } from './types';
import { BaseCursor } from './BaseCursor';

export const PointerCursor: React.FC<BaseCursorProps> = (props) => {
  const { size = 30, color = '#FF5757' } = props;

  return (
    <BaseCursor
      {...props}
      renderCursor={(isClicking) => (
        <motion.div
          animate={{ 
            scale: isClicking ? 0.9 : 1,
            y: isClicking ? 3 : 0,
          }}
          transition={{ duration: 0.2 }}
          style={{
            width: size,
            height: size,
            transform: `translate(-${size / 8}px, -${size / 4}px)`,
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
              d="M7 2L7 15L10 12L14 16L17 13L13 9L16 6L7 2Z" 
              fill="white" 
              stroke={color} 
              strokeWidth="1.5" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}
    />
  );
}; 