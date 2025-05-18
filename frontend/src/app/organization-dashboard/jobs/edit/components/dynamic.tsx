/**
 * Dynamic imports for code splitting
 * 
 * This file provides dynamic imports for components in the job editing module
 * to enable code splitting and lazy loading, reducing initial bundle size.
 */

import dynamic from 'next/dynamic';
import React from 'react';
import { createLoadingComponent } from '../../../../../lib/utils/react-compat';

// Create a loading component for use with dynamic imports
const LoadingFallback = createLoadingComponent(true);

// Dynamically import the JobEditForm with loading fallback
export const DynamicJobEditForm = dynamic(
  () => import('./JobEditForm'),
  { 
    loading: () => React.createElement(LoadingFallback),
    ssr: false // Skip server-side rendering for this form component
  }
);

// Dynamically import the JobStatusControl with loading fallback
export const DynamicJobStatusControl = dynamic(
  () => import('./JobStatusControl'),
  { loading: () => React.createElement(LoadingFallback) }
);

// Add more dynamic imports as needed for other large components
