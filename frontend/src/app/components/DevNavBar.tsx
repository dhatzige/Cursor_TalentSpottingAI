'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/sign-in", label: "Login" },
  { href: "/sign-up", label: "Sign Up" },
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
  
  // DevNav should be visible by default in development
  const [showDevNav, setShowDevNav] = useState(process.env.NODE_ENV === 'development');

  // Allow toggling and saving preference
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setShowDevNav(prev => {
          const newState = !prev;
          try {
            localStorage.setItem('devNavVisible', String(newState));
          } catch (error) {
            console.error('Failed to save DevNav visibility to localStorage', error);
          }
          return newState;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update body class based on visibility
  useEffect(() => {
    if (showDevNav) {
      document.body.classList.add('dev-nav-visible');
    } else {
      document.body.classList.remove('dev-nav-visible');
    }
  }, [showDevNav]);
  
  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+D to toggle dev nav
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault(); // Prevent any browser default actions
        
        // Toggle visibility and save preference
        const newVisibility = !showDevNav;
        setShowDevNav(newVisibility);
        
        try {
          localStorage.setItem('devNavVisible', newVisibility ? 'true' : 'false');
        } catch (e) {
          console.error('Could not save dev nav preference to localStorage');
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDevNav]);
  
  if (!showDevNav) {
    return null;
  }
  
  return (
    <nav className="w-full bg-gray-800 border-b border-gray-700 text-white px-4 py-2 flex gap-4 items-center shadow-sm fixed top-0 left-0 z-[9999] dev-nav-visible" data-component-name="DevNavBar">
      <div className="text-yellow-400 mr-2 text-sm font-bold">DEV NAV →</div>
      <div className="flex gap-4 overflow-x-auto pb-1">
        {navLinks.map((link) => {
          let finalHref = link.href;
          if (link.href.includes('dashboard')) {
            finalHref = link.href.replace('?dev_bypass=true', '');
          }
            
          return (
            <Link
              key={link.href}
              href={finalHref}
              className="hover:underline hover:text-blue-400 transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <button 
        onClick={() => {
          setShowDevNav(false);
          try {
            localStorage.setItem('devNavVisible', 'false');
          } catch (e) {
            console.error('Could not save dev nav preference');
          }
        }}
        className="ml-auto px-2 py-1 bg-red-700 hover:bg-red-600 rounded text-xs"
        aria-label="Close developer navigation"
      >
        Close
      </button>
    </nav>
  );
}
