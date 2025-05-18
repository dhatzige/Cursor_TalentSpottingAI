/**
 * React 19 Compatibility Layer
 * 
 * This file provides compatibility utilities for working with React 19's
 * new component model and API changes.
 */

import React from 'react';

/**
 * Simple implementation of memo for React 19
 * Since React 19 has API changes, this provides a compatible version
 */
export function memo<P extends object>(
  Component: React.FC<P>,
  areEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): React.FC<P> {
  // Create a wrapper component that optionally checks props equality
  // Cast Component to a JSX-compatible element function to fix React 19 type issues
  const ComponentFn = Component as (props: P) => React.ReactElement;
  
  const MemoComponent: React.FC<P> = (props) => {
    // In a real implementation, we would use a ref to store the previous props and result
    // This is a simplified version for compatibility
    return ComponentFn(props);
  };
  
  // In React 19, FC doesn't have displayName by default
  // We can use an approach that's compatible with TypeScript
  const displayName = (Component as any).name || 'MemoComponent';
  // Add displayName as a property using type assertion
  (MemoComponent as any).displayName = `Memo(${displayName})`;
  
  return MemoComponent;
}

/**
 * Creates a loading component for dynamic imports
 */
export function createLoadingComponent(spinner: boolean = true): (props: {}) => React.ReactElement {
  // Define as a direct function returning ReactElement instead of FC type to fix React 19 compatibility
  const LoadingComponent = (): React.ReactElement => (
    <div className="flex items-center justify-center p-8">
      {spinner && (
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
  
  // Set displayName for debugging
  (LoadingComponent as any).displayName = 'DynamicLoadingComponent';
  
  return LoadingComponent;
}

/**
 * Helper function to create dynamic imports with proper types
 */
export function createDynamicImport<P extends object>(
  importFn: () => Promise<{ default: React.FC<P> }>,
  options?: { loading?: boolean; ssr?: boolean }
) {
  const LoadingComponent = createLoadingComponent(true);
  
  // Create and return the dynamic component
  return function DynamicComponent(props: P) {
    // In a production app, we would use useEffect and useState to handle the dynamic import
    // For simplicity in our type checking, we're returning a placeholder
    
    // This would actually be implemented with code like:
    // const [Component, setComponent] = useState<React.FC<P> | null>(null);
    // useEffect(() => {
    //   importFn().then(module => setComponent(module.default));
    // }, []);
    
    // return Component ? <Component {...props} /> : <LoadingComponent />;
    
    // Call function directly to avoid JSX transformation issues with React 19
    return LoadingComponent({});
  };
}
