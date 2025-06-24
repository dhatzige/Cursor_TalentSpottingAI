'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  CheckCircle2, 
  ChevronRight, 
  School, 
  Upload,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { UniversitySelector } from './UniversitySelector';
import { DocumentUploader } from './DocumentUploader';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface FormData {
  universityId: string;
  studentId: string;
  documents: File[];
}

interface StudentVerificationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StudentVerificationForm({
  onSuccess,
  onCancel
}: StudentVerificationFormProps) {
  const router = useRouter();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    universityId: '',
    studentId: '',
    documents: []
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const steps = [
    { id: 1, title: 'Select University', icon: School },
    { id: 2, title: 'Student Details', icon: CheckCircle2 },
    { id: 3, title: 'Upload Documents', icon: Upload }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    switch (step) {
      case 1:
        if (!formData.universityId) {
          newErrors.universityId = 'Please select your university';
        }
        break;
      case 2:
        // Student ID is optional
        break;
      case 3:
        // Documents are optional if email is verified
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleDocumentUpload = async (files: File[]) => {
    setFormData(prev => ({ ...prev, documents: [...prev.documents, ...files] }));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setSubmitting(true);
    try {
      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      formDataToSend.append('universityId', formData.universityId);
      formDataToSend.append('studentId', formData.studentId);
      
      // Append documents
      formData.documents.forEach((file, index) => {
        formDataToSend.append(`documents`, file);
      });

      const response = await fetch('/api/verification/student', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await user?.getToken()}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Verification failed');
      }

      toast({
        title: 'Success!',
        description: result.message || 'Your verification has been submitted.',
      });

      if (result.status === 'VERIFIED') {
        // Auto-verified with university email
        router.push('/student-dashboard');
      } else {
        // Pending manual review
        onSuccess?.();
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit verification',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  isActive && "bg-blue-600 text-white",
                  isCompleted && "bg-green-600 text-white",
                  !isActive && !isCompleted && "bg-gray-200 dark:bg-gray-700 text-gray-500"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={cn(
                  "ml-2 text-sm font-medium",
                  isActive && "text-blue-600 dark:text-blue-400",
                  isCompleted && "text-green-600 dark:text-green-400",
                  !isActive && !isCompleted && "text-gray-500"
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="h-5 w-5 text-gray-400 mx-2" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Your University</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose your university from the list. If you're using a university email, 
                you'll be verified automatically!
              </p>
            </div>
            
            <UniversitySelector
              value={formData.universityId}
              onChange={(universityId) => setFormData(prev => ({ ...prev, universityId }))}
              userEmail={user?.primaryEmailAddress?.emailAddress}
              error={errors.universityId}
            />

            {user?.primaryEmailAddress?.emailAddress && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tip:</strong> Using a university email address 
                  (e.g., student@uoa.gr) will verify you instantly!
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Student Information</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Provide your student ID if you have one. This is optional but helps 
                speed up the verification process.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID (Optional)</Label>
              <Input
                id="studentId"
                type="text"
                placeholder="e.g., 2021CS001"
                value={formData.studentId}
                onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Your university-issued student identification number
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload supporting documents to verify your student status. 
                This step is optional if you're using a university email.
              </p>
            </div>

            <DocumentUploader
              title="Student ID Card"
              description="Upload a clear photo of your student ID card (front and back)"
              onUpload={handleDocumentUpload}
              maxFiles={2}
            />

            <Separator />

            <DocumentUploader
              title="Enrollment Certificate (Optional)"
              description="Upload an official enrollment certificate from your university"
              onUpload={handleDocumentUpload}
              maxFiles={1}
            />

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Make sure your documents are clear and readable. 
                Blurry or incomplete documents may delay verification.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Student Verification</CardTitle>
        <CardDescription>
          Verify your student status to access all features on the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStepIndicator()}
        
        <div className="min-h-[300px]">
          {renderStepContent()}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onCancel : handleBack}
            disabled={submitting}
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext} disabled={submitting}>
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="min-w-[120px]"
            >
              {submitting ? 'Submitting...' : 'Submit Verification'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 