'use client';

import React, { ReactNode } from 'react';
import Card from './Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  // Support both the original change object format and the new trend number format
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  // New trend properties for compatibility with MetricGrid
  trend?: number;
  trendLabel?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  tooltip?: string;
  loading?: boolean;
  footer?: string;
  onClick?: () => void;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  trend,
  trendLabel,
  color = 'blue',
  tooltip,
  loading = false,
  footer,
  onClick,
  className = ''
}: StatCardProps) {
  // Get trend color based on value
  const getTrendColor = () => {
    // For legacy change object
    if (change) {
      if (change.type === 'increase') return 'text-green-600 dark:text-green-400';
      if (change.type === 'decrease') return 'text-red-600 dark:text-red-400';
      return 'text-gray-600 dark:text-gray-400';
    }
    
    // For trend number format
    if (trend !== undefined) {
      if (trend > 0) return 'text-green-600 dark:text-green-400';
      if (trend < 0) return 'text-red-600 dark:text-red-400';
      return 'text-gray-600 dark:text-gray-400';
    }
    
    return 'text-gray-600 dark:text-gray-400';
  };
  
  // Get trend value as formatted string
  const getTrendValue = () => {
    // For legacy change object
    if (change) {
      return `${Math.abs(change.value)}%`;
    }
    
    // For trend number format
    if (trend !== undefined) {
      return trend === 0 ? '0%' : `${Math.abs(trend)}%`;
    }
    
    return null;
  };

  // Format the icon with the specified color
  const getIconStyles = () => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'red':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'purple':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'gray':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
      case 'blue':
      default:
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };
  
  const iconElement = icon && (
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconStyles()}`} data-component-name="StatCard">
      {icon}
    </div>
  );

  // Prepare the content that will be passed as children to Card
  const cardContent = (
    <div data-component-name="StatCard" className="relative p-2 h-full">
      {/* Title row */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400" data-component-name="StatCard">{title}</h3>
      </div>
      
      {/* Value & trend */}
      <div className="mt-2 flex items-baseline justify-between" data-component-name="StatCard">
        <div className="text-2xl font-semibold text-gray-900 dark:text-white" data-component-name="StatCard">
          {value}
        </div>
        {(change || trend !== undefined) && (
          <div
            className={`text-sm font-medium ${getTrendColor()}`}
            style={{ minWidth: '50px', textAlign: 'right' }}
            data-component-name="StatCard"
          >
            {getTrendValue()}
          </div>
        )}
      </div>
      
      {/* Footer if needed */}
      {footer && <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">{footer}</div>}
    </div>
  );

  return (
    <Card
      className={`transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-lg' : ''} border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 ${className}`}
      interactive={!!onClick}
      onActionClick={onClick}
      children={cardContent}
    />
  );
}
