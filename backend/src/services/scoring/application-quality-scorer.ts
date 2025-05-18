/**
 * Application Quality scoring module
 * 
 * Evaluates the quality and completeness of a job application
 */
import { Application, Job } from './types';

/**
 * Calculate application quality score based on resume and cover letter (0-100)
 */
export function calculateApplicationQualityScore(
  application: Application | null | undefined, 
  job: Job
): number {
  if (!application) return 0;
  
  let applicationScore = 50; // Base score
  
  // Check if cover letter exists and is substantial
  if (application.coverLetter) {
    const coverLetterLength = application.coverLetter.length;
    
    // Adjust score based on cover letter length
    if (coverLetterLength > 1500) {
      applicationScore += 25; // Very detailed cover letter
    } else if (coverLetterLength > 800) {
      applicationScore += 20; // Good length cover letter
    } else if (coverLetterLength > 400) {
      applicationScore += 15; // Basic cover letter
    } else if (coverLetterLength > 200) {
      applicationScore += 10; // Short cover letter
    } else {
      applicationScore += 5; // Very short cover letter
    }
    
    // Check if cover letter mentions job title or skills (simplified)
    const jobTitle = job.title?.toLowerCase() || '';
    const jobSkills = job.skills?.map(s => s.name.toLowerCase()) || [];
    
    const coverLetterLower = application.coverLetter.toLowerCase();
    
    if (jobTitle && coverLetterLower.includes(jobTitle)) {
      applicationScore += 10; // Mentions specific job title
    }
    
    let skillMentions = 0;
    jobSkills.forEach(skill => {
      if (coverLetterLower.includes(skill)) {
        skillMentions++;
      }
    });
    
    applicationScore += Math.min(skillMentions * 3, 15); // Up to 15 points for skill mentions
  }
  
  // Has resume
  if (application.resumePath) {
    applicationScore += 10;
  }
  
  return Math.min(100, applicationScore); // Cap at 100
}
