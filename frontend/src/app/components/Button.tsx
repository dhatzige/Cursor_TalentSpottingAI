import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '',
  fullWidth = false,
  type = 'button',
  disabled = false,
  onClick,
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-blue-900 focus:ring-gray-400',
    outline: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthClass} ${disabledClass} ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
