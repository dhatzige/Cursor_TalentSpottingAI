// Core interfaces for the TalentSpottingAI platform, based on the registration and verification system plan.

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'employer' | 'university';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  dashboardCode: string; // 8-character unique code
}

export interface Document {
  id: string;
  url: string;
  name: string;
  type: 'id' | 'business_license' | 'accreditation' | 'tax_id' | 'other';
  uploadedAt: Date;
}

export interface OrganizationInfo {
  name: string;
  website: string;
  registrationNumber?: string; // Business license number
  address: string;
  contactPerson: string;
  documents: Document[]; // Business license, accreditation, etc.
}

export interface VerificationData {
  userId: string;
  documents: Document[];
  universityId?: string; // For students
  organizationDetails?: OrganizationInfo; // For employers/universities
  adminNotes?: string;
}

export interface University {
  id: string;
  name: string;
  emailDomains: string[]; // e.g., ['stanford.edu', 'student.stanford.edu']
  country: string;
}
