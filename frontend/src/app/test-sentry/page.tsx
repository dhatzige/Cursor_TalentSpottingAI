'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function TestSentryPage() {
  const [isLoading, setIsLoading] = useState(false);

  const triggerError = () => {
    setIsLoading(true);
    
    // Add some context
    Sentry.setContext('test_info', {
      test_type: 'manual_error_trigger',
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
    });

    // Add a breadcrumb
    Sentry.addBreadcrumb({
      message: 'User clicked test error button',
      level: 'info',
      category: 'user_action'
    });

    setTimeout(() => {
      setIsLoading(false);
      throw new Error('Test error from Sentry test page - this is intentional for testing error tracking');
    }, 1000);
  };

  const triggerAsyncError = async () => {
    setIsLoading(true);
    
    try {
      // Simulate an async operation that fails
      await new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Async test error - this is intentional for testing'));
        }, 1000);
      });
    } catch (error) {
      Sentry.captureException(error);
      setIsLoading(false);
    }
  };

  const triggerNetworkError = async () => {
    setIsLoading(true);
    
    try {
      // Try to fetch from a non-existent endpoint
      const response = await fetch('/api/non-existent-endpoint');
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          error_type: 'network_error',
          test_scenario: 'manual_trigger'
        }
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sentry Error Tracking Test</h1>
        
        <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 mb-8">
          <h2 className="text-green-400 font-semibold mb-2">✅ Authentication Fix Completed (2025-06-21)</h2>
          <p className="text-green-300 text-sm">
            Successfully resolved redirect loop issue by unifying Clerk authentication across frontend and backend. 
            All API routes now use clerkAuth middleware, and frontend services properly pass Clerk tokens.
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Sentry Integration Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold text-blue-400">Frontend</h3>
              <p className="text-sm text-gray-300">Next.js + Sentry SDK</p>
              <p className="text-xs text-gray-400">DSN: ...52240</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold text-green-400">Backend</h3>
              <p className="text-sm text-gray-300">Express + Sentry SDK</p>
              <p className="text-xs text-gray-400">DSN: ...45456</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Error Tracking</h2>
          <p className="text-gray-300 mb-6">
            Click the buttons below to trigger different types of errors and verify they appear in Sentry:
          </p>
          
          <div className="space-y-4">
            <button
              onClick={triggerError}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isLoading ? 'Triggering Error...' : 'Trigger Synchronous Error'}
            </button>
            
            <button
              onClick={triggerAsyncError}
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isLoading ? 'Triggering Error...' : 'Trigger Async Error'}
            </button>
            
            <button
              onClick={triggerNetworkError}
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isLoading ? 'Triggering Error...' : 'Trigger Network Error'}
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-gray-700 rounded">
            <h3 className="font-semibold mb-2">How to verify:</h3>
            <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
              <li>Click one of the error buttons above</li>
              <li>Check your browser's developer console for the error</li>
              <li>Visit your Sentry dashboard to see the captured error</li>
              <li>Verify error details, context, and breadcrumbs are present</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 