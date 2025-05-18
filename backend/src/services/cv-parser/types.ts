/**
 * CV Parser Types
 * 
 * Common types for CV parsing capabilities
 */

export interface ExtractedExperience {
  company?: string;
  title?: string;
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string | null;
  duration?: number; // months
  skills?: string[];
}

export interface ExtractedEducation {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  graduationYear?: number;
  gpa?: number;
}

export interface ExtractedContact {
  email?: string;
  phone?: string;
  linkedIn?: string;
  website?: string;
}

export interface ExtractedCV {
  fullName?: string;
  contact?: ExtractedContact;
  summary?: string;
  skills: string[];
  experience: ExtractedExperience[];
  education: ExtractedEducation[];
  certifications?: string[];
  fullText: string;
}
