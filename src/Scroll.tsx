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

// Create a global lenis instance to prevent multiple instances
let globalLenis: any = null;

// Track if raf is running
let isRafRunning = false;

export const Scroll: React.FC<ScrollProps> = ({ action, isActive }) => {
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const isScrollingRef = useRef<boolean>(false);
  const lastActionRef = useRef<ScrollAction | null>(null);
  const rafIdRef = useRef<number | null>(null);

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

  // Start RAF loop if not already running
  const startRaf = () => {
    if (!isRafRunning) {
      isRafRunning = true;
      
      const animate = (time: number) => {
        if (globalLenis) {
          globalLenis.raf(time);
        }
        rafIdRef.current = requestAnimationFrame(animate);
      };
      
      rafIdRef.current = requestAnimationFrame(animate);
      console.log('Started RAF loop for Lenis');
    }
  };

  // Initialize Lenis
  useEffect(() => {
    // Initialize Lenis only once, globally
    if (!globalLenis) {
      try {
        console.log('Initializing Lenis with smooth scrolling settings');
        
        // Clean up any existing instance
        if (globalLenis) {
          globalLenis.destroy();
          globalLenis = null;
        }
        
        // Create new instance with proper settings
        globalLenis = new Lenis({
          duration: 1.2,
          easing: customEasing,
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
          // We'll manage RAF ourselves - don't use autoRaf as it's not in the type definition
        });

        // Start our custom RAF loop
        startRaf();
        
        // Check if Lenis is properly initialized
        if (globalLenis && typeof globalLenis.scrollTo === 'function') {
          console.log('Lenis scroll initialized successfully with scrollTo method available');
          
          // Test scroll to make sure it works
          setTimeout(() => {
            if (globalLenis) {
              console.log('Testing Lenis scroll with a small movement');
              const currentPos = window.scrollY;
              globalLenis.scrollTo(currentPos + 1, {
                duration: 0.1,
                onComplete: () => {
                  console.log('Test scroll completed');
                }
              });
            }
          }, 1000);
        } else {
          console.log('Lenis initialized but scrollTo method is not available');
        }

        // Add event listener to debug scroll events
        globalLenis.on('scroll', (e: any) => {
          console.debug(`Lenis scroll event - position: ${e.scroll?.toFixed(2)}, limit: ${e.limit}, progress: ${e.progress?.toFixed(2)}`);
        });
      } catch (error) {
        console.log('Failed to initialize Lenis:', error);
      }
    }

    // Cleanup function for component unmount
    return () => {
      clearAllTimers();
      
      // Cancel RAF loop
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        isRafRunning = false;
      }
      
      // Proper cleanup of Lenis instance if component unmounts
      if (globalLenis) {
        console.log('Destroying Lenis instance on component unmount');
        globalLenis.destroy();
        globalLenis = null;
      }
    };
  }, []);

  // Reset scrolling state when action changes
  useEffect(() => {
    // If the action changes, we should reset the scrolling state
    if (action && lastActionRef.current !== action) {
      lastActionRef.current = action;
      isScrollingRef.current = false;
      console.log('Action changed, resetting scrolling state', action);
    }
  }, [action]);

  // Execute scroll actions when active
  useEffect(() => {
    if (!isActive || !action || !globalLenis) {
      console.log(`Scroll action skipped - isActive: ${isActive}, action: ${!!action}, globalLenis: ${!!globalLenis}`);
      return;
    }

    // Skip if already scrolling
    if (isScrollingRef.current) {
      console.log('Scroll action skipped - already scrolling');
      return;
    }

    // Clear any existing timers
    clearAllTimers();

    const delay = action.delay || 0;
    
    // Calculate scroll amount
    let scrollAmount = 0;
    let targetPosition = 0;
    let isAbsoluteTarget = false;
    
    if (typeof action.amount === 'number') {
      scrollAmount = action.amount;
    } else if (typeof action.amount === 'string' && action.amount.includes('%')) {
      const percentage = parseFloat(action.amount) / 100;
      scrollAmount = window.innerHeight * percentage;
    } else if (action.target) {
      const element = document.querySelector(action.target);
      if (element) {
        scrollAmount = element.getBoundingClientRect().top + window.scrollY;
        isAbsoluteTarget = true;
        console.log(`Target element found at position: ${scrollAmount}, element:`, element);
      } else {
        console.log(`Target element not found: ${action.target}`);
        return; // Exit if target not found
      }
    }

    // Adjust for scroll direction
    if (action.type === 'up' && !isAbsoluteTarget) {
      scrollAmount = -scrollAmount;
    }

    console.log(`Starting scroll ${action.type} ${action.amount} after ${delay}ms delay, scrollAmount: ${scrollAmount}`);

    // Set timeout for the scroll action
    addTimer(() => {
      try {
        isScrollingRef.current = true;
        
        // For absolute targets, use the direct value; for relative, add to current position
        targetPosition = isAbsoluteTarget 
          ? scrollAmount 
          : window.scrollY + scrollAmount;
        
        // Calculate duration based on speed or default to 1000ms
        const duration = action.speed 
          ? Math.abs(scrollAmount) / action.speed * 1000 / 1000 // Convert to seconds for Lenis
          : 1.0; // Default 1 second
        
        console.log(`Scrolling to Y: ${targetPosition}, duration: ${duration}s, scrollAmount: ${scrollAmount}, current position: ${window.scrollY}`);
        
        // Check if we're actually trying to scroll somewhere different
        if (Math.abs(targetPosition - window.scrollY) < 5) {
          console.log('Scroll target is very close to current position, might not be visible');
          isScrollingRef.current = false;
          return;
        }
        
        try {          
          if (globalLenis) {
            // Ensure RAF is running
            startRaf();
            
            // Force Lenis to stop any ongoing animation
            globalLenis.stop();
            
            // Debug Lenis state before scrolling
            console.log('Lenis state before scroll:', {
              isStopped: globalLenis.isStopped,
              isScrolling: globalLenis.isScrolling,
            });
            
            // Make sure Lenis is started
            globalLenis.start();
            
            // Execute the scroll with Lenis
            console.log(`Calling Lenis.scrollTo(${targetPosition}, { duration: ${duration}, ... })`);
            
            // Try a more direct approach to ensure scrolling works
            globalLenis.scrollTo(targetPosition, {
              duration,
              easing: customEasing,
              lock: true,
              immediate: false,
              onComplete: () => {
                console.log(`Scroll animation completed to position ${targetPosition}, final position: ${window.scrollY}`);
                
                // Verify if we reached the target
                const finalDiff = Math.abs(targetPosition - window.scrollY);
                if (finalDiff > 5) {
                  console.log(`Scroll didn't reach target position. Difference: ${finalDiff}px`);
                }
                
                // Reset scrolling state after a short delay
                setTimeout(() => {
                  isScrollingRef.current = false;
                  console.log('Scrolling state reset');
                }, 100);
              }
            });
            
            return;
          }
        } catch (error) {
          console.log('Lenis scroll failed:', error);
          
          // Fallback to native scroll
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Reset scrolling state
          addTimer(() => {
            isScrollingRef.current = false;
          }, 1000);
        }
      } catch (error) {
        console.log('Scroll action failed:', error);
        isScrollingRef.current = false;
      }
    }, delay);

    return () => {
      clearAllTimers();
    };
  }, [action, isActive]);

  return null; // This component doesn't render anything
}; 