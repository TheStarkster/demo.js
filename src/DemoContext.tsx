import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import { DemoContextType, DemoStep, CursorAction } from './types';

const DemoContext = createContext<DemoContextType | undefined>(undefined);

interface DemoProviderProps {
  steps: DemoStep[];
  autoPlay?: boolean;
  loop?: boolean;
  /** Color of a button when not clicked during visual feedback */
  clickInactiveColor?: string;
  /** Color of a button while it is being clicked */
  clickActiveColor?: string;
  onStepComplete?: (stepId: string) => void;
  onComplete?: () => void;
  children: React.ReactNode;
}

// Simple, predictable state machine for demo steps
type DemoState = 
  | 'idle'          // Initial state or reset state
  | 'fade-in'       // Step is fading in
  | 'active'        // Step is fully visible and active
  | 'cursor-active' // Cursor is performing actions
  | 'fade-out'      // Step is fading out
  | 'completed'     // Demo is completed

// Interface for UI state modifications
interface ElementModification {
  selector: string;
  type: 'class' | 'style' | 'attribute' | 'content';
  name?: string;
  value: string;
}

export const DemoProvider: React.FC<DemoProviderProps> = ({
  steps,
  autoPlay = false,
  loop = false,
  clickInactiveColor = '#f5f5f5',
  clickActiveColor = '#357ae8',
  onStepComplete,
  onComplete,
  children,
}) => {
  // Core state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [demoState, setDemoState] = useState<DemoState>('idle');
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  
  // Derived state for components
  const isFadingIn = demoState === 'fade-in';
  const isFadingOut = demoState === 'fade-out';
  const isTransitioning = isFadingIn || isFadingOut;
  const isCursorActive = demoState === 'cursor-active';
  
  // Refs for timers and tracking animation states
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const currentSequenceIdRef = useRef<string | null>(null);
  const stepInProgressRef = useRef<boolean>(false);
  const currentStepIdRef = useRef<string | null>(null);
  const elementModificationsRef = useRef<Map<string, ElementModification[]>>(new Map());
  
  // Clear all active timers
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  }, []);
  
  // Helper to add a managed timeout
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
  
  // Helper to calculate fade durations
  const getFadeDurations = useCallback((stepIndex: number) => {
    const step = steps[stepIndex];
    return {
      fadeIn: step.fadeInDuration ?? 300,
      fadeOut: step.fadeOutDuration ?? 200,
    };
  }, [steps]);
  
  // Helper to calculate time for cursor actions
  const calculateCursorTime = useCallback((cursorActions: CursorAction | CursorAction[]): number => {
    if (!cursorActions) return 0;
    
    // Base timing constants
    const BASE_MOVE_TIME = 800;
    const CLICK_TIME = 500;
    const HOVER_TIME = 800;
    const BETWEEN_ACTIONS_DELAY = 400;
    const BUFFER_TIME = 500;
    
    // Calculate for single action
    if (!Array.isArray(cursorActions)) {
      const delay = cursorActions.delay || 0;
      let actionTime = 0;
      
      switch (cursorActions.type) {
        case 'click':
          actionTime = BASE_MOVE_TIME + CLICK_TIME;
          break;
        case 'hover':
          actionTime = BASE_MOVE_TIME + HOVER_TIME;
          break;
        case 'move':
          actionTime = BASE_MOVE_TIME;
          break;
      }
      
      return delay + actionTime + BUFFER_TIME;
    }
    
    // Calculate for multiple actions
    let totalTime = 0;
    
    cursorActions.forEach((action, index) => {
      const delay = action.delay || 0;
      let actionTime = 0;
      
      switch (action.type) {
        case 'click':
          actionTime = BASE_MOVE_TIME + CLICK_TIME;
          break;
        case 'hover':
          actionTime = BASE_MOVE_TIME + HOVER_TIME;
          break;
        case 'move':
          actionTime = BASE_MOVE_TIME;
          break;
      }
      
      totalTime += delay + actionTime;
      
      // Add delay between actions except for the last one
      if (index < cursorActions.length - 1) {
        totalTime += BETWEEN_ACTIONS_DELAY;
      }
    });
    
    return totalTime + BUFFER_TIME;
  }, []);

  // Find element with reliable strategies
  const findElement = useCallback((selector: string): Element | null => {
    if (!selector) return null;
    
    // Normalize selector (add # to ID if missing)
    const normalizedSelector = selector.match(/^[a-zA-Z][\w-]*$/) 
      ? `#${selector}` 
      : selector;
    
    try {
      // Try querySelector first
      let element = document.querySelector(normalizedSelector);
      if (element) return element;
      
      // If it might be an ID, try more approaches
      if (normalizedSelector.startsWith('#')) {
        const id = normalizedSelector.substring(1);
        
        // Try getElementById
        element = document.getElementById(id);
        if (element) return element;
        
        // Try finding by data-id attribute
        element = document.querySelector(`[data-id="${id}"]`);
        if (element) return element;
        
        // Try case-insensitive search
        const elements = document.querySelectorAll('[id]');
        for (const el of Array.from(elements)) {
          if (el.id.toLowerCase() === id.toLowerCase()) {
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

  // Apply modification to an element
  const applyElementModification = useCallback((mod: ElementModification, element: Element) => {
    try {
      switch (mod.type) {
        case 'class':
          element.classList.add(mod.value);
          break;
        case 'style':
          if (mod.name && element instanceof HTMLElement) {
            element.style.setProperty(mod.name, mod.value);
          }
          break;
        case 'attribute':
          if (mod.name) {
            element.setAttribute(mod.name, mod.value);
          }
          break;
        case 'content':
          element.textContent = mod.value;
          break;
      }

      // Store the modification for potential cleanup
      const key = mod.selector;
      if (!elementModificationsRef.current.has(key)) {
        elementModificationsRef.current.set(key, []);
      }
      elementModificationsRef.current.get(key)?.push(mod);

    } catch (error) {
      console.error(`Failed to apply modification to element: ${error}`);
    }
  }, []);

  // Handle click action directly in the library
  const handleDirectClick = useCallback((selector: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const element = findElement(selector);
      if (!element) {
        console.warn(`Element not found for direct click: ${selector}`);
        resolve(false);
        return;
      }

      try {
        // 1. Apply visual active state
        if (element instanceof HTMLElement) {
          // For buttons, add an active class
          if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
            element.classList.add('active');
            if (element.style) {
              const originalBg = element.style.backgroundColor;
              const originalTransform = element.style.transform;
              
              // Ensure a base color when not clicked
              if (!element.style.backgroundColor) {
                element.style.backgroundColor = clickInactiveColor;
                applyElementModification({
                  selector,
                  type: 'style',
                  name: 'backgroundColor',
                  value: clickInactiveColor
                }, element);
              }

              // Apply pressed effect with provided active color
              element.style.backgroundColor = clickActiveColor;
              element.style.transform = 'scale(0.98)';
              
              // Store the visual changes
              applyElementModification({
                selector,
                type: 'style',
                name: 'backgroundColor',
                value: clickActiveColor
              }, element);
              
              applyElementModification({
                selector,
                type: 'style',
                name: 'transform',
                value: 'scale(0.98)'
              }, element);
              
              // Restore original appearance after a short delay
              setTimeout(() => {
                if (originalBg) {
                  element.style.backgroundColor = originalBg;
                } else {
                  element.style.backgroundColor = clickInactiveColor;
                }
                
                if (originalTransform) {
                  element.style.transform = originalTransform;
                } else {
                  element.style.removeProperty('transform');
                }
                
                element.classList.remove('active');
              }, 300);
            }
          }
        }
        
        // 2. Trigger the click
        if (element instanceof HTMLElement) {
          element.click();
        } else {
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          element.dispatchEvent(clickEvent);
        }
        
        console.log(`Successfully clicked element: ${selector}`);
        resolve(true);
      } catch (error) {
        console.error(`Error clicking element: ${error}`);
        resolve(false);
      }
    });
  }, [findElement, applyElementModification, clickInactiveColor, clickActiveColor]);

  // Handle state changes for elements (expanded, collapsed, etc.)
  const handleElementState = useCallback((selector: string, stateName: string, stateValue: boolean): Promise<boolean> => {
    return new Promise((resolve) => {
      const element = findElement(selector);
      if (!element) {
        console.warn(`Element not found for state change: ${selector}`);
        resolve(false);
        return;
      }

      try {
        // Add appropriate aria attributes
        if (stateName === 'expanded') {
          element.setAttribute('aria-expanded', stateValue ? 'true' : 'false');
          applyElementModification({
            selector,
            type: 'attribute',
            name: 'aria-expanded',
            value: stateValue ? 'true' : 'false'
          }, element);
        }
        
        // Add/remove state classes
        if (stateValue) {
          element.classList.add(stateName);
          applyElementModification({
            selector,
            type: 'class',
            value: stateName
          }, element);
        } else {
          element.classList.remove(stateName);
        }
        
        console.log(`Set element state ${stateName}=${stateValue} for: ${selector}`);
        resolve(true);
      } catch (error) {
        console.error(`Error changing element state: ${error}`);
        resolve(false);
      }
    });
  }, [findElement, applyElementModification]);
  
  // Execute step sequence: fade-in → active → cursor → fade-out
  const executeStepSequence = useCallback((stepIndex: number) => {
    // Skip if we're already processing this step
    if (stepInProgressRef.current && currentStepIdRef.current === steps[stepIndex].id) {
      console.log(`Step ${stepIndex + 1}/${steps.length} (${steps[stepIndex].id}): Already in progress, skipping`);
      return;
    }
    
    // Generate a unique sequence ID to track this specific animation sequence
    const sequenceId = `sequence-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    currentSequenceIdRef.current = sequenceId;
    
    // Mark this step as in progress
    stepInProgressRef.current = true;
    currentStepIdRef.current = steps[stepIndex].id;
    
    const step = steps[stepIndex];
    const { fadeIn, fadeOut } = getFadeDurations(stepIndex);
    
    // Start with fade-in
    setDemoState('fade-in');
    console.log(`Step ${stepIndex + 1}/${steps.length} (${step.id}): Starting fade-in [${sequenceId}]`);
    
    // After fade-in completes, move to active state
    addTimer(() => {
      // If this sequence has been canceled, abort
      if (currentSequenceIdRef.current !== sequenceId) {
        console.log(`Sequence ${sequenceId} was canceled, aborting`);
        return;
      }
      
      setDemoState('active');
      console.log(`Step ${stepIndex + 1}/${steps.length} (${step.id}): Fade-in completed, now active [${sequenceId}]`);
      
      // If we have cursor actions, activate them after a small delay
      if (step.cursor && isPlaying) {
        addTimer(() => {
          // If this sequence has been canceled, abort
          if (currentSequenceIdRef.current !== sequenceId) {
            console.log(`Sequence ${sequenceId} was canceled, aborting`);
            return;
          }
          
          setDemoState('cursor-active');
          console.log(`Step ${stepIndex + 1}/${steps.length} (${step.id}): Cursor activated [${sequenceId}]`);
          
          // Calculate time for all cursor actions
          // Make sure cursor actions are defined before calculating time
          const cursorTime = step.cursor ? calculateCursorTime(step.cursor) : 0;
          
          // After cursor actions complete, go back to active state
          addTimer(() => {
            // If this sequence has been canceled, abort
            if (currentSequenceIdRef.current !== sequenceId) {
              console.log(`Sequence ${sequenceId} was canceled, aborting`);
              return;
            }
            
            setDemoState('active');
            console.log(`Step ${stepIndex + 1}/${steps.length} (${step.id}): Cursor actions completed [${sequenceId}]`);
            
            // Wait for the defined step duration or minimum time
            const remainingTime = Math.max(
              step.duration - (fadeIn + cursorTime), 
              1000 // Minimum time to show the step after cursor actions
            );
            
            // Start fade-out after the step duration
            addTimer(() => {
              // If this sequence has been canceled, abort
              if (currentSequenceIdRef.current !== sequenceId) {
                console.log(`Sequence ${sequenceId} was canceled, aborting`);
                return;
              }
              
              setDemoState('fade-out');
              console.log(`Step ${stepIndex + 1}/${steps.length} (${step.id}): Starting fade-out [${sequenceId}]`);
              
              // After fade-out completes, go to next step or complete
              addTimer(() => {
                // If this sequence has been canceled, abort
                if (currentSequenceIdRef.current !== sequenceId) {
                  console.log(`Sequence ${sequenceId} was canceled, aborting`);
                  return;
                }
                
                console.log(`Step ${stepIndex + 1}/${steps.length} (${step.id}): Fade-out completed [${sequenceId}]`);
                onStepComplete?.(step.id);
                
                // Mark step as no longer in progress
                stepInProgressRef.current = false;
                currentStepIdRef.current = null;
                
                // Determine what to do next
                if (isPlaying) {
                  if (stepIndex < steps.length - 1) {
                    // Go to next step
                    setCurrentStepIndex(stepIndex + 1);
                    executeStepSequence(stepIndex + 1);
                  } else if (loop) {
                    // Loop back to first step
                    setCurrentStepIndex(0);
                    executeStepSequence(0);
                  } else {
                    // Complete the demo
                    setDemoState('completed');
                    setIsPlaying(false);
                    console.log('Demo completed');
                    onComplete?.();
                  }
                } else {
                  // If not playing, just stay idle
                  setDemoState('idle');
                }
              }, fadeOut);
            }, remainingTime);
          }, cursorTime);
        }, 300); // Delay before cursor activation
      } else {
        // No cursor actions, wait for the step duration then fade out
        addTimer(() => {
          // If this sequence has been canceled, abort
          if (currentSequenceIdRef.current !== sequenceId) {
            console.log(`Sequence ${sequenceId} was canceled, aborting`);
            return;
          }
          
          setDemoState('fade-out');
          console.log(`Step ${stepIndex + 1}/${steps.length} (${step.id}): Starting fade-out (no cursor actions) [${sequenceId}]`);
          
          // After fade-out completes, go to next step or complete
          addTimer(() => {
            // If this sequence has been canceled, abort
            if (currentSequenceIdRef.current !== sequenceId) {
              console.log(`Sequence ${sequenceId} was canceled, aborting`);
              return;
            }
            
            console.log(`Step ${stepIndex + 1}/${steps.length} (${step.id}): Fade-out completed [${sequenceId}]`);
            onStepComplete?.(step.id);
            
            // Mark step as no longer in progress
            stepInProgressRef.current = false;
            currentStepIdRef.current = null;
            
            // Determine what to do next
            if (isPlaying) {
              if (stepIndex < steps.length - 1) {
                // Go to next step
                setCurrentStepIndex(stepIndex + 1);
                executeStepSequence(stepIndex + 1);
              } else if (loop) {
                // Loop back to first step
                setCurrentStepIndex(0);
                executeStepSequence(0);
              } else {
                // Complete the demo
                setDemoState('completed');
                setIsPlaying(false);
                console.log('Demo completed');
                onComplete?.();
              }
            } else {
              // If not playing, just stay idle
              setDemoState('idle');
            }
          }, fadeOut);
        }, step.duration);
      }
    }, fadeIn);
  }, [steps, addTimer, getFadeDurations, isPlaying, loop, onStepComplete, onComplete, calculateCursorTime]);
  
  // Cleanup modifications when step changes or component unmounts
  const cleanupElementModifications = useCallback(() => {
    elementModificationsRef.current.forEach((mods, selector) => {
      const element = findElement(selector);
      if (element) {
        mods.forEach(mod => {
          switch (mod.type) {
            case 'class':
              element.classList.remove(mod.value);
              break;
            case 'style':
              if (mod.name && element instanceof HTMLElement) {
                element.style.removeProperty(mod.name);
              }
              break;
            case 'attribute':
              if (mod.name) {
                element.removeAttribute(mod.name);
              }
              break;
            // Don't try to restore content as we don't know the original
          }
        });
      }
    });
    
    // Clear the stored modifications
    elementModificationsRef.current.clear();
  }, [findElement]);
  
  // Start playing from current step
  const play = useCallback(() => {
    if (demoState === 'idle' || demoState === 'completed') {
      setIsPlaying(true);
      executeStepSequence(currentStepIndex);
    } else {
      // If already in a step sequence, just update the playing state
      setIsPlaying(true);
    }
  }, [demoState, currentStepIndex, executeStepSequence]);
  
  // Pause the demo
  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  // Go to a specific step
  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      // Clean up any element modifications from previous steps
      cleanupElementModifications();
      
      // Cancel any current sequence
      currentSequenceIdRef.current = null;
      stepInProgressRef.current = false;
      currentStepIdRef.current = null;
      
      clearAllTimers();
      setCurrentStepIndex(index);
      setDemoState('idle');
      
      // If playing, start the new step sequence
      if (isPlaying) {
        executeStepSequence(index);
      }
    }
  }, [steps.length, clearAllTimers, isPlaying, executeStepSequence, cleanupElementModifications]);
  
  // Go to next step
  const goToNextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      // Clean up any element modifications from previous steps
      cleanupElementModifications();
      
      // Cancel any current sequence
      currentSequenceIdRef.current = null;
      stepInProgressRef.current = false;
      currentStepIdRef.current = null;
      
      clearAllTimers();
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setDemoState('idle');
      
      // If playing, start the new step sequence
      if (isPlaying) {
        executeStepSequence(nextIndex);
      }
    } else if (loop) {
      // Clean up any element modifications from previous steps
      cleanupElementModifications();
      
      // Cancel any current sequence
      currentSequenceIdRef.current = null;
      stepInProgressRef.current = false;
      currentStepIdRef.current = null;
      
      clearAllTimers();
      setCurrentStepIndex(0);
      setDemoState('idle');
      
      // If playing, start from the first step
      if (isPlaying) {
        executeStepSequence(0);
      }
    }
  }, [currentStepIndex, steps.length, loop, clearAllTimers, isPlaying, executeStepSequence, cleanupElementModifications]);
  
  // Go to previous step
  const goToPrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      // Clean up any element modifications from previous steps
      cleanupElementModifications();
      
      // Cancel any current sequence
      currentSequenceIdRef.current = null;
      stepInProgressRef.current = false;
      currentStepIdRef.current = null;
      
      clearAllTimers();
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      setDemoState('idle');
      
      // If playing, start the new step sequence
      if (isPlaying) {
        executeStepSequence(prevIndex);
      }
    }
  }, [currentStepIndex, clearAllTimers, isPlaying, executeStepSequence, cleanupElementModifications]);
  
  // Reset the demo
  const reset = useCallback(() => {
    // Clean up any element modifications
    cleanupElementModifications();
    
    // Cancel any current sequence
    currentSequenceIdRef.current = null;
    stepInProgressRef.current = false;
    currentStepIdRef.current = null;
    
    clearAllTimers();
    setCurrentStepIndex(0);
    setDemoState('idle');
    setIsPlaying(false);
  }, [clearAllTimers, cleanupElementModifications]);
  
  // Start autoplay when component mounts
  useEffect(() => {
    if (autoPlay && steps.length > 0) {
      addTimer(() => {
        setIsPlaying(true);
        executeStepSequence(0);
      }, 500); // Short delay before starting
    }
    
    // Clean up all timers and element modifications on unmount
    return () => {
      clearAllTimers();
      cleanupElementModifications();
    };
  }, [autoPlay, steps, addTimer, executeStepSequence, clearAllTimers, cleanupElementModifications]);
  
  // Context value
  const value = {
    steps,
    currentStepIndex,
    isPlaying,
    isTransitioning,
    isFadingIn,
    isCursorActive,
    goToStep,
    goToNextStep,
    goToPrevStep,
    play,
    pause,
    reset,
    handleDirectClick, // Expose this for BaseCursor to use
    handleElementState, // Expose this for BaseCursor to use
  };
  
  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = (): DemoContextType => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}; 