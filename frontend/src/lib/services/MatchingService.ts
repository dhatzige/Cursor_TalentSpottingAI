/**
 * MatchingService
 * 
 * This service provides advanced matching algorithms for:
 * 1. Calculating match scores between candidates and job requirements
 * 2. Ranking candidates based on qualifications
 * 3. Providing skills gap analysis
 * 4. Recommending jobs to students based on their profile
 */

import { Application } from '../../types/application';

// Types for job requirements
export interface JobRequirements {
  required: string[];   // Skills that are mandatory for the position
  preferred: string[];  // Skills that are nice-to-have but not required
  experience?: number;  // Years of experience required (if applicable)
  education?: string[]; // Required education levels/degrees
  location?: string;    // Job location
  remote?: boolean;     // Whether remote work is allowed
}

// Types for candidate profile
export interface CandidateProfile {
  skills: string[];         // Candidate's skills
  experience?: number;      // Years of experience
  education?: string;       // Highest education level/degree
  location?: string;        // Candidate's location
  remotePreference?: boolean; // Whether candidate prefers remote work
}

// Match result with detailed breakdown
export interface MatchResult {
  overallScore: number;       // Overall match percentage (0-100)
  requiredSkillsScore: number; // Percentage of required skills matched
  preferredSkillsScore: number; // Percentage of preferred skills matched
  experienceScore?: number;    // Experience match score
  educationScore?: number;     // Education match score
  locationScore?: number;      // Location match score
  missingRequiredSkills: string[]; // Required skills the candidate is missing
  matchedRequiredSkills: string[]; // Required skills the candidate has
  matchedPreferredSkills: string[]; // Preferred skills the candidate has
}

