import { calculateMatchScore as calculateDetailedMatchScore } from '../../services/candidate-scoring.service';

/**
 * Common types and utilities for employer controllers
 */

export interface Skill {
  id?: string;
  name: string;
  [key: string]: any;
}

export interface StudentProfile {
  skills?: Skill[];
  education?: any[];
  experience?: any[];
  about?: string;
  [key: string]: any;
}

export interface Job {
  id?: string;
  title?: string;
  organizationId?: string;
  skills?: Skill[];
  [key: string]: any;
}

// Helper function to calculate simple match score (for backwards compatibility)
export const calculateMatchScore = (studentProfile: StudentProfile | null | undefined, job: Job | null | undefined): number => {
  // Use the detailed scoring service but return just the overall score
  const result = calculateDetailedMatchScore(studentProfile, job);
  return result.overallScore;
};
