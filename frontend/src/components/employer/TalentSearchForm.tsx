import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/datepicker';
import { MultiSelect } from '@/components/ui/multiselect';
import { Card } from '@/components/ui/card';

// Types for the search filters and criteria
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

interface TalentSearchFormProps {
  filters: SearchFilters;
  onSearch: (criteria: SearchCriteria) => void;
}

const TalentSearchForm: React.FC<TalentSearchFormProps> = ({ filters, onSearch }) => {
  const [locationInput, setLocationInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedUniversities, setSelectedUniversities] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<Array<{ id: string; name: string; proficiency?: string }>>([]);
  const [availabilityDate, setAvailabilityDate] = useState<Date | null>(null);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const criteria: SearchCriteria = {
      location: locationInput ? { city: locationInput } : undefined,
      universities: selectedUniversities.map(uni => uni.id),
      skills: selectedSkills.map(skill => ({ name: skill.name, priority: 1 })),
      languages: selectedLanguages.map(lang => ({ name: lang.name })),
      availabilityDate: availabilityDate ? availabilityDate.toISOString().split('T')[0] : undefined,
    };
    
    onSearch(criteria);
  };
  
  // Reset all form fields
  const handleReset = () => {
    setLocationInput('');
    setSelectedSkills([]);
    setSelectedUniversities([]);
    setSelectedLanguages([]);
    setAvailabilityDate(null);
    
    onSearch({
      page: 1,
      limit: 10
    });
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Search Filters</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Location Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Input
            placeholder="Enter city or location"
            value={locationInput}
            onChange={e => setLocationInput(e.target.value)}
            className="w-full"
          />
        </div>
        
        {/* Skills */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Required Skills
          </label>
          <MultiSelect
            options={filters.skills.map(skill => ({
              value: skill.id,
              label: `${skill.name} (${skill.count})`,
              data: skill
            }))}
            value={selectedSkills.map(skill => ({
              value: skill.id,
              label: skill.name,
              data: skill
            }))}
            onChange={selected => setSelectedSkills(selected.map(s => s.data))}
            placeholder="Select skills..."
            className="w-full"
            maxItems={4}
          />
          <p className="mt-1 text-xs text-gray-500">Select up to 4 key skills</p>
        </div>
        
        {/* Universities */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Universities
          </label>
          <MultiSelect
            options={filters.universities.map(uni => ({
              value: uni.id,
              label: uni.name,
              data: uni
            }))}
            value={selectedUniversities.map(uni => ({
              value: uni.id,
              label: uni.name,
              data: uni
            }))}
            onChange={selected => setSelectedUniversities(selected.map(u => u.data))}
            placeholder="Select universities..."
            className="w-full"
          />
        </div>
        
        {/* Languages */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Languages
          </label>
          <MultiSelect
            options={filters.languages.map(lang => ({
              value: lang.id,
              label: lang.name,
              data: lang
            }))}
            value={selectedLanguages.map(lang => ({
              value: lang.id,
              label: lang.name,
              data: lang
            }))}
            onChange={selected => setSelectedLanguages(selected.map(l => l.data))}
            placeholder="Select languages..."
            className="w-full"
          />
        </div>
        
        {/* Availability Date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available From
          </label>
          <DatePicker
            selected={availabilityDate}
            onChange={date => setAvailabilityDate(date)}
            placeholderText="Select a date"
            className="w-full"
          />
        </div>
        
        {/* Form Actions */}
        <div className="flex space-x-2">
          <Button type="submit" className="flex-1" variant="primary">
            Search
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TalentSearchForm;
