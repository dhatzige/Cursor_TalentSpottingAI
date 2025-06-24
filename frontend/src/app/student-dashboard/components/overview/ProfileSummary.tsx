'use client';

import React from 'react';
import Image from 'next/image';

interface ProfileSummaryProps {
  name: string;
  major?: string;
  graduationYear?: number;
  avatar?: string;
  status?: 'seeking' | 'employed' | 'internship' | 'student';
  profileCompletionPercentage: number;
}

/**
 * ProfileSummary component for the student dashboard overview
 * Displays student's profile information and completion status
 */
export default function ProfileSummary({
  name,
  major = 'Not specified',
  graduationYear,
  avatar,
  status = 'student',
  profileCompletionPercentage = 0,
}: ProfileSummaryProps) {
  // Remove status tags completely - we don't want to show these

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500">
            {avatar ? (
              <Image
                src={avatar}
                alt={name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center text-blue-500 dark:text-blue-300 text-2xl font-bold">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        
        {/* Profile info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 dark:text-white mb-1">
              Welcome back, {name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{major}{graduationYear ? ` • Class of ${graduationYear}` : ''}</p>
          </div>
          
          {/* Profile completion */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Completion</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{profileCompletionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${profileCompletionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
