'use client';

import { SignIn } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-blue-400 opacity-10 blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-64 h-64 rounded-full bg-indigo-400 opacity-10 blur-3xl" />
      </div>

      <div className="w-full max-w-lg space-y-6 relative z-10">
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-2 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Sign in to your TalentSpottingAI account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <SignIn 
              path="/sign-in" 
              routing="path" 
              fallbackRedirectUrl="/onboarding"
              appearance={{
                baseTheme: undefined,
                variables: {
                  colorPrimary: '#3b82f6',
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
                    bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
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
                    border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900
                  `,
                  formFieldLabel: 'text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm',
                  identityPreviewEditButton: 'text-blue-600 hover:text-blue-700',
                  footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200',
                  footerActionText: 'text-gray-600 dark:text-gray-400',
                  formFieldSuccessText: 'text-blue-600',
                  formFieldErrorText: 'text-red-600 dark:text-red-400',
                  alertError: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg p-3',
                  form: 'space-y-4',
                  formFieldRow: 'space-y-2'
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
