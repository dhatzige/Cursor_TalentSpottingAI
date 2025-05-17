'use client';

import { useState, FormEvent } from 'react';
import { EmployerService } from '../../lib/api';

interface JobFormProps {
  onSubmitSuccess: () => void;
  onCancel?: () => void;
  isEditMode?: boolean;
  initialData?: {
    id?: string;
    title: string;
    description: string;
    location: string;
    skills: string[];
  };
}

export default function JobForm({ onSubmitSuccess, onCancel, isEditMode = false, initialData }: JobFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };
  
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const jobData = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        skills,
      };
      
      if (isEditMode && initialData?.id) {
        await EmployerService.updateJob(initialData.id, jobData);
      } else {
        await EmployerService.createJob(jobData);
      }
      
      onSubmitSuccess();
    } catch (err: any) {
      console.error('Error submitting job:', err);
      setError(err?.response?.data?.message || 'Failed to submit job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{isEditMode ? 'Edit Job' : 'Post a New Job'}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title*
          </label>
          <input
            id="title"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g., Senior Software Engineer"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Job Description*
          </label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Describe the job responsibilities, requirements, and benefits..."
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location*
          </label>
          <input
            id="location"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="e.g., Remote, New York, NY, Hybrid - London"
          />
        </div>
        
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Required Skills
          </label>
          <div className="flex">
            <input
              id="skills"
              type="text"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="e.g., JavaScript, Python, Project Management"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
          
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <div key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-sm">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 text-blue-800 hover:text-blue-900 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditMode ? 'Updating...' : 'Posting...'}
              </span>
            ) : (
              <>{isEditMode ? 'Update Job' : 'Post Job'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
