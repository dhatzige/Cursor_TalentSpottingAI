'use client';

import React, { useState, useMemo } from 'react';
import { Search, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { GREEK_REGIONS, GREEK_LOCATIONS, GreekLocation, GreekRegion } from '@/lib/data/greek-locations';

interface LocationSelectorProps {
  selectedLocationId?: string;
  onLocationSelect: (location: GreekLocation) => void;
  placeholder?: string;
  showRegionHeaders?: boolean;
  showUniversityCitiesOnly?: boolean;
  className?: string;
}

export default function LocationSelector({
  selectedLocationId,
  onLocationSelect,
  placeholder = "Select your city...",
  showRegionHeaders = true,
  showUniversityCitiesOnly = false,
  className = ""
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set(['attica', 'central-macedonia']));

  // Filter locations based on search and university filter
  const filteredData = useMemo(() => {
    let locations = showUniversityCitiesOnly 
      ? GREEK_LOCATIONS.filter(loc => loc.hasUniversities)
      : GREEK_LOCATIONS;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      locations = locations.filter(loc => 
        loc.nameEn.toLowerCase().includes(search) ||
        loc.name.toLowerCase().includes(search) ||
        loc.regionEn.toLowerCase().includes(search) ||
        loc.region.toLowerCase().includes(search)
      );
    }

    // Group by regions
    return GREEK_REGIONS.map(region => ({
      ...region,
      locations: locations.filter(loc => loc.regionEn === region.nameEn)
    })).filter(region => region.locations.length > 0);
  }, [searchTerm, showUniversityCitiesOnly]);

  const selectedLocation = selectedLocationId 
    ? GREEK_LOCATIONS.find(loc => loc.id === selectedLocationId)
    : null;

  const toggleRegion = (regionId: string) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(regionId)) {
      newExpanded.delete(regionId);
    } else {
      newExpanded.add(regionId);
    }
    setExpandedRegions(newExpanded);
  };

  const handleLocationSelect = (location: GreekLocation) => {
    onLocationSelect(location);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200 text-left"
      >
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-blue-400" />
          <div>
            {selectedLocation ? (
              <div>
                <span className="text-white font-medium">{selectedLocation.nameEn}</span>
                <span className="text-blue-200 text-sm ml-2">({selectedLocation.name})</span>
                <div className="text-xs text-blue-300">{selectedLocation.regionEn}</div>
              </div>
            ) : (
              <span className="text-blue-200">{placeholder}</span>
            )}
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-blue-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl z-50 max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cities or regions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-800"
              />
            </div>
          </div>

          {/* Location List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredData.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No locations found matching "{searchTerm}"
              </div>
            ) : (
              filteredData.map((region) => (
                <div key={region.id} className="border-b border-gray-100/50 last:border-b-0">
                  {/* Region Header */}
                  {showRegionHeaders && (
                    <button
                      type="button"
                      onClick={() => toggleRegion(region.id)}
                      className="w-full flex items-center justify-between px-4 py-2 bg-gray-50/50 hover:bg-gray-100/50 transition-colors duration-150"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">{region.nameEn}</span>
                        <span className="text-sm text-gray-500">({region.name})</span>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {region.locations.length}
                        </span>
                      </div>
                      {expandedRegions.has(region.id) ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  )}

                  {/* Locations */}
                  {(!showRegionHeaders || expandedRegions.has(region.id)) && (
                    <div>
                      {region.locations.map((location) => (
                        <button
                          key={location.id}
                          type="button"
                          onClick={() => handleLocationSelect(location)}
                          className={`w-full flex items-center justify-between px-6 py-3 hover:bg-blue-50/50 transition-colors duration-150 text-left ${
                            selectedLocationId === location.id ? 'bg-blue-100/50 border-r-2 border-blue-500' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-800">{location.nameEn}</span>
                                <span className="text-sm text-gray-600">({location.name})</span>
                                {location.majorCity && (
                                  <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full">
                                    Major City
                                  </span>
                                )}
                                {location.hasUniversities && (
                                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                    Universities
                                  </span>
                                )}
                              </div>
                              {!showRegionHeaders && (
                                <div className="text-xs text-gray-500 mt-1">{location.regionEn}</div>
                              )}
                            </div>
                          </div>
                          {selectedLocationId === location.id && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200/50 bg-gray-50/30">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {filteredData.reduce((acc, region) => acc + region.locations.length, 0)} locations available
              </span>
              {showUniversityCitiesOnly && (
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  University cities only
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 