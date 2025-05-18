'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Login" },
  { href: "/create-account", label: "Sign Up" },
  { href: "/role-selector", label: "Roles" },
  
  // Dashboards
  { href: "/admin-dashboard", label: "Admin" },
  { href: "/student-dashboard", label: "Student" },
  { href: "/organization-dashboard", label: "Organization" },
  { href: "/university-dashboard", label: "University" },
  
  // Public pages
  { href: "/employers", label: "Employers" },
  { href: "/students", label: "Students" },
  { href: "/universities", label: "Universities" },
  { href: "/blog", label: "Blog" },
];

export default function DevNavBar() {
  const pathname = usePathname();
  
  // Only show the dev navbar when specifically requested with a query parameter
  // Use useState and useEffect for client-side detection
  const [showDevNav, setShowDevNav] = useState(false);
  
  // Check for query param, but only on the client side
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setShowDevNav(searchParams.has('dev_nav'));
  }, []);
  
  // Hide by default unless specifically requested
  const shouldHide = !showDevNav;
  
  // Add keyboard shortcut listener - client-side only
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+D to toggle dev nav
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        console.log('DevNav shortcut triggered!');
        e.preventDefault(); // Prevent any browser default actions
        
        // Toggle visibility directly without URL parameters
        setShowDevNav(!showDevNav);
        
        // Update URL for persistence if needed
        const url = new URL(window.location.href);
        if (showDevNav) {
          url.searchParams.delete('dev_nav');
        } else {
          url.searchParams.set('dev_nav', 'true');
        }
        window.history.pushState({}, '', url.toString());
      }
    };

    // Always add the event listener, even when nav is hidden
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDevNav]);
    
  if (shouldHide) {
    return null;
  }
  
  return (
    <nav className={`w-full bg-red-800 text-white px-4 py-3 flex gap-4 items-center shadow fixed top-0 left-0 z-[9999] ${showDevNav ? 'dev-nav-visible' : 'hidden'}`}>
      <div className="text-yellow-400 mr-2 text-sm font-bold">DEV NAV →</div>
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
