import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

import ExperienceTab from './ExperienceTab';
import EducationTab from './EducationTab';
import ProjectsTab from './ProjectsTab';
import CertificatesTab from './CertificatesTab';

interface CandidateProfile {
  education: Array<{
    degree?: string;
    fieldOfStudy?: string;
    institution?: string;
    graduationYear?: number;
    description?: string;
  }>;
  experience: Array<{
    title?: string;
    company?: string;
    location?: string;
    startDate?: Date | string;
    endDate?: Date | string | null;
    description?: string;
  }>;
  projects: Array<{
    title?: string;
    description?: string;
    url?: string;
    imageUrl?: string;
  }>;
  certificates: Array<{
    name?: string;
    issuer?: string;
    issueDate?: Date | string;
    expiryDate?: Date | string | null;
    credentialId?: string;
    credentialUrl?: string;
  }>;
}

interface ProfileTabsProps {
  candidate: CandidateProfile;
  formatDate: (date: Date | string | undefined | null) => string;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ candidate, formatDate }) => {
  const [activeTab, setActiveTab] = useState<string>('experience');
  
  const tabs = [
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'certificates', label: 'Certificates' }
  ];

  return (
    <>
      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab content */}
      <div className="mt-4">
        {activeTab === 'experience' && (
          <ExperienceTab experiences={candidate.experience} formatDate={formatDate} />
        )}
        
        {activeTab === 'education' && (
          <EducationTab education={candidate.education} />
        )}
        
        {activeTab === 'projects' && (
          <ProjectsTab projects={candidate.projects} />
        )}
        
        {activeTab === 'certificates' && (
          <CertificatesTab certificates={candidate.certificates} formatDate={formatDate} />
        )}
      </div>
    </>
  );
};

export default ProfileTabs;
