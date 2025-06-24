'use client';

import { SignUp, useUser } from '@clerk/nextjs';
import '../../../styles/gradient-bg.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { School, Building, Briefcase, AlertCircle, CheckCircle2, ArrowLeft, GraduationCap, Building2, Clock, Mail } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Role {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  disclaimer: string;
  requirements: string[];
}

const roles: Role[] = [
  {
    id: 'student',
    title: 'Student',
    description: 'Find internships, jobs, and career opportunities',
    icon: GraduationCap,
    color: 'blue',
    disclaimer: 'You must be currently enrolled in a university or have graduated within the last 2 years.',
    requirements: [
      'Valid university email address (preferred for instant verification)',
      'Current enrollment or recent graduation (within 2 years)',
      'Academic transcripts or student ID (may be required)',
      'Completed academic profile with study details'
    ]
  },
  {
    id: 'employer',
    title: 'Employer',
    description: 'Post jobs, find talent, and build your team',
    icon: Building2,
    color: 'amber',
    disclaimer: 'You must represent a legitimate business or organization with proper registration documents.',
    requirements: [
      'Valid business registration and tax documentation',
      'Professional email address from your organization',
      'Company website and official business information',
      'Verification documents (business license, tax ID, etc.)'
    ]
  },
  {
    id: 'university',
    title: 'University',
    description: 'Connect students with opportunities and track placements',
    icon: School,
    color: 'teal',
    disclaimer: 'You must be an official representative of an accredited educational institution.',
    requirements: [
      'Official university email address and credentials',
      'Institutional accreditation documentation',
      'Authorization to represent the university',
      'Official letterhead and institutional verification'
    ]
  }
];

