'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RoleCard from '../role-selector/RoleCard';

const roles = [
  {
    title: 'Student',
    description: 'Find job opportunities and connect with employers',
    icon: '/icons/student.svg',
    dashboard: '/student-dashboard',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
  },
  {
    title: 'Employer',
    description: 'Post jobs and discover talent',
    icon: '/icons/employer.svg',
    dashboard: '/organization-dashboard',
    bgColor: 'bg-green-50 hover:bg-green-100',
  },
  {
    title: 'University',
    description: 'Manage university presence and help students',
    icon: '/icons/university.svg',
    dashboard: '/university-dashboard',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
  },
];

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [processingRole, setProcessingRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // This effect handles redirection. It runs when the user object is loaded or changes.
  useEffect(() => {
    if (isLoaded && user) {
      const role = (user.unsafeMetadata as { role?: string })?.role;
      // If a role exists, redirect to the corresponding dashboard.
      if (role) {
        const dashboard = roles.find(r => r.title.toLowerCase() === role)?.dashboard;
        if (dashboard) {
          router.push(dashboard);
        }
      }
      // If no role, the user stays on the onboarding page.
    }
  }, [isLoaded, user, router]);

    const handleSelect = async (roleTitle: string) => {
    if (!user || processingRole) return;

    const role = roleTitle.toLowerCase();
    setProcessingRole(roleTitle);
    setError(null);

    try {
      // Step 1: Verify email if the role is 'student'
      if (role === 'student') {
        const res = await fetch('/api/verify-email');
        const data = await res.json();

        if (!res.ok || !data.isValid) {
          setError(data.error || 'A valid university email (.edu, .ac.uk, etc.) is required for the Student role.');
          setProcessingRole(null);
          return;
        }
      }

      // Step 2: If verification passes or is not required, update metadata
      const code = generateDashboardCode();
      console.log('Updating user role to:', role);
      await user.update({
        unsafeMetadata: { role: role, dashboardCode: code },
      });

      console.log('User role updated successfully. Redirect will be handled by the useEffect.');

      // Step 3: Sync with backend (non-blocking)
      try {
        const token = await getToken?.();
        if (token) {
          const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
          const syncPromise = fetch(`${backend}/api/clerk/sync`, {
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

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Backend sync timeout')), 2000)
          );

          await Promise.race([syncPromise, timeoutPromise]).catch((err) =>
            console.log('Backend sync skipped:', err.message)
          );
        }
      } catch (err) {
        console.error('Failed backend sync:', err);
        // Non-critical, so we don't set a user-facing error
      }
    } catch (err) {
      console.error('Failed to set role:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      // The useEffect will handle redirect, so we don't need to set processingRole to null here
      // as the component will unmount. But it's good practice in case redirect fails.
      setProcessingRole(null);
    }
  };

  // Render nothing until Clerk is loaded to prevent flicker
  if (!isLoaded) return null;

  // If the user is loaded but has a role, the useEffect will redirect them.
  // We show a loading state to prevent the role selection UI from flashing briefly.
  if (user && (user.unsafeMetadata as { role?: string })?.role) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p>Redirecting to your dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-blue-900">Select your role</h1>
        <p className="text-gray-600 mt-2 max-w-md">
          Help us tailor your experience by choosing how you'll use TalentSpottingAI
        </p>
      </div>

            {error && (
        <div className="mb-8 text-center text-red-600 bg-red-100 border border-red-400 rounded-md p-4 w-full max-w-5xl">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {roles.map((r) => (
          <RoleCard
            key={r.title}
            title={r.title}
            description={r.description}
            icon={r.icon}
            bgColor={r.bgColor}
            onSelect={() => handleSelect(r.title)}
            disabled={!!processingRole}
          />
        ))}
      </div>
    </main>
  );
}

function generateDashboardCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}


