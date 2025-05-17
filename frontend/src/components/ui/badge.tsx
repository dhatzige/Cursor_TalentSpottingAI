import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  className = '' 
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    outline: 'bg-transparent border border-gray-300 text-gray-700'
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variantStyles[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
}
