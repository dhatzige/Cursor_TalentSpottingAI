/**
 * Candidate Scoring System
 * 
 * This module integrates the specialized scoring components to provide a
 * comprehensive evaluation of candidate-job fit.
 */
import { StudentProfile, Job, Application, ScoringWeights, CandidateScore } from './types';
import { calculateSkillsScore } from './skills-scorer';
import { calculateEducationScore } from './education-scorer';
import { calculateExperienceScore } from './experience-scorer';
import { calculateApplicationQualityScore } from './application-quality-scorer';

// Default weights for scoring components
const DEFAULT_WEIGHTS: ScoringWeights = {
  skills: 0.5,      // 50% of total score
  education: 0.2,   // 20% of total score
  experience: 0.2,  // 20% of total score
  applicationQuality: 0.1 // 10% of total score
};

/**
 * Calculate comprehensive match score between candidate and job
 */
export function calculateMatchScore(
  studentProfile: StudentProfile | null | undefined, 
  job: Job | null | undefined,
  application?: Application | null,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): CandidateScore {
  // Handle null cases
  if (!studentProfile || !job) {
    return { 
      overallScore: 0, 
      breakdownScores: { skills: 0, education: 0, experience: 0, applicationQuality: 0 }
    };
  }
  
  // Calculate individual component scores
  const skillsScore = calculateSkillsScore(studentProfile, job);
  const educationScore = calculateEducationScore(studentProfile, job);
  const experienceScore = calculateExperienceScore(studentProfile, job);
  const applicationQualityScore = calculateApplicationQualityScore(application, job);
  
  // Calculate weighted overall score
  const overallScore = Math.round(
    skillsScore * weights.skills +
    educationScore * weights.education +
    experienceScore * weights.experience +
    applicationQualityScore * weights.applicationQuality
  );
  
  return {
    overallScore,
    breakdownScores: {
      skills: skillsScore,
      education: educationScore,
      experience: experienceScore,
      applicationQuality: applicationQualityScore
    }
  };
}

// Legacy backwards-compatibility function for simpler scoring
export function calculateSimpleMatchScore(
  studentProfile: StudentProfile | null | undefined, 
  job: Job | null | undefined
): number {
  const result = calculateMatchScore(studentProfile, job);
  return result.overallScore;
}

// Export all individual scorers for direct access if needed
export * from './skills-scorer';
export * from './education-scorer';
export * from './experience-scorer';
export * from './application-quality-scorer';
export * from './types';
