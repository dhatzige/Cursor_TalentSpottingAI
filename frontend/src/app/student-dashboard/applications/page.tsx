'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/DashboardLayout';
import Button from '../../components/Button';
import { StudentService } from '../../../lib/api';
import { useProtectedRoute } from '../../../lib/hooks/useProtectedRoute';

// Import modular components
import {
  FilterControls,
  ApplicationItem,
  LoadingState,
  EmptyState,
  NoMatchingApplications,
  ErrorDisplay,
  StatusBadge
} from './components';

// Import types separately to avoid naming conflicts
import type { ApplicationItemType } from './components';

export default function ApplicationsPage() {
  // Protect this route - only students can access
  const { loading: authLoading } = useProtectedRoute(['student'], '/login');
  
  const [applications, setApplications] = useState<ApplicationItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Skip loading if still authenticating
    if (authLoading) return;
    
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In the future, we'll update the StudentService to include getAllApplications
        // For now, we're using mocked data
        
        // Mock data for demonstration
        const mockApplications: ApplicationItemType[] = [
          {
            id: '1',
            jobId: 'job1',
            title: 'Frontend Developer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            status: 'pending',
            appliedDate: '2025-05-10T12:00:00Z',
            lastUpdated: '2025-05-10T12:00:00Z'
          },
          {
            id: '2',
            jobId: 'job2',
            title: 'UX Designer',
            company: 'Creative Solutions',
            location: 'Remote',
            status: 'interview',
            appliedDate: '2025-05-05T09:30:00Z',
            lastUpdated: '2025-05-12T14:20:00Z'
          },
          {
            id: '3',
            jobId: 'job3',
            title: 'Data Analyst Intern',
            company: 'DataDrive Analytics',
            location: 'Boston, MA',
            status: 'accepted',
            appliedDate: '2025-04-28T15:45:00Z',
            lastUpdated: '2025-05-15T10:15:00Z',
            feedback: 'We were impressed with your analytical skills and previous project experience.'
          },
          {
            id: '4',
            jobId: 'job4',
            title: 'Mobile App Developer',
            company: 'AppWorks',
            location: 'Austin, TX',
            status: 'rejected',
            appliedDate: '2025-04-15T08:20:00Z',
            lastUpdated: '2025-05-01T11:30:00Z',
            feedback: 'Thank you for your interest. We have decided to move forward with candidates who have more experience with Flutter development.'
          }
        ];
        
        setApplications(mockApplications);
      } catch (err: any) {
        console.error('Error fetching applications:', err);
        setError('Failed to load your applications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, [authLoading]);

  // Filter applications based on selected status
  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  return (
    <DashboardLayout title="My Applications" userRole="student">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Applications</h1>
          
          <Link href="/student-dashboard">
            <Button variant="outline">
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        {/* Display error if any */}
        <ErrorDisplay error={error} />
        
        {isLoading ? (
          <LoadingState />
        ) : applications.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Filter Controls */}
            <FilterControls
              activeFilter={filterStatus}
              onFilterChange={setFilterStatus}
            />
            
            {/* Applications List */}
            <div className="space-y-4">
              {filteredApplications.length === 0 ? (
                <NoMatchingApplications />
              ) : (
                filteredApplications.map(application => (
                  <ApplicationItem
                    key={application.id}
                    application={application}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
