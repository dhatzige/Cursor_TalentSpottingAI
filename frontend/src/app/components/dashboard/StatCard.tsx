// Reusable stat card component for dashboard metrics
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  className = '',
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-5 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          
          {change && (
            <div className="flex items-center mt-2">
              <span 
                className={`text-sm font-medium ${
                  change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.isPositive ? '↑' : '↓'} {change.value}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs. last period</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
