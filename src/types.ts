import { ReactNode } from 'react';

export interface CursorAction {
  type: 'click' | 'hover' | 'move';
  target: string; // CSS selector or ID
  delay?: number; // delay before action in ms
}

export interface ScrollAction {
  type: 'up' | 'down';
  amount: number | string; // pixels or percentage
  speed?: number; // pixels per second
  delay?: number; // delay before action in ms
  target?: string; // CSS selector or ID
}

export interface DemoStep {
  id: string; // unique identifier for the step
  name: string; // display name for the step
  content: ReactNode; // The React component to render
  duration: number; // duration in ms
  cursor?: CursorAction | CursorAction[]; // cursor action(s) for this step - can be a single action or an array of actions
  scroll?: ScrollAction; // scroll action for this step
  fadeIn?: boolean; // whether to fade in this step
  fadeInDuration?: number; // duration of fade in animation
  fadeOutDuration?: number; // duration of fade out animation
  transitionDirection?: 'x' | 'y'; // direction of transition animation ('x' is horizontal, 'y' is vertical)
  customEasing?: (t: number) => number; // custom easing function for this step
  fadeInEasing?: (t: number) => number; // specific easing function for fade in
  fadeOutEasing?: (t: number) => number; // specific easing function for fade out
}

export interface DemoProps {
  steps: DemoStep[];
  autoPlay?: boolean;
  loop?: boolean;
  cursorSize?: number;
  cursorColor?: string;
  cursorVariant?: string; // Type of cursor to display
  defaultTransitionDirection?: 'x' | 'y'; // default direction for all steps
  defaultEasing?: (t: number) => number; // default easing function for all steps
  defaultFadeInDuration?: number; // default fade in duration for all steps
  defaultFadeOutDuration?: number; // default fade out duration for all steps
  defaultFadeInEasing?: (t: number) => number; // default fade in easing for all steps
  defaultFadeOutEasing?: (t: number) => number; // default fade out easing for all steps
  onStepComplete?: (stepId: string) => void;
  onComplete?: () => void;
}

export interface DemoContextType {
  steps: DemoStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  isTransitioning: boolean;
  isFadingIn: boolean;
  isCursorActive: boolean;
  goToStep: (index: number) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  // Direct DOM manipulation methods
  handleDirectClick: (selector: string) => Promise<boolean>;
  handleElementState: (selector: string, stateName: string, stateValue: boolean) => Promise<boolean>;
} 