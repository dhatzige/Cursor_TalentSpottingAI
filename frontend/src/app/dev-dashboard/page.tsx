'use client';

export const dynamic = 'force-dynamic'; // Required for client-side functionality

import React from 'react';
import Link from 'next/link';

/**
 * Enhanced Developer Dashboard
 * Professional testing interface for role switching and dashboard access
 */
export default function DevDashboard() {
  const testAccounts = [
    {
      role: 'Student',
      name: 'Maria Papadopoulos',
      email: 'student@uoa.gr',
      university: 'University of Athens',
      icon: '👩‍🎓',
      color: 'blue',
      dashboardUrl: '/student-dashboard?dev_bypass=true',
      features: ['Profile Management', 'Job Applications', 'University Integration']
    },
    {
      role: 'Employer',
      name: 'Dimitris Kostas',
      email: 'hr@techstartup.gr',
      company: 'TechStartup Greece',
      icon: '🏢',
      color: 'green',
      dashboardUrl: '/organization-dashboard?dev_bypass=true',
      features: ['Talent Search', 'Job Postings', 'Candidate Management']
    },
    {
      role: 'University',
      name: 'Prof. Elena Katsarou',
      email: 'career@auth.gr',
      university: 'Aristotle University',
      icon: '🎓',
      color: 'purple',
      dashboardUrl: '/university-dashboard?dev_bypass=true',
      features: ['Student Analytics', 'Employer Relations', 'Career Services']
    },
    {
      role: 'Admin',
      name: 'System Administrator',
      email: 'admin@talentspotting.ai',
      company: 'TalentSpotting AI',
      icon: '⚡',
      color: 'red',
      dashboardUrl: '/admin-dashboard?dev_bypass=true',
      features: ['User Management', 'System Analytics', 'Platform Control']
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-300',
        button: 'bg-blue-600 hover:bg-blue-700 text-white'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-700 dark:text-green-300',
        button: 'bg-green-600 hover:bg-green-700 text-white'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-700 dark:text-purple-300',
        button: 'bg-purple-600 hover:bg-purple-700 text-white'
      },
      red: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-700 dark:text-red-300',
        button: 'bg-red-600 hover:bg-red-700 text-white'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 Developer Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Professional testing interface for TalentSpotting AI
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-4xl mx-auto">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Development Mode Active
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>
                    You're using the professional dev bypass system. All dashboards use realistic mock data 
                    and skip authentication for faster testing. Perfect for UI development and feature testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testAccounts.map((account) => {
            const colors = getColorClasses(account.color);
            return (
              <div
                key={account.role}
                className={`${colors.bg} ${colors.border} border rounded-xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-4xl mr-4">{account.icon}</div>
                    <div>
                      <h3 className={`text-xl font-bold ${colors.text} mb-1`}>
                        {account.role} Dashboard
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {account.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {account.email}
                  </div>
                  {(account.university || account.company) && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      {account.university || account.company}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className={`text-sm font-semibold ${colors.text} mb-2`}>Key Features:</h4>
                  <ul className="space-y-1">
                    {account.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="h-3 w-3 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <Link
                    href={account.dashboardUrl}
                    className={`flex-1 ${colors.button} px-4 py-2 rounded-lg font-medium text-center transition-colors duration-200`}
                  >
                    Enter Dashboard
                  </Link>
                  <button
                    onClick={() => navigator.clipboard.writeText(account.dashboardUrl)}
                    className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    title="Copy URL"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                      <path d="M3 5a2 2 0 012-2 3 3 0 003 3h6a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L13.414 13H17v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11.586l-1.293 1.293a1 1 0 001.414 1.414L18 11.414V9h-3v2.586z" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Access Commands */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🛠️ Developer Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Quick Navigation
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Shift+D</kbd> to toggle dev navigation bar
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">?dev_nav=true</code> to any URL for persistent nav
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Server Status
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-400">Frontend: http://localhost:3001</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-400">Backend: http://localhost:4000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            This dashboard is only available in development mode. 
            Use <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">?dev_bypass=true</code> for authentication bypass.
          </p>
        </div>
      </div>
    </div>
  );
}
