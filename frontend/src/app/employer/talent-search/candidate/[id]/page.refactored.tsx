'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EmployerService } from '@/lib/api/employer.service';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';

// Import modular components
import {
  ProfileSidebar,
  ExperienceTab,
  EducationTab,
  ProjectsTab,
  CertificatesTab,
  LoadingState,
  ErrorState
} from '../components';

// Type definition for CandidateProfile
interface CandidateProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  email?: string;
  bio?: string;
  city?: string;
  country?: string;
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
  skills: string[];
  languages: Array<{
    name: string;
    proficiency?: string;
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
  availableFrom?: Date;
  matchScore?: number | null;
}

const CandidateProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidateProfile = async () => {
      setLoading(true);
      try {
        const profile = await EmployerService.viewCandidateProfile(id as string);
        setCandidate(profile);
        setError(null);
      } catch (err) {
        console.error('Error fetching candidate profile:', err);
        setError('Failed to load candidate profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCandidateProfile();
    }
  }, [id]);

  // Format date for display
  const formatDate = (date: Date | string | undefined | null): string => {
    if (!date) return 'Present';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  // Render loading state
  if (loading) {
    return <LoadingState />;
  }

  // Render error state
  if (error || !candidate) {
    return <ErrorState error={error || undefined} onBack={() => router.back()} />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          <span>Back to Search</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar with profile info */}
        <div className="md:col-span-1">
          <ProfileSidebar candidate={candidate} formatDate={formatDate} />
        </div>
        
        {/* Main content */}
        <div className="md:col-span-2">
          <Tabs
            defaultTab="experience"
            tabs={[
              {
                id: 'experience',
                label: 'Experience',
                content: <ExperienceTab experiences={candidate.experience} formatDate={formatDate} />
              },
              {
                id: 'education',
                label: 'Education',
                content: <EducationTab educations={candidate.education} />
              },
              {
                id: 'projects',
                label: 'Projects',
                content: <ProjectsTab projects={candidate.projects} />
              },
              {
                id: 'certificates',
                label: 'Certificates',
                content: <CertificatesTab certificates={candidate.certificates} formatDate={formatDate} />
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default CandidateProfilePage;
