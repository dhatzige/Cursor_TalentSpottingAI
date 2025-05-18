'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EmployerService } from '@/lib/api/employer.service';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/custom-tabs';
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
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : null;
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('experience');

  useEffect(() => {
    const fetchCandidateProfile = async () => {
      setLoading(true);
      try {
        if (!id) {
          setError('Invalid candidate ID');
          return;
        }
        const profile = await EmployerService.viewCandidateProfile(id.toString());
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
          <Tabs defaultValue="experience" className="w-full">
            <TabsList className="mb-4 w-full">
              <TabsTrigger
                value="experience"
                className="flex-1"
                isActive={activeTab === 'experience'}
                onClick={() => setActiveTab('experience')}
              >
                Experience
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className="flex-1"
                isActive={activeTab === 'education'}
                onClick={() => setActiveTab('education')}
              >
                Education
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="flex-1"
                isActive={activeTab === 'projects'}
                onClick={() => setActiveTab('projects')}
              >
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="certificates"
                className="flex-1"
                isActive={activeTab === 'certificates'}
                onClick={() => setActiveTab('certificates')}
              >
                Certificates
              </TabsTrigger>
            </TabsList>
            
            {/* Tab Content */}
            <TabsContent value="experience" activeValue={activeTab}>
              <ExperienceTab experiences={candidate.experience} formatDate={formatDate} />
            </TabsContent>
            
            <TabsContent value="education" activeValue={activeTab}>
              <EducationTab educations={candidate.education} />
            </TabsContent>
            
            <TabsContent value="projects" activeValue={activeTab}>
              <ProjectsTab projects={candidate.projects} />
            </TabsContent>
            
            <TabsContent value="certificates" activeValue={activeTab}>
              <CertificatesTab certificates={candidate.certificates} formatDate={formatDate} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfilePage;
