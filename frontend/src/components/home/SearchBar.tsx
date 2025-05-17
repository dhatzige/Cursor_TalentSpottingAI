'use client';

// Dynamic placeholder implementation for search bar

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ 
  className = ''
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('keyword');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // AI placeholder animation
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingSpeed = 70; // ms per character
  const pauseTime = 2000; // ms to pause before changing

  // AI search placeholders
  const aiPlaceholders = [
    "Find me remote React developer jobs in Europe...",
    "Looking for UX designer positions at startups...",
    "Entry-level software engineer jobs with mentorship...",
    "Marketing manager roles in tech companies...",
    "Data scientist positions with flexible hours...",
    "Product management jobs at healthcare companies...",
    "DevOps engineer roles with competitive pay...",
    "Full-stack developer jobs in fintech..."
  ];

  // Standard placeholder
  const standardPlaceholder = "Search for jobs, skills, or companies...";
  
  // Use simple variables instead of refs for compatibility
  let currentPlaceholderValue = '';
  let typewriterTimeoutId: any = null;
  
  const selectOption = (option: string) => {
    setSearchType(option);
    setIsDropdownOpen(false);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/jobs/search?type=${searchType}&q=${encodeURIComponent(query)}`);
    }
  };

  // Typewriter effect for AI search
  const typeWriter = (i: number) => {
    if (i < currentPlaceholderValue.length) {
      setDisplayedPlaceholder(prev => prev + currentPlaceholderValue.charAt(i));
      setIsTyping(true);
      
      typewriterTimeoutId = setTimeout(() => {
        typeWriter(i + 1);
      }, typingSpeed);
    } else {
      setIsTyping(false);
      
      // After a pause, move to the next placeholder
      typewriterTimeoutId = setTimeout(() => {
        setPlaceholderIndex((prevIndex) => (prevIndex + 1) % aiPlaceholders.length);
        setDisplayedPlaceholder('');
      }, pauseTime);
    }
  };

  // Clean up any timers on unmount
  useEffect(() => {
    return () => {
      if (typewriterTimeoutId) {
        clearTimeout(typewriterTimeoutId);
      }
    };
  }, []);

  // Handle the placeholder animation when AI search is toggled
  useEffect(() => {
    // Reset typing state
    setIsTyping(false);
    
    if (typewriterTimeoutId) {
      clearTimeout(typewriterTimeoutId);
    }
    
    if (searchType.startsWith('ai')) {
      // For AI search, use the dynamic placeholders with typing effect
      setDisplayedPlaceholder('');
      currentPlaceholderValue = aiPlaceholders[placeholderIndex];
      typeWriter(0);
    } else {
      // For regular search, just set the standard placeholder
      setDisplayedPlaceholder(standardPlaceholder);
    }
  }, [searchType, placeholderIndex]);

  return (
    <div className={`${className} w-full max-w-xl mx-auto`}>
      <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
        <div className="flex rounded overflow-hidden border border-gray-800">
          {/* Dropdown */}
          <div 
            className="relative bg-[#0d1424] text-white px-3 py-2 flex items-center cursor-pointer border-r border-gray-800 min-w-[140px] select-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>
              {searchType === 'keyword' && 'Keyword Search'}
              {searchType === 'ai-free' && (
                <>
                  <span className="mr-2">🤖</span>
                  AI Search (Free)
                </>
              )}
              {searchType === 'ai-premium' && (
                <>
                  <span className="mr-2">✨</span>
                  AI Search (Premium)
                </>
              )}
            </span>
            <svg className="h-4 w-4 fill-current ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>

          {/* Input field */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchType.startsWith('ai') ? displayedPlaceholder : standardPlaceholder}
            className="flex-grow py-2 px-4 bg-[#0d1424] text-white outline-none placeholder-gray-500 w-full"
          />

          {/* Search button */}
          <button type="submit" className="bg-[#0d1424] text-white p-2 hover:bg-gray-900 transition-colors flex items-center justify-center w-12">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute mt-1 left-0 w-56 bg-[#0d1424] rounded shadow-lg z-10 border border-gray-800">
            <div className="py-1">
              <div 
                className="px-4 py-2 flex items-center text-white hover:bg-[#1e2746] cursor-pointer"
                onClick={() => selectOption('keyword')}
              >
                <svg className="h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Keyword Search
              </div>
              <div 
                className="px-4 py-2 text-white hover:bg-[#1e2746] cursor-pointer"
                onClick={() => selectOption('ai-free')}
              >
                <div className="flex items-center">
                  <span className="mr-2">🤖</span>
                  AI Search (Free)
                </div>
              </div>
              <div 
                className="px-4 py-2 text-white hover:bg-[#1e2746] cursor-pointer"
                onClick={() => selectOption('ai-premium')}
              >
                <div className="flex items-center">
                  <span className="mr-2">✨</span>
                  AI Search (Premium)
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
