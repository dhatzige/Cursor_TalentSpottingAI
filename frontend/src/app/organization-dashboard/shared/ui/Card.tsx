'use client';

import React, { ReactNode, useState } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  actionIcon?: ReactNode;
  onActionClick?: () => void;
  className?: string;
  interactive?: boolean;
  hoverable?: boolean;
  footer?: ReactNode;
}

export default function Card({
  children,
  title,
  subtitle,
  icon,
  actionIcon,
  onActionClick,
  className = '',
  interactive = false,
  hoverable = true,
  footer
}: CardProps) {
  // Explicitly type the theme object returned by useTheme
  const { isDark } = useTheme() as { colors: typeof import('@/components/theme/ThemeProvider').themeColors, isDark: boolean };
  const [isHovered, setIsHovered] = useState(false);
  
  // Base styles
  const baseStyles = isDark
    ? 'bg-gray-800/50 border border-gray-700 text-white'
    : 'bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white';
    
  // Hover styles
  const hoverStyles = hoverable
    ? isDark
      ? 'hover:bg-gray-800 hover:border-gray-600 transition-all duration-300'
      : 'hover:shadow-lg hover:border-gray-300 transition-all duration-300'
    : '';
    
  // Interactive styles (clickable card)
  const interactiveStyles = interactive
    ? 'cursor-pointer transform transition-transform duration-300' + (isHovered ? ' scale-[1.02]' : '')
    : '';
    
  return (
    <div
      className={`rounded-lg overflow-hidden ${baseStyles} ${hoverStyles} ${interactiveStyles} ${className}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      onClick={interactive && onActionClick ? onActionClick : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive && title ? title : undefined}
      data-component-name="Card"
    >
      {(title || icon || actionIcon) && (
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            {icon && <div className="mr-3">{icon}</div>}
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>}
            </div>
          </div>
          {actionIcon && (
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onActionClick?.();
              }}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
              aria-label="Card action"
            >
              {actionIcon}
            </button>
          )}
        </div>
      )}
      <div className="p-6" data-component-name="Card">{children}</div>
      {footer && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
}
