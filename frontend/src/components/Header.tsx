'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Public navigation links (shown to signed-out users)
  const publicNavLinks = [
    { href: "/", label: "Home" },
    { href: "/students", label: "For Students" },
    { href: "/universities", label: "For Universities" },
    { href: "/employers", label: "For Employers" },
    { href: "/blog", label: "Blog" },
  ];
  
  // Simplified navigation for signed-in users
  const authenticatedNavLinks = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <header className='w-full fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm bg-black/10 text-white transition-all duration-300'>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          TalentSpottingAI
        </Link>

        <nav className="hidden md:flex space-x-8 items-center font-medium">
          <SignedIn>
            {authenticatedNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-white hover:text-blue-400 transition-colors relative group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </SignedIn>
          <SignedOut>
            {publicNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-white hover:text-blue-400 transition-colors relative group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </SignedOut>
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" className="px-4 py-2 rounded-md hover:bg-gray-800/50 transition-colors font-medium">
              Sign In
            </Link>
            <Link href="/sign-up" className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-md font-medium">
              Sign Up
            </Link>
          </SignedOut>
        </div>

        <div className="md:hidden">
          <button 
            className="text-white p-2 hover:bg-gray-800/50 rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md px-6 py-4 pb-6 border-t border-gray-800/50 shadow-xl">
          <div className="flex flex-col space-y-4">
            <SignedIn>
              {authenticatedNavLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-white hover:text-blue-400 transition-colors py-3 border-b border-gray-800/70 font-medium">
                  {link.label}
                </Link>
              ))}
            </SignedIn>
            <SignedOut>
              {publicNavLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-white hover:text-blue-400 transition-colors py-3 border-b border-gray-800/70 font-medium">
                  {link.label}
                </Link>
              ))}
            </SignedOut>
            <div className="pt-4 border-t border-gray-800/70">
              <SignedOut>
                <div className="flex flex-col space-y-3">
                  <Link href="/sign-in" className="text-center px-4 py-2 rounded-md hover:bg-gray-800/50 transition-colors font-medium">
                    Sign In
                  </Link>
                  <Link href="/sign-up" className="text-center px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-md font-medium">
                    Sign Up
                  </Link>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
