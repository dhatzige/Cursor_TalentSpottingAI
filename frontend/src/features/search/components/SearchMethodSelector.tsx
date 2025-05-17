'use client';

import React, { useState } from 'react';
import { useSearch } from '../../../contexts/SearchContext';

interface SearchMethodSelectorProps {
  className?: string;
}

const SearchMethodSelector: React.FC<SearchMethodSelectorProps> = ({ className = '' }) => {
  const { searchMethod, setSearchMethod } = useSearch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectOption = (option: 'keyword' | 'ai-free' | 'ai-premium') => {
    setSearchMethod(option);
    setIsDropdownOpen(false);
  };

  const displayText = {
    'keyword': 'Keyword Search',
    'ai-free': (
      <>
        <span className="mr-2">🤖</span>
        AI Search (Free)
      </>
    ),
    'ai-premium': (
      <>
        <span className="mr-2">✨</span>
        AI Search (Premium)
      </>
    )
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className="relative bg-[#0d1424] text-white px-3 py-2 flex items-center cursor-pointer border-r border-gray-800 min-w-[140px] select-none"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span>
          {displayText[searchMethod]}
        </span>
        <svg className="h-4 w-4 fill-current ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
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
    </div>
  );
};

export default SearchMethodSelector;
