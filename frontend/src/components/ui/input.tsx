import React from 'react';

interface InputProps {
  className?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  [key: string]: any; // Allow any other standard input props
}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`
        w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 
        text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
        bg-white dark:bg-slate-800
        focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    />
  );
}
