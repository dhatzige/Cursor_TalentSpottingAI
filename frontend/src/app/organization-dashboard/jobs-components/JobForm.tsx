'use client';

import { useState } from 'react';

interface JobFormProps {
  job?: {
    id: string;
    title?: string;
    description?: string;
    location?: string;
    skills?: string[];
  } | null;
  isEditMode: boolean;
  isLoading: boolean;
  error: string | null;
  onSubmit: (jobData: any) => void;
  onCancel: () => void;
}

export function JobForm({ job, isEditMode, isLoading, error, onSubmit, onCancel }: JobFormProps) {
  return (
    <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{isEditMode ? 'Edit Job' : 'Post a New Job'}</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const jobData = {
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          location: formData.get('location') as string,
          skills: ((formData.get('skills') as string) || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        };
        onSubmit(jobData);
      }} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title*
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={job?.title || ''}
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
            name="description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
            defaultValue={job?.description || ''}
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
            name="location"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={job?.location || ''}
            required
            placeholder="e.g., Remote, New York, NY, Hybrid - London"
          />
        </div>
        
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Required Skills (comma-separated)
          </label>
          <input
            id="skills"
            name="skills"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={(job?.skills || []).join(', ')}
            placeholder="e.g., JavaScript, Python, Project Management"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? (
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
