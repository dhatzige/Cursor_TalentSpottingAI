import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, label, trend, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value.toLocaleString()}</p>
          </div>
          <p className={`text-sm mt-1 ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 
              'text-gray-500'
            }`}
          >
            {label}
          </p>
        </div>
        {icon && (
          <div className="p-3 bg-blue-50 rounded-full">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
