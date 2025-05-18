/**
 * Experience Extractor
 * 
 * Extracts work experience entries from resume text
 */
import { ExtractedExperience } from './types';
import { extractSkills } from './skills-extractor';

/**
 * Extract work experience entries from resume text
 */
export function extractExperience(text: string): ExtractedExperience[] {
  const experiences: ExtractedExperience[] = [];
  
  // Find the experience section
  const experienceSection = extractExperienceSection(text);
  if (!experienceSection) return experiences;
  
  // Split the section into individual experience entries
  const experienceBlocks = experienceSection.split(/\n\n+/);
  
  experienceBlocks.forEach(block => {
    if (block.trim().length < 10) return; // Skip very short blocks
    
    const experience: ExtractedExperience = {
      skills: []
    };
    
    // Extract dates (various formats)
    const dateInfo = extractDateRange(block);
    if (dateInfo) {
      experience.startDate = dateInfo.startDate;
      experience.endDate = dateInfo.endDate;
    }
    
    // Extract title and company
    const roleInfo = extractRoleInfo(block);
    if (roleInfo) {
      experience.title = roleInfo.title;
      experience.company = roleInfo.company;
    }
    
    // Extract skills mentioned in this experience
    experience.skills = extractSkills(block);
    
    // Only add if we have some meaningful data
    if (experience.title || experience.company || (experience.skills && experience.skills.length > 0)) {
      experiences.push(experience);
    }
  });
  
  return experiences;
}

/**
 * Extract the experience section from a resume
 */
function extractExperienceSection(text: string): string | null {
  // Try various section header patterns for "experience"
  const experienceSectionRegex = /(?:work experience|professional experience|experience|employment history|work history)[\\s\\n]*[:;-]?([\\s\\S]*?)(?:education|skills|projects|achievements|certification|references|languages|^\s*$)/i;
  const experienceSectionMatch = text.match(experienceSectionRegex);
  
  if (experienceSectionMatch && experienceSectionMatch[1]) {
    return experienceSectionMatch[1].trim();
  }
  
  return null;
}

/**
 * Extract date range from an experience block
 */
function extractDateRange(block: string): { startDate: string, endDate: string | null } | null {
  // Various date formats: MM/YYYY, MM-YYYY, Month YYYY
  const dateRangeRegex = /(?:\d{1,2}\/\d{2,4}|\d{1,2}-\d{2,4}|\w+ \d{4})\s?(?:-|–|to)\s?(?:\d{1,2}\/\d{2,4}|\d{1,2}-\d{2,4}|\w+ \d{4}|present|current)/i;
  const dateMatch = block.match(dateRangeRegex);
  
  if (dateMatch) {
    const dateString = dateMatch[0];
    const [start, end] = dateString.split(/\s?(?:-|–|to)\s?/i);
    
    return {
      startDate: start,
      endDate: end?.toLowerCase() === 'present' || end?.toLowerCase() === 'current' ? null : end
    };
  }
  
  return null;
}

/**
 * Extract role information (title and company) from an experience block
 */
function extractRoleInfo(block: string): { title: string, company: string } | null {
  // We'll use a simple heuristic: first line is likely the title or title + company
  const lines = block.split('\n');
  
  if (lines.length === 0) return null;
  
  // Try to detect job title and company
  let title = '';
  let company = '';
  
  // First line often contains title
  if (lines[0].trim()) {
    title = lines[0].trim();
    
    // Many resumes format as "Title, Company" or "Title at Company" or "Title - Company"
    const titleCompanySeparators = [' at ', ' - ', ', ', ' @ '];
    for (const separator of titleCompanySeparators) {
      if (title.includes(separator)) {
        const parts = title.split(separator);
        title = parts[0].trim();
        company = parts[1].trim();
        break;
      }
    }
  }
  
  // If no company found yet and there's a second line, it's likely the company
  if (!company && lines.length > 1 && lines[1].trim()) {
    company = lines[1].trim();
  }
  
  if (title || company) {
    return { title, company };
  }
  
  return null;
}
