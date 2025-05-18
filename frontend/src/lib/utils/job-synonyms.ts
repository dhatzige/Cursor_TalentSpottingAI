/**
 * Job role synonyms and related terms mapping
 * 
 * This file contains definitions of job role synonyms used in search functionality
 */

/**
 * Job role synonyms and related terms
 */
export const jobRoleSynonyms: Record<string, string[]> = {
  // Sales related roles
  'sales': [
    'account executive', 'account manager', 'business development', 'sales representative', 
    'sales manager', 'sales associate', 'sales consultant', 'sales director', 
    'client success', 'customer success', 'business development', 'revenue'
  ],
  // Technical roles
  'developer': [
    'engineer', 'programmer', 'coder', 'software', 'dev', 'frontend', 'backend',
    'full-stack', 'fullstack', 'web developer', 'app developer', 'mobile developer'
  ],
  'data': [
    'data scientist', 'data analyst', 'data engineer', 'analytics', 'business intelligence',
    'bi', 'machine learning', 'ml', 'ai', 'big data', 'statistics', 'statistical'
  ],
  // Management roles
  'manager': [
    'lead', 'director', 'head', 'chief', 'supervisor', 'coordinator', 'team lead',
    'project manager', 'product manager', 'program manager'
  ],
  // Creative roles
  'designer': [
    'ux', 'ui', 'graphic', 'creative', 'design', 'product designer', 'visual designer',
    'interaction designer', 'web designer', 'ux/ui', 'ui/ux'
  ],
  'marketing': [
    'brand', 'growth', 'communications', 'market', 'digital marketing', 'seo',
    'content', 'social media', 'campaign', 'pr', 'public relations'
  ],
  // Other common roles
  'product': ['pm', 'program', 'project', 'product manager', 'product owner'],
  'finance': ['financial', 'accountant', 'accounting', 'controller', 'cfo', 'analyst', 'banking'],
  'hr': ['human resources', 'recruiter', 'talent', 'people', 'hiring', 'recruitment'],
  'customer': ['support', 'service', 'success', 'experience', 'cx', 'care', 'representative']
};

/**
 * Check if text contains any related terms/synonyms for the given search term
 */
export function matchesRelatedTerm(text: string, term: string): boolean {
  const termLower = term.toLowerCase();
  console.log(`Checking if "${text}" matches term "${termLower}"`);
  
  // Check for exact match first - this makes the search more precise
  if (text.includes(termLower)) {
    console.log(`✅ Exact match found for "${termLower}"`);
    return true;
  }
  
  // Special handling for job role synonyms
  if (jobRoleSynonyms[termLower]) {
    // Direct lookup - if the search term is a known job category
    const synonyms = jobRoleSynonyms[termLower];
    const foundSynonym = synonyms.find(synonym => text.includes(synonym.toLowerCase()));
    
    if (foundSynonym) {
      console.log(`✅ Found synonym "${foundSynonym}" for "${termLower}"`);
      return true;
    }
  }
  
  // Check if the term might be a synonym for one of our categories
  for (const [key, synonyms] of Object.entries(jobRoleSynonyms)) {
    // If the search term appears in any of the synonyms
    const matchingSynonym = synonyms.find(s => s.toLowerCase().includes(termLower));
    
    if (matchingSynonym) {
      // Check if the text contains the job category or any of its synonyms
      if (text.includes(key)) {
        console.log(`✅ Term "${termLower}" is part of synonym "${matchingSynonym}" for role "${key}"`);
        return true;
      }
      
      const matchingCategorySynonym = synonyms.find(s => text.includes(s.toLowerCase()));
      if (matchingCategorySynonym) {
        console.log(`✅ Category match: "${matchingCategorySynonym}" from role "${key}" for term "${termLower}"`);
        return true;
      }
    }
  }
  
  // For short terms (3-4 chars), be more lenient to avoid missing good matches
  if (termLower.length >= 3 && termLower.length <= 4) {
    const words = text.split(' ');
    const matchingWord = words.find(word => word.toLowerCase().includes(termLower));
    
    if (matchingWord) {
      console.log(`✅ Short term "${termLower}" matched in word "${matchingWord}"`);
      return true;
    }
  }
  
  console.log(`❌ No match found for "${termLower}"`);
  return false;
}
