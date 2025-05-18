'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EmployerService } from '@/lib/api/employer.service';
import TalentSearchForm from '@/components/employer/TalentSearchForm';
import CandidateCard from '@/components/employer/CandidateCard';
import { Loader } from '@/components/ui/loader';
import { Pagination } from '@/components/ui/pagination';

interface SearchResult {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  city?: string;
  country?: string;
  education: Array<{
    degree?: string;
    fieldOfStudy?: string;
    institution?: string;
    graduationYear?: number;
  }>;
  skills: string[];
  languages: Array<{
    name: string;
    proficiency?: string;
  }>;
  availableFrom?: Date;
  matchScore?: number | null;
}

interface SearchCriteria {
  location?: {
    city?: string;
    lat?: number;
    lng?: number;
  };
  radiusKm?: number;
  universities?: string[];
  skills?: Array<{ name: string; priority?: number }>;
  languages?: Array<{ name: string; proficiency?: string }>;
  availabilityDate?: string;
  page?: number;
  limit?: number;
}

interface SearchFilters {
  universities: Array<{
    id: string;
    name: string;
    type?: string;
    city?: string;
    country?: string;
  }>;
  cities: Array<{
    city: string;
    country: string;
    count: number;
  }>;
  skills: Array<{
    id: string;
    name: string;
    count: number;
  }>;
  languages: Array<{
    id: string;
    name: string;
    code: string;
  }>;
}

const TalentSearchPage = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<SearchFilters | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0
  });

  // Load initial filters
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const filtersData = await EmployerService.getSearchFilters();
        setFilters(filtersData);
      } catch (error) {
        console.error('Failed to load filters:', error);
      }
    };
    
    loadFilters();
  }, []);

  // Search for talent when criteria changes
  useEffect(() => {
    const searchTalent = async () => {
      setLoading(true);
      try {
        const response = await EmployerService.searchTalent(searchCriteria);
        setResults(response.results);
        setPagination(response.pagination);
      } catch (error) {
        console.error('Error searching for talent:', error);
      } finally {
        setLoading(false);
      }
    };

    // Small delay to avoid rapid API calls
    const handler = setTimeout(() => {
      searchTalent();
    }, 500);

    return () => clearTimeout(handler);
  }, [searchCriteria]);

  // Handle search form submission
  const handleSearch = (criteria: SearchCriteria) => {
    setSearchCriteria({
      ...criteria,
      page: 1 // Reset to first page on new search
    });
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setSearchCriteria({
      ...searchCriteria,
      page: newPage
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Find Talent</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search filters sidebar */}
        <div className="lg:col-span-1">
          {filters ? (
            <TalentSearchForm 
              filters={filters}
              onSearch={handleSearch}
            />
          ) : (
            <div className="flex justify-center p-8">
              <Loader size="md" />
            </div>
          )}
        </div>
        
        {/* Search results */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader size="lg" />
            </div>
          ) : results.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">No candidates found</h3>
              <p className="text-gray-500">
                Try adjusting your search filters to find more candidates
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">Found {pagination.totalCount} candidates</p>
              
              <div className="grid grid-cols-1 gap-4">
                {results.map(candidate => (
                  <Link href={`/employer/talent-search/candidate/${candidate.id}`} key={candidate.id}>
                    <CandidateCard candidate={candidate} />
                  </Link>
                ))}
              </div>
              
              {pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination 
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentSearchPage;
