'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearch } from '../../../contexts/SearchContext';
import SearchMethodSelector from './SearchMethodSelector';

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = '' }: SearchBarProps) {
  const { searchMethod, isAiSearch } = useSearch();
  const [query, setQuery] = useState('');
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
  
  const currentPlaceholder = useRef('');
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Here you would navigate to search results page with parameters
      console.log(`Searching with ${searchMethod} for: ${query}`);
      window.location.href = `/jobs/search?type=${searchMethod}&q=${encodeURIComponent(query)}`;
    }
  };

  // Clean up any timers on unmount
  useEffect(() => {
    return () => {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current);
      }
    };
  }, []);

  // Handle the placeholder animation when AI search is toggled
  useEffect(() => {
    // Reset typing state
    setIsTyping(false);
    
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current);
    }
    
    if (isAiSearch) {
      // For AI search, use the dynamic placeholders with typing effect
      setDisplayedPlaceholder('');
      currentPlaceholder.current = aiPlaceholders[placeholderIndex];
      typeWriter(0);
    } else {
      // For regular search, just set the standard placeholder
      setDisplayedPlaceholder(standardPlaceholder);
    }
  }, [searchMethod, placeholderIndex, isAiSearch]);

  // Typewriter effect for AI search
  const typeWriter = (i: number) => {
    if (i < currentPlaceholder.current.length) {
      setDisplayedPlaceholder(prev => prev + currentPlaceholder.current.charAt(i));
      setIsTyping(true);
      
      typewriterRef.current = setTimeout(() => {
        typeWriter(i + 1);
      }, typingSpeed);
    } else {
      setIsTyping(false);
      
      // After a pause, move to the next placeholder
      typewriterRef.current = setTimeout(() => {
        setPlaceholderIndex((prevIndex) => (prevIndex + 1) % aiPlaceholders.length);
        setDisplayedPlaceholder('');
      }, pauseTime);
    }
  };
  
  return (
    <div className={`${className} w-full max-w-xl mx-auto`}>
      <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
        <div className="flex rounded overflow-hidden border border-gray-800">
          {/* Search Method Selector */}
          <SearchMethodSelector />

          {/* Input field */}
          <input
            type="text"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder={displayedPlaceholder}
            className="flex-grow py-2 px-4 bg-[#0d1424] text-white outline-none placeholder-gray-500 w-full"
          />

          {/* Search button */}
          <button type="submit" className="bg-[#0d1424] text-white p-2 hover:bg-gray-900 transition-colors flex items-center justify-center w-12">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
