import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`
        w-full rounded-md border border-gray-300 px-3 py-2 
        text-gray-900 placeholder-gray-500 
        focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    />
  );
}
