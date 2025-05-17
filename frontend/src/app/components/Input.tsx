import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
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
          ref={ref}
          className={`${baseStyles} ${errorStyles} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
