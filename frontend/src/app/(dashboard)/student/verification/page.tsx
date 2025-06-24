'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Upload, 
  FileText, 
  AlertCircle, 
  School,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { DocumentUploader } from '@/components/verification/DocumentUploader';
import { VerificationStatusCard } from '@/components/verification/VerificationStatusCard';

interface VerificationStatus {
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_REQUIRED';
  verifiedAt?: Date | null;
  university?: {
    id: string;
    name: string;
    nameEn: string;
  };
  documents: Array<{
    id: string;
    type: string;
    fileName: string;
    status: string;
    reviewNotes?: string | null;
    createdAt: string;
    reviewedAt?: string | null;
  }>;
}

export default function StudentVerificationPage() {
  const { getToken } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVerificationStatus = async () => {
    try {
      setRefreshing(true);
      const token = await getToken();
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      
      const response = await fetch(`${backend}/api/verification/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch verification status');
      }

      const data = await response.json();
      setVerificationStatus({
        status: data.status,
        verifiedAt: data.verifiedAt,
        university: data.university,
        documents: data.documents || []
      });
    } catch (err) {
      console.error('Error fetching verification status:', err);
      setError('Failed to load verification status. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVerificationStatus();
  }, [getToken]);

  const handleDocumentUpload = async (files: File[]) => {
    setUploading(true);
    setError(null);

    try {
      const token = await getToken();
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append('documents', file);
      });

      const response = await fetch(`${backend}/api/verification/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload documents');
      }

      // Refresh verification status after upload
      await fetchVerificationStatus();
    } catch (err) {
      console.error('Error uploading documents:', err);
      setError('Failed to upload documents. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'green';
      case 'PENDING':
        return 'yellow';
      case 'REJECTED':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getProgressValue = () => {
    if (!verificationStatus) return 0;
    if (verificationStatus.status === 'VERIFIED') return 100;
    if (verificationStatus.documents.length > 0) return 60;
    return 20;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading verification status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Student Verification
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your verification status and upload required documents
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchVerificationStatus}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Verification Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              Verification Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-600">{getProgressValue()}%</span>
              </div>
              <Progress value={getProgressValue()} className="h-2" />
              
              <div className="flex items-center gap-2">
                {getStatusIcon(verificationStatus?.status || 'PENDING')}
                <span className="font-medium">
                  Status: <Badge variant="outline" children={verificationStatus?.status || 'Unknown'} />
                </span>
              </div>

              {verificationStatus?.university && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    University: {verificationStatus.university.nameEn}
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {verificationStatus.university.name}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status-specific content */}
        {verificationStatus?.status === 'VERIFIED' && (
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <CheckCircle2 className="h-5 w-5" />
                Verification Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 dark:text-green-300">
                Your student status has been verified! You now have full access to all platform features.
              </p>
              {verificationStatus.verifiedAt && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  Verified on: {new Date(verificationStatus.verifiedAt).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {verificationStatus?.status === 'PENDING' && (
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <Clock className="h-5 w-5" />
                Verification Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                Your verification is under review. This typically takes 1-2 business days.
              </p>
              
              {verificationStatus.documents.length === 0 && (
                <Alert>
                  <Upload className="h-4 w-4" />
                  <AlertDescription>
                    Upload verification documents below to speed up the process.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {verificationStatus?.status === 'REJECTED' && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <XCircle className="h-5 w-5" />
                Verification Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 dark:text-red-300 mb-4">
                Your verification was rejected. Please review the feedback below and resubmit with corrected documents.
              </p>
              
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Upload new, clear documents that meet the requirements listed below.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Document Upload Section */}
        {verificationStatus?.status !== 'VERIFIED' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Verification Documents
              </CardTitle>
              <CardDescription>
                Upload clear, readable documents to verify your student status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentUploader
                  title="Student ID Card"
                  description="Upload a clear photo of your student ID card (front and back)"
                  onUpload={handleDocumentUpload}
                  maxFiles={2}
                  acceptedTypes={['image/*', 'application/pdf']}
                  disabled={uploading}
                />
                
                <DocumentUploader
                  title="Enrollment Certificate"
                  description="Upload an official enrollment certificate from your university"
                  onUpload={handleDocumentUpload}
                  maxFiles={1}
                  acceptedTypes={['image/*', 'application/pdf']}
                  disabled={uploading}
                />
              </div>

              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  <strong>Document Requirements:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Images must be clear and readable</li>
                    <li>All text and details must be visible</li>
                    <li>Maximum file size: 5MB per document</li>
                    <li>Accepted formats: JPG, PNG, PDF</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Uploaded Documents */}
        {verificationStatus?.documents && verificationStatus.documents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Uploaded Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {verificationStatus.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium">{doc.fileName}</p>
                        <p className="text-sm text-gray-600">
                          Type: {doc.type.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={`border-${getStatusColor(doc.status)}-500 text-${getStatusColor(doc.status)}-700`}
                        children={doc.status}
                      />
                      {doc.reviewNotes && (
                        <p className="text-xs text-gray-600 mt-1 max-w-xs">
                          {doc.reviewNotes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400">
                If you're having trouble with verification or have questions:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Contact Support
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  View Guidelines
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
} 