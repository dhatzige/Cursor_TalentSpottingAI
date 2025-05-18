/**
 * Skills scoring module
 * 
 * Evaluates how well a candidate's skills match a job's requirements
 */
import { Skill, StudentProfile, Job } from './types';

/**
 * Calculate skills match score (0-100)
 */
export function calculateSkillsScore(studentProfile: StudentProfile, job: Job): number {
  if (!job.skills || job.skills.length === 0) return 0;
  
  // Get job skill names for comparison
  const jobSkills = job.skills.map(s => s.name.toLowerCase());
  if (jobSkills.length === 0) return 0;
  
  // PRIORITY: First check parsed resume data (from CV) if available
  let studentSkills: string[] = [];
  
  // 1. Check if parsed resume data is available and has skills
  if (studentProfile?.parsedResumeData?.skills && studentProfile.parsedResumeData.skills.length > 0) {
    studentSkills = studentProfile.parsedResumeData.skills.map(s => s.toLowerCase());
    console.log('Using parsed resume skills for matching');
  } 
  // 2. If no parsed data, fall back to profile skills
  else if (studentProfile?.skills) {
    studentSkills = studentProfile.skills.map(s => s.name.toLowerCase());
    console.log('Using profile skills for matching');
  }
  
  // Count matching skills and any bonus for proficiency
  let skillPoints = 0;
  let maxPossiblePoints = jobSkills.length * 10; // Max 10 points per required skill
  
  jobSkills.forEach(jobSkill => {
    if (studentSkills.includes(jobSkill)) {
      // Basic match: 7 points
      let pointsForThisSkill = 7;
      
      // Look for proficiency info for bonus points (if using profile data)
      if (!studentProfile?.parsedResumeData?.skills) {
        const studentSkillObj = studentProfile.skills?.find(
          s => s.name.toLowerCase() === jobSkill
        );
        
        if (studentSkillObj) {
          // Add bonus points for years of experience (up to 3 bonus points)
          if (studentSkillObj.yearsExperience) {
            pointsForThisSkill += Math.min(studentSkillObj.yearsExperience, 3);
          }
          
          // Or add bonus points for proficiency level if available
          else if (studentSkillObj.proficiency) {
            pointsForThisSkill += Math.min(Math.floor(studentSkillObj.proficiency / 3), 3);
          }
        }
      } 
      // For parsed resume data, we give a standard bonus since we don't have proficiency data
      else {
        // Additional 2 points for having the skill in the actual CV
        pointsForThisSkill += 2;
      }
      
      skillPoints += pointsForThisSkill;
    }
  });
  
  // Calculate percentage score out of 100
  return Math.round((skillPoints / maxPossiblePoints) * 100);
}
