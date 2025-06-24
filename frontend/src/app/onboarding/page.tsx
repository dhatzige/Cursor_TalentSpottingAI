'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUniversityByEmail, University } from '@/lib/data/greek-universities';
import { validateEmailUniversityMatch } from '@/lib/utils/greek-university-validator';
import { GreekLocation } from '@/lib/data/greek-locations';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import {
  ProgressBar,
  UniversityStep,
  PersonalInfoStep,
  AcademicStep,
  ProfileStep,
  OnboardingNavigation
} from '@/components/onboarding';

export const dynamic = 'force-dynamic';

interface StudentDetails {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  address: string;
  bio: string;
  studyField: string;
  studyLevel: string;
  graduationYear: string;
  skills: string;
  selectedUniversityId: string;
  verificationDocuments: File[];
}

// Multi-step onboarding steps
const ONBOARDING_STEPS = [
  { id: 'university', title: 'University', description: 'Select your university' },
  { id: 'personal', title: 'Personal Info', description: 'Basic information' },
  { id: 'academic', title: 'Academic Info', description: 'Study details' },
  { id: 'profile', title: 'Complete Profile', description: 'Final touches' }
];

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [detectedUniversity, setDetectedUniversity] = useState<University | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [needsManualVerification, setNeedsManualVerification] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [universities, setUniversities] = useState<University[]>([]);
  const [studentDetails, setStudentDetails] = useState<StudentDetails>({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    address: '',
    bio: '',
    studyField: '',
    studyLevel: '',
    graduationYear: '',
    skills: '',
    selectedUniversityId: '',
    verificationDocuments: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [personalInfoValid, setPersonalInfoValid] = useState(false);

  // Fetch universities
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch('/api/universities');
        const data = await response.json();
        
        if (data.success && data.data) {
          setUniversities(data.data);
        }
      } catch (error) {
        console.error('❌ Error fetching universities:', error);
      }
    };

    fetchUniversities();
  }, []);

  // Scroll to top when step changes (UX best practice)
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentStep]);

  // Handle role and university detection
  useEffect(() => {
    if (isLoaded && user && user.primaryEmailAddress) {
      // Check URL parameter first (from signup redirect), then metadata
      const roleFromUrl = searchParams.get('role');
      const preSelectedRole = roleFromUrl || (user.unsafeMetadata as { selectedRole?: string })?.selectedRole;
      
      if (preSelectedRole) {
        setSelectedRole(preSelectedRole);
        
        // Store role in metadata if it came from URL
        if (roleFromUrl && !user.unsafeMetadata?.selectedRole) {
          user.update({
            unsafeMetadata: { 
              ...user.unsafeMetadata,
              selectedRole: roleFromUrl 
            }
          });
        }
        
        if (preSelectedRole === 'student') {
          const userEmail = user.primaryEmailAddress.emailAddress;
          const university = getUniversityByEmail(userEmail);
          
          if (university) {
            setDetectedUniversity(university);
          } else {
            setNeedsManualVerification(true);
          }
          
          setStudentDetails(prev => ({
            ...prev,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
          }));
        } else {
          processRoleSelection(preSelectedRole);
        }
      } else {
        router.push('/sign-up');
      }
    }
  }, [isLoaded, user, router, searchParams]);

  // Process role selection (for non-students)
  const processRoleSelection = async (role: string) => {
    if (!user) return;

    try {
      const code = generateDashboardCode();
      
      await user.update({
        unsafeMetadata: { role: role, dashboardCode: code },
      });

      // Sync with backend
      try {
        const token = await getToken?.();
        if (token) {
          const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
          await fetch(`${backend}/api/clerk/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
              role,
              dashboardCode: code,
            }),
          });
        }
      } catch (err) {
        console.error('Backend sync failed:', err);
      }

      // Redirect to verification or dashboard
      if (role === 'employer') {
        router.push('/organization-dashboard/verification');
      } else if (role === 'university') {
        router.push('/university-dashboard/verification');
      }
    } catch (err) {
      console.error('Failed to set role:', err);
      setError('Failed to set role. Please try again.');
    }
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validation for each step
  const isStepValid = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // University step
        return !!studentDetails.selectedUniversityId && getEmailUniversityValidation()?.type !== 'error';
      case 1: // Personal info step
        return personalInfoValid; // Use the validation from PersonalInfoStep component
      case 2: // Academic info step
        return !!studentDetails.studyField && !!studentDetails.studyLevel && !!studentDetails.graduationYear;
      case 3: // Profile completion step
        return true; // Optional step
      default:
        return false;
    }
  };

  // Validate email-university match
  const getEmailUniversityValidation = () => {
    if (!user?.primaryEmailAddress?.emailAddress || !studentDetails.selectedUniversityId) {
      return null;
    }
    
    const validation = validateEmailUniversityMatch(
      user.primaryEmailAddress.emailAddress,
      studentDetails.selectedUniversityId
    );
    
    // Map 'success' to 'info' to match UniversityStep component expectations
    return {
      type: validation.type === 'success' ? 'info' as const : 'error' as const,
      message: validation.message
    };
  };

  // Get selected university object
  const getSelectedUniversity = (): University | null => {
    if (!studentDetails.selectedUniversityId || universities.length === 0) {
      return null;
    }
    return universities.find(uni => uni.id === studentDetails.selectedUniversityId) || null;
  };

  // Handle student details submission
  const handleStudentSubmit = async () => {
    if (!user || !selectedRole) return;

    setSubmitting(true);
    setError(null);

    try {
      const code = generateDashboardCode();
      const hasUniversityEmail = !!detectedUniversity;
      const verificationStatus = hasUniversityEmail ? 'VERIFIED' : 'PENDING';
      
      await user.update({
        unsafeMetadata: { 
          role: selectedRole, 
          dashboardCode: code,
          verificationStatus
        },
      });

      const token = await getToken?.();
      if (token) {
        const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
        
        // Sync user with backend
        await fetch(`${backend}/api/clerk/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            name: `${studentDetails.firstName} ${studentDetails.lastName}`.trim(),
            role: selectedRole,
            dashboardCode: code,
          }),
        });

        // Create student profile
        const profileData = {
          // User identification fields (required by backend)
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: `${studentDetails.firstName} ${studentDetails.lastName}`.trim(),
          dashboardCode: code,
          // Profile fields
          firstName: studentDetails.firstName,
          lastName: studentDetails.lastName,
          phone: studentDetails.phone,
          locationId: studentDetails.city, // City name as locationId for now
          locationName: studentDetails.city, // Also save the display name
          bio: studentDetails.bio,
          studyField: studentDetails.studyField,
          studyLevel: studentDetails.studyLevel,
          graduationYear: parseInt(studentDetails.graduationYear) || new Date().getFullYear() + 1,
          skills: studentDetails.skills.split(',').map(s => s.trim()).filter(Boolean),
          universityId: studentDetails.selectedUniversityId,
          verificationStatus,
        };

        console.log('📝 Sending profile data:', profileData);

        const profileResponse = await fetch(`${backend}/api/student/create-profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        });

        if (!profileResponse.ok) {
          const errorText = await profileResponse.text();
          console.error('❌ Profile creation failed:', errorText);
          
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.message && errorData.message.includes('already exists')) {
              console.log('📝 Profile already exists, backend will handle update...');
              // Continue with the flow - backend now handles updates
            } else {
              throw new Error(errorData.message || 'Failed to create profile');
            }
          } catch (parseError) {
            // If error text is not JSON, handle it as plain text
            if (errorText.includes('already exists') || errorText.includes('Unique constraint')) {
              console.log('📝 User already exists, backend will handle update...');
              // Continue with the flow
            } else {
              throw new Error('Failed to create your profile. Please try again.');
            }
          }
        }

        const profileResult = await profileResponse.json();
        console.log('✅ Profile created successfully:', profileResult);

        // Upload verification documents if any
        if (studentDetails.verificationDocuments.length > 0) {
          const formData = new FormData();
          studentDetails.verificationDocuments.forEach((file) => {
            formData.append(`documents`, file);
          });
          formData.append('userId', user.id);
          formData.append('type', 'STUDENT_ID');

          await fetch(`${backend}/api/verification/upload-documents`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });
        }

        // Update user metadata to mark onboarding as complete
        await user.update({
          unsafeMetadata: { 
            role: selectedRole, 
            dashboardCode: code,
            verificationStatus,
            onboardingComplete: true,
            profileCreated: true
          },
        });

        console.log('✅ User metadata updated, redirecting to dashboard');
      }

      // Small delay to ensure metadata is propagated
      await new Promise(resolve => setTimeout(resolve, 500));

      // Use router.replace to prevent going back to onboarding
      // Real users should always go to the normal dashboard with proper Clerk authentication
      router.replace('/student-dashboard');
    } catch (err) {
      console.error('Failed to create student profile:', err);
      setError('Failed to create your profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate dashboard code
  const generateDashboardCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Step content renderer
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <UniversityStep
            selectedUniversityId={studentDetails.selectedUniversityId}
            onUniversitySelect={(universityId) => setStudentDetails(prev => ({ ...prev, selectedUniversityId: universityId }))}
            userEmail={user?.primaryEmailAddress?.emailAddress}
            detectedUniversity={detectedUniversity}
            needsManualVerification={needsManualVerification}
            verificationDocuments={studentDetails.verificationDocuments}
            onDocumentUpload={(files) => setStudentDetails(prev => ({ ...prev, verificationDocuments: [...prev.verificationDocuments, ...files] }))}
            emailUniversityValidation={getEmailUniversityValidation()}
          />
        );

      case 1:
        return (
          <PersonalInfoStep
            formData={{
              firstName: studentDetails.firstName,
              lastName: studentDetails.lastName,
              phone: studentDetails.phone,
              city: studentDetails.city,
              address: studentDetails.address
            }}
            onChange={(field, value) => {
              setStudentDetails(prev => ({ ...prev, [field]: value }));
            }}
            userEmail={user?.primaryEmailAddress?.emailAddress}
            onValidationChange={setPersonalInfoValid}
          />
        );

      case 2:
        return (
          <AcademicStep
            studyField={studentDetails.studyField}
            studyLevel={studentDetails.studyLevel}
            graduationYear={studentDetails.graduationYear}
            onStudyFieldChange={(value) => setStudentDetails(prev => ({ ...prev, studyField: value }))}
            onStudyLevelChange={(value) => setStudentDetails(prev => ({ ...prev, studyLevel: value }))}
            onGraduationYearChange={(value) => setStudentDetails(prev => ({ ...prev, graduationYear: value }))}
          />
        );

      case 3:
        return (
          <ProfileStep
            bio={studentDetails.bio}
            skills={studentDetails.skills}
            firstName={studentDetails.firstName}
            lastName={studentDetails.lastName}
            studyField={studentDetails.studyField}
            studyLevel={studentDetails.studyLevel}
            graduationYear={studentDetails.graduationYear}
            selectedUniversity={getSelectedUniversity()}
            city={studentDetails.city}
            onBioChange={(value) => setStudentDetails(prev => ({ ...prev, bio: value }))}
            onSkillsChange={(value) => setStudentDetails(prev => ({ ...prev, skills: value }))}
          />
        );

      default:
        return null;
    }
  };

  // Render loading state
  if (!isLoaded || !selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Setting up your account...</p>
        </div>
      </div>
    );
  }

  // Show student onboarding form
  if (selectedRole === 'student') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">TalentSpotting AI</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
              Complete Your Student Profile
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Welcome to your journey! Let's create an amazing profile that will help you connect with top employers and opportunities.
            </p>
          </div>

          {/* Progress Bar */}
          <ProgressBar steps={ONBOARDING_STEPS} currentStep={currentStep} />

          {/* Main Content Card */}
          <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardContent className="p-10">
              {renderStepContent()}

              {/* Error Display */}
              {error && (
                <Alert className="mt-8 border-2 border-red-200/60 bg-gradient-to-r from-red-50 to-rose-50 dark:border-red-800/60 dark:from-red-950/30 dark:to-rose-950/30 rounded-xl shadow-sm">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <AlertDescription className="text-red-800 dark:text-red-200 font-medium">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Navigation Buttons */}
              <OnboardingNavigation
                currentStep={currentStep}
                totalSteps={ONBOARDING_STEPS.length}
                canProceed={isStepValid(currentStep)}
                isSubmitting={submitting}
                onPrevious={prevStep}
                onNext={nextStep}
                onSubmit={handleStudentSubmit}
              />
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Need help? Contact our support team at
              </span>
              <a 
                href="mailto:support@talentspotting.ai" 
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                support@talentspotting.ai
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For non-student roles, show processing state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Setting up your {selectedRole} account...</p>
      </div>
    </div>
  );
}


