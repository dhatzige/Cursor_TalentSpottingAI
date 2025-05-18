import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { JobEditForm } from '../components/JobEditForm';
import { EmployerService } from '../../../../../lib/api';
import '@testing-library/jest-dom';

// Mock the EmployerService
jest.mock('../../../../../lib/api', () => ({
  EmployerService: {
    updateJob: jest.fn(),
    createJob: jest.fn(),
    updateJobStatus: jest.fn()
  }
}));

describe('JobEditForm Component', () => {
  // Sample test props
  const defaultProps = {
    jobId: 'test-job-id',
    initialData: {
      title: 'Test Job',
      description: 'Test job description',
      location: 'Remote',
      skillsInput: 'React, TypeScript',
      status: 'draft' as const
    },
    onSuccess: jest.fn(),
    onError: jest.fn(),
    onCancel: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form with initial data', () => {
    render(<JobEditForm {...defaultProps} />);
    
    // Check if form fields are rendered with initial values
    expect(screen.getByLabelText(/job title/i)).toHaveValue('Test Job');
    expect(screen.getByLabelText(/job description/i)).toHaveValue('Test job description');
    expect(screen.getByLabelText(/location/i)).toHaveValue('Remote');
    expect(screen.getByLabelText(/required skills/i)).toHaveValue('React, TypeScript');
  });

  test('validates required fields on submit', async () => {
    render(<JobEditForm {...defaultProps} />);
    
    // Clear the required title field
    fireEvent.change(screen.getByLabelText(/job title/i), { target: { value: '' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/update job/i));
    
    // Validation should trigger onError callback
    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalledWith('Job title is required');
    });
    
    // API should not be called
    expect(EmployerService.updateJob).not.toHaveBeenCalled();
  });

  test('calls API to update existing job', async () => {
    // Mock successful API response
    (EmployerService.updateJob as jest.Mock).mockResolvedValue({ success: true });
    
    render(<JobEditForm {...defaultProps} />);
    
    // Change title field
    fireEvent.change(screen.getByLabelText(/job title/i), { 
      target: { value: 'Updated Job Title' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByText(/update job/i));
    
    // API should be called with updated data
    await waitFor(() => {
      expect(EmployerService.updateJob).toHaveBeenCalledWith('test-job-id', {
        title: 'Updated Job Title',
        description: 'Test job description',
        location: 'Remote',
        skills: ['React', 'TypeScript']
      });
      expect(defaultProps.onSuccess).toHaveBeenCalledWith('Job updated successfully');
    });
  });

  test('calls API to create new job', async () => {
    // Render with no jobId (new job creation)
    const newJobProps = {
      ...defaultProps,
      jobId: null
    };
    
    // Mock successful API response
    (EmployerService.createJob as jest.Mock).mockResolvedValue({ success: true });
    
    render(<JobEditForm {...newJobProps} />);
    
    // Submit form
    fireEvent.click(screen.getByText(/create job/i));
    
    // API should be called to create job
    await waitFor(() => {
      expect(EmployerService.createJob).toHaveBeenCalledWith({
        title: 'Test Job',
        description: 'Test job description',
        location: 'Remote',
        skills: ['React', 'TypeScript']
      });
      expect(defaultProps.onSuccess).toHaveBeenCalledWith('Job created successfully');
    });
  });

  test('handles status changes for existing jobs', async () => {
    // Mock successful API response
    (EmployerService.updateJobStatus as jest.Mock).mockResolvedValue({ success: true });
    
    render(<JobEditForm {...defaultProps} />);
    
    // Find and click the "Open" button in the job status control
    fireEvent.click(screen.getByText('Open'));
    
    // API should be called to update job status
    await waitFor(() => {
      expect(EmployerService.updateJobStatus).toHaveBeenCalledWith('test-job-id', 'open');
      expect(defaultProps.onSuccess).toHaveBeenCalledWith('Job status updated to open');
    });
  });

  test('handles API errors properly', async () => {
    // Mock API error
    (EmployerService.updateJob as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<JobEditForm {...defaultProps} />);
    
    // Submit form
    fireEvent.click(screen.getByText(/update job/i));
    
    // Error callback should be called
    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalledWith('Failed to save job. Please try again later.');
    });
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(<JobEditForm {...defaultProps} />);
    
    // Click cancel button
    fireEvent.click(screen.getByText(/cancel/i));
    
    // Cancel callback should be called
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
