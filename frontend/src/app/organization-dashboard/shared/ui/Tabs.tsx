'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  queryParamName?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
  className?: string;
}

export default function Tabs({
  tabs,
  defaultTabId,
  queryParamName,
  onChange,
  variant = 'default',
  fullWidth = false,
  className = '',
}: TabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get active tab from URL if queryParamName is provided, otherwise use defaultTabId or first tab
  const initialTabId = queryParamName 
    ? searchParams.get(queryParamName) || defaultTabId || tabs[0]?.id 
    : defaultTabId || tabs[0]?.id;
    
  const [activeTabId, setActiveTabId] = useState(initialTabId);
  
  // Update active tab when URL changes
  useEffect(() => {
    if (queryParamName) {
      const tabFromUrl = searchParams.get(queryParamName);
      if (tabFromUrl && tabFromUrl !== activeTabId && tabs.some(tab => tab.id === tabFromUrl)) {
        setActiveTabId(tabFromUrl);
      }
    }
  }, [searchParams, queryParamName, activeTabId, tabs]);
  
  // Handle tab change
  const handleTabChange = (tabId: string) => {
    // Don't do anything if the tab is disabled
    if (tabs.find(tab => tab.id === tabId)?.disabled) {
      return;
    }
    
    setActiveTabId(tabId);
    
    // Update URL if queryParamName is provided
    if (queryParamName) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(queryParamName, tabId);
      
      // Update the URL without refreshing the page
      router.push(`?${params.toString()}`, { scroll: false });
    }
    
    // Call onChange handler
    onChange?.(tabId);
  };
  
  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'pills':
        return {
          container: 'p-1 bg-gray-100 dark:bg-gray-800 rounded-lg',
          tab: 'py-2 px-4 rounded-md transition-colors duration-200',
          active: 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400',
          inactive: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50',
          disabled: 'text-gray-400 dark:text-gray-500 cursor-not-allowed',
        };
      case 'underline':
        return {
          container: 'border-b border-gray-200 dark:border-gray-700',
          tab: 'py-2 px-4 border-b-2 border-transparent transition-colors duration-200',
          active: 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400',
          inactive: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500',
          disabled: 'text-gray-400 dark:text-gray-500 cursor-not-allowed',
        };
      default:
        return {
          container: '',
          tab: 'py-2 px-4 transition-colors duration-200 font-medium rounded-t-lg',
          active: 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-t border-l border-r border-gray-200 dark:border-gray-700',
          inactive: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white',
          disabled: 'text-gray-400 dark:text-gray-500 cursor-not-allowed',
        };
    }
  };
  
  const styles = getVariantStyles();
  
  return (
    <div className={`${styles.container} ${className}`} role="tablist">
      <div className={`flex ${fullWidth ? 'w-full' : 'inline-flex'} space-x-1`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTabId === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={`
              ${styles.tab}
              ${activeTabId === tab.id ? styles.active : tab.disabled ? styles.disabled : styles.inactive}
              ${fullWidth ? 'flex-1 text-center' : ''}
              flex items-center justify-center
            `}
            onClick={() => handleTabChange(tab.id)}
            disabled={tab.disabled}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 ${
                activeTabId === tab.id ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
