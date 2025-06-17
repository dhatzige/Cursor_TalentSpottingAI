'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

interface UnifiedDashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  showBackButton?: boolean;
  onBackClick?: () => void;
  userInfo?: {
    name: string;
    company?: string;
    role?: string;
    image?: string;
  };
  // Role determines the sidebar items and color theme
  userRole: 'admin' | 'student' | 'employer' | 'university';
  // Optional className for main content
  className?: string;
}

/**
 * UnifiedDashboardLayout
 * 
 * A standardized layout component for all dashboard types in the application.
 * Provides consistent navigation, theme, and layout while supporting role-specific customizations.
 */
export default function UnifiedDashboardLayout({
  children,
  title,
  description,
  actions,
  breadcrumbs,
  showBackButton = false,
  onBackClick,
  userInfo = {
    name: 'Demo User',
    role: 'User',
  },
  userRole,
  className = '',
}: UnifiedDashboardLayoutProps) {
  const pathname = usePathname() || '';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Extract the content to pass as explicit children prop to ThemeProvider
  const dashboardContent = (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        {/* Sidebar component - changes based on userRole */}
        <DashboardSidebar 
          userRole={userRole}
          userInfo={userInfo}
          currentPath={pathname}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        
        {/* Main Content */}
        <div className="flex flex-col flex-1 w-0 overflow-hidden bg-white dark:bg-gray-800">
          {/* Fixed height header */}
          <div className="flex-shrink-0">
            <DashboardHeader
              title={title}
              description={description}
              breadcrumbs={breadcrumbs}
              actions={actions}
              showBackButton={showBackButton}
              onBackButton={onBackClick}
              onMenuButtonClick={() => setSidebarOpen(true)}
              userInfo={userInfo}
            />
          </div>
          
          {/* Main scrollable area with proper top spacing */}
          <main className={`flex-1 relative overflow-y-auto focus:outline-none ${className}`}>
            <div className="py-6 mt-6"> {/* Added margin-top for separation from navbar */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Page content */}
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
  );
  
  return (
    <ThemeProvider children={dashboardContent} />
  );
}
