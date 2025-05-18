/**
 * Education Extractor
 * 
 * Extracts education entries from resume text
 */
import { ExtractedEducation } from './types';

// Known degree types for extraction
const DEGREES = [
  'bachelor', 'bs', 'ba', 'b.s.', 'b.a.', 'master', 'ms', 'ma', 'm.s.', 'm.a.',
  'phd', 'ph.d', 'doctorate', 'mba', 'associate', 'diploma', 'high school'
];

/**
 * Extract education entries from resume text
 */
export function extractEducation(text: string): ExtractedEducation[] {
  const educationEntries: ExtractedEducation[] = [];
  
  // Find the education section
  const educationSection = extractEducationSection(text);
  if (!educationSection) return educationEntries;
  
  // Split into individual education entries
  const educationBlocks = educationSection.split(/\n\n+/);
  
  educationBlocks.forEach(block => {
    if (block.trim().length < 10) return; // Skip very short blocks
    
    const education: ExtractedEducation = {};
    
    // Extract institution from first line (common format)
    const lines = block.split('\n');
    if (lines.length > 0) {
      education.institution = lines[0].trim();
    }
    
    // Extract degree information
    const degreeInfo = extractDegree(block);
    if (degreeInfo) {
      education.degree = degreeInfo.degree;
      education.fieldOfStudy = degreeInfo.fieldOfStudy;
    }
    
    // Extract graduation year
    const graduationYear = extractGraduationYear(block);
    if (graduationYear) {
      education.graduationYear = graduationYear;
    }
    
    // Extract GPA if present
    const gpa = extractGPA(block);
    if (gpa !== null) {
      education.gpa = gpa;
    }
    
    // Only add if we have meaningful data
    if (education.institution || education.degree) {
      educationEntries.push(education);
    }
  });
  
  return educationEntries;
}

/**
 * Extract the education section from a resume
 */
function extractEducationSection(text: string): string | null {
  // Try various section header patterns for "education"
  const educationSectionRegex = /(?:education|academic background|qualifications)[\\s\\n]*[:;-]?([\\s\\S]*?)(?:experience|skills|projects|achievements|certification|references|languages|^\s*$)/i;
  const educationSectionMatch = text.match(educationSectionRegex);
  
  if (educationSectionMatch && educationSectionMatch[1]) {
    return educationSectionMatch[1].trim();
  }
  
  return null;
}

/**
 * Extract degree information from an education block
 */
function extractDegree(block: string): { degree: string, fieldOfStudy?: string } | null {
  // Pattern to find degree mentions
  const degreeRegex = new RegExp(`(?:${DEGREES.join('|')})\\s+(?:of|in)?\\s+([^,\\n]+)`, 'i');
  const degreeMatch = block.match(degreeRegex);
  
  if (degreeMatch) {
    return {
      degree: degreeMatch[0],
      fieldOfStudy: degreeMatch[1] ? degreeMatch[1].trim() : undefined
    };
  }
  
  return null;
}

/**
 * Extract graduation year from an education block
 */
function extractGraduationYear(block: string): number | null {
  // Look for years (assume 4 digit years between 1950-2030)
  const yearRegex = /(?:19[5-9][0-9]|20[0-3][0-9])/g;
  const yearMatches = block.match(yearRegex);
  
  if (yearMatches && yearMatches.length > 0) {
    // If multiple years, take the latest one (assuming it's graduation)
    const years = yearMatches.map(y => parseInt(y)).sort((a, b) => b - a);
    return years[0];
  }
  
  return null;
}

/**
 * Extract GPA from an education block
 */
function extractGPA(block: string): number | null {
  // Look for GPA (various formats)
  const gpaRegex = /(?:gpa|grade point average)[:;]?\\s*(\\d+\\.\\d+)/i;
  const gpaMatch = block.match(gpaRegex);
  
  if (gpaMatch && gpaMatch[1]) {
    return parseFloat(gpaMatch[1]);
  }
  
  return null;
}
