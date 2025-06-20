'use client';

import Link from 'next/link';
import { useState } from 'react';

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`w-full fixed top-0 left-0 right-0 z-50 ${transparent ? 'bg-transparent backdrop-blur-sm bg-black/10' : 'navbar-gradient'} text-white transition-all duration-300`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          TalentSpottingAI
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 items-center font-medium">
          <Link 
            href="/" 
            className="text-white hover:text-blue-400 transition-colors relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
          </Link>
          <Link 
            href="/students" 
            className="text-white hover:text-blue-400 transition-colors relative group"
          >
            For Students
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
          </Link>
          <Link 
            href="/universities" 
            className="text-white hover:text-blue-400 transition-colors relative group"
          >
            For Universities
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
          </Link>
          <Link 
            href="/employers" 
            className="text-white hover:text-blue-400 transition-colors relative group"
          >
            For Employers
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
          </Link>
          <Link 
            href="/blog" 
            className="text-white hover:text-blue-400 transition-colors relative group"
          >
            Blog
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-3">
          <Link 
            href="/sign-in" 
            className="px-4 py-2 rounded-md hover:bg-gray-800/50 transition-colors font-medium"
          >
            Sign In
          </Link>
          <Link 
            href="/sign-up" 
            className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-md font-medium"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2 hover:bg-gray-800/50 rounded-md transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md px-6 py-4 pb-6 border-t border-gray-800/50 shadow-xl">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="text-white hover:text-blue-400 transition-colors py-3 border-b border-gray-800/70 font-medium">
              Home
            </Link>
            <Link href="/students" className="text-white hover:text-blue-400 transition-colors py-3 border-b border-gray-800/70 font-medium">
              For Students
            </Link>
            <Link href="/universities" className="text-white hover:text-blue-400 transition-colors py-3 border-b border-gray-800/70 font-medium">
              For Universities
            </Link>
            <Link href="/employers" className="text-white hover:text-blue-400 transition-colors py-3 border-b border-gray-800/70 font-medium">
              For Employers
            </Link>
            <Link href="/blog" className="text-white hover:text-blue-400 transition-colors py-3 border-b border-gray-800/70 font-medium">
              Blog
            </Link>

            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <Link 
                href="/sign-in" 
                className="px-4 py-3 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors w-full sm:w-auto text-center font-medium"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up" 
                className="px-4 py-3 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto text-center font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
