// Reusable activity feed component for dashboards
import { ReactNode } from 'react';

interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: ReactNode;
  type?: 'default' | 'success' | 'warning' | 'error';
}

interface ActivityCardProps {
  title: string;
  activities: ActivityItem[];
  showViewAll?: boolean;
  viewAllLink?: string;
  maxItems?: number;
  className?: string;
}

export default function ActivityCard({
  title,
  activities,
  showViewAll = true,
  viewAllLink = "#",
  maxItems = 5,
  className = '',
}: ActivityCardProps) {
  // Get type-specific styles for activity items
  const getTypeStyles = (type: ActivityItem['type'] = 'default') => {
    const styles = {
      default: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
      success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      error: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    };
    
    return styles[type];
  };
  
  return (
    <div className={`bg-white dark:bg-slate-800/50 rounded-lg shadow ${className}`}>
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
        {showViewAll && (
          <a 
            href={viewAllLink} 
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View all
          </a>
        )}
      </div>
      
      <div className="p-5">
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {activities.slice(0, maxItems).map((activity) => (
            <li key={activity.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start">
                {activity.icon && (
                  <div className={`p-2 rounded-full mr-3 ${getTypeStyles(activity.type)}`}>
                    {activity.icon}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{activity.title}</p>
                  {activity.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-0.5">{activity.description}</p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            </li>
          ))}
          
          {activities.length === 0 && (
            <li className="py-3 text-center text-gray-500 dark:text-gray-300">
              No recent activity
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
