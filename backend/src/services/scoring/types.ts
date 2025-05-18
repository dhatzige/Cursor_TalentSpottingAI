/**
 * Common types for the candidate scoring system
 */
import { ExtractedExperience, ExtractedEducation } from '../cv-parser.service';

export interface Skill {
  name: string;
  proficiency?: number; // 1-10 scale if available
  yearsExperience?: number;
  [key: string]: any;
}

export interface Education {
  degree?: string;
  fieldOfStudy?: string;
  institution?: string;
  graduationYear?: number;
  gpa?: number;
  [key: string]: any;
}

export interface Experience {
  title?: string;
  company?: string;
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string | null;
  skills?: string[];
  [key: string]: any;
}

export interface StudentProfile {
  skills?: Skill[];
  education?: Education[];
  experience?: Experience[];
  about?: string;
  parsedResumeData?: {
    skills?: string[];
    extractedExperience?: ExtractedExperience[];
    extractedEducation?: ExtractedEducation[];
    fullText?: string;
    parsedAt?: Date;
  };
  [key: string]: any;
}

export interface Job {
  id?: string;
  title?: string;
  description?: string;
  organizationId?: string;
  skills?: Skill[];
  requiredEducation?: string[];
  preferredEducation?: string[];
  experienceLevel?: string;
  [key: string]: any;
}

export interface Application {
  id?: string;
  resumePath?: string;
  coverLetter?: string;
  parsedResumeData?: {
    skills?: string[];
    extractedExperience?: ExtractedExperience[];
    extractedEducation?: ExtractedEducation[];
    fullText?: string;
  };
  [key: string]: any;
}

export interface ScoringWeights {
  skills: number;
  education: number;
  experience: number;
  applicationQuality: number;
}

export interface ScoreBreakdown {
  skills: number;
  education: number;
  experience: number;
  applicationQuality: number;
}

export interface CandidateScore {
  overallScore: number;
  breakdownScores: ScoreBreakdown;
}