export default function SignUpPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Handle redirect for already signed-in users
  useEffect(() => {
    if (isLoaded && user && !isRedirecting) {
      const metadata = user.unsafeMetadata;
      
      // If user is already signed in and has completed onboarding, redirect to appropriate dashboard
      if (metadata?.onboardingComplete) {
        setIsRedirecting(true);
        const role = metadata?.selectedRole || metadata?.role;
        if (role === 'student') {
          router.replace('/student-dashboard?dev_bypass=true');
        } else if (role === 'employer') {
          router.replace('/organization-dashboard?dev_bypass=true');
        } else if (role === 'university') {
          router.replace('/university-dashboard?dev_bypass=true');
        } else {
          router.replace('/');
        }
        return;
      }
      
      // If user exists but hasn't completed onboarding and has a role, send them to onboarding
      if (metadata?.selectedRole) {
        setIsRedirecting(true);
        router.replace(`/onboarding?role=${metadata.selectedRole}`);
        return;
      }
      
      // If user exists but no role is set in metadata, and we have a local selectedRole, update metadata
      if (selectedRole && !metadata?.selectedRole && !isUpdatingRole) {
        setIsUpdatingRole(true);
        user.update({
          unsafeMetadata: {
            ...metadata,
            selectedRole: selectedRole.id
          }
        }).then(() => {
          setIsUpdatingRole(false);
          setIsRedirecting(true);
          router.replace(`/onboarding?role=${selectedRole.id}`);
        }).catch((error) => {
          console.error('Failed to update user metadata:', error);
          setIsUpdatingRole(false);
        });
        return;
      }
    }
  }, [isLoaded, user, router, selectedRole, isRedirecting, isUpdatingRole]);

  const handleRoleSelect = async (role: Role) => {
    setSelectedRole(role);
    setShowSignUp(false); // Reset to show disclaimer first
    
    // If user is already signed in, immediately update their metadata
    if (user && isLoaded) {
      setIsUpdatingRole(true);
      try {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            selectedRole: role.id
          }
        });
        console.log('✅ Role updated in user metadata:', role.id);
      } catch (error) {
        console.error('Failed to update user metadata with role:', error);
      } finally {
        setIsUpdatingRole(false);
      }
    }
  };

  const handleProceedToSignUp = () => {
    setShowSignUp(true);
  };

  const handleBack = () => {
    if (showSignUp) {
      setShowSignUp(false);
    } else {
      setSelectedRole(null);
    }
  };

  // Show loading state during redirects
  if (isRedirecting || isUpdatingRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse opacity-20"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isUpdatingRole ? 'Setting up your account...' : 'Redirecting...'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isUpdatingRole 
                ? 'We\'re preparing your personalized experience' 
                : 'Taking you to complete your profile'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Role Selection Step
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Join TalentSpottingAI
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose your role to get started with our AI-powered talent matching platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Card 
                  key={role.id}
                  className={`relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                    ${role.color === 'blue' ? 'hover:border-blue-300 hover:shadow-blue-100 dark:hover:shadow-blue-900/20' : ''}
                    ${role.color === 'amber' ? 'hover:border-amber-300 hover:shadow-amber-100 dark:hover:shadow-amber-900/20' : ''}
                    ${role.color === 'teal' ? 'hover:border-teal-300 hover:shadow-teal-100 dark:hover:shadow-teal-900/20' : ''}
                  `}
                  onClick={() => handleRoleSelect(role)}
                  style={{ opacity: isUpdatingRole ? 0.6 : 1 }}
                  className={isUpdatingRole ? 'pointer-events-none' : ''}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg
                      ${role.color === 'blue' ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900' : ''}
                      ${role.color === 'amber' ? 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-800 dark:to-amber-900' : ''}
                      ${role.color === 'teal' ? 'bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-800 dark:to-teal-900' : ''}
                    `}>
                      <Icon className={`h-8 w-8
                        ${role.color === 'blue' ? 'text-blue-600 dark:text-blue-300' : ''}
                        ${role.color === 'amber' ? 'text-amber-600 dark:text-amber-300' : ''}
                        ${role.color === 'teal' ? 'text-teal-600 dark:text-teal-300' : ''}
                      `} />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      {role.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      disabled={isUpdatingRole}
                      className={`w-full font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] relative
                        ${role.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600' : ''}
                        ${role.color === 'amber' ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' : ''}
                        ${role.color === 'teal' ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600' : ''}
                        ${isUpdatingRole ? 'cursor-not-allowed opacity-60' : ''}
                      `}
                    >
                      {isUpdatingRole ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Setting up...
                        </>
                      ) : (
                        `Select ${role.title}`
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              Already have an account?{' '}
              <a href="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Disclaimer Step
  if (selectedRole && !showSignUp) {
    const Icon = selectedRole.icon;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-1/4 -left-48 w-96 h-96 rounded-full opacity-8 blur-3xl
            ${selectedRole.id === 'student' ? 'bg-blue-200' : ''}
            ${selectedRole.id === 'employer' ? 'bg-amber-200' : ''}
            ${selectedRole.id === 'university' ? 'bg-teal-200' : ''}
          `} />
          <div className={`absolute bottom-1/4 -right-48 w-96 h-96 rounded-full opacity-8 blur-3xl
            ${selectedRole.id === 'student' ? 'bg-indigo-200' : ''}
            ${selectedRole.id === 'employer' ? 'bg-orange-200' : ''}
            ${selectedRole.id === 'university' ? 'bg-cyan-200' : ''}
          `} />
        </div>

        <div className="w-full max-w-2xl space-y-8 relative z-10">
          
          <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg relative backdrop-blur-sm
                ${selectedRole.id === 'student' ? 'bg-blue-100/30 dark:bg-blue-800/30 border border-blue-200/30 dark:border-blue-700/30' : ''}
                ${selectedRole.id === 'employer' ? 'bg-amber-100/30 dark:bg-amber-800/30 border border-amber-200/30 dark:border-amber-700/30' : ''}
                ${selectedRole.id === 'university' ? 'bg-teal-100/30 dark:bg-teal-800/30 border border-teal-200/30 dark:border-teal-700/30' : ''}
              `}>
                {/* Subtle glow behind icon */}
                <div className={`absolute inset-0 rounded-full blur-lg opacity-20
                  ${selectedRole.id === 'student' ? 'bg-blue-300' : ''}
                  ${selectedRole.id === 'employer' ? 'bg-amber-300' : ''}
                  ${selectedRole.id === 'university' ? 'bg-teal-300' : ''}
                `} />
                <Icon className={`h-10 w-10 relative z-10
                  ${selectedRole.id === 'student' ? 'text-blue-600 dark:text-blue-300' : ''}
                  ${selectedRole.id === 'employer' ? 'text-amber-600 dark:text-amber-300' : ''}
                  ${selectedRole.id === 'university' ? 'text-teal-600 dark:text-teal-300' : ''}
                `} />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedRole.title} Registration
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                Please review the requirements before creating your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 px-8 pb-8">
              
              {/* Important Notice */}
              <Alert className="border border-amber-200/40 bg-amber-50/20 dark:border-amber-700/40 dark:bg-amber-950/20 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-100/10 to-orange-100/10 dark:from-amber-900/10 dark:to-orange-900/10" />
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 relative z-10" />
                <AlertDescription className="text-amber-800 dark:text-amber-200 font-medium relative z-10">
                  <strong>Important:</strong> {selectedRole.disclaimer}
                </AlertDescription>
              </Alert>

              {/* Requirements Section */}
              <div className="space-y-4">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                  <div className={`w-1 h-6 rounded-full
                    ${selectedRole.id === 'student' ? 'bg-gradient-to-b from-blue-500 to-blue-600' : ''}
                    ${selectedRole.id === 'employer' ? 'bg-gradient-to-b from-amber-500 to-amber-600' : ''}
                    ${selectedRole.id === 'university' ? 'bg-gradient-to-b from-teal-500 to-teal-600' : ''}
                  `} />
                  Requirements for {selectedRole.title} accounts:
                </h3>
                <div className={`rounded-xl p-6 border backdrop-blur-sm
                  ${selectedRole.id === 'student' ? 'bg-blue-50/20 border-blue-200/30 dark:bg-blue-950/20 dark:border-blue-800/30' : ''}
                  ${selectedRole.id === 'employer' ? 'bg-amber-50/20 border-amber-200/30 dark:bg-amber-950/20 dark:border-amber-800/30' : ''}
                  ${selectedRole.id === 'university' ? 'bg-teal-50/20 border-teal-200/30 dark:bg-teal-950/20 dark:border-teal-800/30' : ''}
                `}>
                  <ul className="space-y-4">
                    {selectedRole.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3 group">
                        <div className={`rounded-full p-1 mt-0.5 transition-all duration-200 group-hover:scale-110 backdrop-blur-sm
                          ${selectedRole.id === 'student' ? 'bg-blue-100/40 dark:bg-blue-900/40' : ''}
                          ${selectedRole.id === 'employer' ? 'bg-amber-100/40 dark:bg-amber-900/40' : ''}
                          ${selectedRole.id === 'university' ? 'bg-teal-100/40 dark:bg-teal-900/40' : ''}
                        `}>
                          <CheckCircle2 className={`h-4 w-4 flex-shrink-0
                            ${selectedRole.id === 'student' ? 'text-blue-600 dark:text-blue-400' : ''}
                            ${selectedRole.id === 'employer' ? 'text-amber-600 dark:text-amber-400' : ''}
                            ${selectedRole.id === 'university' ? 'text-teal-600 dark:text-teal-400' : ''}
                          `} />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                          {requirement}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Role-specific tips */}
              {selectedRole.id === 'student' && (
                <Alert className="border border-blue-200/40 bg-blue-50/20 dark:border-blue-700/40 dark:bg-blue-950/20 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 to-indigo-100/10 dark:from-blue-900/10 dark:to-indigo-900/10" />
                  <School className="h-5 w-5 text-blue-600 dark:text-blue-400 relative z-10" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200 font-medium relative z-10">
                    <strong>💡 Pro Tip:</strong> Use your university email for instant verification. 
                    Supported domains include .edu, .ac.uk, uoa.gr, auth.gr, and many others.
                  </AlertDescription>
                </Alert>
              )}

              {selectedRole.id === 'employer' && (
                <Alert className="border border-amber-200/40 bg-amber-50/20 dark:border-amber-700/40 dark:bg-amber-950/20 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-100/10 to-orange-100/10 dark:from-amber-900/10 dark:to-orange-900/10" />
                  <Briefcase className="h-5 w-5 text-amber-600 dark:text-amber-400 relative z-10" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200 font-medium relative z-10">
                    <strong>🚀 Pro Tip:</strong> Have your business registration documents ready for faster verification. 
                    This includes business license, tax ID, and company website.
                  </AlertDescription>
                </Alert>
              )}

              {selectedRole.id === 'university' && (
                <Alert className="border border-teal-200/40 bg-teal-50/20 dark:border-teal-700/40 dark:bg-teal-950/20 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-100/10 to-cyan-100/10 dark:from-teal-900/10 dark:to-cyan-900/10" />
                  <Building className="h-5 w-5 text-teal-600 dark:text-teal-400 relative z-10" />
                  <AlertDescription className="text-teal-800 dark:text-teal-200 font-medium relative z-10">
                    <strong>🎓 Pro Tip:</strong> Use your official institutional email and have accreditation documents ready. 
                    This ensures faster approval for your university account.
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 border border-gray-300/30 dark:border-gray-600/30 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm hover:bg-gray-50/40 dark:hover:bg-gray-800/40 transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={handleProceedToSignUp}
                  className={`flex-1 px-8 py-3 font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.01] backdrop-blur-sm
                    ${selectedRole.id === 'student' ? 'bg-gradient-to-r from-blue-400/70 to-indigo-400/70 hover:from-blue-500/80 hover:to-indigo-500/80' : ''}
                    ${selectedRole.id === 'employer' ? 'bg-gradient-to-r from-amber-400/70 to-orange-400/70 hover:from-amber-500/80 hover:to-orange-500/80' : ''}
                    ${selectedRole.id === 'university' ? 'bg-gradient-to-r from-teal-400/70 to-cyan-400/70 hover:from-teal-500/80 hover:to-cyan-500/80' : ''}
                  `}
                >
                  I Understand, Continue ✨
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Sign Up Step
  const Icon = selectedRole.icon;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/3 -left-32 w-64 h-64 rounded-full opacity-10 blur-3xl
          ${selectedRole.id === 'student' ? 'bg-blue-400' : ''}
          ${selectedRole.id === 'employer' ? 'bg-amber-400' : ''}
          ${selectedRole.id === 'university' ? 'bg-teal-400' : ''}
        `} />
        <div className={`absolute bottom-1/3 -right-32 w-64 h-64 rounded-full opacity-10 blur-3xl
          ${selectedRole.id === 'student' ? 'bg-indigo-400' : ''}
          ${selectedRole.id === 'employer' ? 'bg-orange-400' : ''}
          ${selectedRole.id === 'university' ? 'bg-cyan-400' : ''}
        `} />
      </div>

      <div className="w-full max-w-lg space-y-6 relative z-10">
        
        {/* Role Confirmation */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg
              ${selectedRole.id === 'student' ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900' : ''}
              ${selectedRole.id === 'employer' ? 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-800 dark:to-amber-900' : ''}
              ${selectedRole.id === 'university' ? 'bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-800 dark:to-teal-900' : ''}
            `}>
              <Icon className={`h-6 w-6
                ${selectedRole.id === 'student' ? 'text-blue-600 dark:text-blue-300' : ''}
                ${selectedRole.id === 'employer' ? 'text-amber-600 dark:text-amber-300' : ''}
                ${selectedRole.id === 'university' ? 'text-teal-600 dark:text-teal-300' : ''}
              `} />
            </div>
            <Badge variant="outline" className={`text-sm font-medium px-3 py-1
              ${selectedRole.id === 'student' ? 'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300' : ''}
              ${selectedRole.id === 'employer' ? 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300' : ''}
              ${selectedRole.id === 'university' ? 'border-teal-300 text-teal-700 dark:border-teal-700 dark:text-teal-300' : ''}
            `}>
              {selectedRole.title} Registration
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Creating your {selectedRole.title.toLowerCase()} account
          </p>
        </div>

        {/* Sign Up Form */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-2 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Create Your Account</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {selectedRole.id === 'student' 
                ? 'Use your university email for instant verification'
                : 'Enter your professional information'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            
            {/* Verification Help */}
            <Alert className="mb-6 border border-blue-200/40 bg-blue-50/20 dark:border-blue-700/40 dark:bg-blue-950/20 backdrop-blur-sm">
              <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                <div className="space-y-2">
                  <p><strong>Email Verification Tips:</strong></p>
                  <ul className="text-xs space-y-1 ml-4">
                    <li>• Check your email for the verification code (including spam folder)</li>
                    <li>• The code expires after 10 minutes - request a new one if needed</li>
                    <li>• Having trouble? Try refreshing the page or using a different browser</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            <SignUp 
              onClerkError={(error) => {
                console.error('Clerk signup error:', error);
              }}
              onSignUpSuccess={async (user) => {
                console.log('✅ Signup successful, updating metadata...');
                setIsUpdatingRole(true);
                try {
                  await user.update({
                    unsafeMetadata: {
                      ...user.unsafeMetadata,
                      selectedRole: selectedRole.id
                    }
                  });
                  console.log('✅ Role metadata updated after signup:', selectedRole.id);
                  setIsRedirecting(true);
                } catch (error) {
                  console.error('Failed to update metadata after signup:', error);
                } finally {
                  setIsUpdatingRole(false);
                }
              }}
              appearance={{
                baseTheme: undefined,
                variables: {
                  colorPrimary: selectedRole.id === 'student' ? '#3b82f6' : selectedRole.id === 'employer' ? '#f59e0b' : '#14b8a6',
                  colorBackground: 'transparent',
                  colorInputBackground: 'rgb(55, 65, 81)',
                  colorInputText: 'rgb(243, 244, 246)',
                  colorText: 'rgb(243, 244, 246)',
                  colorTextSecondary: 'rgb(156, 163, 175)',
                  borderRadius: '0.75rem',
                  fontFamily: 'var(--font-geist-sans)',
                  fontSize: '16px',
                  spacingUnit: '1rem'
                },
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none border-none bg-transparent w-full',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  formButtonPrimary: `
                    w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-[1.01] shadow-md hover:shadow-lg
                    ${selectedRole.id === 'student' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                      : selectedRole.id === 'employer'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
                      : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700'
                    }
                  `,
                  socialButtonsBlockButton: `
                    w-full py-3 px-4 mb-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 
                    bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 
                    text-gray-700 dark:text-gray-200 font-medium transition-all duration-200
                    shadow-sm hover:shadow-md
                  `,
                  dividerLine: 'bg-gray-300 dark:bg-gray-600',
                  dividerText: 'text-gray-500 dark:text-gray-400 text-sm font-medium',
                  formFieldInput: `
                    w-full py-3 px-4 rounded-lg border-2 bg-white dark:bg-gray-700 
                    text-gray-900 dark:text-gray-100 transition-all duration-200
                    ${selectedRole.id === 'student'
                      ? 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900'
                      : selectedRole.id === 'employer'
                      ? 'border-gray-200 dark:border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 dark:focus:ring-amber-900'
                      : 'border-gray-200 dark:border-gray-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900'
                    }
                  `,
                  formFieldLabel: 'text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm',
                  identityPreviewEditButton: `
                    ${selectedRole.id === 'student' ? 'text-blue-600 hover:text-blue-700' : selectedRole.id === 'employer' ? 'text-amber-600 hover:text-amber-700' : 'text-teal-600 hover:text-teal-700'}
                  `,
                  footerActionLink: `
                    ${selectedRole.id === 'student' ? 'text-blue-600 hover:text-blue-700' : selectedRole.id === 'employer' ? 'text-amber-600 hover:text-amber-700' : 'text-teal-600 hover:text-teal-700'}
                    font-medium transition-colors duration-200
                  `,
                  footerActionText: 'text-gray-600 dark:text-gray-400',
                  formFieldSuccessText: `
                    ${selectedRole.id === 'student' ? 'text-blue-600' : selectedRole.id === 'employer' ? 'text-amber-600' : 'text-teal-600'}
                  `,
                  formFieldErrorText: 'text-red-600 dark:text-red-400',
                  alertError: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg p-3',
                  form: 'space-y-4',
                  formFieldRow: 'space-y-2',
                  otpCodeFieldInput: `
                    w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 bg-white dark:bg-gray-700 
                    text-gray-900 dark:text-gray-100 transition-all duration-200
                    ${selectedRole.id === 'student'
                      ? 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900'
                      : selectedRole.id === 'employer'
                      ? 'border-gray-200 dark:border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 dark:focus:ring-amber-900'
                      : 'border-gray-200 dark:border-gray-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900'
                    }
                  `,
                  verificationLinkStatusText: 'text-gray-600 dark:text-gray-400 text-sm',
                  verificationLinkStatusIconBox: 'text-gray-500 dark:text-gray-400',
                  spinner: `
                    ${selectedRole.id === 'student' ? 'text-blue-600' : selectedRole.id === 'employer' ? 'text-amber-600' : 'text-teal-600'}
                  `,
                  formResendCodeLink: `
                    ${selectedRole.id === 'student' ? 'text-blue-600 hover:text-blue-700' : selectedRole.id === 'employer' ? 'text-amber-600 hover:text-amber-700' : 'text-teal-600 hover:text-teal-700'}
                    font-medium transition-colors duration-200 text-sm
                  `,
                  formFieldAction: `
                    ${selectedRole.id === 'student' ? 'text-blue-600 hover:text-blue-700' : selectedRole.id === 'employer' ? 'text-amber-600 hover:text-amber-700' : 'text-teal-600 hover:text-teal-700'}
                    font-medium transition-colors duration-200 text-sm
                  `
                }
              }}
              routing="path"
              afterSignUpUrl={`/onboarding?role=${selectedRole.id}`}
              redirectUrl={`/onboarding?role=${selectedRole.id}`}
              signInUrl="/sign-in"
            />
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className={`text-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800
              ${selectedRole.id === 'student' ? 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300' : ''}
              ${selectedRole.id === 'employer' ? 'text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300' : ''}
              ${selectedRole.id === 'university' ? 'text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300' : ''}
            `}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to role selection
          </Button>
        </div>
      </div>
    </div>
  );
}
