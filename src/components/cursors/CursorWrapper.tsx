import React from 'react';
import { CursorWrapperProps } from './types';
import { DefaultCursor } from './DefaultCursor';
import { DotCursor } from './DotCursor';
import { ArrowCursor } from './ArrowCursor';
import { CircleCursor } from './CircleCursor';
import { PointerCursor } from './PointerCursor';

export const CursorWrapper: React.FC<CursorWrapperProps> = ({
  variant = 'default',
  ...cursorProps
}) => {
  switch (variant) {
    case 'dot':
      return <DotCursor {...cursorProps} />;
    case 'arrow':
      return <ArrowCursor {...cursorProps} />;
    case 'circle':
      return <CircleCursor {...cursorProps} />;
    case 'pointer':
      return <PointerCursor {...cursorProps} />;
    case 'default':
    default:
      return <DefaultCursor {...cursorProps} />;
  }
}; 