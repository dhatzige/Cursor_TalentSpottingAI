/**
 * Contact Extractor
 * 
 * Extracts contact information from resume text
 */
import { ExtractedContact } from './types';

/**
 * Extract contact information from resume text
 */
export function extractContactInfo(text: string): ExtractedContact {
  const contact: ExtractedContact = {};
  
  // Email extraction
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const emailMatches = text.match(emailRegex);
  if (emailMatches && emailMatches.length > 0) {
    contact.email = emailMatches[0];
  }
  
  // Phone extraction (various formats)
  const phoneRegex = /(\+\d{1,3})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
  const phoneMatches = text.match(phoneRegex);
  if (phoneMatches && phoneMatches.length > 0) {
    contact.phone = phoneMatches[0];
  }
  
  // LinkedIn profile
  const linkedInRegex = /linkedin\.com\/in\/[\w-]+/gi;
  const linkedInMatches = text.match(linkedInRegex);
  if (linkedInMatches && linkedInMatches.length > 0) {
    contact.linkedIn = linkedInMatches[0];
  }
  
  // Website/portfolio
  const websiteRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}(?:\/\S*)?/gi;
  const websiteMatches = text.match(websiteRegex);
  if (websiteMatches && websiteMatches.length > 0) {
    // Filter out LinkedIn and common job sites
    const personalSite = websiteMatches.find(site => {
      const lowerSite = site.toLowerCase();
      return !lowerSite.includes('linkedin') && 
             !lowerSite.includes('indeed') && 
             !lowerSite.includes('monster') &&
             !lowerSite.includes('glassdoor');
    });
    
    if (personalSite) {
      contact.website = personalSite;
    }
  }
  
  return contact;
}

/**
 * Extract the candidate's name from resume text
 */
export function extractName(text: string): string | undefined {
  // Use the first 500 characters as most resumes have name at the top
  const topText = text.substring(0, 500).toLowerCase();
  
  // Split into lines and look for potential name line
  const lines = topText.split('\n');
  
  // Filter out lines with common CV headers or contact info
  const potentialNameLines = lines.filter(line => {
    const l = line.trim().toLowerCase();
    if (!l || l.length < 3 || l.length > 50) return false;
    if (l.includes('@') || l.includes('resume') || l.includes('cv')) return false;
    if (l.includes('phone') || l.includes('email') || l.includes('address')) return false;
    return true;
  });
  
  // Return the first potential name line, if any
  return potentialNameLines[0]?.trim();
}
