'use client';

import Link from 'next/link';
import { useState } from 'react';

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`w-full ${transparent ? 'bg-transparent' : 'navbar-gradient'} text-white`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-400">
          TalentSpottingAI
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link 
            href="/homepage" 
            className="text-white text-sm hover:text-gray-300 transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/students" 
            className="text-white text-sm hover:text-gray-300 transition-colors"
          >
            For Students
          </Link>
          <Link 
            href="/universities" 
            className="text-white text-sm hover:text-gray-300 transition-colors"
          >
            For Universities
          </Link>
          <Link 
            href="/employers" 
            className="text-white text-sm hover:text-gray-300 transition-colors"
          >
            For Employers
          </Link>
          <Link 
            href="/blog" 
            className="text-white text-sm hover:text-gray-300 transition-colors"
          >
            Blog
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-2">
          <Link 
            href="/login" 
            className="text-sm px-3 py-1 rounded-md hover:bg-[#172042] transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/create-account" 
            className="text-sm px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a1124] px-4 py-2 pb-4">
          <div className="flex flex-col space-y-3">
            <Link href="/homepage" className="hover:text-[#1A73E8] transition-colors py-2 border-b border-gray-700">
              Home
            </Link>
            <Link href="/students" className="hover:text-[#1A73E8] transition-colors py-2 border-b border-gray-700">
              For Students
            </Link>
            <Link href="/universities" className="hover:text-[#1A73E8] transition-colors py-2 border-b border-gray-700">
              For Universities
            </Link>
            <Link href="/employers" className="hover:text-[#1A73E8] transition-colors py-2 border-b border-gray-700">
              For Employers
            </Link>
            <Link href="/blog" className="hover:text-[#1A73E8] transition-colors py-2 border-b border-gray-700">
              Blog
            </Link>

            <div className="flex space-x-4 pt-2">
              <Link 
                href="/login" 
                className="px-4 py-2 rounded border border-white hover:bg-[#172042] transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 bg-[#1A73E8] rounded hover:bg-blue-700 transition-colors"
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
