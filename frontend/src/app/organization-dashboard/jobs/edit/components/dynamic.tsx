/**
 * Dynamic imports for code splitting
 * 
 * This file provides dynamic imports for components in the job editing module
 * to enable code splitting and lazy loading, reducing initial bundle size.
 */

import dynamic from 'next/dynamic';

// Simple loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

// Dynamically import the JobEditForm with loading fallback
export const DynamicJobEditForm = dynamic(
  () => import('./JobEditForm'),
  { 
    loading: () => <LoadingFallback />,
    ssr: false // Skip server-side rendering for this form component
  }
);

// Dynamically import the JobStatusControl with loading fallback
export const DynamicJobStatusControl = dynamic(
  () => import('./JobStatusControl'),
  { loading: () => <LoadingFallback /> }
);

// Add more dynamic imports as needed for other large components
