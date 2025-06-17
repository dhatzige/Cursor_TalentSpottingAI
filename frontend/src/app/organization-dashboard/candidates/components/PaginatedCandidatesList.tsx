'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EmployerService } from '@/lib/api';
import Pagination from '../../shared/Pagination';

// Import modular components
import CandidateEmptyState from './CandidateEmptyState';
import CandidateFilters from './CandidateFilters';
import CandidateTable from './CandidateTable';
import FilterToolbar from './FilterToolbar';
import SaveFilterDialog from './SaveFilterDialog';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

// Import custom hooks
import { useCandidateFilters, Candidate, SavedFilter } from '../hooks/useCandidateFilters';
import { usePagination } from '../hooks/usePagination';
import { useCandidateSelection } from '../hooks/useCandidateSelection';

interface PaginatedCandidatesListProps {
  initialSkills?: string[];
  initialMatchScore?: number;
}

export default function PaginatedCandidatesList({ 
  initialSkills = [], 
  initialMatchScore = 0 
}: PaginatedCandidatesListProps) {
  const router = useRouter();
  
  // Data loading state
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use our custom hooks
  const {
    selectedSkills,
    minMatchScore,
    availableSkills,
    savedFilters,
    showSaveFilterDialog,
    filterName,
    filteredCandidates,
    setSelectedSkills,
    setMinMatchScore,
    setShowSaveFilterDialog,
    setFilterName,
    saveCurrentFilter,
    applyFilter,
    deleteFilter,
    resetFilters,
    formatDate
  } = useCandidateFilters(allCandidates, initialSkills, initialMatchScore);
  
  const { 
    pagination, 
    currentPageCandidates, 
    handlePageChange,
    resetToFirstPage 
  } = usePagination(filteredCandidates);
  
  const {
    selectedCandidates,
    handleCandidateSelect,
    handleCompare
  } = useCandidateSelection(allCandidates);
  
  // Fetch candidates data
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const apiCandidates = await EmployerService.getTopCandidates();
        setAllCandidates(apiCandidates);
      } catch (err: any) {
        console.error('Error fetching candidates:', err);
        setError('Failed to load candidates. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCandidates();
  }, []);
  
  // Setup the compare functionality to use with the router
  const compareSelectedCandidates = () => {
    if (selectedCandidates.length > 0) {
      // Convert array of IDs to URL query param
      const applicationIds = selectedCandidates.map(candidateId => {
        const candidate = allCandidates.find(c => c.id === candidateId);
        return candidate?.applicationId || '';
      }).filter(Boolean).join(',');
      
      router.push(`/organization-dashboard/applications?compare=${applicationIds}`);
    }
  };
  
  // Render content based on loading/error state
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  if (allCandidates.length === 0) {
    return <EmptyState />;
  }
  
  // Return filtered results
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      {/* Filter toolbar with saved filters */}
      <FilterToolbar 
        onShowSaveFilter={() => setShowSaveFilterDialog(true)}
        selectedCount={selectedCandidates.length}
        onCompare={compareSelectedCandidates}
        savedFilters={savedFilters}
        onApplyFilter={applyFilter}
        onDeleteFilter={deleteFilter}
        formatDate={formatDate}
      />
      
      {/* Filter controls */}
      <CandidateFilters
        availableSkills={availableSkills}
        selectedSkills={selectedSkills}
        onSkillsChange={setSelectedSkills}
        minMatchScore={minMatchScore}
        onMatchScoreChange={setMinMatchScore}
        onResetFilters={resetFilters}
      />
      
      {/* Save filter dialog */}
      {showSaveFilterDialog && (
        <SaveFilterDialog
          filterName={filterName}
          onFilterNameChange={setFilterName}
          onSave={saveCurrentFilter}
          onCancel={() => setShowSaveFilterDialog(false)}
        />
      )}
      
      {/* Show empty state or candidate table */}
      {filteredCandidates.length === 0 ? (
        <CandidateEmptyState onResetFilters={resetFilters} />
      ) : (
        <>
          <CandidateTable 
            candidates={currentPageCandidates}
            selectedCandidates={selectedCandidates}
            onSelect={handleCandidateSelect}
          />
          
          {/* Pagination controls */}
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{filteredCandidates.length > 0 ? (pagination.page - 1) * pagination.pageSize + 1 : 0}</span> to <span className="font-medium">
                    {Math.min(pagination.page * pagination.pageSize, filteredCandidates.length)}
                  </span> of <span className="font-medium">{filteredCandidates.length}</span> results
                </p>
              </div>
              <Pagination 
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                hasNextPage={pagination.hasNextPage}
                hasPreviousPage={pagination.hasPreviousPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
