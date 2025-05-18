/**
 * Education scoring module
 * 
 * Evaluates how well a candidate's education matches a job's requirements
 */
import { Education, StudentProfile, Job } from './types';
import { ExtractedEducation } from '../cv-parser.service';

/**
 * Calculate education relevance score (0-100)
 */
export function calculateEducationScore(studentProfile: StudentProfile, job: Job): number {
  // Set up Education data sources with priority for parsed CV data
  let educationData: Education[] | ExtractedEducation[] = [];
  let useParsedData = false;
  
  // Check if parsed CV data is available
  if (studentProfile?.parsedResumeData?.extractedEducation && 
      studentProfile.parsedResumeData.extractedEducation.length > 0) {
    educationData = studentProfile.parsedResumeData.extractedEducation;
    useParsedData = true;
    console.log('Using parsed CV education data for scoring');
  } 
  // Fall back to profile data if available
  else if (studentProfile.education && studentProfile.education.length > 0) {
    educationData = studentProfile.education;
    console.log('Using profile education data for scoring');
  } else {
    // No education data available
    return 0;
  }
  
  // Check if job has education requirements
  if (!job.requiredEducation && !job.preferredEducation) return 50; // Neutral score if job has no requirements
  
  let educationScore = 0;
  
  // Get highest education level
  const highestEducation = useParsedData ? 
    getHighestEducationLevelFromParsed(educationData as ExtractedEducation[]) : 
    getHighestEducationLevel(educationData as Education[]);
  
  const requiredLevels = job.requiredEducation || [];
  const preferredLevels = job.preferredEducation || [];
  
  // Required education match: 70 points
  if (requiredLevels.length > 0 && meetsEducationRequirement(highestEducation, requiredLevels)) {
    educationScore = 70;
  }
  
  // Preferred education match: additional 30 points
  if (preferredLevels.length > 0 && meetsEducationRequirement(highestEducation, preferredLevels)) {
    educationScore += 30;
  } else if (requiredLevels.length === 0) {
    // If no required education but has some education, give partial credit
    educationScore = 50;
  }
  
  return educationScore;
}

/**
 * Helper function to get highest education level from structured profile data
 */
export function getHighestEducationLevel(education: Education[]): string {
  const levels = ['high school', 'associate', 'bachelor', 'master', 'doctorate', 'phd'];
  
  let highestLevel = '';
  let highestIndex = -1;
  
  education.forEach(edu => {
    if (!edu.degree) return;
    
    const degreeLower = edu.degree.toLowerCase();
    
    // Find matching education level
    levels.forEach((level, index) => {
      if (degreeLower.includes(level) && index > highestIndex) {
        highestLevel = level;
        highestIndex = index;
      }
    });
  });
  
  return highestLevel;
}

/**
 * Helper function to get highest education level from parsed CV data
 */
export function getHighestEducationLevelFromParsed(education: ExtractedEducation[]): string {
  const levels = ['high school', 'associate', 'bachelor', 'master', 'doctorate', 'phd'];
  
  let highestLevel = '';
  let highestIndex = -1;
  
  education.forEach(edu => {
    if (!edu.degree) return;
    
    const degreeLower = edu.degree.toLowerCase();
    
    // Find matching education level
    levels.forEach((level, index) => {
      if (degreeLower.includes(level) && index > highestIndex) {
        highestLevel = level;
        highestIndex = index;
      }
    });
  });
  
  return highestLevel;
}

/**
 * Check if candidate education level meets job requirements
 */
export function meetsEducationRequirement(candidateLevel: string, requiredLevels: string[]): boolean {
  const levels = ['high school', 'associate', 'bachelor', 'master', 'doctorate', 'phd'];
  
  const candidateIndex = levels.findIndex(level => level === candidateLevel);
  
  if (candidateIndex === -1) return false;
  
  // Check if candidate level meets any required level
  for (const requiredLevel of requiredLevels) {
    const requiredIndex = levels.findIndex(level => requiredLevel.toLowerCase().includes(level));
    
    if (requiredIndex !== -1 && candidateIndex >= requiredIndex) {
      return true;
    }
  }
  
  return false;
}
