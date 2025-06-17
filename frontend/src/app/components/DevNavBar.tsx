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
  { href: "/dev-student-dashboard", label: "Student (No Auth)" },
  { href: "/dev-student-dashboard/simple", label: "Student (Simple)" },
  { href: "/organization-dashboard", label: "Organization" },
  { href: "/university-dashboard", label: "University" },
  
  // Public pages
  { href: "/employers", label: "Employers" },
  { href: "/students", label: "Students" },
  { href: "/universities", label: "Universities" },
  { href: "/blog", label: "Blog" },
  
  // Developer resources
  { href: "/dev-dashboard", label: "UI Showcase" }
];

export default function DevNavBar() {
  const pathname = usePathname();
  
  // State for dev navbar visibility
  const [showDevNav, setShowDevNav] = useState(false);
  
  // Load preference from localStorage if available
  useEffect(() => {
    // Initial check: URL parameter takes precedence
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('dev_nav')) {
      setShowDevNav(true);
      // Save preference
      try {
        localStorage.setItem('devNavVisible', 'true');
      } catch (e) {
        console.error('Could not save dev nav preference to localStorage');
      }
      return;
    }
    
    // Otherwise check localStorage for saved preference
    try {
      const savedPreference = localStorage.getItem('devNavVisible');
      if (savedPreference === 'true') {
        setShowDevNav(true);
      }
    } catch (e) {
      console.error('Could not read dev nav preference from localStorage');
    }
  }, []);
  
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
          // Add dev_bypass=true parameter to dashboard links
          const href = link.href.includes('dashboard') 
            ? `${link.href}?dev_bypass=true` 
            : link.href;
            
          return (
            <Link
              key={link.href}
              href={href}
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
