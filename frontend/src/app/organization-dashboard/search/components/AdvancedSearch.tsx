'use client';

import { useState, useEffect } from 'react';

// Import our UI components
import Card from '../../shared/ui/Card';
import Button from '../../shared/ui/Button';
import SearchInput from '../../shared/ui/SearchInput';
import Tabs from '../../shared/ui/Tabs';
import ChartContainer from '../../shared/ui/ChartContainer';
import FilterPanel from '../../shared/ui/FilterPanel';

// These components are imported as variables rather than types to work around TypeScript errors
// In a production environment, we would ensure proper type declarations are available
const SearchFilters = require('./SearchFilters').default;
const SearchResults = require('./SearchResults').default;
const SearchHistory = require('./SearchHistory').default;
const SavedSearches = require('./SavedSearches').default;

// Define types directly in this file to avoid module resolution issues
interface SearchCriteria {
  query: string;
  skills: string[];
  education: string[];
  experience: {
    min: number;
    max: number;
  };
  locations: string[];
  matchScore: {
    min: number;
    max: number;
  };
}

interface SearchResult {
  id: string;
  name: string;
  title: string;
  skills: string[];
  experience: number;
  education: string;
  location: string;
  matchScore: number;
  appliedDate: string;
}

interface AdvancedSearchProps {
  isLoading?: boolean;
}

// Define the tab options for our search interface
const searchTabs = [
  { id: 'filters', label: 'Search Filters' },
  { id: 'saved', label: 'Saved Searches' },
  { id: 'recent', label: 'Recent Searches' }
];

export default function AdvancedSearch({ isLoading = false }: AdvancedSearchProps) {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    query: '',
    skills: [],
    education: [],
    experience: {
      min: 0,
      max: 10
    },
    locations: [],
    matchScore: {
      min: 0,
      max: 100
    }
  });
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchCriteria[]>([]);
  const [savedSearches, setSavedSearches] = useState<{id: string; name: string; criteria: SearchCriteria}[]>([]);
  
  // Load saved searches on mount
  useEffect(() => {
    const loadSavedSearches = () => {
      if (typeof window === 'undefined') return;
      
      try {
        const savedSearchesJson = localStorage.getItem('talentSpotting_savedCandidateSearches');
        if (savedSearchesJson) {
          setSavedSearches(JSON.parse(savedSearchesJson));
        }
        
        // Load recent searches
        const recentSearchesJson = localStorage.getItem('talentSpotting_recentCandidateSearches');
        if (recentSearchesJson) {
          setRecentSearches(JSON.parse(recentSearchesJson));
        }
      } catch (err) {
        console.error('Error loading searches:', err);
      }
    };
    
    loadSavedSearches();
  }, []);
  
  // Handle search execution
  const handleSearch = async () => {
    setLoading(true);
    setSearchPerformed(true);
    
    try {
      // In a real implementation, call the API with searchCriteria
      // const results = await EmployerService.searchCandidates(searchCriteria);
      
      // For now, simulate API call with timeout
      setTimeout(() => {
        // Generate mock results based on criteria
        const mockResults = generateMockResults(searchCriteria);
        setResults(mockResults);
        
        // Save to recent searches
        saveToRecentSearches(searchCriteria);
        
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error searching candidates:', error);
      setLoading(false);
    }
  };
  
  // Save search to recent searches
  const saveToRecentSearches = (criteria: SearchCriteria) => {
    // Add current search to recent searches (at the beginning)
    const updated = [criteria, ...recentSearches.filter(s => 
      // Simple comparison to avoid exact duplicates
      s.query !== criteria.query || 
      JSON.stringify(s.skills) !== JSON.stringify(criteria.skills)
    )].slice(0, 10); // Keep only 10 most recent
    
    setRecentSearches(updated);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('talentSpotting_recentCandidateSearches', JSON.stringify(updated));
    }
  };
  
  // Save current search
  const saveSearch = (name: string) => {
    if (!name.trim()) return;
    
    const newSavedSearch = {
      id: Date.now().toString(),
      name,
      criteria: searchCriteria
    };
    
    const updated = [...savedSearches, newSavedSearch];
    setSavedSearches(updated);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('talentSpotting_savedCandidateSearches', JSON.stringify(updated));
    }
  };
  
  // Apply a saved search
  const applySavedSearch = (id: string) => {
    const search = savedSearches.find(s => s.id === id);
    if (search) {
      setSearchCriteria(search.criteria);
      // Don't trigger search automatically - let user review and modify if needed
    }
  };
  
  // Delete a saved search
  const deleteSavedSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('talentSpotting_savedCandidateSearches', JSON.stringify(updated));
    }
  };
  
  // Apply a recent search
  const applyRecentSearch = (index: number) => {
    if (recentSearches[index]) {
      setSearchCriteria(recentSearches[index]);
      // Don't trigger search automatically
    }
  };
  
  const [activeTab, setActiveTab] = useState('filters');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Main card with tabs */}
      <Card className="overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Advanced Candidate Search</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Find perfect candidates based on detailed criteria</p>
        </div>
        
        <div className="px-6 pt-4">
          <Tabs
            tabs={searchTabs}
            defaultTabId="filters"
            onChange={handleTabChange}
            variant="underline"
            fullWidth
          />
        </div>
        
        <div className="p-6 pt-4">
          {/* Search Filters Tab */}
          {activeTab === 'filters' && (
            <ChartContainer
              loading={isLoading}
              height="auto"
            >
              <SearchFilters 
                criteria={searchCriteria}
                onChange={setSearchCriteria}
                onSearch={handleSearch}
                onSave={saveSearch}
              />
            </ChartContainer>
          )}
          
          {/* Saved Searches Tab */}
          {activeTab === 'saved' && (
            <ChartContainer
              loading={isLoading}
              height="auto"
              emptyState={
                savedSearches.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="mb-2 mx-auto w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">No saved searches</h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Your saved searches will appear here for quick access.</p>
                  </div>
                ) : undefined
              }
            >
              {savedSearches.length > 0 && (
                <SavedSearches
                  searches={savedSearches}
                  onApply={applySavedSearch}
                  onDelete={deleteSavedSearch}
                />
              )}
            </ChartContainer>
          )}
          
          {/* Recent Searches Tab */}
          {activeTab === 'recent' && (
            <ChartContainer
              loading={isLoading}
              height="auto"
              emptyState={
                recentSearches.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="mb-2 mx-auto w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">No recent searches</h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Your recent search history will appear here.</p>
                  </div>
                ) : undefined
              }
            >
              {recentSearches.length > 0 && (
                <SearchHistory
                  searches={recentSearches}
                  onApply={applyRecentSearch}
                />
              )}
            </ChartContainer>
          )}
        </div>
      </Card>
      
      {/* Results Section */}
      {searchPerformed && (
        <ChartContainer
          title="Search Results"
          subtitle={`Found ${results.length} candidates matching your criteria`}
          loading={loading}
          height="auto"
        >
          <SearchResults 
            results={results}
            loading={loading}
          />
        </ChartContainer>
      )}
    </div>
  );
}

