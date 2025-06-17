'use client';

import React from 'react';
import Link from 'next/link';

/**
 * UI/UX Component Showcase
 * 
 * A visual showcase of the enhanced UI components implemented in the TalentSpottingAI project.
 * Focuses specifically on displaying the UI enhancements without duplicating the DevNavBar navigation.
 */
export default function UIShowcasePage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">UI/UX Component Showcase</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Explore the enhanced UI components implemented as part of the dashboard UI/UX overhaul
          </p>
        </header>

        {/* Enhanced Components Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Enhanced Dashboard Components</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            View implementations of our enhanced UI components in context of their respective dashboards.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Jobs Dashboard Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-2 p-4 w-3/4 opacity-50">
                    <div className="bg-white dark:bg-gray-700 h-8 rounded"></div>
                    <div className="bg-white dark:bg-gray-700 h-8 rounded"></div>
                    <div className="bg-white dark:bg-gray-700 h-8 rounded"></div>
                    <div className="bg-white dark:bg-gray-700 h-20 rounded col-span-3"></div>
                    <div className="bg-white dark:bg-gray-700 h-12 rounded col-span-3"></div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <h3 className="text-white text-xl font-bold">Jobs Dashboard</h3>
                  <p className="text-white/80 text-sm">Enhanced with Cards, Tabs, and ChartContainer</p>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">UI Components</h4>
                <ul className="space-y-1 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center"><span className="mr-2">•</span> PaginatedJobList with tabs and filters</li>
                  <li className="flex items-center"><span className="mr-2">•</span> JobsEmptyState with Card component</li>
                  <li className="flex items-center"><span className="mr-2">•</span> Search and filter interface</li>
                  <li className="flex items-center"><span className="mr-2">•</span> Dark mode support</li>
                </ul>
                <Link href="/organization-dashboard/jobs" className="inline-block mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                  View Implementation
                </Link>
              </div>
            </div>
            
            {/* Analytics Dashboard Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48 bg-gradient-to-r from-purple-600 to-purple-800 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-2 p-4 w-3/4 opacity-50">
                    <div className="bg-white dark:bg-gray-700 h-24 rounded"></div>
                    <div className="bg-white dark:bg-gray-700 h-24 rounded"></div>
                    <div className="bg-white dark:bg-gray-700 h-32 rounded col-span-2"></div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <h3 className="text-white text-xl font-bold">Analytics Dashboard</h3>
                  <p className="text-white/80 text-sm">Enhanced with Charts, MetricGrid, and DateRangePicker</p>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">UI Components</h4>
                <ul className="space-y-1 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center"><span className="mr-2">•</span> Interactive charts with loading states</li>
                  <li className="flex items-center"><span className="mr-2">•</span> Metric grid for KPI visualization</li>
                  <li className="flex items-center"><span className="mr-2">•</span> Date range filtering</li>
                  <li className="flex items-center"><span className="mr-2">•</span> Tab-based navigation</li>
                </ul>
                <Link href="/organization-dashboard/analytics" className="inline-block mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors">
                  View Implementation
                </Link>
              </div>
            </div>
            
            {/* Advanced Search Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48 bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col gap-2 p-4 w-3/4 opacity-50">
                    <div className="bg-white dark:bg-gray-700 h-10 rounded w-full"></div>
                    <div className="flex gap-2 w-full">
                      <div className="bg-white dark:bg-gray-700 h-8 rounded flex-1"></div>
                      <div className="bg-white dark:bg-gray-700 h-8 rounded flex-1"></div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 h-28 rounded w-full"></div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <h3 className="text-white text-xl font-bold">Advanced Search</h3>
                  <p className="text-white/80 text-sm">Enhanced with tabs, filters, and result displays</p>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">UI Components</h4>
                <ul className="space-y-1 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center"><span className="mr-2">•</span> Tabbed search interface</li>
                  <li className="flex items-center"><span className="mr-2">•</span> Advanced filter controls</li>
                  <li className="flex items-center"><span className="mr-2">•</span> Saved search management</li>
                  <li className="flex items-center"><span className="mr-2">•</span> Results display with multiple views</li>
                </ul>
                <Link href="/organization-dashboard/search" className="inline-block mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                  View Implementation
                </Link>
              </div>
            </div>
            
            {/* Component Library Link */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48 bg-gradient-to-r from-gray-700 to-gray-900 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-2 p-4 w-3/4 opacity-50">
                    <div className="bg-white/30 dark:bg-gray-600 h-12 rounded"></div>
                    <div className="bg-white/30 dark:bg-gray-600 h-12 rounded"></div>
                    <div className="bg-white/30 dark:bg-gray-600 h-12 rounded"></div>
                    <div className="bg-white/30 dark:bg-gray-600 h-12 rounded"></div>
                    <div className="bg-white/30 dark:bg-gray-600 h-12 rounded"></div>
                    <div className="bg-white/30 dark:bg-gray-600 h-12 rounded"></div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <h3 className="text-white text-xl font-bold">Component Documentation</h3>
                  <p className="text-white/80 text-sm">View all shared UI components with examples</p>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Reusable UI Components</h4>
                <ul className="space-y-1 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center"><span className="mr-2">•</span> Cards, buttons, and form inputs</li>
                  <li className="flex items-center"><span className="mr-2">•</span> Charts and data visualization</li>
                  <li className="flex items-center"><span className="mr-2">•</span> Layout components</li>
                  <li className="flex items-center"><span className="mr-2">•</span> Interactive controls</li>
                </ul>
                <span className="inline-block mt-2 px-4 py-2 bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md">Coming Soon</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Developer Resources */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Developer Resources</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              To access all parts of the application during development, use the following methods:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">DevNavBar:</span>
                  <span className="text-gray-600 dark:text-gray-400"> Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Shift+D</kbd> to toggle the developer navigation bar</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">URL Parameter:</span>
                  <span className="text-gray-600 dark:text-gray-400"> Add <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">?dev_nav=true</code> to any URL to show the navigation bar</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Authentication Bypass:</span>
                  <span className="text-gray-600 dark:text-gray-400"> The <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">useProtectedRoute</code> hook in development uses mock authentication</span>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
