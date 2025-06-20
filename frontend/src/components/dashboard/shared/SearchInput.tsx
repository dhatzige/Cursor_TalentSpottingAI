'use client';

import React, { useState, useRef, useEffect } from 'react';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  showSearchButton?: boolean;
}

export default function SearchInput({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  className = '',
  autoFocus = false,
  name,
  id,
  size = 'md',
  fullWidth = false,
  showSearchButton = true
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value || '');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Update local state when external value changes
  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);
  
  // Auto-focus the input if specified
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Get size-specific styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-3 text-sm';
      case 'md':
        return 'py-2.5 px-4 text-base';
      case 'lg':
        return 'py-3 px-5 text-lg';
      default:
        return 'py-2.5 px-4 text-base';
    }
  };
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };
  
  // Handle search
  const handleSearch = () => {
    onSearch?.(inputValue);
  };
  
  // Handle key down (for Enter key)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      handleSearch();
    }
  };
  
  // Build class names
  const inputClasses = [
    'border border-gray-300 rounded-l-md bg-white text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white',
    getSizeStyles(),
    fullWidth ? 'w-full' : '',
    !showSearchButton ? 'rounded-r-md' : '',
    className
  ].join(' ');
  
  return (
    <div className={`flex ${fullWidth ? 'w-full' : ''}`}>
      <div className={`relative ${fullWidth ? 'flex-grow' : ''}`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          name={name}
          id={id}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={`pl-10 ${inputClasses}`}
          aria-label={placeholder}
        />
      </div>
      {showSearchButton && (
        <button
          type="button"
          onClick={handleSearch}
          className={`inline-flex items-center px-4 border border-l-0 border-gray-300 rounded-r-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:border-gray-700 ${getSizeStyles()}`}
          aria-label="Search"
        >
          Search
        </button>
      )}
    </div>
  );
}
