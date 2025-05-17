'use client';

import React, { useState, ReactNode, createContext, useContext } from 'react';

type SearchMethod = 'keyword' | 'ai-free' | 'ai-premium';

interface SearchContextType {
  searchMethod: SearchMethod;
  setSearchMethod: (method: SearchMethod) => void;
  isAiSearch: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchMethod, setSearchMethod] = useState<SearchMethod>('keyword');

  // Helper to check if using any AI search method
  const isAiSearch = searchMethod.startsWith('ai');

  return (
    <SearchContext.Provider value={{ searchMethod, setSearchMethod, isAiSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
