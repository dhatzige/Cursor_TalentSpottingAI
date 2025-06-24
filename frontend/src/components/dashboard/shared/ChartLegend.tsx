'use client';

import React from 'react';

export interface LegendItem {
  label: string;
  color: string;
  value?: string | number;
  percentage?: number;
  isActive?: boolean;
}

interface ChartLegendProps {
  items: LegendItem[];
  onClick?: (item: LegendItem, index: number) => void;
  className?: string;
  layout?: 'horizontal' | 'vertical';
  showValues?: boolean;
  showPercentages?: boolean;
  showDots?: boolean;
  showBoxes?: boolean;
}

export default function ChartLegend({
  items,
  onClick,
  className = '',
  layout = 'horizontal',
  showValues = false,
  showPercentages = false,
  showDots = true,
  showBoxes = false
}: ChartLegendProps) {
  const isClickable = Boolean(onClick);
  
  // Determine the container class based on layout
  const containerClass = layout === 'horizontal' 
    ? 'flex flex-wrap gap-x-4 gap-y-2' 
    : 'flex flex-col space-y-2';
    
  return (
    <div className={`${containerClass} ${className}`}>
      {items.map((item, index) => (
        <div 
          key={`${item.label}-${index}`}
          className={`flex items-center text-sm ${
            isClickable 
              ? 'cursor-pointer hover:opacity-80' 
              : ''
          } ${
            item.isActive === false
              ? 'opacity-40'
              : ''
          }`}
          onClick={isClickable && onClick ? () => onClick(item, index) : undefined}
        >
          {/* Color indicator */}
          {showDots && !showBoxes && (
            <span 
              className="mr-2 h-3 w-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: item.color }}
            />
          )}
          
          {/* Color box */}
          {showBoxes && !showDots && (
            <span 
              className="mr-2 h-3 w-3 rounded-sm flex-shrink-0" 
              style={{ backgroundColor: item.color }}
            />
          )}
          
          {/* Label */}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {item.label}
          </span>
          
          {/* Value */}
          {showValues && item.value !== undefined && (
            <span className="ml-1 font-semibold text-gray-900 dark:text-white">
              {item.value}
            </span>
          )}
          
          {/* Percentage */}
          {showPercentages && item.percentage !== undefined && (
            <span className="ml-1 text-gray-500 dark:text-gray-400">
              ({item.percentage}%)
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
