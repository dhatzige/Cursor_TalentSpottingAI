'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '../theme/ThemeProvider';





interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
}

interface EnhancedDashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  showBackButton?: boolean;
  onBackClick?: () => void;
  userInfo?: {
    name: string;
    company: string;
    image?: string;
  };
  navigationItems: NavItem[];
  bottomNavigationItems: NavItem[];
}

export default function EnhancedDashboardLayout({
  children,
  title,
  description,
  actions,
  breadcrumbs,
  showBackButton = false,
  onBackClick,
  userInfo = {
    name: 'Your Name',
    company: 'Your Company',
    image: undefined
  },
  navigationItems,
  bottomNavigationItems,
}: EnhancedDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname() || '';

  // Check if a navigation item is active based on the current path
  const isActive = (href: string) => {
    if (href === '/organization-dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Toggle mobile sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle back button click
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;
    
    return (
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
                <Link href={crumb.href} className={`inline-flex items-center text-sm font-medium ${index === breadcrumbs.length - 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                  {index === 0 && (
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                  )}
                  {crumb.label}
                </Link>
              ) : (
                <span className={`inline-flex items-center text-sm font-medium ${index === breadcrumbs.length - 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {index === 0 && (
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                  )}
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  };

  const layoutContentForThemeProvider = (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          ></div>
        )}

        {/* Sidebar for mobile */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold text-white">TalentSpottingAI</span>
              </div>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
              onClick={toggleSidebar}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col h-0 flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800">
            {/* Mobile user info */}
            <div className="px-4 py-6 border-b border-gray-800">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {userInfo.image ? (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={userInfo.image}
                      alt={userInfo.name}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {userInfo.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{userInfo.name}</p>
                  <p className="text-xs font-medium text-gray-400">{userInfo.company}</p>
                </div>
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigationItems.map((item) => (
                <Link href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Mobile bottom navigation */}
            <div className="px-2 py-4 space-y-1 border-t border-gray-800">
              {bottomNavigationItems.map((item) => (
                <Link href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1 bg-gradient-to-b from-gray-900 to-gray-800">
              <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-800">
                <span className="text-xl font-bold text-white">TalentSpottingAI</span>
              </div>
              <div className="flex-1 flex flex-col overflow-y-auto">
                {/* Desktop user info */}
                <div className="px-4 py-6 border-b border-gray-800">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {userInfo.image ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={userInfo.image}
                          alt={userInfo.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                          {userInfo.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{userInfo.name}</p>
                      <p className="text-xs font-medium text-gray-400">{userInfo.company}</p>
                    </div>
                  </div>
                </div>
                
                {/* Desktop Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-1">
                  {navigationItems.map((item) => (
                    <Link
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive(item.href)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                </nav>
                
                {/* Desktop bottom navigation */}
                <div className="px-2 py-4 mt-auto space-y-1 border-t border-gray-800">
                  {bottomNavigationItems.map((item) => (
                    <Link
                      href={item.href}
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top navigation */}
          <header className="bg-white dark:bg-gray-800 shadow">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <button
                    type="button"
                    className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                    onClick={toggleSidebar}
                  >
                    <span className="sr-only">Open sidebar</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  
                  {/* Back button */}
                  {showBackButton && (
                    <button
                      type="button"
                      onClick={handleBackClick}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back
                    </button>
                  )}
                </div>
                
                {/* Header right section */}
                <div className="flex items-center">
                  {/* Notification bell */}
                  <button
                    type="button"
                    className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                  
                  {/* User menu (desktop only) */}
                  <div className="hidden sm:ml-3 sm:flex sm:items-center">
                    {userInfo.image ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={userInfo.image}
                        alt={userInfo.name}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                        {userInfo.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="py-6">
              <div className="px-4 sm:px-6 lg:px-8">
                {/* Page header */}
                {(title || description || actions) && (
                  <div className="mb-6">
                    {renderBreadcrumbs()}
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1 min-w-0">
                        {title && <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>}
                        {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
                      </div>
                      {actions && <div className="mt-4 sm:mt-0 sm:ml-4">{actions}</div>}
                    </div>
                  </div>
                )}
                
                {/* Main content */}
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
  );

  return (
    <ThemeProvider dark={false} children={layoutContentForThemeProvider} />
  );
}