// Helper to generate mock results
function generateMockResults(criteria: SearchCriteria): SearchResult[] {
  // Sort results by match score for better user experience
  // This would be replaced by real API call in production
  const mockNames = [
    'Alex Johnson', 'Jamie Smith', 'Taylor Wilson', 
    'Morgan Lee', 'Casey Brown', 'Jordan Miller',
    'Riley Davis', 'Quinn Thompson', 'Avery Martinez', 
    'Dakota Clark', 'Reese Rodriguez', 'Skyler Nguyen'
  ];
  
  const mockSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 
    'Python', 'Django', 'SQL', 'Machine Learning',
    'AWS', 'DevOps', 'UX Design', 'Graphic Design',
    'Content Writing', 'Marketing', 'Sales', 'Project Management'
  ];
  
  const mockResults: SearchResult[] = [];
  
  // Number of results based on criteria strictness
  const numResults = Math.max(1, Math.floor(Math.random() * 12));
  
  for (let i = 0; i < numResults; i++) {
    // Calculate match score based on criteria
    let matchScore = Math.floor(Math.random() * (criteria.matchScore.max - criteria.matchScore.min + 1)) + criteria.matchScore.min;
    
    // Adjust match score based on skill matches
    if (criteria.skills.length > 0) {
      const skillOverlap = criteria.skills.filter(
        (skill: string) => mockSkills.slice(0, i % mockSkills.length + 3).includes(skill)
      ).length;
      
      // Boost score based on skill matches
      if (skillOverlap > 0) {
        matchScore = Math.min(100, matchScore + skillOverlap * 5);
      }
    }
    
    // Generate candidate skills (3-5 skills per candidate)
    const numSkills = 3 + (i % 3);
    const candidateSkills = mockSkills
      .slice(i % mockSkills.length, i % mockSkills.length + numSkills);
    
    // If there are specific skills in criteria, include at least one
    if (criteria.skills.length > 0 && i < numResults / 2) {
      candidateSkills.push(criteria.skills[i % criteria.skills.length]);
    }
    
    // Create the result object
    mockResults.push({
      id: `cand-${i + 1}`,
      name: mockNames[i % mockNames.length],
      title: ['Software Engineer', 'UX Designer', 'Product Manager', 'Data Scientist', 'Marketing Specialist'][i % 5],
      skills: [...new Set(candidateSkills)], // Remove duplicates
      experience: criteria.experience.min + (i % (criteria.experience.max - criteria.experience.min + 1)),
      education: ['Bachelor\'s', 'Master\'s', 'PhD', 'Associate\'s'][i % 4],
      location: ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Chicago, IL'][i % 5],
      matchScore,
      appliedDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString() // Recent to older
    });
  }
  
  // Sort by match score (highest first)
  return mockResults.sort((a, b) => b.matchScore - a.matchScore);
}
