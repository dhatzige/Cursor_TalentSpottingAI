/**
 * Experience scoring module
 * 
 * Evaluates how well a candidate's work experience aligns with a job's requirements
 */
import { Experience, StudentProfile, Job } from './types';
import { ExtractedExperience } from '../cv-parser.service';

/**
 * Calculate experience match score (0-100)
 */
export function calculateExperienceScore(studentProfile: StudentProfile, job: Job): number {
  // Set up Experience data sources with priority for parsed CV data
  let experienceData: Experience[] | ExtractedExperience[] = [];
  let useParsedData = false;
  
  // Check if parsed CV data is available
  if (studentProfile?.parsedResumeData?.extractedExperience && 
      studentProfile.parsedResumeData.extractedExperience.length > 0) {
    experienceData = studentProfile.parsedResumeData.extractedExperience;
    useParsedData = true;
    console.log('Using parsed CV experience data for scoring');
  } 
  // Fall back to profile data if available
  else if (studentProfile.experience && studentProfile.experience.length > 0) {
    experienceData = studentProfile.experience;
    console.log('Using profile experience data for scoring');
  } else {
    // No experience data available
    return 0;
  }
  
  // Calculate total relevant months of experience
  let totalRelevantMonths = 0;
  
  experienceData.forEach(exp => {
    if (!exp.startDate || !exp.title) return;
    
    // Calculate duration of this experience
    let startDate: Date, endDate: Date;
    
    // Handle different data types for dates based on source (parsed vs. profile)
    if (typeof exp.startDate === 'string') {
      try {
        // Attempt to parse the date string (may vary from CV parser)
        startDate = new Date(exp.startDate);
        endDate = exp.endDate ? new Date(exp.endDate as string) : new Date();
      } catch (e) {
        // If parse fails, use current date to avoid breaking calculation
        startDate = new Date();
        endDate = new Date();
        console.error('Could not parse date from experience:', exp.startDate);
      }
    } else {
      // Already Date object from profile
      startDate = exp.startDate as Date;
      endDate = exp.endDate ? exp.endDate as Date : new Date();
    }
    
    // Calculate months (handle potential invalid dates by defaulting to 0)
    let durationMonths = 0;
    if (startDate instanceof Date && !isNaN(startDate.getTime())) {
      durationMonths = 
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());
    }
    
    // Determine relevance factor (0-1) based on job title and skills match
    const relevanceFactor = calculateRelevanceFactor(exp, job, useParsedData);
    
    // Add this experience's relevant time
    totalRelevantMonths += durationMonths * relevanceFactor;
  });
  
  return calculateExperienceScoreFromMonths(totalRelevantMonths, job.experienceLevel);
}

/**
 * Calculate the relevance factor of a specific experience to a job (0-1)
 */
function calculateRelevanceFactor(
  exp: Experience | ExtractedExperience, 
  job: Job, 
  useParsedData: boolean
): number {
  let relevanceFactor = 0.5; // Base relevance
  
  // Check for job title relevance (simplified)
  const jobTitle = job.title?.toLowerCase() || '';
  const expTitle = exp.title!.toLowerCase();
  
  // Title contains keywords from job title
  if (jobTitle.split(' ').some(word => word.length > 3 && expTitle.includes(word))) {
    relevanceFactor += 0.25;
  }
  
  // Calculate relevant skills overlap for this experience
  // Handle different data structures between parsed and profile data
  if (useParsedData) {
    // For parsed data - skills is string array
    const parsedExp = exp as ExtractedExperience;
    if (parsedExp.skills && job.skills) {
      const expSkills = parsedExp.skills.map(s => s.toLowerCase());
      const jobSkillNames = job.skills.map(s => s.name.toLowerCase());
      
      const matchingSkills = jobSkillNames.filter(skill => 
        expSkills.some(expSkill => expSkill.includes(skill))  
      );
      
      if (matchingSkills.length > 0) {
        relevanceFactor += 0.25 * Math.min(matchingSkills.length / jobSkillNames.length * 2, 1);
      }
    }
  } else {
    // For profile data - original format
    const profileExp = exp as Experience;
    if (profileExp.skills && job.skills) {
      const expSkills = profileExp.skills.map(s => s.toLowerCase());
      const jobSkillNames = job.skills.map(s => s.name.toLowerCase());
      
      const matchingSkills = jobSkillNames.filter(skill => expSkills.includes(skill));
      if (matchingSkills.length > 0) {
        relevanceFactor += 0.25 * Math.min(matchingSkills.length / jobSkillNames.length * 2, 1);
      }
    }
  }
  
  return relevanceFactor;
}

/**
 * Calculate experience score based on total relevant months and required experience level
 */
function calculateExperienceScoreFromMonths(totalRelevantMonths: number, experienceLevel?: string): number {
  // Convert required experience level to months
  let requiredMonths = 0;
  
  switch (experienceLevel?.toLowerCase()) {
    case 'entry':
      requiredMonths = 0;
      break;
    case 'junior':
      requiredMonths = 12;
      break;
    case 'mid':
      requiredMonths = 36;
      break;
    case 'senior':
      requiredMonths = 60;
      break;
    case 'lead':
      requiredMonths = 96;
      break;
    default:
      requiredMonths = 24; // Default to mid-level if not specified
  }
  
  // Score based on relevance and meeting requirements
  let experienceScore;
  
  if (totalRelevantMonths >= requiredMonths * 1.5) {
    experienceScore = 100; // Exceeds requirements by 50%
  } else if (totalRelevantMonths >= requiredMonths) {
    experienceScore = 80 + (totalRelevantMonths - requiredMonths) / (requiredMonths * 0.5) * 20;
  } else if (requiredMonths === 0) {
    experienceScore = 70; // Entry-level positions get decent score
  } else {
    experienceScore = Math.min(70, (totalRelevantMonths / requiredMonths) * 70);
  }
  
  return Math.round(experienceScore);
}
