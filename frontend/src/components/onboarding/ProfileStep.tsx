import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Lightbulb, Plus, X, ChevronDown, Sparkles, Target } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  searchSkills, 
  getSkillRecommendations, 
  mapStudyFieldToRecommendationField,
  SkillRecommendation 
} from '@/lib/data/comprehensive-skills';

interface University {
  id: string;
  name: string;
  nameEn: string;
  type: 'public' | 'private';
  city: string;
  emailDomains: string[];
  website: string;
  established?: number;
}

interface ProfileStepProps {
  bio: string;
  skills: string;
  firstName: string;
  lastName: string;
  studyField: string;
  studyLevel: string;
  graduationYear: string;
  selectedUniversity?: University | null;
  city?: string;
  onBioChange: (value: string) => void;
  onSkillsChange: (value: string) => void;
}

export function ProfileStep({
  bio,
  skills,
  firstName,
  lastName,
  studyField,
  studyLevel,
  graduationYear,
  selectedUniversity,
  city,
  onBioChange,
  onSkillsChange
}: ProfileStepProps) {
  const [skillsArray, setSkillsArray] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recommendations, setRecommendations] = useState<SkillRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const skillInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Initialize skills array from comma-separated string
  useEffect(() => {
    if (skills) {
      const parsedSkills = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      setSkillsArray(parsedSkills);
    }
  }, [skills]);

  // Update skills string when array changes
  useEffect(() => {
    const skillsString = skillsArray.join(', ');
    onSkillsChange(skillsString);
  }, [skillsArray]); // Removed onSkillsChange from dependencies to prevent infinite loop

  // Get skill recommendations based on study level and field
  useEffect(() => {
    if (studyLevel && studyField) {
      const level = studyLevel.toLowerCase().includes('bachelor') ? 'bachelor' :
                   studyLevel.toLowerCase().includes('master') ? 'master' :
                   studyLevel.toLowerCase().includes('phd') || studyLevel.toLowerCase().includes('doctorate') ? 'phd' : 'bachelor';
      
      const field = mapStudyFieldToRecommendationField(studyField);
      const recs = getSkillRecommendations(level, field);
      setRecommendations(recs);
    }
  }, [studyLevel, studyField]);

  // Handle skill input changes and search
  const handleSkillInputChange = (value: string) => {
    setSkillInput(value);
    
    if (value.length > 0) {
      const suggestions = searchSkills(value, 12);
      // Filter out already selected skills
      const filteredSuggestions = suggestions.filter(skill => 
        !skillsArray.some(existing => existing.toLowerCase() === skill.toLowerCase())
      );
      setSkillSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSkillSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Add skill from suggestion or input (max 10 during onboarding)
  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && 
        !skillsArray.some(existing => existing.toLowerCase() === trimmedSkill.toLowerCase()) &&
        skillsArray.length < 10) {
      setSkillsArray(prev => [...prev, trimmedSkill]);
      setSkillInput('');
      setShowSuggestions(false);
      skillInputRef.current?.focus();
    }
  };

  // Remove skill
  const removeSkill = (index: number) => {
    setSkillsArray(prev => prev.filter((_, i) => i !== index));
  };

  // Handle key press in skill input
  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (skillInput.trim()) {
        addSkill(skillInput);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Add recommended skill (max 10 during onboarding)
  const addRecommendedSkill = (skill: string) => {
    if (skillsArray.length < 10) {
      addSkill(skill);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          skillInputRef.current && !skillInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Briefcase className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-gray-900 to-orange-900 dark:from-white dark:to-orange-100 bg-clip-text text-transparent">
          Complete Your Profile
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
          Add some final details to make your profile stand out to employers. These fields are optional but highly recommended.
        </p>
      </div>

      <div className="space-y-8">
        {/* Bio Section */}
        <div className="space-y-4">
          <Label htmlFor="bio" className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-sm">💭</span>
            </div>
            About You
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            placeholder="Tell us about yourself, your interests, career goals, and what makes you unique. For example: 'I'm a passionate computer science student with a keen interest in artificial intelligence and machine learning. I enjoy solving complex problems and am always eager to learn new technologies...'"
            rows={4}
            className="resize-none text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Lightbulb className="w-4 h-4" />
            Optional - This helps employers understand your personality and career aspirations
          </p>
        </div>

        {/* Skills Section */}
        <div className="space-y-4">
          <Label className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 text-sm">🎯</span>
            </div>
            Skills & Technologies
          </Label>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Select your top 10 skills • You can add more from your dashboard later
          </p>

          {/* Skills Input */}
          <div className="relative">
            <Input
              ref={skillInputRef}
              value={skillInput}
              onChange={(e) => handleSkillInputChange(e.target.value)}
              onKeyDown={handleSkillKeyPress}
              onFocus={() => skillInput && setShowSuggestions(true)}
              placeholder={skillsArray.length >= 10 ? "Maximum 10 skills reached" : "Type a skill and press Enter (e.g., JavaScript, Communication, Problem Solving)"}
              disabled={skillsArray.length >= 10}
              className={`text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 transition-colors pr-10 ${
                skillsArray.length >= 10 ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Plus className={`w-5 h-5 ${skillsArray.length >= 10 ? 'text-gray-300' : 'text-gray-400'}`} />
            </div>

            {/* Skill Suggestions Dropdown */}
            {showSuggestions && skillSuggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-xl max-h-60 overflow-y-auto"
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    💡 Suggestions ({skillSuggestions.length})
                  </p>
                </div>
                {skillSuggestions.map((skill, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-950/30 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                  >
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{skill}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Skills */}
          {skillsArray.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Selected Skills ({skillsArray.length}/10)
                </p>
                {skillsArray.length >= 10 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    ✓ Maximum reached
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {skillsArray.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 text-sm py-1 px-3 flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Skill Recommendations */}
          {recommendations.length > 0 && showRecommendations && (
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-2 border-blue-200/50 dark:border-blue-800/50 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-100">
                      🎯 Recommended for You
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Based on your {studyLevel} in {studyField}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRecommendations(false)}
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {recommendations.map((rec, recIndex) => (
                <div key={recIndex} className="space-y-3">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/30 dark:border-blue-700/30">
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3 font-medium">
                      {recIndex === 0 ? 'Recommended skills' : `Recommended skills for ${studyField.toLowerCase()} students`}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {rec.skills.slice(0, 12).map((skill, skillIndex) => {
                        const isAlreadySelected = skillsArray.some(existing => 
                          existing.toLowerCase() === skill.toLowerCase()
                        );
                        
                        const isMaxReached = skillsArray.length >= 10;
                        
                        return (
                          <button
                            key={skillIndex}
                            type="button"
                            onClick={() => !isAlreadySelected && !isMaxReached && addRecommendedSkill(skill)}
                            disabled={isAlreadySelected || isMaxReached}
                            className={`text-sm px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                              isAlreadySelected
                                ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700 cursor-default'
                                : isMaxReached
                                ? 'bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-600 cursor-not-allowed'
                                : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50 hover:border-blue-400 dark:bg-gray-700 dark:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-900/30 cursor-pointer'
                            }`}
                          >
                            {isAlreadySelected ? '✓ ' : '+'} {skill}
                          </button>
                        );
                      })}
                    </div>
                    {rec.skills.length > 12 && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                        +{rec.skills.length - 12} more skills available
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {skillsArray.length < 10 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Optional - Add skills that match your experience and interests. Use our recommendations above!
            </p>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">You've selected 10 skills!</span>
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                You can add more skills and edit your profile from your dashboard later.
              </p>
            </div>
          )}
        </div>

        {/* Profile Summary */}
        <div className="bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-800 dark:via-slate-800 dark:to-gray-900 rounded-2xl p-6 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              📋 Profile Summary
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Name:</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {firstName} {lastName}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">University:</span>
                <span className="text-gray-900 dark:text-white font-semibold text-right">
                  {selectedUniversity ? selectedUniversity.nameEn : 'Not selected'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Study:</span>
                <span className="text-gray-900 dark:text-white font-semibold text-right">
                  {studyLevel} in {studyField}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Graduation:</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {graduationYear}
                </span>
              </div>
              
              {city && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Location:</span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {city}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-start py-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Skills:</span>
                <span className="text-gray-900 dark:text-white font-semibold text-right">
                  {skillsArray.length > 0 ? `${skillsArray.length} skills added` : 'No skills added'}
                </span>
              </div>
            </div>
          </div>
          
          {bio && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">About:</span>
              <p className="text-gray-900 dark:text-white mt-2 text-sm leading-relaxed">
                {bio.length > 150 ? `${bio.substring(0, 150)}...` : bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 