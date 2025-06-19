'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSafeSearchParams } from '@/lib/hooks/useSafeSearchParams';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import JobApplicationForm from './JobApplicationForm';
import { StudentService } from '../../lib/api';
import { useProtectedRoute } from '../../lib/hooks/useProtectedRoute';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postDate: string;
  status: 'open' | 'closed' | 'draft';
  skills?: string[];
  matchScore?: number;
}

export default function JobApplicationPage() {
  // Protect this route - only students can access
  const { loading: authLoading } = useProtectedRoute(['student'], '/login');
  
  const router = useRouter();
  const searchParams = useSafeSearchParams();
  const jobId = searchParams.get('id');
  
  const [job, setJob] = useState<Job | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip loading if still authenticating or no job ID
    if (authLoading || !jobId) return;
    
    const fetchJobDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Future update: Add getJobById method to StudentService
        // For now we'll use mock data
        
        // Mock data for demonstration
        const mockJob: Job = {
          id: jobId,
          title: 'Software Developer Intern',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA (Remote)',
          description: `
          <p class="mb-4">TechCorp is looking for motivated Software Developer Interns to join our team for the summer. You'll work alongside experienced developers on real projects that impact our business and customers.</p>
          
          <h3 class="text-lg font-medium mb-2">Responsibilities:</h3>
          <ul class="list-disc pl-5 mb-4">
            <li>Develop and maintain web applications using modern JavaScript frameworks</li>
            <li>Collaborate with the product and design teams to build new features</li>
            <li>Write clean, maintainable, and well-tested code</li>
            <li>Participate in code reviews and team meetings</li>
          </ul>
          
          <h3 class="text-lg font-medium mb-2">Requirements:</h3>
          <ul class="list-disc pl-5 mb-4">
            <li>Currently enrolled in a Computer Science or related degree program</li>
            <li>Knowledge of HTML, CSS, and JavaScript</li>
            <li>Familiarity with React or similar frameworks is a plus</li>
            <li>Basic understanding of version control systems (Git)</li>
            <li>Strong problem-solving skills and attention to detail</li>
          </ul>
          
          <p class="mb-4">This internship offers a competitive stipend and the possibility of a full-time position after graduation.</p>
          `,
          postDate: '2025-05-01',
          status: 'open',
          skills: ['JavaScript', 'React', 'HTML/CSS', 'Git'],
          matchScore: 84
        };
        
        setJob(mockJob);
      } catch (err: any) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [jobId, authLoading]);

  const handleApplyClick = () => {
    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    // Update UI, could navigate back to dashboard
    setShowApplicationForm(false);
  };

  const handleApplicationCancel = () => {
    setShowApplicationForm(false);
  };

  return (
    <DashboardLayout title="Job Details" userRole="student">
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col gap-4 items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading job details...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">{error}</h3>
            <Button onClick={() => router.push('/student-dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        ) : job ? (
          <div>
            {/* Back button */}
            <button 
              onClick={() => router.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Jobs
            </button>
            
            {showApplicationForm ? (
              <JobApplicationForm
                jobId={job.id}
                jobTitle={job.title}
                companyName={job.company}
                onSuccess={handleApplicationSuccess}
                onCancel={handleApplicationCancel}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Job header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                      <div className="text-gray-600 mb-1">{job.company}</div>
                      <div className="text-gray-500 mb-2">{job.location}</div>
                      
                      {/* Skills tags */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {job.skills.map(skill => (
                            <span 
                              key={skill} 
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {job.matchScore && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-500">Match Score</span>
                          <div className="flex items-center justify-end">
                            <div className="text-xl font-bold text-blue-700">{job.matchScore}%</div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-700 ml-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-500 mb-4">
                        Posted on {new Date(job.postDate).toLocaleDateString()}
                      </div>
                      
                      <Button onClick={handleApplyClick}>
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Job description */}
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Job Description</h2>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </div>
                
                {/* Apply button (bottom) */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <Button onClick={handleApplyClick} fullWidth>
                    Apply for this Position
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Job not found</p>
            <Button 
              onClick={() => router.push('/student-dashboard')}
              className="mt-4"
            >
              Return to Dashboard
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
