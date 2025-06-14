import React, { useEffect, useState, useRef, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseCursorProps } from './types';
import { customEasing, getTargetPosition } from './utils';
import { CursorAction } from '../../types';
import { useDemo } from '../../DemoContext';

interface BaseCursorComponentProps extends BaseCursorProps {
  renderCursor: (isClicking: boolean) => ReactNode;
}

// Constants for animation timing
const CURSOR_BETWEEN_ACTIONS_DELAY = 400; // Time between sequential actions
const CLICK_ANIMATION_DURATION = 300; // Duration of click animation
const HOVER_DURATION = 800; // Duration to hold hover state
const MOVE_COMPLETION_DELAY = 300; // Time to wait after movement before completing
const ELEMENT_SEARCH_INTERVAL = 200; // Interval between element search attempts
const MAX_ELEMENT_SEARCH_ATTEMPTS = 15; // Maximum attempts to find an element
const DOM_READY_DELAY = 200; // Delay to ensure DOM is ready before starting

export const BaseCursor: React.FC<BaseCursorComponentProps> = ({
  action,
  isActive,
  animationDuration = 800,
  clickAnimationDuration = 300,
  exitDelay = 500,
  renderCursor,
}) => {
  // Get direct DOM handling functions from context
  const { handleDirectClick, handleElementState } = useDemo();
  
  // Position and animation states
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [sequenceStarted, setSequenceStarted] = useState(false);

  // Refs for storing actions and managing timers
  const actionsRef = useRef<CursorAction[]>([]);
  const currentActionIndexRef = useRef<number>(0);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const sequenceIdRef = useRef<string | null>(null);

  // Clear all timers to prevent memory leaks
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  // Add a new timer and track it for cleanup
  const addTimer = useCallback((callback: () => void, delay: number): NodeJS.Timeout => {
    const timer = setTimeout(() => {
      // Remove this timer from the list when it executes
      timersRef.current = timersRef.current.filter(t => t !== timer);
      // Execute the callback
      callback();
    }, delay);
    
    // Add to the list of active timers
    timersRef.current.push(timer);
    return timer;
  }, []);

  // Reset the cursor state
  const resetCursorState = useCallback(() => {
    setIsVisible(false);
    setIsAnimating(false);
    setIsClicking(false);
    setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    currentActionIndexRef.current = 0;
    setSequenceStarted(false);
    sequenceIdRef.current = null;
    clearAllTimers();
  }, [clearAllTimers]);

  // Initialize action sequence when action prop changes
  useEffect(() => {
    if (!action) {
      actionsRef.current = [];
      resetCursorState();
      return;
    }

    // Convert single action or array to array format
    actionsRef.current = Array.isArray(action) ? action : [action];
    currentActionIndexRef.current = 0;
    
    console.log('Cursor actions initialized:', 
      actionsRef.current.map(a => `${a.type} on ${a.target}`)
    );
    
  }, [action, resetCursorState]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Reset cursor when isActive becomes false
  useEffect(() => {
    if (!isActive) {
      resetCursorState();
    }
  }, [isActive, resetCursorState]);

  // Find target element with multiple strategies for reliability
  const findElement = useCallback((selector: string): HTMLElement | null => {
    if (!selector) return null;
    
    // Normalize selector (add # to ID if missing)
    const normalizedSelector = selector.match(/^[a-zA-Z][\w-]*$/) 
      ? `#${selector}` 
      : selector;
    
    try {
      // Try querySelector first
      const element = document.querySelector(normalizedSelector);
      if (element instanceof HTMLElement) return element;
      
      // If it might be an ID, try more approaches
      if (normalizedSelector.startsWith('#')) {
        const id = normalizedSelector.substring(1);
        
        // Try getElementById
        const elementById = document.getElementById(id);
        if (elementById) return elementById;
        
        // Try finding by data-id attribute
        const elementByDataId = document.querySelector(`[data-id="${id}"]`);
        if (elementByDataId instanceof HTMLElement) return elementByDataId;
        
        // Try case-insensitive search
        const elements = document.querySelectorAll('[id]');
        for (const el of Array.from(elements)) {
          if (el.id.toLowerCase() === id.toLowerCase() && el instanceof HTMLElement) {
            return el;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Error finding element with selector "${normalizedSelector}":`, error);
      return null;
    }
  }, []);

  // Execute a single cursor action
  const executeAction = useCallback((actionIndex: number) => {
    if (actionIndex >= actionsRef.current.length) {
      console.log('Cursor sequence completed');
      
      // Hide cursor after a delay
      addTimer(() => {
        setIsVisible(false);
      }, exitDelay);
      
      return;
    }
    
    // Generate a unique ID for this action sequence
    const currentSequenceId = sequenceIdRef.current;
    
    const currentAction = actionsRef.current[actionIndex];
    console.log(`Executing cursor action ${actionIndex + 1}/${actionsRef.current.length}:`, 
      JSON.stringify({
        type: currentAction.type,
        target: currentAction.target
      })
    );
    
    // Handle action delay
    const delay = currentAction.delay || 0;
    if (delay > 0) {
      console.log(`Waiting ${delay}ms before action`);
      addTimer(() => {
        // Check if the sequence is still valid
        if (sequenceIdRef.current !== currentSequenceId) {
          console.log('Cursor action canceled because sequence ID changed');
          return;
        }
        performAction(actionIndex, currentSequenceId);
      }, delay);
    } else {
      performAction(actionIndex, currentSequenceId);
    }
  }, [addTimer, exitDelay]);
  
  // Actually perform the action (after any delay)
  const performAction = useCallback((actionIndex: number, sequenceId: string | null) => {
    const currentAction = actionsRef.current[actionIndex];
    let attempts = 0;
    
    const findAndAct = () => {
      // Check if the sequence is still valid
      if (sequenceIdRef.current !== sequenceId) {
        console.log('Cursor action canceled because sequence ID changed');
        return;
      }
      
      const element = findElement(currentAction.target);
      
      if (!element) {
        attempts++;
        if (attempts <= MAX_ELEMENT_SEARCH_ATTEMPTS) {
          console.log(`Attempt ${attempts}/${MAX_ELEMENT_SEARCH_ATTEMPTS} to find element "${currentAction.target}"`);
          addTimer(() => {
            // Check if the sequence is still valid
            if (sequenceIdRef.current !== sequenceId) {
              console.log('Cursor action canceled because sequence ID changed');
              return;
            }
            findAndAct();
          }, ELEMENT_SEARCH_INTERVAL);
        } else {
          console.warn(`Element "${currentAction.target}" not found after ${MAX_ELEMENT_SEARCH_ATTEMPTS} attempts, skipping action`);
          
          // Move to next action
          currentActionIndexRef.current = actionIndex + 1;
          addTimer(() => {
            // Check if the sequence is still valid
            if (sequenceIdRef.current !== sequenceId) {
              console.log('Cursor action canceled because sequence ID changed');
              return;
            }
            executeAction(actionIndex + 1);
          }, CURSOR_BETWEEN_ACTIONS_DELAY);
        }
        return;
      }
      
      // Element found, move cursor to it
      const targetPos = getTargetPosition(element);
      setPosition(targetPos);
      setIsAnimating(true);
      
      // Wait for cursor movement to complete
      addTimer(() => {
        // Check if the sequence is still valid
        if (sequenceIdRef.current !== sequenceId) {
          console.log('Cursor action canceled because sequence ID changed');
          return;
        }
        
        setIsAnimating(false);
        
        // Perform the specific action based on type
        switch (currentAction.type) {
          case 'click':
            performClick(currentAction.target, actionIndex, sequenceId);
            break;
            
          case 'hover':
            performHover(element, actionIndex, sequenceId);
            break;
            
          case 'move':
            // For move, just complete after movement
            addTimer(() => {
              // Check if the sequence is still valid
              if (sequenceIdRef.current !== sequenceId) {
                console.log('Cursor action canceled because sequence ID changed');
                return;
              }
              
              // Move to next action
              currentActionIndexRef.current = actionIndex + 1;
              executeAction(actionIndex + 1);
            }, MOVE_COMPLETION_DELAY);
            break;
        }
      }, animationDuration);
    };
    
    // Start the find and act process
    findAndAct();
  }, [findElement, addTimer, animationDuration, executeAction]);
  
  // Perform click action using the direct DOM handling system
  const performClick = useCallback((selector: string, actionIndex: number, sequenceId: string | null) => {
    // Show the cursor click animation
    setIsClicking(true);
    
    // Use the direct click handler from context
    handleDirectClick(selector)
      .then((success: boolean) => {
        // Wait for the click animation to complete
        addTimer(() => {
          // Check if the sequence is still valid
          if (sequenceIdRef.current !== sequenceId) {
            console.log('Cursor action canceled because sequence ID changed');
            return;
          }
          
          setIsClicking(false);
          
          if (success) {
            console.log(`Successfully clicked element: ${selector}`);
          } else {
            console.warn(`Failed to click element: ${selector}`);
          }
          
          // Move to next action
          currentActionIndexRef.current = actionIndex + 1;
          addTimer(() => {
            // Check if the sequence is still valid
            if (sequenceIdRef.current !== sequenceId) {
              console.log('Cursor action canceled because sequence ID changed');
              return;
            }
            
            executeAction(actionIndex + 1);
          }, 100); // Small delay before next action
        }, clickAnimationDuration);
      });
  }, [handleDirectClick, addTimer, clickAnimationDuration, executeAction]);
  
  // Perform hover action
  const performHover = useCallback((element: HTMLElement, actionIndex: number, sequenceId: string | null) => {
    // Set element to hovered state
    handleElementState(element.id || element.tagName.toLowerCase(), 'hovered', true)
      .then(() => {
        // Hold hover for a duration
        addTimer(() => {
          // Check if the sequence is still valid
          if (sequenceIdRef.current !== sequenceId) {
            console.log('Cursor action canceled because sequence ID changed');
            return;
          }
          
          // Remove hover state
          handleElementState(element.id || element.tagName.toLowerCase(), 'hovered', false);
          
          // Move to next action
          currentActionIndexRef.current = actionIndex + 1;
          addTimer(() => {
            // Check if the sequence is still valid
            if (sequenceIdRef.current !== sequenceId) {
              console.log('Cursor action canceled because sequence ID changed');
              return;
            }
            
            executeAction(actionIndex + 1);
          }, 100); // Small delay before next action
        }, HOVER_DURATION);
      });
  }, [handleElementState, addTimer, executeAction]);

  // Start the cursor sequence when isActive becomes true
  useEffect(() => {
    if (isActive && !sequenceStarted && actionsRef.current.length > 0) {
      setSequenceStarted(true);
      
      // Generate a unique sequence ID for this run
      const newSequenceId = `cursor-seq-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      sequenceIdRef.current = newSequenceId;
      
      // Make cursor visible immediately
      setIsVisible(true);
      
      // Start with first action after a delay to ensure DOM is ready
      addTimer(() => {
        // Check if the sequence is still valid
        if (sequenceIdRef.current !== newSequenceId) {
          console.log('Cursor sequence canceled before it could start');
          return;
        }
        
        executeAction(0);
      }, DOM_READY_DELAY);
    }
  }, [isActive, sequenceStarted, executeAction, addTimer]);

  // Update position on window resize/scroll to keep cursor in sync with targets
  useEffect(() => {
    const handlePositionUpdate = () => {
      if (!isVisible || actionsRef.current.length === 0) return;
      
      const currentActionIndex = currentActionIndexRef.current;
      if (currentActionIndex >= actionsRef.current.length) return;
      
      const currentAction = actionsRef.current[currentActionIndex];
      const element = findElement(currentAction.target);
      
      if (element) {
        const newPos = getTargetPosition(element);
        setPosition(newPos);
      }
    };

    window.addEventListener('resize', handlePositionUpdate);
    window.addEventListener('scroll', handlePositionUpdate);
    
    return () => {
      window.removeEventListener('resize', handlePositionUpdate);
      window.removeEventListener('scroll', handlePositionUpdate);
    };
  }, [isVisible, findElement]);

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          x: position.x,
          y: position.y,
        }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: isAnimating ? animationDuration / 1000 : 0,
          ease: customEasing,
          x: { duration: isAnimating ? animationDuration / 1000 : 0, ease: customEasing },
          y: { duration: isAnimating ? animationDuration / 1000 : 0, ease: customEasing },
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      >
        {renderCursor(isClicking)}
      </motion.div>
    </AnimatePresence>
  );
}; 