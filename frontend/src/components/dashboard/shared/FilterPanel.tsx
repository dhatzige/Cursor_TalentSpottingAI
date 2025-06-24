'use client';

import React, { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroupProps {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function FilterGroup({
  title,
  children,
  collapsible = true,
  defaultOpen = true
}: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="py-4 border-b border-gray-200 last:border-b-0 dark:border-gray-700">
      <div 
        className={`flex items-center justify-between mb-2 ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
      >
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 dark:text-white">{title}</h3>
        {collapsible && (
          <button 
            type="button"
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse' : 'Expand'}
          >
            <svg 
              className={`h-5 w-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      <div className={`space-y-2 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  );
}

interface CheckboxFilterProps {
  options: FilterOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  showCount?: boolean;
  maxVisible?: number;
}

export function CheckboxFilter({
  options,
  selectedIds,
  onChange,
  showCount = true,
  maxVisible = 5
}: CheckboxFilterProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleOptions = showAll ? options : options.slice(0, maxVisible);
  
  const handleChange = (optionId: string) => {
    if (selectedIds.includes(optionId)) {
      onChange(selectedIds.filter(id => id !== optionId));
    } else {
      onChange([...selectedIds, optionId]);
    }
  };
  
  return (
    <div className="space-y-2">
      {visibleOptions.map(option => (
        <div key={option.id} className="flex items-center">
          <input
            id={`filter-${option.id}`}
            name={`filter-${option.id}`}
            type="checkbox"
            checked={selectedIds.includes(option.id)}
            onChange={() => handleChange(option.id)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800"
          />
          <label htmlFor={`filter-${option.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            {option.label}
            {showCount && option.count !== undefined && (
              <span className="text-gray-500 ml-1">({option.count})</span>
            )}
          </label>
        </div>
      ))}
      
      {options.length > maxVisible && (
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mt-2"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Less' : `Show More (${options.length - maxVisible})`}
        </button>
      )}
    </div>
  );
}

interface RangeFilterProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
}

export function RangeFilter({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (val) => val.toString()
}: RangeFilterProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value);
    onChange([Math.min(newMin, value[1]), value[1]]);
  };
  
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    onChange([value[0], Math.max(newMax, value[0])]);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-24">
          <label htmlFor="min-value" className="block text-xs text-gray-500 dark:text-gray-400">
            Min
          </label>
          <input
            type="number"
            id="min-value"
            min={min}
            max={value[1]}
            step={step}
            value={value[0]}
            onChange={handleMinChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        <div className="text-gray-500 dark:text-gray-400">to</div>
        <div className="w-24">
          <label htmlFor="max-value" className="block text-xs text-gray-500 dark:text-gray-400">
            Max
          </label>
          <input
            type="number"
            id="max-value"
            min={value[0]}
            max={max}
            step={step}
            value={value[1]}
            onChange={handleMaxChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>
      
      <div className="px-2">
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={handleMinChange}
            className="absolute z-10 w-full h-2 appearance-none pointer-events-none opacity-0"
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[1]}
            onChange={handleMaxChange}
            className="absolute z-20 w-full h-2 appearance-none pointer-events-none opacity-0"
          />
          
          <div className="relative z-0 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="absolute h-full bg-blue-500 rounded-full"
              style={{
                left: `${((value[0] - min) / (max - min)) * 100}%`,
                width: `${((value[1] - value[0]) / (max - min)) * 100}%`
              }}
            ></div>
          </div>
          
          <div
            className="absolute z-30 w-4 h-4 bg-gray-50 dark:bg-slate-800/50 border-2 border-blue-500 rounded-full -mt-1 transform -translate-x-1/2"
            style={{ left: `${((value[0] - min) / (max - min)) * 100}%` }}
          ></div>
          <div
            className="absolute z-30 w-4 h-4 bg-gray-50 dark:bg-slate-800/50 border-2 border-blue-500 rounded-full -mt-1 transform -translate-x-1/2"
            style={{ left: `${((value[1] - min) / (max - min)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}

interface FilterPanelProps {
  children: ReactNode;
  title?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  onClear?: () => void;
  onApply?: () => void;
  className?: string;
}

export default function FilterPanel({
  children,
  title = 'Filters',
  collapsible = true,
  defaultOpen = true,
  onClear,
  onApply,
  className = ''
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 dark:text-white">{title}</h2>
        {collapsible && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-md"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse filters' : 'Expand filters'}
          >
            <svg 
              className={`h-5 w-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6">
          {children}
        </div>
        
        {(onClear || onApply) && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            {onClear && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClear}
              >
                Clear All
              </Button>
            )}
            {onApply && (
              <Button
                variant="primary"
                size="sm"
                onClick={onApply}
              >
                Apply Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
