'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Building2, FileText, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { DocumentUploader } from './DocumentUploader';

// Types
interface OrganizationFormData {
  organizationName: string;
  registrationNumber: string;
  website: string;
  industry: string;
  contactPhone: string;
  address: string;
  description: string;
}

interface VerificationRequirements {
  requiredDocuments: string[];
  descriptions: Record<string, string>;
  additionalInfo: string;
}

interface OrganizationStatus {
  organization: {
    id: string;
    name: string;
    verificationStatus: 'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
    verifiedAt?: string;
    registrationNumber?: string;
    website?: string;
    industry?: string;
  } | null;
  documents: Array<{
    id: string;
    type: string;
    fileName: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reviewNotes?: string;
    createdAt: string;
    reviewedAt?: string;
  }>;
  requiredDocuments: string[];
}

const STEP_TITLES = {
  1: 'Organization Details',
  2: 'Document Upload',
  3: 'Review & Submit'
};

export const OrganizationVerificationForm: React.FC = () => {
  const { getToken } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<OrganizationFormData>({
    organizationName: '',
    registrationNumber: '',
    website: '',
    industry: '',
    contactPhone: '',
    address: '',
    description: ''
  });

  const [requirements, setRequirements] = useState<VerificationRequirements | null>(null);
  const [status, setStatus] = useState<OrganizationStatus | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, File>>({});

  // Load initial data
  useEffect(() => {
    loadRequirements();
    loadStatus();
  }, []);

  // Load verification requirements
  const loadRequirements = async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/verification/organization/requirements', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequirements(data);
      } else {
        console.error('Failed to load requirements');
      }
    } catch (error) {
      console.error('Error loading requirements:', error);
    }
  };

  // Load current verification status
  const loadStatus = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch('/api/verification/organization/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        
        // Pre-fill form if organization exists
        if (data.organization) {
          setFormData({
            organizationName: data.organization.name || '',
            registrationNumber: data.organization.registrationNumber || '',
            website: data.organization.website || '',
            industry: data.organization.industry || '',
            contactPhone: '',
            address: '',
            description: ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading status:', error);
      setError('Failed to load verification status');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof OrganizationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  // Submit organization details
  const submitOrganizationDetails = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const token = await getToken();
      const response = await fetch('/api/verification/organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Organization details submitted successfully');
        await loadStatus(); // Reload status
        setCurrentStep(2);
      } else {
        setError(data.error || 'Failed to submit organization details');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Upload document
  const uploadDocument = async (documentType: string, file: File) => {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);

      const response = await fetch('/api/verification/organization/document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadedDocuments(prev => ({ ...prev, [documentType]: file }));
        await loadStatus(); // Reload to show uploaded document
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error };
      }
    } catch (error) {
      return { success: false, message: 'Upload failed. Please try again.' };
    }
  };

  // Validate current step
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.organizationName.trim().length >= 2;
      case 2:
        return requirements?.requiredDocuments.every(docType => 
          status?.documents.some(doc => doc.type === docType) || uploadedDocuments[docType]
        ) || false;
      default:
        return true;
    }
  };

  // Get step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizationName">
                  Organization Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="organizationName"
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange('organizationName', e.target.value)}
                  placeholder="Enter your organization name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  placeholder="e.g., Technology, Education, Healthcare"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  placeholder="Official registration/license number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://www.example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Organization Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of your organization"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {requirements && (
              <>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {requirements.additionalInfo}
                  </AlertDescription>
                </Alert>

                <div className="grid gap-6">
                  {requirements.requiredDocuments.map((docType) => {
                    const existingDoc = status?.documents.find(doc => doc.type === docType);
                    const uploadedFile = uploadedDocuments[docType];
                    
                    return (
                      <Card key={docType} className="border-gray-700">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-200">
                              {requirements.descriptions[docType]}
                            </CardTitle>
                            {existingDoc && (
                              <Badge 
                                variant={existingDoc.status === 'APPROVED' ? 'default' : 
                                        existingDoc.status === 'REJECTED' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {existingDoc.status}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          {existingDoc ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <FileText className="w-4 h-4" />
                                {existingDoc.fileName}
                              </div>
                              {existingDoc.reviewNotes && (
                                <p className="text-sm text-yellow-400">{existingDoc.reviewNotes}</p>
                              )}
                            </div>
                          ) : (
                            <DocumentUploader
                              onUpload={(file) => uploadDocument(docType, file)}
                              accept=".jpg,.jpeg,.png,.pdf"
                              maxSize={5 * 1024 * 1024}
                              className="min-h-[120px]"
                            />
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card className="border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Organization Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <p className="font-medium text-gray-200">{formData.organizationName}</p>
                  </div>
                  {formData.industry && (
                    <div>
                      <span className="text-gray-400">Industry:</span>
                      <p className="font-medium text-gray-200">{formData.industry}</p>
                    </div>
                  )}
                  {formData.registrationNumber && (
                    <div>
                      <span className="text-gray-400">Registration:</span>
                      <p className="font-medium text-gray-200">{formData.registrationNumber}</p>
                    </div>
                  )}
                  {formData.website && (
                    <div>
                      <span className="text-gray-400">Website:</span>
                      <p className="font-medium text-blue-400">{formData.website}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Uploaded Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {status?.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                      <span className="text-sm text-gray-200">{doc.fileName}</span>
                      <Badge 
                        variant={doc.status === 'APPROVED' ? 'default' : 
                                doc.status === 'REJECTED' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your verification request is ready for submission. Our team will review your documents and get back to you within 2-3 business days.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-gray-900 border-gray-700">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step === currentStep
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : step < currentStep
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-600 text-gray-400'
              }`}
            >
              {step < currentStep ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{step}</span>
              )}
            </div>
            {step < 3 && (
              <div
                className={`w-12 h-0.5 mx-2 ${
                  step < currentStep ? 'bg-green-500' : 'bg-gray-600'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Main Form */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-100">
            {STEP_TITLES[currentStep as keyof typeof STEP_TITLES]}
          </CardTitle>
          <CardDescription className="text-gray-400">
            Step {currentStep} of 3 - Organization Verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-400">{success}</AlertDescription>
            </Alert>
          )}

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-700">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 1}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {currentStep < 3 ? (
                <Button
                  onClick={() => {
                    if (currentStep === 1) {
                      submitOrganizationDetails();
                    } else {
                      setCurrentStep(prev => prev + 1);
                    }
                  }}
                  disabled={!isStepValid() || submitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setSuccess('Verification request submitted successfully!');
                    // In a real app, you might want to redirect or update the parent component
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 