'use client';

import { CandidateMetric } from './types';

interface CandidateMetricsProps {
  metrics: CandidateMetric[];
}

export default function CandidateMetrics({ metrics }: CandidateMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
          <h4 className="text-sm text-gray-500 font-medium">{metric.label}</h4>
          <div className="flex items-end justify-center mt-2">
            <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
            {metric.subtext && (
              <span className="text-sm text-gray-500 ml-1 mb-1">{metric.subtext}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
