import React from 'react';

type InputProps = {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
  type?: string;
  placeholder?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: any) => void; // Using any to avoid type issues
  onBlur?: (e: any) => void;   // Using any to avoid type issues
  [key: string]: any; // For any additional props
};

// Create a simple input component without using forwardRef
const Input = ({ 
  label, 
  error, 
  fullWidth = true, 
  className = '', 
  ...props 
}: InputProps) => {
    const baseStyles = 'px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500';
    const errorStyles = error 
      ? 'border-red-500 focus:ring-red-500' 
      : 'border-gray-300';
    const widthClass = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`mb-4 ${widthClass}`}>
        {label && (
          <label className="block text-gray-700 font-medium mb-2">
            {label}
          </label>
        )}
        <input
          className={`${baseStyles} ${errorStyles} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
};

Input.displayName = 'Input';

export default Input;
