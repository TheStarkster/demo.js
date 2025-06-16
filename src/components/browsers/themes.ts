import { BrowserTheme, BrowserType } from './types';

export const browserThemes: Record<BrowserType, BrowserTheme> = {
  chrome: {
    background: '#ffffff',
    headerBackground: '#f1f3f4',
    borderColor: '#dadce0',
    textColor: '#202124',
  },
  safari: {
    background: '#ffffff',
    headerBackground: '#f7f7f7',
    borderColor: '#c6c6c6',
    textColor: '#000000',
  },
  firefox: {
    background: '#ffffff',
    headerBackground: '#f9f9fa',
    borderColor: '#d7d7db',
    textColor: '#0c0c0d',
  },
  edge: {
    background: '#ffffff',
    headerBackground: '#f3f2f1',
    borderColor: '#d2d0ce',
    textColor: '#323130',
  },
  'ios-safari': {
    background: '#ffffff',
    headerBackground: '#f7f7f7',
    borderColor: '#c6c6c6',
    textColor: '#000000',
  },
  'android-chrome': {
    background: '#ffffff',
    headerBackground: '#f1f3f4',
    borderColor: '#dadce0',
    textColor: '#202124',
  },
}; 
