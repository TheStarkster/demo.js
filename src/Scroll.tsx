import React, { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { ScrollAction } from './types';

interface ScrollProps {
  action?: ScrollAction;
  isActive: boolean;
}

// Custom easing function
const customEasing = (t: number) => {
  return t < 0.8 
    ? t * 1.05 
    : 0.84 + (1 - 0.84) * (1 - Math.pow(1 - (t - 0.8) * 5, 2));
};

// Animation frame function to update Lenis
const rafFunction = (time: number) => {
  if (globalLenis) {
    globalLenis.raf(time);
  }
  requestAnimationFrame(rafFunction);
};

// Create a global lenis instance to prevent multiple instances
let globalLenis: Lenis | null = null;

export const Scroll: React.FC<ScrollProps> = ({ action, isActive }) => {
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const isScrollingRef = useRef<boolean>(false);
  const lastActionRef = useRef<ScrollAction | null>(null);

  // Clear all timers to prevent memory leaks
  const clearAllTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  };

  // Add a new timer and track it for cleanup
  const addTimer = (callback: () => void, delay: number): NodeJS.Timeout => {
    const timer = setTimeout(() => {
      // Remove this timer from the list when it executes
      timersRef.current = timersRef.current.filter(t => t !== timer);
      // Execute the callback
      callback();
    }, delay);
    
    // Add to the list of active timers
    timersRef.current.push(timer);
    return timer;
  };

  // Initialize Lenis
  useEffect(() => {
    // Initialize Lenis only once, globally
    if (!globalLenis) {
      try {
        globalLenis = new Lenis({
          duration: 1.2,
          easing: customEasing,
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
        });

        // Start the animation loop
        requestAnimationFrame(rafFunction);
        
        console.log('Lenis scroll initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Lenis:', error);
      }
    }

    // Cleanup function for component unmount
    return () => {
      clearAllTimers();
    };
  }, []);

  // Reset scrolling state when action changes
  useEffect(() => {
    // If the action changes, we should reset the scrolling state
    if (action && lastActionRef.current !== action) {
      lastActionRef.current = action;
      isScrollingRef.current = false;
    }
  }, [action]);

  // Execute scroll actions when active
  useEffect(() => {
    if (!isActive || !action || !globalLenis) {
      return;
    }

    // Skip if already scrolling
    if (isScrollingRef.current) {
      return;
    }

    // Clear any existing timers
    clearAllTimers();

    const delay = action.delay || 0;
    
    // Calculate scroll amount
    let scrollAmount = 0;
    if (typeof action.amount === 'number') {
      scrollAmount = action.amount;
    } else if (typeof action.amount === 'string' && action.amount.includes('%')) {
      const percentage = parseFloat(action.amount) / 100;
      scrollAmount = window.innerHeight * percentage;
    }

    // Adjust for scroll direction
    if (action.type === 'up') {
      scrollAmount = -scrollAmount;
    }

    console.log(`Starting scroll ${action.type} ${action.amount} after ${delay}ms delay`);

    // Set timeout for the scroll action
    addTimer(() => {
      try {
        isScrollingRef.current = true;
        const targetPosition = window.scrollY + scrollAmount;
        
        // Calculate duration based on speed or default to 1000ms
        const duration = action.speed 
          ? Math.abs(scrollAmount) / action.speed * 1000 
          : 1000;
        
        console.log(`Scrolling to Y: ${targetPosition}, duration: ${duration}ms`);
        
        // Fallback to window.scrollTo if Lenis fails
        const handleScrollFailure = () => {
          console.warn('Falling back to standard scroll');
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Mark scrolling as complete after animation
          addTimer(() => {
            isScrollingRef.current = false;
            console.log('Scroll animation completed (fallback)');
          }, duration);
        };
        
        try {
          // Use Lenis for smooth scrolling
          if (globalLenis) {
            globalLenis.scrollTo(targetPosition, {
              duration,
              easing: customEasing,
              immediate: false,
              onComplete: () => {
                isScrollingRef.current = false;
                console.log('Scroll animation completed');
              }
            });
          } else {
            handleScrollFailure();
          }
        } catch (error) {
          console.error('Lenis scroll failed:', error);
          handleScrollFailure();
        }
      } catch (error) {
        console.error('Scroll action failed:', error);
        isScrollingRef.current = false;
      }
    }, delay);

    return () => {
      clearAllTimers();
    };
  }, [action, isActive]);

  return null; // This component doesn't render anything
}; 