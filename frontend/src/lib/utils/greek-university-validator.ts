import { GREEK_UNIVERSITIES, University } from '@/lib/data/greek-universities';

export interface EmailValidationResult {
  isValid: boolean;
  isGreekUniversity: boolean;
  university?: University;
  verificationMethod: 'AUTO' | 'MANUAL';
  message: string;
  suggestedAction?: string;
}

/**
 * Personal email domains that require manual verification
 */
const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
  'icloud.com', 'protonmail.com', 'tutanota.com', 'zoho.com',
  'yahoo.gr', 'hotmail.gr', 'live.gr', 'windowslive.com'
];

/**
 * Get Greek university by email domain
 */
export function getGreekUniversityByEmail(email: string): University | null {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return null;

  return GREEK_UNIVERSITIES.find(uni => 
    uni.emailDomains.some(uniDomain => 
      domain === uniDomain || domain.endsWith(`.${uniDomain}`)
    )
  ) || null;
}

/**
 * Validate email for student registration
 */
export function validateStudentEmail(email: string): EmailValidationResult {
  if (!email) {
    return {
      isValid: false,
      isGreekUniversity: false,
      verificationMethod: 'MANUAL',
      message: 'Email address is required'
    };
  }

  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    return {
      isValid: false,
      isGreekUniversity: false,
      verificationMethod: 'MANUAL',
      message: 'Invalid email format'
    };
  }

  // Check if it's a Greek university email (auto-verification)
  const greekUniversity = getGreekUniversityByEmail(email);
  if (greekUniversity) {
    return {
      isValid: true,
      isGreekUniversity: true,
      university: greekUniversity,
      verificationMethod: 'AUTO',
      message: `Verified Greek university email from ${greekUniversity.nameEn}`,
      suggestedAction: 'You will be automatically verified upon registration'
    };
  }

  // Check if it's a personal email (manual verification allowed)
  if (PERSONAL_EMAIL_DOMAINS.includes(domain)) {
    return {
      isValid: true,
      isGreekUniversity: false,
      verificationMethod: 'MANUAL',
      message: 'Personal email detected - manual verification required',
      suggestedAction: 'You can register and will need to upload student documents for verification'
    };
  }

  // Unknown domain - could be personal or international university
  // Allow registration but require manual verification
  return {
    isValid: true,
    isGreekUniversity: false,
    verificationMethod: 'MANUAL',
    message: 'Email domain not recognized - manual verification required',
    suggestedAction: 'You can register and will need to upload student documents for verification'
  };
}

/**
 * Validate email-university match during onboarding
 */
export function validateEmailUniversityMatch(email: string, selectedUniversityId: string): {
  isValid: boolean;
  message: string;
  type: 'success' | 'error';
} {
  const emailUniversity = getGreekUniversityByEmail(email);
  
  // If email matches a Greek university, it must match the selected university
  if (emailUniversity) {
    if (emailUniversity.id === selectedUniversityId) {
      return {
        isValid: true,
        message: `✅ Email verified for ${emailUniversity.nameEn}`,
        type: 'success'
      };
    } else {
      const selectedUni = GREEK_UNIVERSITIES.find(u => u.id === selectedUniversityId);
      return {
        isValid: false,
        message: `❌ Your email is from ${emailUniversity.nameEn}, but you selected ${selectedUni?.nameEn || 'a different university'}. Please select the correct university or use a personal email.`,
        type: 'error'
      };
    }
  }
  
  // Personal email - can select any Greek university (requires manual verification)
  return {
    isValid: true,
    message: `⚠️ Personal email with manual verification required`,
    type: 'success'
  };
}

/**
 * Get user-friendly message for email validation
 */
export function getEmailValidationMessage(email: string): {
  canRegister: boolean;
  message: string;
  type: 'success' | 'warning' | 'error';
  action?: string;
} {
  const validation = validateStudentEmail(email);
  
  if (validation.verificationMethod === 'AUTO') {
    return {
      canRegister: true,
      message: `✅ ${validation.message}`,
      type: 'success',
      action: validation.suggestedAction
    };
  }
  
  return {
    canRegister: true,
    message: `⚠️ ${validation.message}`,
    type: 'warning',
    action: validation.suggestedAction
  };
} 