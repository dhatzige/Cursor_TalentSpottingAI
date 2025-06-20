'use client';

import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

interface UnifiedDashboardLayoutProps {
  children: ReactNode;
}

type UserRole = 'student' | 'admin' | 'employer' | 'university';
const ROLES: UserRole[] = ['student', 'admin', 'employer', 'university'];

function isValidRole(role: any): role is UserRole {
  return ROLES.includes(role);
}

export default function UnifiedDashboardLayout({ children }: UnifiedDashboardLayoutProps) {
  const { user } = useUser();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const roleFromMeta = user?.publicMetadata?.role;
  const userRole: UserRole = isValidRole(roleFromMeta) ? roleFromMeta : 'student';
  const currentPath = pathname ?? '';

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <DashboardSidebar
        userRole={userRole}
        currentPath={currentPath}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
