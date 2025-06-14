import React from 'react';
import { motion } from 'framer-motion';
import { useDemo } from './DemoContext';

// Custom easing function
const customEasing = (t: number) => {
  return t < 0.8 
    ? t * 1.05 
    : 0.84 + (1 - 0.84) * (1 - Math.pow(1 - (t - 0.8) * 5, 2));
};

export const DemoControls: React.FC = () => {
  const {
    currentStepIndex,
    steps,
    isPlaying,
    isTransitioning,
    isFadingIn,
    goToNextStep,
    goToPrevStep,
    play,
    pause,
    reset,
  } = useDemo();

  // Button animation variants
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  // Determine if controls should be disabled during animations
  const isAnimating = isTransitioning || isFadingIn;
  const isPrevDisabled = currentStepIndex === 0 || isAnimating;
  const isNextDisabled = (currentStepIndex === steps.length - 1) || isAnimating;
  const isPlayPauseDisabled = isAnimating;
  const isResetDisabled = isAnimating;

  // Button styling and handlers
  const buttonStyle = {
    base: {
      border: 'none',
      color: 'white',
      padding: '5px 10px',
      borderRadius: '4px',
      transition: 'opacity 0.2s, background-color 0.2s',
      cursor: 'pointer',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    }
  };

  const handlePrevClick = () => {
    if (!isPrevDisabled) {
      goToPrevStep();
    }
  };

  const handleNextClick = () => {
    if (!isNextDisabled) {
      goToNextStep();
    }
  };

  const handlePlayPauseClick = () => {
    if (!isPlayPauseDisabled) {
      isPlaying ? pause() : play();
    }
  };

  const handleResetClick = () => {
    if (!isResetDisabled) {
      reset();
    }
  };

  return (
    <motion.div 
      className="demo-js-controls" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: customEasing }}
      style={{ 
        position: 'fixed', 
        bottom: 20, 
        left: '50%', 
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '10px 15px',
        borderRadius: '8px',
        zIndex: 1000,
      }}
    >
      {/* Previous button */}
      <motion.button 
        onClick={handlePrevClick} 
        disabled={isPrevDisabled}
        variants={buttonVariants}
        initial="idle"
        whileHover={!isPrevDisabled ? "hover" : "idle"}
        whileTap={!isPrevDisabled ? "tap" : "idle"}
        style={{
          ...buttonStyle.base,
          backgroundColor: '#555',
          ...(isPrevDisabled ? buttonStyle.disabled : {}),
        }}
      >
        Prev
      </motion.button>
      
      {/* Play/Pause button */}
      <motion.button 
        onClick={handlePlayPauseClick}
        disabled={isPlayPauseDisabled}
        variants={buttonVariants}
        initial="idle"
        whileHover={!isPlayPauseDisabled ? "hover" : "idle"}
        whileTap={!isPlayPauseDisabled ? "tap" : "idle"}
        style={{
          ...buttonStyle.base,
          backgroundColor: isPlaying ? '#ff5757' : '#4caf50',
          ...(isPlayPauseDisabled ? buttonStyle.disabled : {}),
        }}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </motion.button>
      
      {/* Next button */}
      <motion.button 
        onClick={handleNextClick}
        disabled={isNextDisabled}
        variants={buttonVariants}
        initial="idle"
        whileHover={!isNextDisabled ? "hover" : "idle"}
        whileTap={!isNextDisabled ? "tap" : "idle"}
        style={{
          ...buttonStyle.base,
          backgroundColor: '#555',
          ...(isNextDisabled ? buttonStyle.disabled : {}),
        }}
      >
        Next
      </motion.button>
      
      {/* Reset button */}
      <motion.button 
        onClick={handleResetClick}
        disabled={isResetDisabled}
        variants={buttonVariants}
        initial="idle"
        whileHover={!isResetDisabled ? "hover" : "idle"}
        whileTap={!isResetDisabled ? "tap" : "idle"}
        style={{
          ...buttonStyle.base,
          backgroundColor: '#888',
          ...(isResetDisabled ? buttonStyle.disabled : {}),
        }}
      >
        Reset
      </motion.button>
    </motion.div>
  );
}; 