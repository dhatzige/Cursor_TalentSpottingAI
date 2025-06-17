'use client';

import { OverviewMetric } from './types';

interface OverviewMetricsProps {
  metrics: OverviewMetric[];
}

export default function OverviewMetrics({ metrics }: OverviewMetricsProps) {
  // Function to render the appropriate icon
  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'document':
        return (
          <svg className="w-6 h-6 text-blue-500 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'briefcase':
        return (
          <svg className="w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'chat':
        return (
          <svg className="w-6 h-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'clock':
        return (
          <svg className="w-6 h-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-blue-500 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-gray-50 dark:bg-slate-800/50 rounded-lg shadow p-6 transition-transform hover:scale-105">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">{metric.label}</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{metric.value}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full p-3">
              {renderIcon(metric.icon)}
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-1">
            <span className={`inline-block min-w-[50px] text-right text-sm font-semibold ${
              metric.trend === 'up' 
                ? metric.label.includes('Time') ? 'text-red-500' : 'text-green-500'
                : metric.trend === 'down'
                  ? metric.label.includes('Time') ? 'text-green-500' : 'text-red-500'
                  : 'text-gray-500'
            }`}>
              {metric.change > 0 ? '+' : ''}{metric.change}%
            </span>
            
            {metric.trend === 'up' && (
              <svg className={`w-4 h-4 ml-1 ${metric.label.includes('Time') ? 'text-red-500' : 'text-green-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 01-1-1V5.414l-4.293 4.293a1 1 0 01-1.414-1.414l4.293-4.293H8a1 1 0 010-2h5a1 1 0 011 1v5a1 1 0 01-1 1z" clipRule="evenodd" />
              </svg>
            )}
            
            {metric.trend === 'down' && (
              <svg className={`w-4 h-4 ml-1 ${metric.label.includes('Time') ? 'text-green-500' : 'text-red-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 13a1 1 0 100-2H5.414l4.293-4.293a1 1 0 00-1.414-1.414l-4.293 4.293V8a1 1 0 00-2 0v5a1 1 0 001 1h5a1 1 0 001-1z" clipRule="evenodd" />
              </svg>
            )}
            
            <span className="text-gray-500 text-sm ml-1">vs previous period</span>
          </div>
        </div>
      ))}
    </div>
  );
}
