'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, School, Sparkles, MapPin, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUniversityByEmail, University } from '@/lib/data/greek-universities';

interface UniversitySelectorProps {
  value?: string;
  onChange: (universityId: string) => void;
  userEmail?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function UniversitySelector({
  value,
  onChange,
  userEmail,
  disabled = false,
  placeholder = 'Select your university'
}: UniversitySelectorProps) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoDetected, setAutoDetected] = useState<University | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch universities from API
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch('/api/universities');
        const data = await response.json();
        
        if (data.success && data.data) {
          setUniversities(data.data);
        }
      } catch (error) {
        console.error('❌ Error fetching universities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Auto-detection logic
  useEffect(() => {
    if (userEmail && universities.length > 0) {
      const detected = getUniversityByEmail(userEmail);
      setAutoDetected(detected);
    }
  }, [userEmail, universities]);

  // Update selected university when value changes
  useEffect(() => {
    if (value && universities.length > 0) {
      const found = universities.find(uni => uni.id === value);
      setSelectedUniversity(found || null);
    }
  }, [value, universities]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleUniversitySelect = (university: University) => {
    console.log('✅ University selected:', university.nameEn);
    setSelectedUniversity(university);
    onChange(university.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleAutoDetectionAccept = () => {
    if (autoDetected) {
      handleUniversitySelect(autoDetected);
      setAutoDetected(null);
    }
  };

  // Filter universities based on search term
  const filteredUniversities = universities.filter(uni => 
    uni.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const publicUniversities = filteredUniversities.filter(uni => uni.type === 'public');
  const privateUniversities = filteredUniversities.filter(uni => uni.type === 'private');

  if (loading) {
    return (
      <div className="w-full p-6 border border-gray-200 dark:border-gray-700 rounded-xl animate-pulse bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Auto-Detection Card */}
      {autoDetected && (
        <div className="relative overflow-hidden p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 border-2 border-blue-200/50 dark:border-blue-800/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/10 to-blue-400/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-blue-900 dark:text-blue-100 text-lg">
                  🎯 Perfect Match Found!
                </h4>
                <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                  Auto-detected
                </div>
              </div>
              <p className="text-blue-700 dark:text-blue-300 mb-4 leading-relaxed">
                Based on your email domain{' '}
                <code className="px-2 py-1 bg-blue-200/70 dark:bg-blue-800/70 rounded-md text-sm font-mono border border-blue-300/50 dark:border-blue-700/50">
                  @{userEmail?.split('@')[1]}
                </code>
                , we automatically identified your university:
              </p>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-blue-200/30 dark:border-blue-700/30 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {autoDetected.nameEn}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs font-medium ${
                          autoDetected.type === 'public' 
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' 
                            : 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
                        }`}
                      >
                        <School className="w-3 h-3 mr-1" />
                        {autoDetected.type === 'public' ? 'Public University' : 'Private Institution'}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="text-xs font-medium bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700"
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        {autoDetected.city}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-5">
                <Button 
                  onClick={handleAutoDetectionAccept}
                  size="sm" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                >
                  ✅ Yes, that's correct!
                </Button>
                <Button 
                  onClick={() => setAutoDetected(null)}
                  variant="outline" 
                  size="sm"
                  className="border-blue-300/60 text-blue-700 hover:bg-blue-50 dark:border-blue-600/60 dark:text-blue-300 dark:hover:bg-blue-950/30 transition-all duration-200 font-medium"
                >
                  🔍 Choose manually
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* University Selector */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <School className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          Select Your University
        </label>
        
        <div className="relative" ref={dropdownRef}>
          {/* Trigger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              "w-full flex items-center justify-between h-14 px-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md",
              disabled && "opacity-50 cursor-not-allowed",
              isOpen && "ring-4 ring-blue-100 dark:ring-blue-900/30 border-blue-500"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <School className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <span className={cn(
                "truncate font-medium",
                selectedUniversity ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
              )}>
                {selectedUniversity ? selectedUniversity.nameEn : placeholder}
              </span>
            </div>
            <ChevronDown className={cn(
              "h-5 w-5 text-gray-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl max-h-[400px] overflow-hidden backdrop-blur-sm">
              {/* Search Input */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50">
                <input
                  type="text"
                  placeholder="🔍 Search universities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all duration-200 font-medium"
                  autoFocus
                />
              </div>

              {/* University List */}
              <div className="overflow-y-auto max-h-[320px]">
                {filteredUniversities.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <School className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No universities found</p>
                    <p className="text-sm">Try adjusting your search terms</p>
                  </div>
                ) : (
                  <>
                    {/* Public Universities */}
                    {publicUniversities.length > 0 && (
                      <div>
                        <div className="px-4 py-3 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-900/20 border-b border-emerald-200/50 dark:border-emerald-800/50 flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          PUBLIC UNIVERSITIES
                        </div>
                        {publicUniversities.map((university) => (
                          <button
                            key={university.id}
                            type="button"
                            onClick={() => handleUniversitySelect(university)}
                            className="w-full flex items-center justify-between p-4 hover:bg-blue-50 dark:hover:bg-blue-950/30 border-b border-gray-100 dark:border-gray-700 last:border-b-0 text-left transition-all duration-200 group"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                                <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-900 dark:group-hover:text-blue-100 transition-colors">
                                  {university.nameEn}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                                  <span>{university.name}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {university.city}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="secondary"
                                className="text-xs font-medium bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
                              >
                                Public
                              </Badge>
                              {value === university.id && (
                                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Private Universities */}
                    {privateUniversities.length > 0 && (
                      <div>
                        <div className="px-4 py-3 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50/80 dark:bg-purple-900/20 border-b border-purple-200/50 dark:border-purple-800/50 flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          PRIVATE INSTITUTIONS
                        </div>
                        {privateUniversities.map((university) => (
                          <button
                            key={university.id}
                            type="button"
                            onClick={() => handleUniversitySelect(university)}
                            className="w-full flex items-center justify-between p-4 hover:bg-blue-50 dark:hover:bg-blue-950/30 border-b border-gray-100 dark:border-gray-700 last:border-b-0 text-left transition-all duration-200 group"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                                <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-900 dark:group-hover:text-blue-100 transition-colors">
                                  {university.nameEn}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                                  <span>{university.name}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {university.city}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="secondary"
                                className="text-xs font-medium bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                              >
                                Private
                              </Badge>
                              {value === university.id && (
                                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected University Display */}
      {selectedUniversity && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200/60 dark:border-green-800/60 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
                Selected University
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 text-xs">
                  ✓ Confirmed
                </Badge>
              </div>
              <div className="text-green-700 dark:text-green-300 font-medium mt-1">
                {selectedUniversity.nameEn}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 