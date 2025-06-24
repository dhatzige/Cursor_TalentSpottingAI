'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  studentProfile?: {
    firstName: string;
    lastName: string;
    phone?: string;
    bio?: string;
    studyField: string;
    studyLevel: string;
    graduationYear: number;
    skills: string[];
    locationName?: string;
    address?: string;
    resumeUrl?: string;
    resumeFileName?: string;
  };
  university?: {
    name: string;
    nameEn: string;
    city: string;
    type: string;
  };
}

export default function ProfilePage() {
  // Protect this route - only students can access
  const { loading: authLoading } = useProtectedRoute(['student']);
  const { getToken } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/student/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data.user || data);
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading, getToken]);

  if (authLoading || loading) {
    return (
      <UnifiedDashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </UnifiedDashboardLayout>
    );
  }

  if (error || !profile) {
    return (
      <UnifiedDashboardLayout>
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">{error || 'Profile not found'}</p>
        </div>
      </UnifiedDashboardLayout>
    );
  }

  // Define the content that will go inside the layout
  const content = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 dark:text-white">My Profile</h1>
        
        <button 
          onClick={() => router.push('/student-dashboard/profile/edit')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Edit Profile
        </button>
      </div>
      
      {/* Profile Information Card */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="flex-grow space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 dark:text-white">
                {profile.studentProfile ? `${profile.studentProfile.firstName} ${profile.studentProfile.lastName}` : profile.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {profile.studentProfile?.studyField ? 
                  `${profile.studentProfile.studyField.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Student` : 
                  'Student'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                <p className="mt-1 text-gray-900 dark:text-gray-100 dark:text-white">{profile.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
                <p className="mt-1 text-gray-900 dark:text-gray-100 dark:text-white">
                  {profile.studentProfile?.phone || 'Not provided'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">University</h3>
                <p className="mt-1 text-gray-900 dark:text-gray-100 dark:text-white">
                  {profile.university?.nameEn || 'Not specified'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Year</h3>
                <p className="mt-1 text-gray-900 dark:text-gray-100 dark:text-white">
                  {profile.studentProfile?.studyLevel} ({profile.studentProfile?.graduationYear || 'TBD'})
                </p>
              </div>
              {profile.studentProfile?.locationName && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                  <p className="mt-1 text-gray-900 dark:text-gray-100 dark:text-white">{profile.studentProfile.locationName}</p>
                </div>
              )}
              {profile.studentProfile?.address && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h3>
                  <p className="mt-1 text-gray-900 dark:text-gray-100 dark:text-white">{profile.studentProfile.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Education Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white mb-4">Education</h2>
        {profile.university || profile.studentProfile ? (
          <div className="border-l-2 border-blue-500 pl-4">
            <div>
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 dark:text-white">
                  {profile.university?.nameEn || 'University'}
                </h3>
                <span className="text-gray-500 dark:text-gray-400">
                  {profile.studentProfile?.graduationYear ? 
                    `${profile.studentProfile.graduationYear - 4} - ${profile.studentProfile.graduationYear}` : 
                    'Current'}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {profile.studentProfile?.studyLevel || 'Bachelor'} in {profile.studentProfile?.studyField?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Computer Science'}
              </p>
              {profile.studentProfile?.locationName && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  📍 {profile.studentProfile.locationName}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No education information available</p>
        )}
      </div>
      
      {/* Skills Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {profile.studentProfile?.skills && profile.studentProfile.skills.length > 0 ? (
            profile.studentProfile.skills.map(skill => (
              <span key={skill} className="px-3 py-1 bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No skills added yet</p>
          )}
        </div>
      </div>
      
      {/* Resume Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white">Resume</h2>
          <label className="relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploading(true);
                  try {
                    const formData = new FormData();
                    formData.append('resume', file);
                    
                    const token = await getToken();
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/student/upload-resume`, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                      },
                      body: formData
                    });
                    
                    if (response.ok) {
                      alert('Resume uploaded successfully!');
                      // Refresh the page to show the uploaded resume
                      window.location.reload();
                    } else {
                      throw new Error('Failed to upload resume');
                    }
                  } catch (err) {
                    console.error('Error uploading resume:', err);
                    alert('Failed to upload resume. Please try again.');
                  } finally {
                    setUploading(false);
                  }
                }
              }}
              className="hidden"
            />
            <button 
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </label>
        </div>
        
        {/* Resume Display */}
        {profile.studentProfile?.resumeUrl ? (
          <div className="mt-4 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800/30 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {profile.studentProfile.resumeFileName || 'Resume.pdf'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Uploaded resume</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={profile.studentProfile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm transition-colors"
                >
                  View
                </a>
                <a
                  href={profile.studentProfile.resumeUrl}
                  download={profile.studentProfile.resumeFileName}
                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-md text-sm transition-colors"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-2">No resume uploaded yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Upload your resume to improve your profile visibility</p>
          </div>
        )}
      </div>
    </div>
  );
  
  // Check if we're in development environment
  const isDev = process.env.NODE_ENV === 'development';
  
  // Return the layout with content as children
  return (
    <UnifiedDashboardLayout children={content} />
  );
}
