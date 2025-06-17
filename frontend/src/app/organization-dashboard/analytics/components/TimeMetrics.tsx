'use client';

import { TimeMetric } from './types';

interface TimeMetricsProps {
  metrics: TimeMetric[];
}

export default function TimeMetrics({ metrics }: TimeMetricsProps) {
  return (
    <div className="space-y-4">
      {metrics.map((metric, index) => (
        <div key={index} className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">{metric.stage}</span>
            <div className="flex items-center">
              <span className="text-lg font-semibold">{metric.averageDays.toFixed(1)}</span>
              <span className="text-xs text-gray-500 ml-1">days</span>
              
              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full flex items-center ${
                metric.change < 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {metric.change < 0 ? (
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
                {Math.abs(metric.change).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${metric.change < 0 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(100, (metric.averageDays / 10) * 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>Previous: {metric.previousAverageDays.toFixed(1)} days</span>
            <span>Current: {metric.averageDays.toFixed(1)} days</span>
          </div>
        </div>
      ))}
    </div>
  );
}
