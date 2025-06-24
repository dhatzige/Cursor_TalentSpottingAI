import { useState, useRef, useEffect } from 'react';
import { GraduationCap, ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { STUDY_FIELDS, STUDY_CATEGORIES, StudyField } from '@/lib/data/study-fields';

const STUDY_LEVELS = ['Bachelor', 'Master', 'PhD', 'Diploma'];

interface AcademicStepProps {
  studyField: string;
  studyLevel: string;
  graduationYear: string;
  onStudyFieldChange: (value: string) => void;
  onStudyLevelChange: (value: string) => void;
  onGraduationYearChange: (value: string) => void;
}

export function AcademicStep({
  studyField,
  studyLevel,
  graduationYear,
  onStudyFieldChange,
  onStudyLevelChange,
  onGraduationYearChange
}: AcademicStepProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredFields, setFilteredFields] = useState<StudyField[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentYear = new Date().getFullYear();
  const maxYear = currentYear + 10;

  // Get selected field details
  const selectedField = STUDY_FIELDS.find(field => field.id === studyField);

  // Filter study fields based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFields(STUDY_FIELDS);
    } else {
      const filtered = STUDY_FIELDS.filter(field =>
        field.englishTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.greekTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFields(filtered);
    }
  }, [searchTerm]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFieldSelect = (field: StudyField) => {
    onStudyFieldChange(field.id);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
    if (selectedField) {
      setSearchTerm(selectedField.englishTitle);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  // Handle graduation year input - allow free typing but validate on blur
  const handleGraduationYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow any input while typing (including empty string)
    onGraduationYearChange(value);
  };

  // Validate graduation year when user finishes typing
  const handleGraduationYearBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const year = parseInt(value);
    
    // If invalid year, reset to current year + 1
    if (value !== '' && (isNaN(year) || year < currentYear || year > maxYear)) {
      onGraduationYearChange(String(currentYear + 1));
    }
  };

  // Check if graduation year is invalid for styling
  const isGraduationYearInvalid = () => {
    if (graduationYear === '') return false;
    const year = parseInt(graduationYear);
    return isNaN(year) || year < currentYear || year > maxYear;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Academic Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Share your academic background to help us match you with relevant opportunities.
        </p>
      </div>

      <div className="space-y-6">
        {/* Study Field with Autocomplete */}
        <div className="space-y-2">
          <Label htmlFor="studyField" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Field of Study *
          </Label>
          <div className="relative" ref={dropdownRef}>
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                value={isDropdownOpen ? searchTerm : (selectedField?.englishTitle || '')}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder="Search for your field of study..."
                className="h-11 pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {isDropdownOpen ? (
                  <Search className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            {/* Selected Field Display */}
            {selectedField && !isDropdownOpen && (
              <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-blue-900 dark:text-blue-100">
                      {selectedField.englishTitle}
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      {selectedField.greekTitle}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {selectedField.category}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(true)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                {filteredFields.length > 0 ? (
                  <div className="py-2">
                    {filteredFields.map((field) => (
                      <button
                        key={field.id}
                        type="button"
                        onClick={() => handleFieldSelect(field)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700 focus:outline-none transition-colors"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {field.englishTitle}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {field.greekTitle}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {field.category}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                    No fields found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Search by English or Greek name, or browse by category
          </p>
        </div>

        {/* Study Level and Graduation Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 relative z-10">
            <Label htmlFor="studyLevel" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Study Level *
            </Label>
            <Select value={studyLevel} onValueChange={onStudyLevelChange}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select your study level" />
              </SelectTrigger>
              <SelectContent className="z-[60] !bg-white dark:!bg-slate-800 !border !border-gray-200 dark:!border-slate-700 !shadow-xl !text-gray-900 dark:!text-white backdrop-blur-none">
                {STUDY_LEVELS.map(level => (
                  <SelectItem key={level} value={level} className="!bg-transparent hover:!bg-gray-100 dark:hover:!bg-slate-700 !text-gray-900 dark:!text-white">{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="graduationYear" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Expected Graduation Year *
            </Label>
            <Input
              id="graduationYear"
              type="number"
              min={currentYear}
              max={maxYear}
              value={graduationYear}
              onChange={handleGraduationYearChange}
              onBlur={handleGraduationYearBlur}
              placeholder={`e.g., ${currentYear + 1}`}
              className={`h-11 ${isGraduationYearInvalid() ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
            />
            <p className={`text-xs ${isGraduationYearInvalid() ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {isGraduationYearInvalid() 
                ? `Please enter a year between ${currentYear} and ${maxYear}` 
                : `Must be ${currentYear} or later (current year: ${currentYear})`
              }
            </p>
          </div>
        </div>

        {/* Benefits Information */}
        {selectedField && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg relative z-0">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mt-0.5">
                <GraduationCap className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                  Why we need your field of study
                </h4>
                <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                  <li>• Match you with relevant job opportunities and internships</li>
                  <li>• Connect you with companies in your field</li>
                  <li>• Show you specialized career paths and growth opportunities</li>
                  <li>• Recommend relevant skills and certifications</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 