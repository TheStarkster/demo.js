import React from 'react';

export type BrowserType =
  | 'safari'
  | 'ios-safari';

export interface BrowserDimensions {
  width?: number | string;
  height?: number | string;
}

export interface MockBrowserProps {
  type?: BrowserType;
  dimensions?: BrowserDimensions;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
  url?: string;
}

export interface BrowserTheme {
  background: string;
  headerBackground: string;
  borderColor: string;
  textColor: string;
} 
