'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { JobListing, JobSearchQuery, PaginationInfo, JobType, SearchFilters } from '@/types/jobs';
import { getPaginatedJobResults, saveSearch } from '@/lib/services/jobs-service';

// Import our UI components
import Card from '../../shared/ui/Card';
import Button from '../../shared/ui/Button';
import ChartContainer from '../../shared/ui/ChartContainer';
import Tabs from '../../shared/ui/Tabs';
import SearchInput from '../../shared/ui/SearchInput';

// Import local components
import JobStatusBadge from '@/app/organization-dashboard/jobs/components/JobStatusBadge';
import Pagination from '@/app/organization-dashboard/jobs/components/Pagination';
import JobsEmptyState from '@/app/organization-dashboard/jobs/components/JobsEmptyState';
import JobsLoadingState from '@/app/organization-dashboard/jobs/components/JobsLoadingState';
import SavedSearches from '@/app/organization-dashboard/jobs/components/SavedSearches';

interface PaginatedJobListProps {
  initialFilter?: 'all' | 'open' | 'closed' | 'draft';
}

export default function PaginatedJobList({ initialFilter = 'all' }: PaginatedJobListProps) {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'closed' | 'draft'>(initialFilter);
  const [showSaveSearchDialog, setShowSaveSearchDialog] = useState(false);
  const [searchName, setSearchName] = useState('');
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    totalResults: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  // Fetch jobs with pagination
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      
      try {
        // Create search query with filters and pagination
        const query: JobSearchQuery = {
          searchTerms: searchQuery,
          filters: activeFilter !== 'all' ? {
            jobType: mapStatusToJobTypes(activeFilter)
          } : undefined,
          page: pagination.page,
          pageSize: pagination.pageSize
        };
        
        // Get paginated results
        const response = await getPaginatedJobResults(query);
        setJobs(response.results);
        setPagination(response.pagination);
        
        // Clear any error
        setError(undefined);
      } catch (e) {
        console.error('Error fetching jobs:', e);
        setError('Failed to load jobs. Please try again later.');
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, [activeFilter, pagination.page, pagination.pageSize, searchQuery]);

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Map status filter to JobType values
  const mapStatusToJobTypes = (status: 'open' | 'closed' | 'draft'): JobType[] => {
    switch (status) {
      case 'open':
        return ['full-time', 'part-time', 'contract'] as JobType[];
      case 'draft':
        return ['internship'] as JobType[];
      case 'closed':
      default:
        // For closed status, we'll handle this differently
        // In a real implementation, we'd likely have a status field on the job
        return [] as JobType[];
    }
  };
  
  // Get job status from job type
  const getStatusFromJobType = (jobType: string): 'open' | 'closed' | 'draft' => {
    if (jobType === 'full-time' || jobType === 'part-time' || jobType === 'contract') {
      return 'open';
    } else if (jobType === 'internship') {
      return 'draft';
    } else {
      return 'closed';
    }
  };

  // Convert status filters to tabs
  const statusTabs = [
    { id: 'all', label: 'All Jobs' },
    { id: 'open', label: 'Open' },
    { id: 'closed', label: 'Closed' },
    { id: 'draft', label: 'Draft' }
  ];

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Search input */}
          <div className="w-full sm:w-64">
            <SearchInput
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
              onSearch={() => {
                setPagination(prev => ({
                  ...prev,
                  page: 1
                }));
              }}
            />
            
            {searchQuery && (
              <div className="flex items-center mt-2">
                <span className="text-sm mr-2 text-gray-600 dark:text-gray-300">Search: "{searchQuery}"</span>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Clear search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => setShowSaveSearchDialog(true)}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
          
          {/* Saved Searches */}
          <SavedSearches 
            onApplySearch={(query) => {
              // Apply the saved search
              if (query.filters?.jobType) {
                // Map job type to our status filter if possible
                const jobType = query.filters.jobType[0];
                if (['full-time', 'part-time', 'contract'].includes(jobType)) {
                  setActiveFilter('open');
                } else if (jobType === 'internship') {
                  setActiveFilter('draft');
                } else {
                  setActiveFilter('all');
                }
              }
              
              // Set search terms if any
              setSearchQuery(query.searchTerms || '');
              
              // Reset pagination
              setPagination(prev => ({
                ...prev,
                page: 1
              }));
            }} 
          />
        </div>
      </Card>
      
      {/* Save Search Dialog */}
      {showSaveSearchDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Card className="p-6 w-96 max-w-full">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100 dark:text-white">Save this search</h3>
            <input 
              type="text" 
              placeholder="Enter a name for this search" 
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-4 text-gray-900 dark:text-gray-100 dark:text-white"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowSaveSearchDialog(false);
                  setSearchName('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!searchName.trim()}
                onClick={async () => {
                  if (searchName.trim()) {
                    // Construct query to save
                    const query: JobSearchQuery = {
                      searchTerms: searchQuery,
                      filters: activeFilter !== 'all' ? {
                        jobType: mapStatusToJobTypes(activeFilter)
                      } : undefined
                    };
                    
                    // Save the search
                    await saveSearch(searchName, query);
                    
                    // Close dialog and reset
                    setShowSaveSearchDialog(false);
                    setSearchName('');
                  }
                }}
              >
                Save
              </Button>
            </div>
          </Card>
        </div>
      )}
      
      {/* Status Tabs */}
      <Tabs
        tabs={statusTabs}
        defaultTabId={activeFilter}
        onChange={(tabId) => setActiveFilter(tabId as 'all' | 'open' | 'closed' | 'draft')}
        variant="underline"
      />

      {/* Jobs Table in Chart Container */}
      <ChartContainer
        loading={isLoading}
        error={error}
        height="auto"
        emptyState={jobs.length === 0 ? <JobsEmptyState activeFilter={activeFilter} /> : undefined}
      >
        {jobs.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Posted Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Skills
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {jobs.map(job => (
              <tr key={job.id} className="hover:bg-gray-100 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 dark:text-white">{job.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{job.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {job.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(job.posted)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <JobStatusBadge status={getStatusFromJobType(job.jobType)} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {job.skills?.slice(0, 3).map(skill => (
                      <span key={skill} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {job.skills && job.skills.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-full">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/organization-dashboard/applications?jobId=${job.id}`)}
                    >
                      View Applicants
                    </Button>
                    <Button
                      variant="text"
                      size="sm"
                      onClick={() => router.push(`/organization-dashboard/jobs/edit?id=${job.id}`)}
                    >
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
              </tbody>
            </table>
          </div>
        </Card>
        )}
      </ChartContainer>
      
      {/* Pagination Footer */}
      {jobs.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Results Summary */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {jobs.length} of {pagination.totalResults} results
            </div>
            
            {/* Pagination Controls */}
            <Pagination 
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
            />
          </div>
        </Card>
      )}
    </div>
  );
}