const MatchingService = {
  /**
   * Calculate a detailed match score between a candidate and job requirements
   * 
   * @param candidateProfile The candidate's profile with skills and qualifications
   * @param jobRequirements The job requirements including required and preferred skills
   * @returns A detailed MatchResult with scores and skill breakdowns
   */
  calculateMatchScore(candidateProfile: CandidateProfile, jobRequirements: JobRequirements): MatchResult {
    // Initialize match result
    const result: MatchResult = {
      overallScore: 0,
      requiredSkillsScore: 0,
      preferredSkillsScore: 0,
      missingRequiredSkills: [],
      matchedRequiredSkills: [],
      matchedPreferredSkills: []
    };
    
    // Calculate required skills match
    if (jobRequirements.required.length > 0) {
      const matchedRequired = jobRequirements.required.filter(
        skill => candidateProfile.skills.includes(skill)
      );
      
      result.matchedRequiredSkills = matchedRequired;
      result.missingRequiredSkills = jobRequirements.required.filter(
        skill => !candidateProfile.skills.includes(skill)
      );
      
      result.requiredSkillsScore = (matchedRequired.length / jobRequirements.required.length) * 100;
    } else {
      result.requiredSkillsScore = 100; // If no required skills, score is 100%
    }
    
    // Calculate preferred skills match
    if (jobRequirements.preferred.length > 0) {
      const matchedPreferred = jobRequirements.preferred.filter(
        skill => candidateProfile.skills.includes(skill)
      );
      
      result.matchedPreferredSkills = matchedPreferred;
      result.preferredSkillsScore = (matchedPreferred.length / jobRequirements.preferred.length) * 100;
    } else {
      result.preferredSkillsScore = 0; // If no preferred skills, score is 0%
    }
    
    // Calculate experience match (if applicable)
    if (jobRequirements.experience !== undefined && candidateProfile.experience !== undefined) {
      if (candidateProfile.experience >= jobRequirements.experience) {
        result.experienceScore = 100;
      } else {
        // Partial score based on how close they are to required experience
        result.experienceScore = (candidateProfile.experience / jobRequirements.experience) * 100;
      }
    }
    
    // Calculate education match (if applicable)
    if (jobRequirements.education && candidateProfile.education) {
      const educationLevels = [
        'high school',
        'associate',
        'bachelor',
        'master',
        'doctorate'
      ];
      
      const candidateLevel = educationLevels.indexOf(candidateProfile.education.toLowerCase());
      
      // Find the highest required education level
      let highestRequiredLevel = -1;
      for (const edu of jobRequirements.education) {
        const level = educationLevels.indexOf(edu.toLowerCase());
        if (level > highestRequiredLevel) {
          highestRequiredLevel = level;
        }
      }
      
      if (candidateLevel >= highestRequiredLevel) {
        result.educationScore = 100;
      } else {
        result.educationScore = 0; // Education is usually binary - either qualified or not
      }
    }
    
    // Calculate location match (if applicable)
    if (jobRequirements.location && candidateProfile.location) {
      if (jobRequirements.remote && candidateProfile.remotePreference) {
        result.locationScore = 100; // Remote job and candidate prefers remote
      } else if (jobRequirements.location.toLowerCase() === candidateProfile.location.toLowerCase()) {
        result.locationScore = 100; // Same location
      } else {
        result.locationScore = 0; // Different locations
      }
    }
    
    // Calculate overall score with weighted components
    // Skills (70%), Experience (15%), Education (10%), Location (5%)
    let overallScore = (result.requiredSkillsScore * 0.5) + (result.preferredSkillsScore * 0.2);
    let divisor = 0.7; // Base divisor for skills components
    
    if (result.experienceScore !== undefined) {
      overallScore += result.experienceScore * 0.15;
      divisor += 0.15;
    }
    
    if (result.educationScore !== undefined) {
      overallScore += result.educationScore * 0.1;
      divisor += 0.1;
    }
    
    if (result.locationScore !== undefined) {
      overallScore += result.locationScore * 0.05;
      divisor += 0.05;
    }
    
    // Normalize the overall score based on available components
    result.overallScore = Math.round(overallScore / divisor);
    
    return result;
  },
  
  /**
   * Calculate match scores for multiple applications and rank them
   * 
   * @param applications List of job applications
   * @param jobRequirements The job requirements
   * @returns The applications with match scores, sorted by score
   */
  rankApplications(applications: Application[], jobRequirements: JobRequirements): (Application & { matchResult: MatchResult })[] {
    // Convert applications to include candidate profiles
    const applicationsWithProfiles = applications.map(app => {
      const candidateProfile: CandidateProfile = {
        skills: app.skills || [],
        // Add other profile details if available in the application
      };
      
      const matchResult = this.calculateMatchScore(candidateProfile, jobRequirements);
      
      return {
        ...app,
        matchResult
      };
    });
    
    // Sort by overall match score (descending)
    return applicationsWithProfiles.sort(
      (a, b) => b.matchResult.overallScore - a.matchResult.overallScore
    );
  },
  
  /**
   * Get skills gaps for a candidate compared to job requirements
   * 
   * @param candidateSkills The candidate's skills
   * @param jobRequirements The job requirements
   * @returns Object with missing required and preferred skills
   */
  getSkillsGapAnalysis(candidateSkills: string[], jobRequirements: JobRequirements) {
    return {
      missingRequiredSkills: jobRequirements.required.filter(
        skill => !candidateSkills.includes(skill)
      ),
      missingPreferredSkills: jobRequirements.preferred.filter(
        skill => !candidateSkills.includes(skill)
      )
    };
  },
  
  /**
   * Check if a candidate meets the minimum requirements for a job
   * 
   * @param candidateProfile The candidate's profile
   * @param jobRequirements The job requirements
   * @returns Boolean indicating if candidate meets minimum requirements
   */
  meetsMinimumRequirements(candidateProfile: CandidateProfile, jobRequirements: JobRequirements): boolean {
    // Calculate required skills match percentage
    const requiredSkillsMatch = jobRequirements.required.filter(
      skill => candidateProfile.skills.includes(skill)
    ).length / jobRequirements.required.length;
    
    // Check if meets minimum threshold (80% of required skills)
    const meetsSkillsThreshold = requiredSkillsMatch >= 0.8;
    
    // Check experience requirement if specified
    const meetsExperienceRequirement = 
      jobRequirements.experience === undefined || 
      (candidateProfile.experience !== undefined && 
       candidateProfile.experience >= jobRequirements.experience);
    
    // Check education requirement if specified
    let meetsEducationRequirement = true;
    if (jobRequirements.education && jobRequirements.education.length > 0 && candidateProfile.education) {
      const educationLevels = [
        'high school',
        'associate',
        'bachelor',
        'master',
        'doctorate'
      ];
      
      const candidateLevel = educationLevels.indexOf(candidateProfile.education.toLowerCase());
      
      // Find the highest required education level
      let highestRequiredLevel = -1;
      for (const edu of jobRequirements.education) {
        const level = educationLevels.indexOf(edu.toLowerCase());
        if (level > highestRequiredLevel) {
          highestRequiredLevel = level;
        }
      }
      
      meetsEducationRequirement = candidateLevel >= highestRequiredLevel;
    }
    
    // Candidate meets minimum requirements if they meet the skills threshold
    // and satisfy any experience and education requirements
    return meetsSkillsThreshold && meetsExperienceRequirement && meetsEducationRequirement;
  }
};

export default MatchingService;
