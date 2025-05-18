import React from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Select({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  className = '',
  ...props
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full rounded-md border border-gray-300 px-3 py-2 
        text-gray-900 appearance-none
        focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
