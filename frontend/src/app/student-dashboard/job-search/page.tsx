'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';
import { StudentService } from '@/lib/api';

// Import components
import { SearchFilters, JobList, JobFilters, Job } from './components';

/**
 * Student Dashboard Job Search Page
 * 
 * This page allows students to search and filter available jobs
 * and provides job recommendations based on profile data.
 */
export default function JobSearchPage() {
  // Protect this route - only student can access
  const { loading: authLoading } = useProtectedRoute(['student'], '/login');
  const searchParams = useSearchParams();
  
  // State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Extract initial search parameters from URL if they exist
  const initialKeyword = searchParams?.get('keyword') || '';
  
  const [filters, setFilters] = useState<JobFilters>({
    jobType: [],
    experienceLevel: [],
    location: [],
    salary: [],
    remote: false,
    postedWithin: null,
    keyword: initialKeyword,
  });

  // Fetch jobs data
  useEffect(() => {
    // Skip loading data if still authenticating
    if (authLoading) return;
    
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch jobs data from API
        const apiJobs = await StudentService.getRecommendedJobs();
        
        // Transform API response to our Job interface
        const transformedJobs: Job[] = apiJobs.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location || 'Remote',
          postDate: job.postDate,
          matchScore: job.matchScore,
          applied: job.applied || false,
          // Add mock data for these fields since they're not in the API response
          jobType: ['Full-time'], 
          salary: '$50k - $100k',
          skills: ['JavaScript', 'React', 'TypeScript'],
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl.'
        }));
        
        setJobs(transformedJobs);
        setFilteredJobs(transformedJobs);
      } catch (err: any) {
        console.error('Error fetching jobs data:', err);
        setError('Failed to load jobs data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, [authLoading]);

  // Apply filters to jobs
  const applyFilters = (filtersToApply: JobFilters) => {
    setFilters(filtersToApply);
    
    // Filter jobs based on the provided filters
    let result = [...jobs];
    
    // Filter by keyword (search in title, company, and description)
    if (filtersToApply.keyword) {
      const keyword = filtersToApply.keyword.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(keyword) || 
        job.company.toLowerCase().includes(keyword) ||
        (job.description && job.description.toLowerCase().includes(keyword))
      );
    }
    
    // Filter by job type
    if (filtersToApply.jobType.length > 0) {
      result = result.filter(job => 
        job.jobType && filtersToApply.jobType.some(type => 
          job.jobType?.map(t => t.toLowerCase()).includes(type.toLowerCase())
        )
      );
    }
    
    // Filter by remote option
    if (filtersToApply.remote) {
      result = result.filter(job => 
        job.location.toLowerCase().includes('remote')
      );
    }
    
    // Filter by location
    if (filtersToApply.location.length > 0) {
      result = result.filter(job => 
        filtersToApply.location.some(location => 
          job.location.toLowerCase().includes(location.toLowerCase())
        )
      );
    }
    
    // Filter by posted within (simplified for demo)
    if (filtersToApply.postedWithin) {
      const now = new Date();
      let cutoffDate = new Date();
      
      // Set cutoff date based on filter
      switch (filtersToApply.postedWithin) {
        case '24h':
          cutoffDate.setDate(now.getDate() - 1);
          break;
        case '3d':
          cutoffDate.setDate(now.getDate() - 3);
          break;
        case '1w':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case '1m':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      result = result.filter(job => {
        const jobDate = new Date(job.postDate);
        return jobDate >= cutoffDate;
      });
    }
    
    setFilteredJobs(result);
  };

  // Handle saving a job
  const handleSaveJob = (jobId: string) => {
    // This would typically call an API to save the job
    console.log(`Saving job ${jobId}`);
    // For demo purposes, show an alert
    alert(`Job saved! (ID: ${jobId})`);
  };

  // User info for dashboard layout
  const userInfo = {
    name: 'Alex Johnson',
    role: 'Student',
  };

  // Create the dashboard content element to pass as explicit children prop
  const dashboardContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Job Search
        </h1>
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredJobs.length} jobs found
          </span>
        </div>
      </div>
      
      {/* Search and filters */}
      <SearchFilters 
        onFilterChange={applyFilters} 
        initialFilters={filters}
      />
      
      {/* Job listings */}
      <JobList 
        jobs={filteredJobs} 
        isLoading={isLoading} 
        error={error}
        onSaveJob={handleSaveJob}
      />
    </div>
  );

  return (
    <UnifiedDashboardLayout 
      // Removing title to prevent duplication
      title="" 
      description=""
      userRole="student"
      userInfo={userInfo}
      breadcrumbs={[
        { label: 'Dashboard', href: '/student-dashboard' },
        { label: 'Job Search' }
      ]}
      className="pt-0 mt-0" // Removing padding at the top
      children={dashboardContent}
    />
  );
}
