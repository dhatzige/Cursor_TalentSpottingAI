'use client';

import React, { useState, useEffect, MouseEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Candidate {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  university?: string;
  skills: string[];
  applicationId: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  minMatchScore?: number;
  skills?: string[];
  university?: string;
  createdAt: string;
  lastUsed: string;
}

export function useCandidateFilters(
  allCandidates: Candidate[],
  initialSkills: string[] = [],
  initialMatchScore: number = 0
) {
  // Filter state
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills);
  const [minMatchScore, setMinMatchScore] = useState<number>(initialMatchScore);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveFilterDialog, setShowSaveFilterDialog] = useState(false);
  const [filterName, setFilterName] = useState('');
  
  // Extract all unique skills for filtering
  useEffect(() => {
    const skillsSet = new Set<string>();
    allCandidates.forEach(candidate => {
      candidate.skills.forEach(skill => skillsSet.add(skill));
    });
    setAvailableSkills(Array.from(skillsSet));
    
    // Load saved filters
    loadSavedFilters();
  }, [allCandidates]);
  
  // Filter candidates based on criteria (memoized to avoid unnecessary re-renders)
  const filteredCandidates = React.useMemo(() =>
    applyFilters(allCandidates, minMatchScore, selectedSkills),
    [allCandidates, minMatchScore, selectedSkills]
  );
  
  // Load saved filters from localStorage
  const loadSavedFilters = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedFiltersJson = localStorage.getItem('talentSpotting_savedCandidateFilters');
      if (savedFiltersJson) {
        setSavedFilters(JSON.parse(savedFiltersJson));
      }
    } catch (err) {
      console.error('Error loading saved filters:', err);
    }
  };
  
  // Save current filter settings
  const saveCurrentFilter = () => {
    if (!filterName.trim()) return;
    
    const newFilter: SavedFilter = {
      id: uuidv4(),
      name: filterName,
      minMatchScore: minMatchScore > 0 ? minMatchScore : undefined,
      skills: selectedSkills.length > 0 ? [...selectedSkills] : undefined,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };
    
    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    setFilterName('');
    setShowSaveFilterDialog(false);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('talentSpotting_savedCandidateFilters', JSON.stringify(updatedFilters));
    }
  };
  
  // Apply a saved filter
  const applyFilter = (filter: SavedFilter) => {
    if (filter.minMatchScore !== undefined) {
      setMinMatchScore(filter.minMatchScore);
    } else {
      setMinMatchScore(0);
    }
    
    if (filter.skills && filter.skills.length > 0) {
      setSelectedSkills([...filter.skills]);
    } else {
      setSelectedSkills([]);
    }
    
    // Update lastUsed
    const updatedFilters = savedFilters.map(f => 
      f.id === filter.id 
        ? {...f, lastUsed: new Date().toISOString()} 
        : f
    );
    
    setSavedFilters(updatedFilters);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('talentSpotting_savedCandidateFilters', JSON.stringify(updatedFilters));
    }
  };
  
  // Delete saved filter
  const deleteFilter = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    const updatedFilters = savedFilters.filter(f => f.id !== id);
    setSavedFilters(updatedFilters);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('talentSpotting_savedCandidateFilters', JSON.stringify(updatedFilters));
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedSkills([]);
    setMinMatchScore(0);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return {
    // Filter state
    selectedSkills,
    minMatchScore,
    availableSkills,
    savedFilters,
    showSaveFilterDialog,
    filterName,
    filteredCandidates,
    
    // Filter actions
    setSelectedSkills,
    setMinMatchScore,
    setShowSaveFilterDialog,
    setFilterName,
    saveCurrentFilter,
    applyFilter,
    deleteFilter,
    resetFilters,
    formatDate
  };
}

// Helper function to filter candidates based on criteria
function applyFilters(
  candidates: Candidate[],
  minMatchScore: number,
  selectedSkills: string[]
): Candidate[] {
  let filtered = [...candidates];
  
  // Apply match score filter
  if (minMatchScore > 0) {
    filtered = filtered.filter(
      candidate => candidate.matchScore >= minMatchScore
    );
  }
  
  // Apply skills filter
  if (selectedSkills.length > 0) {
    filtered = filtered.filter(candidate => 
      selectedSkills.every(skill => candidate.skills.includes(skill))
    );
  }
  
  return filtered;
}
