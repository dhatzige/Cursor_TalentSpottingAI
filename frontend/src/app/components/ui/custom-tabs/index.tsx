import React from 'react';

// Extremely simplified tabs - no children cloning, just direct usage

// Types for props
type TabsContextType = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};

// Create a simple tabs container
export function Tabs({
  defaultValue,
  children,
  className = ''
}: {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}) {
  // State for the active tab
  const [activeTab, setActiveTab] = React.useState(defaultValue);
  
  // Create context object
  const context: TabsContextType = {
    activeTab,
    setActiveTab
  };
  
  return (
    <div className={className}>
      {/* No context needed - direct rendering */}
      {children}
    </div>
  );
}

// List of tab triggers
export function TabsList({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex ${className}`}>
      {children}
    </div>
  );
}

// Individual tab button
export function TabsTrigger({
  value,
  children,
  className = '',
  onClick,
  isActive = false
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}) {
  const activeClass = isActive 
    ? 'bg-blue-100 text-blue-800' 
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  
  return (
    <button
      type="button"
      className={`px-4 py-2 font-medium rounded-md text-sm transition ${activeClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Content for each tab
export function TabsContent({
  value,
  activeValue,
  children,
  className = ''
}: {
  value: string;
  activeValue?: string;
  children: React.ReactNode;
  className?: string;
}) {
  // Only render content if this tab is active
  if (activeValue !== value) {
    return null;
  }
  
  return (
    <div className={className}>
      {children}
    </div>
  );
}
