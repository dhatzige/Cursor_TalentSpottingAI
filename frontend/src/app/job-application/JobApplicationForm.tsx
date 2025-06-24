// Reference: Job application form for students
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../components/Button';
import Input from '../components/Input';
import { StudentService } from '../../lib/api';

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function JobApplicationForm({
  jobId,
  jobTitle,
  companyName,
  onSuccess,
  onCancel
}: JobApplicationFormProps) {
  const router = useRouter();

  // Form state
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<'editing' | 'submitting' | 'success' | 'error'>('editing');

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setResumeFile(files[0]);
    }
  };

  // File validation
  const validateFile = (file: File): string | null => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      return 'File type not supported. Please upload a PDF or Word document.';
    }
    
    if (file.size > maxSize) {
      return 'File size exceeds 5MB. Please upload a smaller file.';
    }
    
    return null;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!resumeFile) {
      setError('Please upload your resume');
      return;
    }
    
    // File validation
    const fileError = validateFile(resumeFile);
    if (fileError) {
      setError(fileError);
      return;
    }
    
    if (coverLetter.trim().length < 50) {
      setError('Please provide a more detailed cover letter (minimum 50 characters)');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setFormStatus('submitting');
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('coverLetter', coverLetter);
      formData.append('jobId', jobId);
      formData.append('additionalInfo', additionalInfo || '');
      
      // Submit application using updated StudentService
      const result = await StudentService.applyForJob(jobId, formData);
      
      // Success
      setFormStatus('success');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Otherwise redirect to applications page after short delay
        setTimeout(() => {
          router.push('/student-dashboard/applications');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Error submitting job application:', err);
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render success message
  if (formStatus === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Application Submitted!</h3>
        <p className="text-green-700 mb-4">
          Your application for {jobTitle} at {companyName} has been successfully submitted.
        </p>
        <Button 
          variant="primary"
          onClick={() => router.push('/student-dashboard/applications')}
        >
          View My Applications
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-2">Apply for {jobTitle}</h2>
      <p className="text-gray-500 mb-6">{companyName}</p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume/CV *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {resumeFile ? (
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{resumeFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC up to 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Cover Letter */}
          <div>
            <label htmlFor="cover-letter" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Letter / Statement of Interest *
            </label>
            <textarea
              id="cover-letter"
              name="cover-letter"
              rows={6}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="Explain why you're interested in this position and what makes you a good fit..."
              value={coverLetter}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCoverLetter(e.target.value)}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Minimum 50 characters required
            </p>
          </div>
          
          {/* Additional Information */}
          <div>
            <label htmlFor="additional-info" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Information (Optional)
            </label>
            <textarea
              id="additional-info"
              name="additional-info"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="Anything else you'd like to share with the employer..."
              value={additionalInfo}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAdditionalInfo(e.target.value)}
            />
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Application'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
