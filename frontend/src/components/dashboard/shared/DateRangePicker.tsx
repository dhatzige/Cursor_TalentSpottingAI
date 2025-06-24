'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export type DateRange = {
  startDate: Date;
  endDate: Date;
  label?: string;
};

interface DateRangePickerProps {
  onChange: (range: DateRange) => void;
  initialRange?: DateRange;
  className?: string;
  showPresets?: boolean;
}

// Preset date ranges
const presets: Array<{ label: string; getValue: () => DateRange }> = [
  {
    label: 'Last 7 days',
    getValue: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      return { startDate, endDate, label: 'Last 7 days' };
    }
  },
  {
    label: 'Last 30 days',
    getValue: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
      return { startDate, endDate, label: 'Last 30 days' };
    }
  },
  {
    label: 'This month',
    getValue: () => {
      const endDate = new Date();
      const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      return { startDate, endDate, label: 'This month' };
    }
  },
  {
    label: 'Last month',
    getValue: () => {
      const endDate = new Date();
      const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
      endDate.setDate(0); // Last day of previous month
      return { startDate, endDate, label: 'Last month' };
    }
  },
  {
    label: 'This quarter',
    getValue: () => {
      const endDate = new Date();
      const startDate = new Date(endDate.getFullYear(), Math.floor(endDate.getMonth() / 3) * 3, 1);
      return { startDate, endDate, label: 'This quarter' };
    }
  },
  {
    label: 'Year to date',
    getValue: () => {
      const endDate = new Date();
      const startDate = new Date(endDate.getFullYear(), 0, 1);
      return { startDate, endDate, label: 'Year to date' };
    }
  }
];

// Format date as YYYY-MM-DD for input fields
const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Format date for display in a more readable format
const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Get default date range (last 30 days)
const getDefaultDateRange = (): DateRange => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);
  return { startDate, endDate, label: 'Last 30 days' };
};

export default function DateRangePicker({
  onChange,
  initialRange,
  className = '',
  showPresets = true
}: DateRangePickerProps) {
  // Initialize with either provided range or default (last 30 days)
  const [dateRange, setDateRange] = useState<DateRange>(initialRange || getDefaultDateRange());
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(dateRange.label || null);

  // Call onChange when dateRange changes
  useEffect(() => {
    onChange(dateRange);
  }, [dateRange, onChange]);

  // Handle input change
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const date = new Date(value);
    setDateRange(prev => {
      // Make sure the dates are valid
      if (isNaN(date.getTime())) return prev;
      
      // Create new range with updated date
      const newRange: DateRange = { ...prev, [field]: date };
      
      // If start date is after end date, adjust the other date
      if (field === 'startDate' && newRange.startDate > newRange.endDate) {
        newRange.endDate = new Date(newRange.startDate);
      } else if (field === 'endDate' && newRange.endDate < newRange.startDate) {
        newRange.startDate = new Date(newRange.endDate);
      }
      
      // Remove label since this is a custom range now
      setActivePreset(null);
      delete newRange.label;
      
      return newRange;
    });
  };

  // Apply a preset range
  const applyPreset = (preset: typeof presets[0]) => {
    const newRange = preset.getValue();
    setDateRange(newRange);
    setActivePreset(preset.label);
    setIsOpen(false);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdown = document.getElementById('date-range-dropdown');
      if (dropdown && !dropdown.contains(target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block ${className}`} id="date-range-dropdown">
      <Button 
        onClick={toggleDropdown}
        variant="outline"
        size="sm"
        className="flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>
          {dateRange.label || `${formatDateForDisplay(dateRange.startDate)} - ${formatDateForDisplay(dateRange.endDate)}`}
        </span>
        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 min-w-[320px]">
          <div className="p-4">
            {showPresets && (
              <div className="mb-4 grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => applyPreset(preset)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activePreset === preset.label
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={formatDateForInput(dateRange.startDate)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateChange('startDate', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={formatDateForInput(dateRange.endDate)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateChange('endDate', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
