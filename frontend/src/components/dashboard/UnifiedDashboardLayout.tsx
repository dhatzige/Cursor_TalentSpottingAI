'use client';

import { ReactNode, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
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

function getRoleFromPathname(pathname: string): UserRole {
  if (pathname.includes('student')) return 'student';
  if (pathname.includes('organization') || pathname.includes('employer')) return 'employer';
  if (pathname.includes('university')) return 'university';
  if (pathname.includes('admin')) return 'admin';
  return 'student'; // default fallback
}

export default function UnifiedDashboardLayout({ children }: UnifiedDashboardLayoutProps) {
  const { user } = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Check for development bypass
  const isDevMode = process.env.NODE_ENV === 'development';
  const devBypass = searchParams.get('dev_bypass') === 'true';
  const shouldBypass = isDevMode && devBypass;

  // Determine user role
  let userRole: UserRole;
  
  if (shouldBypass) {
    // In dev bypass mode, determine role from pathname
    userRole = getRoleFromPathname(pathname ?? '');
    console.log('Dev bypass active, determined role from pathname:', userRole);
  } else {
    // Normal mode: get role from Clerk user metadata
    const roleFromMeta = user?.publicMetadata?.role;
    userRole = isValidRole(roleFromMeta) ? roleFromMeta : 'student';
  }

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
