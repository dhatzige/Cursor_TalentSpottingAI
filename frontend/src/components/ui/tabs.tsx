import React, { useState } from 'react';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
  onTabChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, className = '', onTabChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id || '');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}

export function TabsList({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="-mb-px flex space-x-8">
        {children}
      </nav>
    </div>
  );
}

export function TabsTrigger({
  children,
  value,
  active,
  onClick,
  className = ''
}: {
  children: React.ReactNode;
  value: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
        ${active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  children,
  value,
  activeValue,
  className = ''
}: {
  children: React.ReactNode;
  value: string;
  activeValue: string;
  className?: string;
}) {
  if (value !== activeValue) return null;
  
  return (
    <div className={`mt-4 ${className}`}>
      {children}
    </div>
  );
}
