'use client';

import React, { ReactNode } from 'react';
import Button from './Button';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export default function DashboardHeader({
  title,
  description,
  children,
  actions,
  breadcrumbs = []
}: DashboardHeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumbs if provided */}
      {breadcrumbs.length > 0 && (
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                )}
                {crumb.href ? (
                  <a href={crumb.href} className={`text-sm font-medium ${index === breadcrumbs.length - 1 ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
                    {crumb.label}
                  </a>
                ) : (
                  <span className={`text-sm font-medium ${index === breadcrumbs.length - 1 ? 'text-blue-600' : 'text-gray-600'}`}>
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header content */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>

      {/* Optional additional content */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
