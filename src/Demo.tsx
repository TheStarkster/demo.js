import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DemoProps } from './types';
import { DemoProvider, useDemo } from './DemoContext';
import { CursorWrapper, CursorVariant } from './components/cursors';
import { Scroll } from './Scroll';
import { DemoControls } from './DemoControls';
import Lenis from '@studio-freight/lenis'

// Custom easing function
const defaultEasingFunction = (t: number) => {
  return t < 0.8
    ? t * 1.05
    : 0.84 + (1 - 0.84) * (1 - Math.pow(1 - (t - 0.8) * 5, 2));
};

// Default values
const DEFAULT_FADE_IN_DURATION = 300; // ms
const DEFAULT_FADE_OUT_DURATION = 200; // ms

// Content wrapper that prevents parent re-renders when content updates
const ContentWrapper: React.FC<{ content: React.ReactNode }> = React.memo(({ content }) => {
  return <>{content}</>;
});

const DemoContent: React.FC<{
  cursorSize?: number;
  cursorColor?: string;
  cursorVariant?: string;
  defaultTransitionDirection?: 'x' | 'y';
  defaultEasing?: (t: number) => number;
  defaultFadeInDuration?: number;
  defaultFadeOutDuration?: number;
  defaultFadeInEasing?: (t: number) => number;
  defaultFadeOutEasing?: (t: number) => number;
}> = ({
  cursorSize,
  cursorColor,
  cursorVariant = 'default',
  defaultTransitionDirection = 'x',
  defaultEasing = defaultEasingFunction,
  defaultFadeInDuration = DEFAULT_FADE_IN_DURATION,
  defaultFadeOutDuration = DEFAULT_FADE_OUT_DURATION,
  defaultFadeInEasing,
  defaultFadeOutEasing,
}) => {
    const {
      steps,
      currentStepIndex,
      isPlaying,
      isTransitioning,
      isFadingIn,
      isCursorActive,
    } = useDemo();

    const currentStep = steps[currentStepIndex];

    // Apply defaults or specific step values
    const fadeInDuration = currentStep.fadeInDuration ?? defaultFadeInDuration;
    const fadeOutDuration = currentStep.fadeOutDuration ?? defaultFadeOutDuration;
    const transitionDirection = currentStep.transitionDirection ?? defaultTransitionDirection;

    // Determine the easing functions to use
    const generalEasing = currentStep.customEasing ?? defaultEasing;
    const fadeInEasing = currentStep.fadeInEasing ?? defaultFadeInEasing ?? generalEasing;
    const fadeOutEasing = currentStep.fadeOutEasing ?? defaultFadeOutEasing ?? generalEasing;

    // Animation variants for step transitions
    const stepVariants = useMemo(() => ({
      hidden: {
        opacity: 0,
        ...(transitionDirection === 'x' ? { x: 20 } : { y: 20 }),
      },
      visible: {
        opacity: 1,
        ...(transitionDirection === 'x' ? { x: 0 } : { y: 0 }),
        transition: {
          duration: fadeInDuration / 1000,
          ease: fadeInEasing,
        }
      },
      exit: {
        opacity: 0,
        ...(transitionDirection === 'x' ? { x: -20 } : { y: -20 }),
        transition: {
          duration: fadeOutDuration / 1000,
          ease: fadeOutEasing,
        }
      }
    }), [transitionDirection, fadeInDuration, fadeOutDuration, fadeInEasing, fadeOutEasing]);

    // Show scroll animations only when not in fading or transition states
    const shouldActivateScroll = isPlaying && !isTransitioning && !isFadingIn && !!currentStep.scroll;

    // Create a stable key for the current step that won't change on content re-renders
    const stepKey = useMemo(() => `step-${currentStep.id}`, [currentStep.id]);

    return (
      <div className="demo-js-container" style={{ position: 'relative' }}>
        {/* Step content with animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stepKey}
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="demo-js-step"
          >
            <ContentWrapper content={currentStep.content} />
          </motion.div>
        </AnimatePresence>

        {/* Cursor animations */}
        <CursorWrapper
          action={currentStep.cursor}
          isActive={isCursorActive}
          size={cursorSize}
          color={cursorColor}
          variant={cursorVariant as CursorVariant}
        />

        {/* Scroll animations */}
        <Scroll
          action={currentStep.scroll}
          isActive={shouldActivateScroll}
        />

        {/* Demo controls */}
        <DemoControls />
      </div>
    );
  };

export const Demo: React.FC<DemoProps> = ({
  steps,
  autoPlay = false,
  loop = false,
  cursorSize,
  cursorColor,
  cursorVariant = 'arrow',
  defaultTransitionDirection = 'x',
  defaultEasing = defaultEasingFunction,
  defaultFadeInDuration = DEFAULT_FADE_IN_DURATION,
  defaultFadeOutDuration = DEFAULT_FADE_OUT_DURATION,
  defaultFadeInEasing,
  defaultFadeOutEasing,
  visualClickInactiveColor,
  visualClickActiveColor,
  onStepComplete,
  onComplete,
}) => {
  return (
      <DemoProvider
        steps={steps}
        autoPlay={autoPlay}
        loop={loop}
        clickInactiveColor={visualClickInactiveColor}
        clickActiveColor={visualClickActiveColor}
        onStepComplete={onStepComplete}
        onComplete={onComplete}
      >
        <DemoContent
          cursorSize={cursorSize}
          cursorColor={cursorColor}
          cursorVariant={cursorVariant}
          defaultTransitionDirection={defaultTransitionDirection}
          defaultEasing={defaultEasing}
          defaultFadeInDuration={defaultFadeInDuration}
          defaultFadeOutDuration={defaultFadeOutDuration}
          defaultFadeInEasing={defaultFadeInEasing}
          defaultFadeOutEasing={defaultFadeOutEasing}
        />
      </DemoProvider>
  );
}; 