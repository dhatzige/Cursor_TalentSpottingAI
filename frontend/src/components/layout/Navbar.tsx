'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  transparent?: boolean;
}

interface NavLink {
  href: string;
  label: string;
  description?: string;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  // Navigation links for different user states
  const publicNavLinks: NavLink[] = [
    { href: "/", label: "Home", description: "Discover talent opportunities" },
    { href: "/students", label: "For Students", description: "Find your dream job" },
    { href: "/employers", label: "For Employers", description: "Hire top talent" },
    { href: "/universities", label: "For Universities", description: "Connect with industry" },
    { href: "/blog", label: "Blog", description: "Latest insights" },
    { href: "/contact", label: "Contact", description: "Get in touch" }
  ];

  // Handle scroll effect for transparent navbar
  useEffect(() => {
    if (!transparent) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [transparent]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Determine dashboard URL based on user role
  const getDashboardUrl = () => {
    const role = user?.publicMetadata?.role || user?.unsafeMetadata?.role;
    switch (role) {
      case 'student':
        return '/student-dashboard';
      case 'employer':
        return '/organization-dashboard';
      case 'university':
        return '/university-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/student-dashboard'; // Default to student dashboard
    }
  };

  const navbarBg = transparent 
    ? (isScrolled 
        ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-700/80 shadow-lg shadow-black/20' 
        : 'bg-transparent')
    : 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-700/80 shadow-lg shadow-black/20';

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`navbar-main fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navbarBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 group"
              aria-label="TalentSpottingAI Home"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <span className="text-xl font-bold animated-gradient-text">
                TalentSpottingAI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {publicNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive(link.href)
                      ? 'text-blue-400 bg-blue-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              <SignedOut>
                <div className="hidden sm:flex items-center space-x-3">
                  <Link
                    href="/sign-in"
                    className="text-slate-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                             text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                             shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center space-x-3">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all duration-200"
                      }
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="Visit Dashboard"
                        labelIcon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        }
                        href={getDashboardUrl()}
                      />
                      <UserButton.Action label="manageAccount" />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
              </SignedIn>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 
                         transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
                             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
                             className="fixed top-16 right-0 bottom-0 w-80 bg-slate-950/98 backdrop-blur-xl border-l border-slate-700/80 z-[9999] md:hidden overflow-y-auto shadow-2xl"
            >
              <div className="p-6 space-y-6">
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {publicNavLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                          isActive(link.href)
                            ? 'text-blue-400 bg-blue-500/10 border-l-2 border-blue-500'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex flex-col">
                          <span>{link.label}</span>
                          {link.description && (
                            <span className="text-xs text-slate-500 mt-1">
                              {link.description}
                            </span>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Auth Section */}
                <SignedOut>
                  <div className="border-t border-slate-700 pt-6 space-y-3">
                    <Link
                      href="/sign-in"
                                              className="block w-full text-center px-4 py-3 text-slate-300 hover:text-white 
                                 border border-slate-600 rounded-lg font-medium transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                               hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium 
                               transition-all duration-200 shadow-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                </SignedOut>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
