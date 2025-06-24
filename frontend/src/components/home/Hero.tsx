'use client';

import Link from 'next/link';
import SearchBar from './SearchBar';
import '@/styles/HomeDynamicHero.css';

interface HeroProps {
  className?: string;
}

export default function Hero({ className = '' }: HeroProps) {
  return (
    <div className={`gradient-background py-12 md:py-16 ${className}`}>
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 animated-gradient-hero">
          Find Your Dream Job
        </h1>
        <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
          Connect with top companies and discover opportunities that match your skills and aspirations.
        </p>
        
        <SearchBar className="mx-auto mb-8" />
        
        <div className="mt-6 space-x-4">
          <Link
            href="/jobs"
            className="px-5 py-2 bg-blue-600 rounded-md text-white text-sm font-medium"
          >
            Find Jobs
          </Link>
          <Link
            href="/sign-up"
            className="px-5 py-2 bg-white text-gray-800 rounded-md text-sm font-medium"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
