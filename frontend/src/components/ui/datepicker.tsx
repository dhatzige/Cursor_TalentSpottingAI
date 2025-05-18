import React from 'react';

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  className?: string;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({ 
  selected,
  onChange,
  placeholderText = 'Select a date',
  className = '',
  dateFormat = 'MM/dd/yyyy',
  minDate,
  maxDate
}: DatePickerProps) {
  // For this simplified implementation, we're using a basic input type="date"
  // In a real application, you might want to use a proper date picker library like react-datepicker
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      onChange(new Date(value));
    } else {
      onChange(null);
    }
  };
  
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  return (
    <input
      type="date"
      value={formatDateForInput(selected)}
      onChange={handleChange}
      placeholder={placeholderText}
      min={minDate ? formatDateForInput(minDate) : undefined}
      max={maxDate ? formatDateForInput(maxDate) : undefined}
      className={`
        w-full rounded-md border border-gray-300 px-3 py-2 
        text-gray-900 placeholder-gray-500 
        focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
    />
  );
}
