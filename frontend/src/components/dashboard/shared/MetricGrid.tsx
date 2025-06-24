'use client';

import React from 'react';
import StatCard from './StatCard';

export interface Metric {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  formatter?: (value: string | number) => string;
  tooltip?: string;
  loading?: boolean;
}

interface MetricGridProps {
  metrics: Metric[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  onClick?: (metric: Metric) => void;
}

export default function MetricGrid({
  metrics,
  columns = 3,
  className = '',
  onClick
}: MetricGridProps) {
  // Generate grid columns class based on the columns prop
  const getGridClass = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Format the value if a formatter is provided
  const formatValue = (metric: Metric) => {
    if (metric.formatter) {
      return metric.formatter(metric.value);
    }
    return metric.value;
  };

  return (
    <div className={`grid ${getGridClass()} gap-4 ${className}`}>
      {metrics.map((metric) => (
        <div key={metric.id}>
          <StatCard
            title={metric.label}
            value={formatValue(metric)}
            trend={metric.change}
            trendLabel={metric.changeLabel}
            icon={metric.icon}
            color={metric.color}
            tooltip={metric.tooltip}
            loading={metric.loading}
            onClick={onClick ? () => onClick(metric) : undefined}
            className={onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
          />
        </div>
      ))}
    </div>
  );
}
