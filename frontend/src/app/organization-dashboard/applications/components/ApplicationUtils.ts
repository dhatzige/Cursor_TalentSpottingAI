import { SavedApplicationSearch } from './ApplicationsTypes';
import { Application } from '@/types/application';

/**
 * Loads saved application searches from localStorage
 * @returns Array of saved searches or empty array if none found
 */
export function loadSavedApplicationSearches(): SavedApplicationSearch[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedSearchesJson = localStorage.getItem('talentSpotting_savedApplicationSearches');
    if (savedSearchesJson) {
      return JSON.parse(savedSearchesJson);
    }
  } catch (err) {
    console.error('Error loading saved searches:', err);
  }
  
  return [];
}

/**
 * Saves application searches to localStorage
 * @param searches Array of saved searches to store
 */
export function saveSavedApplicationSearches(searches: SavedApplicationSearch[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('talentSpotting_savedApplicationSearches', JSON.stringify(searches));
  } catch (err) {
    console.error('Error saving searches:', err);
  }
}

/**
 * Safely extracts job information from application objects with different structures
 * @param app Application object
 * @returns Object containing jobId and jobTitle
 */
export function extractJobInfo(app: Application): { jobId: string | null; jobTitle: string } {
  // Extract job information safely
  const jobId = app.jobId || null;
  
  // Look for job title using the most reliable property available
  let jobTitle = 'Unknown Job';
  if ('jobTitle' in app) {
    jobTitle = (app as any).jobTitle;
  } else if ('job' in app && (app as any).job?.title) {
    jobTitle = (app as any).job.title;
  }
  
  return { jobId, jobTitle };
}
