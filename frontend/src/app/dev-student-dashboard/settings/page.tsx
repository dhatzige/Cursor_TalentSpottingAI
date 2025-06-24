'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';

/**
 * Settings page for the student dashboard (dev mode)
 */
export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock user info
  const userInfo = {
    name: 'Alex Johnson',
    role: 'Student',
  };

  // Create the settings content
  const settingsContent = (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button className="px-6 py-3 border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium text-sm">
                Account
              </button>
              <button className="px-6 py-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium text-sm">
                Notifications
              </button>
              <button className="px-6 py-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium text-sm">
                Privacy
              </button>
              <button className="px-6 py-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium text-sm">
                Integrations
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 dark:text-white mb-4">Account Settings</h3>
                
                <div className="space-y-4">
                  {/* Name */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        First name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          defaultValue="Alex"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-slate-700 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="last-name"
                          id="last-name"
                          defaultValue="Johnson"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-slate-700 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        defaultValue="alex.johnson@university.edu"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-slate-700 rounded-md"
                      />
                    </div>
                  </div>
                  
                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Change password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-slate-700 rounded-md"
                      />
                    </div>
                  </div>
                  
                  {/* Preferences */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme preferences</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="theme-system"
                          name="theme"
                          type="radio"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="theme-system" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                          System default
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="theme-light"
                          name="theme"
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="theme-light" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                          Light theme
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="theme-dark"
                          name="theme"
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="theme-dark" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                          Dark theme
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700/50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <UnifiedDashboardLayout children={settingsContent} />
  );
}
