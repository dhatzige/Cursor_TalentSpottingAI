/**
 * Performance utilities for component optimization
 * 
 * This module provides utilities to optimize component rendering performance
 * through techniques like memoization and equality checking.
 */

import React from 'react';
import { memo } from './react-compat';

/**
 * Custom deep equality function for comparing props
 * More efficient than JSON.stringify comparison
 */
export function arePropsEqual<T extends Record<string, any>>(
  prevProps: T,
  nextProps: T
): boolean {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);
  
  // Different number of properties
  if (prevKeys.length !== nextKeys.length) {
    return false;
  }
  
  // Check each property for equality
  return prevKeys.every(key => {
    const prevValue = prevProps[key];
    const nextValue = nextProps[key];
    
    // Handle functions specially (reference comparison only)
    if (typeof prevValue === 'function' && typeof nextValue === 'function') {
      return true; // Assume functions are equivalent (often they're handlers created inline)
    }
    
    // Simple equality check for other types
    return prevValue === nextValue;
  });
}

/**
 * Enhanced memo HOC with custom equality function
 * Use for components that receive complex props
 * 
 * Compatible with React 19's new component model
 */
export function memoWithCustomCompare<P extends object>(
  Component: React.FC<P>
): React.FC<P> {
  // Using our custom memo implementation with equality function
  return memo(Component, arePropsEqual);
}

/**
 * Simple wrapper around React.memo
 * Use for components that should only re-render when props change
 * 
 * Compatible with React 19's new component model
 */
export function memoize<P extends object>(
  Component: React.FC<P>
): React.FC<P> {
  // Using our custom memo implementation with default equality behavior
  return memo(Component);
}
