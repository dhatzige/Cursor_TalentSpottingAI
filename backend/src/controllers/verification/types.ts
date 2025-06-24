export interface StudentVerificationRequest {
  universityId: string;
  studentId?: string;
}

export interface OrganizationVerificationRequest {
  organizationType: 'employer' | 'university';
  organizationName: string;
  registrationNumber?: string;
  website?: string;
}

export interface VerificationResponse {
  success: boolean;
  verificationId: string;
  status: string;
  message: string;
  documents?: {
    id: string;
    type: string;
    fileName: string;
    status: string;
  }[];
}

export interface VerificationStatusResponse {
  success: boolean;
  status: string;
  verifiedAt: Date | null;
  university?: {
    id: string;
    name: string;
    nameEn: string;
  };
  organization?: {
    id: string;
    name: string;
    verificationStatus: string;
  };
  documents: {
    id: string;
    type: string;
    fileName: string;
    status: string;
    reviewNotes: string | null;
    createdAt: Date;
    reviewedAt: Date | null;
  }[];
}

export interface UploadDocumentsResponse {
  success: boolean;
  documentIds: string[];
  uploadedFiles: {
    id: string;
    fileName: string;
    fileSize: number;
    type: string;
    status: string;
  }[];
}

export interface DocumentType {
  value: string;
  label: string;
  description: string;
  required: boolean;
}

export const STUDENT_DOCUMENT_TYPES: DocumentType[] = [
  {
    value: 'student_id',
    label: 'Student ID Card',
    description: 'Upload a clear photo of your student ID card',
    required: true
  },
  {
    value: 'enrollment_certificate',
    label: 'Enrollment Certificate',
    description: 'Official enrollment certificate from your university',
    required: false
  }
];

export const EMPLOYER_DOCUMENT_TYPES: DocumentType[] = [
  {
    value: 'business_license',
    label: 'Business License',
    description: 'Official business registration or license',
    required: true
  },
  {
    value: 'tax_certificate',
    label: 'Tax Certificate',
    description: 'Recent tax registration certificate',
    required: false
  },
  {
    value: 'company_registration',
    label: 'Company Registration',
    description: 'Official company registration documents',
    required: false
  }
];

export const UNIVERSITY_DOCUMENT_TYPES: DocumentType[] = [
  {
    value: 'accreditation',
    label: 'Accreditation Certificate',
    description: 'Official accreditation from education ministry',
    required: true
  },
  {
    value: 'ministry_approval',
    label: 'Ministry Approval',
    description: 'Approval letter from Ministry of Education',
    required: false
  },
  {
    value: 'official_letter',
    label: 'Official Letter',
    description: 'Official letter on university letterhead',
    required: false
  }
]; 