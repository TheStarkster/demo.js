import { CursorAction } from '../../types';

// Base cursor props that all cursor variants will share
export interface BaseCursorProps {
  action?: CursorAction | CursorAction[];
  size?: number;
  color?: string;
  isActive: boolean;
  animationDuration?: number;
  clickAnimationDuration?: number;
  exitDelay?: number;
}

// Different cursor appearance types
export type CursorVariant = 'default' | 'pointer' | 'dot' | 'circle' | 'arrow';

// Props specific to the CursorWrapper component
export interface CursorWrapperProps extends BaseCursorProps {
  variant?: CursorVariant;
} 