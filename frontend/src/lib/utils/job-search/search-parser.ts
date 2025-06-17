/**
 * Search Parser Module
 * 
 * Handles parsing search queries into structured search terms
 */
import { ParsedSearchQuery } from './types';

/**
 * Parse search query for special operators
 * Supports quoted phrases, +required terms, -excluded terms, and OR alternatives
 */
export function parseSearchQuery(query: string): ParsedSearchQuery {
  const regularTerms: string[] = [];
  const requiredTerms: string[] = [];
  const excludedTerms: string[] = [];
  const orTerms: string[] = [];
  
  // Handle quoted phrases
  const quotedPhrasesRegex = /"([^"]+)"/g;
  const quotedPhrases = Array.from(query.matchAll(quotedPhrasesRegex)).map(match => match[1]);
  
  // Remove quoted phrases from query for further processing
  let remainingQuery = query;
  quotedPhrases.forEach(phrase => {
    remainingQuery = remainingQuery.replace(`"${phrase}"`, '');
    regularTerms.push(phrase);
  });
  
  // Split remaining terms by spaces
  const terms = remainingQuery.trim().split(/\s+/).filter(term => term);
  
  // Process each term for special operators
  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];
    
    // Skip empty terms
    if (!term) continue;
    
    // Check for "OR" operator
    if (term.toLowerCase() === 'or' && i > 0 && i < terms.length - 1) {
      // Add the term before OR and after OR to orTerms
      orTerms.push(terms[i-1]);
      orTerms.push(terms[i+1]);
      // Remove the already processed term before OR from regularTerms
      const termBeforeIndex = regularTerms.indexOf(terms[i-1]);
      if (termBeforeIndex !== -1) {
        regularTerms.splice(termBeforeIndex, 1);
      }
      // Skip the next term as we've already processed it
      i++;
    }
    // Required term
    else if (term.startsWith('+')) {
      requiredTerms.push(term.substring(1));
    }
    // Excluded term
    else if (term.startsWith('-')) {
      excludedTerms.push(term.substring(1));
    }
    // Regular term
    else {
      regularTerms.push(term);
    }
  }
  
  return { regularTerms, requiredTerms, excludedTerms, orTerms };
}
