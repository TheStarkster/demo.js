import { BrowserType } from './types';

export const defaultDimensions = {
  chrome: { width: '100%', height: 600 },
  safari: { width: '100%', height: 600 },
  firefox: { width: '100%', height: 600 },
  edge: { width: '100%', height: 600 },
  'ios-safari': { width: 375, height: 667 },
  'android-chrome': { width: 360, height: 640 },
};

export const isMobile = (type: BrowserType): boolean => {
  return type === 'ios-safari' || type === 'android-chrome';
};

export const getBorderRadius = (type: BrowserType): number => {
  switch (type) {
    case 'ios-safari':
      return 20;
    case 'android-chrome':
      return 16;
    default:
      return 8;
  }
};

export const getHeaderHeight = (type: BrowserType): number => {
  switch (type) {
    case 'ios-safari':
    case 'android-chrome':
      return 44;
    case 'safari':
      return 36;
    default:
      return 32;
  }
}; 
