'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseSearchQuery } from '@/lib/utils/job-search';

interface SearchBarProps {
  className?: string;
  defaultValue?: string;
}

export default function SearchBar({ className = '', defaultValue = '' }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [searchType, setSearchType] = useState('keyword');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState('Search for jobs, skills, or companies...');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  
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
  
  const searchTips = [
    'Use quotes for exact phrases: "product manager"',
    'Use + for required terms: +remote developer',
    'Use - to exclude terms: developer -senior',
    'Use OR for alternatives: developer OR designer',
    'Search looks in job title, description, skills, and company'
  ];
  
  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
      } catch (e) {
        console.error('Error parsing recent searches', e);
      }
    }
  }, []);
  
  // Close recent searches dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Skip this feature since we can't use refs in this project
      // User can dismiss by clicking the search button or elsewhere
      const target = event.target as HTMLElement;
      if (!target.closest('.search-bar-input') && !target.closest('.recent-searches')) {
        setShowRecentSearches(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to handle search type selection
  const selectOption = (option: string) => {
    setSearchType(option);
    setIsDropdownOpen(false);
  };

  // Save search to recent searches
  const saveToRecentSearches = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updatedSearches = [
      searchQuery, 
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Function to handle search submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (trimmedQuery) {
      // Save to recent searches
      saveToRecentSearches(trimmedQuery);
      
      // Hide recent searches dropdown
      setShowRecentSearches(false);
      
      // We're not using searchType for now as requested (AI features will be last)
      // Just pass the query parameter directly - both pages now use the same
      // filterJobsBySearchTerms logic underneath
      router.push(`/jobs?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };
  
  // Handle selecting a recent search
  const selectRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setShowRecentSearches(false);
    
    // Simply close dropdown after selection
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
    <div className={`${className} w-full mx-auto`}>
      <form onSubmit={handleSearch} className="relative w-full mx-auto">
        <div className="flex rounded-lg overflow-hidden border border-gray-700 bg-gray-800/80 shadow-inner shadow-blue-900/20">
          {/* Search Type Selector */}
          <div 
            className="relative bg-gray-800/90 text-white px-4 py-3 flex items-center cursor-pointer border-r border-gray-700 w-[220px] whitespace-nowrap select-none hover:bg-gray-700/80 transition-colors"
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
                    <span className="text-xs bg-yellow-400/20 text-yellow-400 ml-1 px-1.5 py-0.5 rounded-sm font-medium">(Premium)</span>
                  </div>
                )}
              </div>
              <svg className="h-4 w-4 fill-current ml-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-grow">
            <input
              type="text"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              onFocus={() => setShowRecentSearches(true)}
              placeholder={placeholder}
              className="search-bar-input w-full py-3 px-5 bg-gray-800/90 text-white text-base outline-none placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-inner"
            />
            
            {/* Recent Searches Dropdown */}
            {showRecentSearches && recentSearches.length > 0 && (
              <div 
                className="recent-searches absolute left-0 right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20"
              >
                <div className="p-2">
                  <h4 className="text-xs text-gray-400 px-2 pb-1">Recent Searches</h4>
                  <ul>
                    {recentSearches.map((search, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          onClick={() => selectRecentSearch(search)}
                          className="w-full text-left px-3 py-2 hover:bg-blue-600/20 rounded text-white flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {search}
                        </button>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <h4 className="text-xs text-gray-400 px-2 pb-1">Search Tips</h4>
                    <div className="px-3 py-2">
                      {searchTips.map((tip, index) => (
                        <p key={index} className="text-xs text-gray-300 mb-1">
                          {tip}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-4 hover:bg-blue-600 transition-colors flex items-center justify-center font-medium w-14 flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className={`absolute mt-1 left-0 w-[220px] bg-gray-800 rounded-md shadow-xl z-10 border border-gray-700`}>
            <div className="py-1">
              <div 
                className="px-4 py-3 flex items-center text-white hover:bg-gray-700 cursor-pointer transition-colors"
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
                className="px-4 py-3 flex items-center text-white hover:bg-gray-700 cursor-pointer transition-colors"
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
                className="px-4 py-3 flex items-center text-white hover:bg-gray-700 cursor-pointer transition-colors"
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
                  <span className="text-xs bg-yellow-400/20 text-yellow-400 ml-1 px-1.5 py-0.5 rounded-sm font-medium">(Premium)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
