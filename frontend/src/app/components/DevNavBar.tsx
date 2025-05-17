'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/homepage", label: "Home" },
  { href: "/login", label: "Login" },
  { href: "/create-account", label: "Sign Up" },
  { href: "/role-selector", label: "Roles" },
  { href: "/admin-dashboard", label: "Admin" },
  { href: "/student-dashboard", label: "Student" },
  { href: "/organization-dashboard", label: "Organization" },
  { href: "/university-dashboard", label: "University" },
  { href: "/employers", label: "Employers" },
  { href: "/students", label: "Students" },
  { href: "/universities", label: "Universities" },
  { href: "/blog", label: "Blog" },
];

export default function DevNavBar() {
  const pathname = usePathname();
  
  // Hide dev navbar on homepage and dashboard pages
  const shouldHide = 
    pathname === '/' || 
    pathname.includes('/organization-dashboard') ||
    pathname.includes('/student-dashboard') ||
    pathname.includes('/university-dashboard') ||
    pathname.includes('/admin-dashboard');
    
  if (shouldHide) {
    return null;
  }
  
  return (
    <nav className="w-full bg-gray-900 text-white px-4 py-3 flex gap-4 items-center shadow z-50">
      <div className="text-yellow-400 mr-2 text-sm">DEV NAV →</div>
      <div className="flex gap-4 overflow-x-auto pb-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:underline hover:text-blue-400 transition-colors whitespace-nowrap"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
