'use client';

import React from 'react';
import type { ReactNode } from 'react';

// WORKAROUND: Manual type declarations since TypeScript can't find these in React 19
// This is necessary due to a module resolution issue specific to this project setup
// @ts-ignore - Using React's actual implementations at runtime
const createContext: <T>(defaultValue: T) => React.Context<T> = React.createContext;
// @ts-ignore - Using React's actual implementations at runtime
const useContext: <T>(context: React.Context<T>) => T = React.useContext;

// Define theme colors to match homepage
export const themeColors = {
  // Primary colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // Secondary accent colors
  secondary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  // Background colors
  background: {
    light: '#f9fafb',
    main: '#f3f4f6',
    dark: '#1f2937',
    darker: '#111827',
    accent: 'rgba(59, 130, 246, 0.08)',
  },
  // Text colors
  text: {
    primary: '#111827',
    secondary: '#4b5563',
    disabled: '#9ca3af',
    light: '#f9fafb',
    accent: '#3b82f6',
  },
  // Status colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  }
};

// Theme context
interface ThemeContextType {
  colors: typeof themeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: themeColors,
  isDark: false,
});

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode;
  dark?: boolean;
}

export function ThemeProvider({ children, dark = false }: ThemeProviderProps) {
  const theme = {
    colors: themeColors,
    isDark: dark,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme
export function useTheme() {
  return useContext(ThemeContext);
}
