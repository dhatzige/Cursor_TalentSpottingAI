// Shared dashboard layout for all dashboard types
import { ReactNode } from 'react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  userRole: 'admin' | 'student' | 'employer' | 'university';
}

export default function DashboardLayout({ 
  children, 
  title, 
  userRole 
}: DashboardLayoutProps) {
  // Color map for role-specific styling
  const roleColors = {
    admin: 'bg-gray-800 text-white',
    student: 'bg-blue-700 text-white',
    employer: 'bg-green-700 text-white',
    university: 'bg-purple-700 text-white',
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`w-64 ${roleColors[userRole]} flex-shrink-0`}>
        <div className="p-4 border-b border-white/10">
          <h2 className="text-xl font-bold">TalentSpottingAI</h2>
          <p className="text-sm opacity-80 mt-1">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
          </p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href={`/${userRole}-dashboard`} 
                className="block py-2 px-4 rounded hover:bg-white/10 transition"
              >
                Dashboard
              </Link>
            </li>
            {userRole === 'admin' && (
              <>
                <li>
                  <Link 
                    href="/admin-dashboard/users" 
                    className="block py-2 px-4 rounded hover:bg-white/10 transition"
                  >
                    Users
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin-dashboard/organizations" 
                    className="block py-2 px-4 rounded hover:bg-white/10 transition"
                  >
                    Organizations
                  </Link>
                </li>
              </>
            )}
            {userRole === 'student' && (
              <>
                <li>
                  <Link 
                    href="/student-dashboard/jobs" 
                    className="block py-2 px-4 rounded hover:bg-white/10 transition"
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/student-dashboard/applications" 
                    className="block py-2 px-4 rounded hover:bg-white/10 transition"
                  >
                    My Applications
                  </Link>
                </li>
              </>
            )}
            {userRole === 'employer' && (
              <>
                <li>
                  <Link 
                    href="/organization-dashboard/jobs" 
                    className="block py-2 px-4 rounded hover:bg-white/10 transition"
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/organization-dashboard/candidates" 
                    className="block py-2 px-4 rounded hover:bg-white/10 transition"
                  >
                    Candidates
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/employer/talent-search" 
                    className="block py-2 px-4 rounded hover:bg-white/10 transition"
                  >
                    Talent Search
                  </Link>
                </li>
              </>
            )}
            {userRole === 'university' && (
              <>
                <li>
                  <Link 
                    href="/university-dashboard/students" 
                    className="block py-2 px-4 rounded hover:bg-white/10 transition"
                  >
                    Students
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/university-dashboard/employers" 
                    className="block py-2 px-4 rounded hover:bg-white/10 transition"
                  >
                    Employers
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link 
                href="/settings" 
                className="block py-2 px-4 rounded hover:bg-white/10 transition"
              >
                Settings
              </Link>
            </li>
            <li>
              <Link 
                href="/logout" 
                className="block py-2 px-4 rounded hover:bg-white/10 transition"
              >
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <header className="bg-white shadow">
          <div className="py-4 px-6">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
