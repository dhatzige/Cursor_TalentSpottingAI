import React, { useState, useEffect, useRef } from 'react';
import { Badge } from './badge';

interface MultiSelectOption {
  value: string;
  label: string;
  data?: any;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: MultiSelectOption[];
  onChange: (selected: MultiSelectOption[]) => void;
  placeholder?: string;
  className?: string;
  maxItems?: number;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  className = '',
  maxItems,
  disabled = false
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(
    (option) =>
      !value.some((selected) => selected.value === option.value) &&
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add an option to the selection
  const handleSelect = (option: MultiSelectOption) => {
    if (maxItems && value.length >= maxItems) {
      return;
    }
    onChange([...value, option]);
    setSearchTerm('');
    setIsOpen(true); // Keep dropdown open
  };

  // Remove an option from the selection
  const handleRemove = (optionValue: string) => {
    onChange(value.filter((option) => option.value !== optionValue));
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
    >
      {/* Selected items and search input */}
      <div
        className={`
          flex flex-wrap items-center gap-1 border rounded-md p-2 bg-white cursor-text
          ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
        `}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
          }
        }}
      >
        {value.map((option) => (
          <div key={option.value} className="inline-block">
            <Badge 
              variant="default" 
              className="flex items-center gap-1 mr-1 mb-1"
              children={
                <>
                  <span>{option.label}</span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleRemove(option.value);
                      }}
                      className="ml-1 hover:text-gray-700 focus:outline-none"
                    >
                      ×
                    </button>
                  )}
                </>
              }
            />
          </div>
        ))}
        
        {/* Input field */}
        {(!maxItems || value.length < maxItems) && (
          <input
            type="text"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 outline-none min-w-[8rem] bg-transparent disabled:cursor-not-allowed"
            disabled={disabled}
          />
        )}
      </div>

      {/* Options dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">No options found</div>
          ) : (
            <div className="py-1">
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50"
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Message when max items is reached */}
      {maxItems && value.length >= maxItems && (
        <div className="text-xs text-gray-500 mt-1">
          Maximum of {maxItems} items selected
        </div>
      )}
    </div>
  );
}
