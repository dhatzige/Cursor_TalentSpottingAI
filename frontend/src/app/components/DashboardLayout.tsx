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
  // Consistent dark theme for sidebar
  const sidebarBg = 'bg-slate-900'; // Or bg-gray-900, or a slightly different shade from the main gradient
  const textColor = 'text-gray-200';
  const linkHoverBg = 'hover:bg-slate-700/50';
  const linkHoverText = 'hover:text-white';
  const activeLinkBg = 'bg-blue-600'; // Example active state
  const activeLinkText = 'text-white';

  // TODO: Determine active link based on current path
  // For now, the first 'Dashboard' link can be styled as active for demo

  return (
    <div className="flex min-h-screen gradient-background text-gray-200">
      {/* Sidebar */}
      <aside className={`w-64 ${sidebarBg} ${textColor} flex-shrink-0 flex flex-col`}>
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">TalentSpottingAI</h2>
          <p className="text-sm text-slate-400 mt-1">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
          </p>
        </div>

        <nav className="p-4 flex-grow">
          <ul className="space-y-2">
            <li>
              <Link 
                href={`/${userRole}-dashboard`} 
                className={`block py-2 px-4 rounded ${linkHoverBg} ${linkHoverText} transition-colors ${userRole === 'admin' ? (activeLinkBg + ' ' + activeLinkText) : ''}`}
              >
                Dashboard
              </Link>
            </li>
            {userRole === 'admin' && (
              <>
                <li>
                  <Link 
                    href="/admin-dashboard/users" 
                    className={`block py-2 px-4 rounded ${linkHoverBg} ${linkHoverText} transition-colors`}
                  >
                    Users
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin-dashboard/organizations" 
                    className={`block py-2 px-4 rounded ${linkHoverBg} ${linkHoverText} transition-colors`}
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
                    className={`block py-2 px-4 rounded ${linkHoverBg} ${linkHoverText} transition-colors`}
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/student-dashboard/applications" 
                    className={`block py-2 px-4 rounded ${linkHoverBg} ${linkHoverText} transition-colors`}
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
                    className={`block py-2 px-4 rounded ${linkHoverBg} ${linkHoverText} transition-colors`}
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/organization-dashboard/applications" 
                    className={`block py-2 px-4 rounded ${linkHoverBg} ${linkHoverText} transition-colors`}
                  >
                    Applications
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/organization-dashboard/candidates" 
                    className={`block py-2 px-4 rounded ${linkHoverBg} ${linkHoverText} transition-colors`}
                  >
                    Candidates
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/organization-dashboard/analytics" 
                    className={`block py-2 px-4 rounded ${linkHoverBg} ${linkHoverText} transition-colors`}
                  >
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/organization-dashboard/search" 
                    className={`block py-2 px-4 rounded ${linkHoverBg} ${linkHoverText} transition-colors`}
                  >
                    Advanced Search
                  </Link>
                </li>
              </>
            )}
            {userRole === 'university' && (
              <>
                <li>
                  <Link 
                    href="/university-dashboard/students" 
                    className={`block py-2 px-4 rounded ${linkHoverBg} ${linkHoverText} transition-colors`}
                  >
                    Students
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/university-dashboard/employers" 
                    className={`block py-2 px-4 rounded ${linkHoverBg} ${linkHoverText} transition-colors`}
                  >
                    Employers
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link 
                href="/settings" 
                className={`block py-2 px-4 rounded ${linkHoverBg} ${linkHoverText} transition-colors`}
              >
                Settings
              </Link>
            </li>
            <li>
              <Link 
                href="/logout" 
                className={`block py-2 px-4 rounded ${linkHoverBg} ${linkHoverText} transition-colors mt-auto mb-2`}
              >
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-slate-800/60 backdrop-blur-md shadow-lg">
          <div className="py-4 px-6">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
