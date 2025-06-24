'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';

/**
 * Profile page for the student dashboard (dev mode)
 */
export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock user info
  const userInfo = {
    name: 'Alex Johnson',
    role: 'Student',
  };

  // Create the profile content
  const profileContent = (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Profile Image */}
              <div className="w-24 h-24 bg-blue-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-300 text-2xl font-bold">
                {userInfo.name.charAt(0)}
              </div>
              
              {/* Basic Info */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 dark:text-white">{userInfo.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">Computer Science • Class of 2025</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">alex.johnson@university.edu</p>
                
                <div className="mt-4">
                  <button 
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700" />
            
            {/* Profile Sections */}
            <div className="space-y-6">
              {/* Bio */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 dark:text-white mb-2">About</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Computer Science student passionate about web development and AI. Looking for internship opportunities to apply my skills in a real-world setting.
                </p>
              </div>
              
              {/* Skills */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 dark:text-white mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'Machine Learning', 'UI/UX Design'].map((skill) => (
                    <span 
                      key={skill}
                      className="px-2.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Education */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 dark:text-white mb-2">Education</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 dark:text-white">Bachelor of Science in Computer Science</h4>
                    <p className="text-gray-600 dark:text-gray-300">University of Technology</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">2022 - 2025 (Expected)</p>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Relevant coursework: Data Structures, Algorithms, Web Development, Machine Learning</p>
                  </div>
                </div>
              </div>
              
              {/* Experience */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 dark:text-white mb-2">Experience</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 dark:text-white">Software Development Intern</h4>
                    <p className="text-gray-600 dark:text-gray-300">Tech Startup Inc.</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">June 2023 - August 2023</p>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Developed and maintained web applications using React and Node.js. Collaborated with the product team to implement new features and fix bugs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <UnifiedDashboardLayout children={profileContent} />
  );
}
