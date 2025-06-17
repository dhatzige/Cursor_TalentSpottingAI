'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Application, ApplicationStatus } from '@/types/application';
import { EmployerService } from '@/lib/api';
import { PaginationInfo, SavedApplicationSearch } from './ApplicationsTypes';
import { loadSavedApplicationSearches, saveSavedApplicationSearches, extractJobInfo } from './ApplicationUtils';
import ApplicationsTable from './ApplicationsTable';
import ApplicationsFilterBar from './ApplicationsFilterBar';
import ApplicationSavedSearches from './ApplicationSavedSearches';
import SaveSearchDialog from './SaveSearchDialog';
import Pagination from '../../shared/Pagination';

// Using existing components from the project
const LoadingState = require('./loading/LoadingState').default;
const NoApplicationsState = require('./empty/NoApplicationsState').default;
const NoSelectedApplicationState = require('./empty/NoSelectedApplicationState').default;
const ComparisonControl = require('./ComparisonControl').default;

interface PaginatedApplicationsListProps {
  initialJobId?: string;
  initialStatus?: string;
  onSelectApplication?: (application: Application) => void;
}

export default function PaginatedApplicationsList({
  initialJobId,
  initialStatus = 'all',
  onSelectApplication
}: PaginatedApplicationsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for applications and loading
  const [applications, setApplications] = useState<Application[]>([]);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>(initialStatus as ApplicationStatus | 'all');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(initialJobId || null);
  const [jobOptions, setJobOptions] = useState<{ id: string; title: string }[]>([]);
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    totalResults: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  
  // Selection and comparison state
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  
  // Saved searches state
  const [savedSearches, setSavedSearches] = useState<SavedApplicationSearch[]>([]);
  const [showSaveSearchDialog, setShowSaveSearchDialog] = useState(false);
  const [searchName, setSearchName] = useState('');

  // Check for comparison IDs in URL
  useEffect(() => {
    const compareIds = searchParams.get('compare');
    if (compareIds) {
      setSelectedApplications(compareIds.split(','));
      setCompareMode(true);
    }
  }, [searchParams]);
  
  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get all applications from all jobs
        let apiApplications: Application[] = [];
        const allJobs = await EmployerService.getAllJobs();
        
        // For each job, get its applications
        for (const job of allJobs) {
          if (job.id) {
            try {
              const jobApplications = await EmployerService.getJobApplications(job.id);
              apiApplications = [...apiApplications, ...jobApplications as Application[]];
            } catch (err) {
              console.error(`Error fetching applications for job ${job.id}:`, err);
            }
          }
        }
        setAllApplications(apiApplications);
        
        // Extract unique job options
        const jobsMap = new Map<string, string>();
        apiApplications.forEach((app: Application) => {
          const { jobId, jobTitle } = extractJobInfo(app);
          if (jobId) {
            jobsMap.set(jobId, jobTitle);
          }
        });
        
        setJobOptions(Array.from(jobsMap.entries()).map(([id, title]) => ({ id, title })));
        
        // Load saved searches
        setSavedSearches(loadSavedApplicationSearches());
      } catch (err: any) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, []);
  
  // Apply filters and update pagination
  useEffect(() => {
    applyFilters();
  }, [allApplications, selectedStatus, selectedJobId, pagination.page, pagination.pageSize]);
  
  // Apply filters and update pagination
  const applyFilters = () => {
    // Filter applications based on selected criteria
    let filteredApplications = [...allApplications];
    
    // Apply status filter if not 'all'
    if (selectedStatus !== 'all') {
      filteredApplications = filteredApplications.filter(
        application => application.status === selectedStatus
      );
    }
    
    // Apply job filter if selected
    if (selectedJobId) {
      filteredApplications = filteredApplications.filter(
        application => application.jobId === selectedJobId
      );
    }
    
    // Calculate pagination
    const totalResults = filteredApplications.length;
    const totalPages = Math.ceil(totalResults / pagination.pageSize);
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    
    // Update pagination info
    setPagination(prev => ({
      ...prev,
      totalResults,
      totalPages,
      hasNextPage: pagination.page < totalPages,
      hasPreviousPage: pagination.page > 1
    }));
    
    // Get the current page of results
    setApplications(filteredApplications.slice(startIndex, endIndex));
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedStatus('all');
    setSelectedJobId(null);
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };
  
  // Handle application selection for comparison
  const handleApplicationSelect = (applicationId: string) => {
    setSelectedApplications(prev => {
      const isSelected = prev.includes(applicationId);
      
      if (isSelected) {
        return prev.filter(id => id !== applicationId);
      } else {
        if (prev.length >= 3) {
          return [...prev.slice(1), applicationId];
        }
        return [...prev, applicationId];
      }
    });
    
    // Find the selected application
    const selectedApp = applications.find(app => app.id === applicationId);
    
    // Call the onSelectApplication callback if provided and application found
    if (onSelectApplication && selectedApp) {
      onSelectApplication(selectedApp);
    }
  };
  
  // Toggle comparison mode
  const toggleCompareMode = () => {
    if (selectedApplications.length === 0) {
      return;
    }
    
    if (compareMode) {
      // Exit comparison mode
      setCompareMode(false);
      router.push('/organization-dashboard/applications');
    } else {
      // Enter comparison mode
      setCompareMode(true);
      router.push(`/organization-dashboard/applications?compare=${selectedApplications.join(',')}`);
    }
  };
  

  
  // Save current search
  const saveCurrentSearch = () => {
    if (!searchName.trim()) return;
    
    const newSearch: SavedApplicationSearch = {
      id: Date.now().toString(),
      name: searchName,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      jobId: selectedJobId || undefined,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };
    
    const updatedSearches = [...savedSearches, newSearch];
    setSavedSearches(updatedSearches);
    saveSavedApplicationSearches(updatedSearches);
    
    // Reset form
    setSearchName('');
    setShowSaveSearchDialog(false);
  };
  
  // Apply saved search
  const applySearch = (search: SavedApplicationSearch) => {
    // Apply filters
    setSelectedStatus((search.status || 'all') as ApplicationStatus | 'all');
    setSelectedJobId(search.jobId || null);
    
    // Reset to first page
    setPagination(prev => ({ ...prev, page: 1 }));
    
    // Update lastUsed
    const updatedSearches = savedSearches.map(s => 
      s.id === search.id 
        ? {...s, lastUsed: new Date().toISOString()} 
        : s
    );
    
    setSavedSearches(updatedSearches);
    saveSavedApplicationSearches(updatedSearches);
  };
  
  // Delete saved search
  const deleteSearch = (id: string) => {
    const updatedSearches = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updatedSearches);
    saveSavedApplicationSearches(updatedSearches);
  };
  
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (allApplications.length === 0) {
    return <NoApplicationsState />;
  }

  return (
    <div className="space-y-4">
      {/* Header with search tools */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <ApplicationSavedSearches 
            savedSearches={savedSearches}
            onApplySearch={applySearch}
            onDeleteSearch={deleteSearch}
            onShowSaveDialog={() => setShowSaveSearchDialog(true)}
          />
        </div>
        
        <div className="space-x-4">
          {selectedApplications.length > 0 && (
            <ComparisonControl 
              selectedCount={selectedApplications.length}
              compareMode={compareMode}
              onToggleCompare={toggleCompareMode}
            />
          )}
        </div>
      </div>
      
      {/* Save Search Dialog */}
      {showSaveSearchDialog && (
        <SaveSearchDialog
          searchName={searchName}
          onSearchNameChange={setSearchName}
          onSave={saveCurrentSearch}
          onCancel={() => setShowSaveSearchDialog(false)}
        />
      )}
      
      {/* Filters bar */}
      <ApplicationsFilterBar
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedJobId={selectedJobId}
        jobOptions={jobOptions}
        onJobChange={setSelectedJobId}
        onReset={resetFilters}
      />
      
      {/* Show empty state if filtered results are empty */}
      {applications.length === 0 && (
        <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">No applications match your filters</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your filter criteria to see more results.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Reset All Filters
          </button>
        </div>
      )}
      
      {/* Applications table */}
      {applications.length > 0 && (
        <ApplicationsTable
          applications={applications}
          selectedApplications={selectedApplications}
          onApplicationSelect={handleApplicationSelect}
        />
      )}
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
        />
      )}
    </div>
  );
}
