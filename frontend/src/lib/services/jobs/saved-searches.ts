/**
 * Saved Searches Module
 * 
 * Handles saving, retrieving and managing saved job searches
 */
import { JobSearchQuery, SavedSearch } from '@/types/jobs';

// Storage key for saved searches
const SAVED_SEARCHES_KEY = 'talentSpotting_savedSearches';

/**
 * Get all saved searches for the current user
 */
export function getSavedSearches(): SavedSearch[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const savedSearchesJson = localStorage.getItem(SAVED_SEARCHES_KEY);
  return savedSearchesJson ? JSON.parse(savedSearchesJson) : [];
}

/**
 * Save a new search query
 * @param name User-provided name for the search
 * @param query The search query to save
 * @returns The saved search object
 */
export function saveSearch(name: string, query: JobSearchQuery): SavedSearch {
  const savedSearches = getSavedSearches();
  
  // Create new saved search with timestamp
  const newSearch: SavedSearch = {
    id: Date.now().toString(),
    name,
    query,
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString()
  };
  
  // Add to saved searches
  savedSearches.push(newSearch);
  
  // Save to localStorage
  localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(savedSearches));
  
  return newSearch;
}

/**
 * Delete a saved search by ID
 * @param id ID of the saved search to delete
 * @returns true if successful, false if not found
 */
export function deleteSavedSearch(id: string): boolean {
  const savedSearches = getSavedSearches();
  const initialLength = savedSearches.length;
  
  // Filter out the search to delete
  const updatedSearches = savedSearches.filter(search => search.id !== id);
  
  // If we filtered out a search, save the updated list
  if (updatedSearches.length < initialLength) {
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updatedSearches));
    return true;
  }
  
  return false;
}

/**
 * Update the last used timestamp for a saved search
 * @param id ID of the saved search to update
 * @returns The updated saved search or null if not found
 */
export function updateSavedSearchUsage(id: string): SavedSearch | null {
  const savedSearches = getSavedSearches();
  const searchIndex = savedSearches.findIndex(search => search.id === id);
  
  if (searchIndex === -1) {
    return null;
  }
  
  // Update last used timestamp
  savedSearches[searchIndex].lastUsed = new Date().toISOString();
  
  // Save to localStorage
  localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(savedSearches));
  
  return savedSearches[searchIndex];
}

/**
 * Get a saved search by ID
 * @param id ID of the saved search to get
 * @returns The saved search or null if not found
 */
export function getSavedSearchById(id: string): SavedSearch | null {
  const savedSearches = getSavedSearches();
  return savedSearches.find(search => search.id === id) || null;
}
