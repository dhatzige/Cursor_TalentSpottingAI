'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function DashboardLayout({ 
  children, 
  title,
  description
}: DashboardLayoutProps) {
  return (
    <div className="flex-1">
      <header className="bg-gray-50 dark:bg-slate-800/50 shadow">
        <div className="py-4 px-6">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </header>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
