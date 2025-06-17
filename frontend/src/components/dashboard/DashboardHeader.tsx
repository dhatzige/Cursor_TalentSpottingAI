'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  showBackButton?: boolean;
  onBackButton?: () => void;
  onMenuButtonClick?: () => void;
  userInfo?: {
    name: string;
    role?: string;
    company?: string;
    image?: string;
  };
}

/**
 * DashboardHeader Component
 * 
 * A consistent header for dashboard pages with title, breadcrumbs, actions,
 * and responsive hamburger menu for mobile.
 */
export default function DashboardHeader({
  title,
  description,
  breadcrumbs,
  actions,
  showBackButton = false,
  onBackButton,
  onMenuButtonClick,
  userInfo
}: DashboardHeaderProps) {
  return (
    <header className="relative z-10 flex-shrink-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 shadow-sm text-gray-800 dark:text-white">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side: Menu button (mobile) + Breadcrumbs/Title */}
          <div className="flex">
            {/* Mobile menu button */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onMenuButtonClick}
              aria-label="Open sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Breadcrumbs and title */}
            <div className="flex flex-col justify-center">
              {/* Breadcrumbs */}
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex items-center text-sm font-medium">
                  {showBackButton && (
                    <button 
                      onClick={onBackButton}
                      className="mr-2 text-slate-300 hover:text-white"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    </button>
                  )}
                  
                  {breadcrumbs.map((item, index) => (
                    <div key={index} className="inline-flex items-center">
                      {index > 0 && (
                        <svg className="mx-2 h-5 w-5 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      
                      {item.href ? (
                        <Link 
                          href={item.href}
                          className="text-slate-300 hover:text-white dark:text-blue-300 dark:hover:text-blue-200"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span className="text-gray-100 dark:text-white">{item.label}</span>
                      )}
                    </div>
                  ))}
                </nav>
              )}
              
              {/* Title and description */}
              {title && (
                <div className={`${breadcrumbs && breadcrumbs.length > 0 ? 'mt-1' : ''}`}>
                  <h1 className="text-xl font-semibold text-white">
                    {title}
                  </h1>
                  {description && (
                    <p className="mt-1 text-sm text-slate-300">
                      {description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Right side: Actions */}
          <div className="flex items-center ml-4 md:ml-6">
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
            
            {/* User menu - simplified version */}
            {userInfo && (
              <div className="ml-3 relative flex items-center">
                <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-gray-200">
                  {userInfo.image ? (
                    <img 
                      src={userInfo.image} 
                      alt={userInfo.name} 
                      className="h-full w-full rounded-full object-cover" 
                    />
                  ) : (
                    userInfo.name.charAt(0)
                  )}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-100 hidden sm:block">
                  {userInfo.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
