'use client';

import React from 'react';

// Simplified type definition since the original file can't be found
interface TimeSeriesDataPoint {
  date: string;
  applications: number;
  interviews: number;
  hires: number;
}

interface ApplicationsChartProps {
  data: TimeSeriesDataPoint[];
}

/**
 * ApplicationsChart Component
 * 
 * A simplified visualization component that renders application data trends
 * without relying on Chart.js library
 */
export default function ApplicationsChart({ data }: ApplicationsChartProps) {
  // Find the maximum value to scale the bars
  const maxValue = Math.max(
    ...data.map(item => Math.max(item.applications, item.interviews, item.hires))
  );

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm" data-component-name="ApplicationsChart">
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm text-gray-800 dark:text-gray-200" data-component-name="ApplicationsChart">Applications</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-800 dark:text-gray-200">Interviews</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            <span className="text-sm text-gray-800 dark:text-gray-200">Hires</span>
          </div>
        </div>
      </div>

      <div className="relative h-64">
        {/* Horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between border-t border-gray-200 dark:border-gray-700 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={`grid-${i}`} className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          ))}
        </div>

        {/* Data visualization */}
        <div className="absolute inset-0 flex items-end justify-between pb-6" data-component-name="ApplicationsChart">
          {data.map((item, index) => (
            <div key={`bar-group-${index}`} className="flex flex-col items-center w-1/12">
              {/* Application bar */}
              <div 
                className="w-4 bg-blue-500 mb-1 rounded-t" 
                style={{ 
                  height: `${Math.max((item.applications / maxValue) * 100, 5)}%`,
                }}
              ></div>

              {/* Interview bar */}
              <div 
                className="w-4 bg-green-500 mb-1 rounded-t" 
                style={{ 
                  height: `${Math.max((item.interviews / maxValue) * 100, 3)}%`,
                }}
              ></div>

              {/* Hire bar */}
              <div 
                className="w-4 bg-purple-500 mb-1 rounded-t" 
                style={{ 
                  height: `${Math.max((item.hires / maxValue) * 100, 2)}%`,
                }}
              ></div>

              {/* Date label */}
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {formatDate(item.date)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
        Showing application data from {formatDate(data[0]?.date || '')} to {formatDate(data[data.length - 1]?.date || '')}
      </div>
    </div>
  );
}
