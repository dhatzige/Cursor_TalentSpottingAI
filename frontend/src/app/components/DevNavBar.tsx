'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  // Primary Development Tools
  { href: "/dev-dashboard", label: "🚀 Dev Dashboard", highlight: true },
  
  // Core Pages
  { href: "/", label: "Home" },
  { href: "/role-selector", label: "Roles" },
  
  // Authentication (for testing flows)
  { href: "/sign-in", label: "Login" },
  { href: "/sign-up", label: "Sign Up" },
  
  // Public Pages
  { href: "/employers", label: "Employers" },
  { href: "/students", label: "Students" },
  { href: "/universities", label: "Universities" },
  { href: "/blog", label: "Blog" },
  
  // Direct Dashboard Access (with dev bypass)
  { href: "/student-dashboard?dev_bypass=true", label: "Student (Direct)", category: "direct" },
  { href: "/organization-dashboard?dev_bypass=true", label: "Employer (Direct)", category: "direct" },
  { href: "/university-dashboard?dev_bypass=true", label: "University (Direct)", category: "direct" },
  { href: "/admin-dashboard?dev_bypass=true", label: "Admin (Direct)", category: "direct" },
];

export default function DevNavBar() {
  const pathname = usePathname();
  
  // DevNav should be visible by default in development
  const [showDevNav, setShowDevNav] = useState(process.env.NODE_ENV === 'development');
  const [showDirectLinks, setShowDirectLinks] = useState(false);

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
  
  if (!showDevNav) {
    return null;
  }
  
  // Filter links based on visibility settings
  const mainLinks = navLinks.filter(link => link.category !== 'direct');
  const directLinks = navLinks.filter(link => link.category === 'direct');
  
  return (
    <nav className="w-full bg-gray-800 border-b border-gray-700 text-white px-4 py-2 flex gap-4 items-center shadow-sm fixed top-0 left-0 z-[9999] dev-nav-visible" data-component-name="DevNavBar">
      <div className="text-yellow-400 mr-2 text-sm font-bold">DEV NAV →</div>
      
      {/* Main Navigation Links */}
      <div className="flex gap-4 overflow-x-auto pb-1">
        {mainLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:underline transition-colors whitespace-nowrap ${
              link.highlight 
                ? 'text-yellow-400 hover:text-yellow-300 font-semibold' 
                : 'hover:text-blue-400'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      
      {/* Direct Dashboard Links Toggle */}
      <div className="flex items-center gap-2 ml-4 border-l border-gray-600 pl-4">
        <button
          onClick={() => setShowDirectLinks(!showDirectLinks)}
          className="text-xs px-2 py-1 bg-blue-700 hover:bg-blue-600 rounded transition-colors"
          title="Toggle direct dashboard access links"
        >
          {showDirectLinks ? 'Hide Direct' : 'Show Direct'}
        </button>
        
        {showDirectLinks && (
          <div className="flex gap-2">
            {directLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors whitespace-nowrap"
                title={`Direct access to ${link.label.replace(' (Direct)', '')} dashboard with dev bypass`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Close Button */}
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
