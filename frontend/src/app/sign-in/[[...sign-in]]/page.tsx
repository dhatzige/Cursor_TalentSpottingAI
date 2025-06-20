'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <SignIn path="/sign-in" routing="path" fallbackRedirectUrl="/onboarding" appearance={{ elements: { formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white' } }} />
    </div>
  );
}
