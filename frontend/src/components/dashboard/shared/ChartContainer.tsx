'use client';

import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface ChartContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  loading?: boolean;
  error?: string;
  height?: string;
  legend?: ReactNode;
  actions?: ReactNode;
  info?: string;
  emptyState?: ReactNode;
}

export default function ChartContainer({
  children,
  title,
  subtitle,
  className = '',
  loading = false,
  error,
  height = 'h-64',
  legend,
  actions,
  info,
  emptyState
}: ChartContainerProps) {
  // Render loading state
  const renderLoading = () => (
    <div className={`flex items-center justify-center ${height}`}>
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading data...</p>
      </div>
    </div>
  );

  // Render error state
  const renderError = () => (
    <div className={`flex items-center justify-center ${height}`}>
      <div className="flex flex-col items-center text-center max-w-xs">
        <div className="rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400 mb-2">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">Failed to load chart data</p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    </div>
  );

  // Render empty state
  const renderEmptyState = () => {
    if (emptyState) return emptyState;
    
    return (
      <div className={`flex items-center justify-center ${height}`}>
        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="rounded-full bg-gray-100 p-3 text-gray-500 dark:bg-gray-800 dark:text-gray-400 mb-2">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">No data available</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Try adjusting your filters or date range.</p>
        </div>
      </div>
    );
  };

  // Determine what to render based on state
  const renderContent = () => {
    if (loading) return renderLoading();
    if (error) return renderError();
    
    // Check if children is truthy
    if (!children) return renderEmptyState();
    
    return (
      <div className={height}>
        {children}
      </div>
    );
  };

  return (
    <Card className={className}>
      {/* Header */}
      {(title || subtitle || actions) && (
        <div className="pb-4 mb-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
          {actions && <div className="mt-2 sm:mt-0">{actions}</div>}
        </div>
      )}
      
      {/* Main content */}
      {renderContent()}
      
      {/* Footer with legend and info */}
      {(legend || info) && (
        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {legend && <div className="flex flex-wrap gap-4">{legend}</div>}
          {info && <p className="mt-2 sm:mt-0 text-xs text-gray-500 dark:text-gray-400">{info}</p>}
        </div>
      )}
    </Card>
  );
}
