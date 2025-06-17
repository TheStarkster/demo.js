import { BrowserType } from './types';

export const defaultDimensions = {
  safari: { width: '100%', height: 600 },
  'ios-safari': { width: 375, height: 667 },
};

export const isMobile = (type: BrowserType): boolean => {
  return type === 'ios-safari';
};

export const getBorderRadius = (type: BrowserType): number => {
  switch (type) {
    case 'ios-safari':
      return 20;
    default:
      return 8;
  }
};

export const getHeaderHeight = (type: BrowserType): number => {
  switch (type) {
    case 'ios-safari':
      return 44;
    case 'safari':
      return 36;
    default:
      return 36;
  }
}; 
