/**
 * CV Parser Service
 * 
 * Main interface for extracting structured data from resumes
 */
import { extractTextFromDocument } from './document-extractor';
import { extractSkills } from './skills-extractor';
import { extractExperience } from './experience-extractor';
import { extractEducation } from './education-extractor';
import { extractContactInfo, extractName } from './contact-extractor';
import { ExtractedCV } from './types';

/**
 * Parse a resume file and extract structured data
 */
export async function parseCV(filePath: string): Promise<ExtractedCV> {
  try {
    // Extract text from the document
    const text = await extractTextFromDocument(filePath);
    
    // Process the extracted text into structured data
    return processExtractedText(text);
  } catch (error) {
    console.error('Error parsing CV:', error);
    throw error;
  }
}

/**
 * Process extracted text into structured CV data
 */
function processExtractedText(text: string): ExtractedCV {
  // Initialize the result object
  const result: ExtractedCV = {
    skills: [],
    experience: [],
    education: [],
    fullText: text
  };
  
  // Extract contact information
  result.contact = extractContactInfo(text);
  
  // Extract name
  result.fullName = extractName(text);
  
  // Extract skills
  result.skills = extractSkills(text);
  
  // Extract work experience
  result.experience = extractExperience(text);
  
  // Extract education
  result.education = extractEducation(text);
  
  return result;
}

// Export all types and extractors for direct usage if needed
export * from './types';
export * from './document-extractor';
export * from './skills-extractor';
export * from './experience-extractor';
export * from './education-extractor';
export * from './contact-extractor';
