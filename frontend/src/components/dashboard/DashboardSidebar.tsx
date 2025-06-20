'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSafeSearchParams } from '@/lib/hooks/useSafeSearchParams';
import { getSidebarConfig } from '@/components/dashboard/dashboardConfig';

// Helper component to avoid TypeScript error with Link and key prop
interface NavLinkItemProps {
  key?: React.Key; // Allow key prop for React's list rendering reconciliation
  item: {
    name: string;
    href: string;
    icon: React.ReactNode;
  };
  isActive: boolean;
}

function NavLinkItem({ item, isActive }: NavLinkItemProps) {
  return (
    <Link 
      href={item.href} 
      className={`
        flex items-center px-4 py-2 text-sm rounded-md
        ${isActive 
          ? 'bg-slate-700/80 text-white font-medium border-l-4 border-indigo-500' 
          : 'hover:bg-slate-700/50 hover:text-white transition-colors'
        }
      `}
    >
      <span className="mr-3">{item.icon}</span>
      {item.name}
    </Link>
  );
};

interface DashboardSidebarProps {
  userRole: 'admin' | 'student' | 'employer' | 'university';
  userInfo?: {
    name: string;
    company?: string;
    role?: string;
    image?: string;
  };
  currentPath: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * DashboardSidebar Component
 * 
 * A responsive sidebar for dashboard navigation that adapts based on user role.
 */
export default function DashboardSidebar({
  userRole,
  userInfo,
  currentPath,
  isOpen,
  setIsOpen
}: DashboardSidebarProps) {
  // Get the correct navigation items and theme color based on user role
  const { navigationItems, themeColor } = getSidebarConfig(userRole);
  
  // Use our safe search params hook
  const safeSearchParams = useSafeSearchParams();
  const devBypassActive = safeSearchParams.get('dev_bypass') === 'true';
  
  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div className={`
        fixed inset-y-0 left-0 flex flex-col z-40 w-64 
        transition duration-300 ease-in-out transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:inset-0
        bg-slate-900 dark:bg-slate-900 text-gray-200 dark:text-gray-100 shadow-lg
      `}>
        {/* User profile section */}
        <div className="flex flex-col items-center justify-center py-6 px-4 border-b border-slate-700 dark:border-slate-700 bg-slate-800/50 dark:bg-slate-800/70">
          <div className="h-10 w-10 rounded-full bg-slate-700 dark:bg-slate-700 flex items-center justify-center text-gray-200 dark:text-white font-bold text-xl shadow">
            {userInfo?.image ? (
              <img 
                src={userInfo.image} 
                alt={userInfo?.name || 'User'} 
                className="h-full w-full rounded-full object-cover" 
              />
            ) : (
              userInfo?.name?.charAt(0) || 'U'
            )}
          </div>
          <div className="mt-2 text-center">
            <p className="font-medium text-gray-100 dark:text-white">{userInfo?.name || 'User'}</p>
            {userInfo?.company && (
              <p className="text-xs text-slate-400 dark:text-slate-300">{userInfo.company}</p>
            )}
            {userInfo?.role && !userInfo?.company && (
              <p className="text-xs text-slate-400 dark:text-slate-300">{userInfo.role}</p>
            )}
          </div>
        </div>
        
        {/* Navigation section */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navigationItems.map((item) => {
              const baseDashboardPath = `/${userRole}-dashboard`;
                            // Logic to determine if a navigation item should be highlighted as active
                let isActive = false;
                
                if (item.href === baseDashboardPath) {
                  // For the dashboard index, only exact match counts
                  isActive = currentPath === item.href;
                } else {
                  // For other items, we need more specific checks
                  // Extract the section name from the href (e.g., "settings" from "/org-dashboard/settings")
                  const itemSection = item.href.split('/').pop();
                  // Extract the section name from the current path
                  const currentSection = currentPath.split('/').pop();
                  
                  // Only mark as active if the current section matches the item's section
                  isActive = itemSection === currentSection;
                }

              let finalItemHref = item.href;
              if (devBypassActive) {
                // Ensure dev_bypass is appended correctly
                finalItemHref = item.href;
              }
                
              return (
                <NavLinkItem
                  key={item.name}
                  item={{ ...item, href: finalItemHref }}
                  isActive={isActive}
                />
              );
            })}
          </nav>
        </div>
        
        {/* Footer with close button (mobile only) */}
        <div className="p-4 border-t border-slate-700 dark:border-slate-700 md:hidden">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full flex justify-center items-center px-4 py-2 text-sm rounded-md text-gray-200 hover:bg-slate-700/50 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close Menu
          </button>
        </div>
      </div>
    </>
  );
}
