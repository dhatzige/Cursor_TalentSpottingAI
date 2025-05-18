'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = '' }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('keyword');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState('Search for jobs, skills, or companies...');
  
  // Different placeholder sets for each search type
  const standardPlaceholder = "Search for jobs, skills, or companies...";
  
  const aiFreeSearchPlaceholders = [
    "Find me remote React developer jobs...",
    "UX designer positions at startups...",
    "Entry-level software engineer jobs...",
    "Marketing manager roles at tech companies..."
  ];
  
  const aiPremiumSearchPlaceholders = [
    "Senior data scientist with Python and R skills...", 
    "DevOps engineer with cloud expertise...",
    "Machine learning engineer in healthcare...", 
    "Full-stack developer with React and Node.js..."
  ];
  
  // Function to handle search type selection
  const selectOption = (option: string) => {
    setSearchType(option);
    setIsDropdownOpen(false);
  };

  // Function to handle search submission
  const handleSearch = (e: any) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/jobs/search?type=${searchType}&q=${encodeURIComponent(query)}`);
    }
  };
  
  // Simple typewriter effect
  useEffect(() => {
    let currentPlaceholder = '';
    let currentIndex = 0;
    let placeholderText = standardPlaceholder;
    let isTyping = true;
    let typingTimer: NodeJS.Timeout | null = null;
    let currentPlaceholderIndex = 0;
    
    const getActivePlaceholders = () => {
      if (searchType === 'ai-free') return aiFreeSearchPlaceholders;
      if (searchType === 'ai-premium') return aiPremiumSearchPlaceholders;
      return [standardPlaceholder];
    };
    
    const type = () => {
      const placeholders = getActivePlaceholders();
      placeholderText = placeholders[currentPlaceholderIndex];
      
      if (isTyping) {
        // Typing
        if (currentIndex <= placeholderText.length) {
          currentPlaceholder = placeholderText.substring(0, currentIndex);
          setPlaceholder(currentPlaceholder);
          currentIndex++;
          typingTimer = setTimeout(type, 70);
        } else {
          // Finished typing, pause before deleting
          isTyping = false;
          typingTimer = setTimeout(type, 2000);
        }
      } else {
        // Deleting
        if (currentIndex > 0) {
          currentIndex--;
          currentPlaceholder = placeholderText.substring(0, currentIndex);
          setPlaceholder(currentPlaceholder);
          typingTimer = setTimeout(type, 30);
        } else {
          // Finished deleting, move to next placeholder
          isTyping = true;
          currentPlaceholderIndex = (currentPlaceholderIndex + 1) % placeholders.length;
          typingTimer = setTimeout(type, 500);
        }
      }
    };
    
    if (searchType === 'keyword') {
      setPlaceholder(standardPlaceholder);
    } else {
      // Start typewriter effect
      currentIndex = 0;
      isTyping = true;
      currentPlaceholderIndex = 0;
      if (typingTimer) clearTimeout(typingTimer);
      typingTimer = setTimeout(type, 100);
    }
    
    return () => {
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [searchType]);
  
  return (
    <div className={`${className} w-full max-w-xl mx-auto`}>
      <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
        <div className="flex rounded overflow-hidden border border-gray-800">
          {/* Search Type Selector */}
          <div 
            className="relative bg-[#0d1424] text-white px-3 py-2 flex items-center cursor-pointer border-r border-gray-800 w-[200px] whitespace-nowrap select-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex-1 flex items-center overflow-hidden">
                {searchType === 'keyword' && (
                  <span className="block truncate">Keyword Search</span>
                )}
                {searchType === 'ai-free' && (
                  <div className="flex items-center">
                    <span className="mr-1 flex-shrink-0">🤖</span>
                    <span className="block truncate">AI Search (Free)</span>
                  </div>
                )}
                {searchType === 'ai-premium' && (
                  <div className="flex items-center">
                    <span className="mr-1 flex-shrink-0">✨</span>
                    <span className="block truncate">AI Search</span>
                  </div>
                )}
              </div>
              <svg className="h-4 w-4 fill-current ml-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={query}
            onChange={(e: any) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-grow py-2 px-4 bg-[#0d1424] text-white outline-none placeholder-gray-500 w-full"
          />

          {/* Search Button */}
          <button 
            type="submit" 
            className="bg-[#0d1424] text-white p-2 hover:bg-gray-900 transition-colors flex items-center justify-center w-12"
          >
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
                <div className="w-5 h-5 mr-2 flex items-center justify-center flex-shrink-0">
                  {searchType === 'keyword' && (
                    <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span>Keyword Search</span>
              </div>
              <div 
                className="px-4 py-2 flex items-center text-white hover:bg-[#1e2746] cursor-pointer"
                onClick={() => selectOption('ai-free')}
              >
                <div className="w-5 h-5 mr-2 flex items-center justify-center flex-shrink-0">
                  {searchType === 'ai-free' && (
                    <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="mr-1 flex-shrink-0">🤖</span>
                  <span>AI Search (Free)</span>
                </div>
              </div>
              <div 
                className="px-4 py-2 flex items-center text-white hover:bg-[#1e2746] cursor-pointer"
                onClick={() => selectOption('ai-premium')}
              >
                <div className="w-5 h-5 mr-2 flex items-center justify-center flex-shrink-0">
                  {searchType === 'ai-premium' && (
                    <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="mr-1 flex-shrink-0">✨</span>
                  <span>AI Search</span>
                  <span className="text-xs text-yellow-400 ml-1">(Premium)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
