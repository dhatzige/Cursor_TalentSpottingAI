'use client';

import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  School,
  Building2,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'not_started';

interface VerificationDocument {
  id: string;
  type: string;
  fileName: string;
  status: string;
  reviewNotes?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
}

interface VerificationStatusCardProps {
  status: VerificationStatus;
  userRole: 'student' | 'employer' | 'university';
  verifiedAt?: Date | null;
  university?: {
    id: string;
    name: string;
    nameEn: string;
  } | null;
  organization?: {
    id: string;
    name: string;
    verificationStatus: string;
  } | null;
  documents?: VerificationDocument[];
  onStartVerification?: () => void;
  onRetryVerification?: () => void;
}

export function VerificationStatusCard({
  status,
  userRole,
  verifiedAt,
  university,
  organization,
  documents = [],
  onStartVerification,
  onRetryVerification
}: VerificationStatusCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-8 w-8 text-red-500" />;
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-500" />;
      default:
        return <AlertCircle className="h-8 w-8 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      default:
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'verified':
        return userRole === 'student' 
          ? 'Your student status has been verified!' 
          : 'Your organization has been verified!';
      case 'rejected':
        return 'Your verification was not approved. Please review the feedback and try again.';
      case 'pending':
        return 'Your verification is being reviewed. This usually takes 1-2 business days.';
      default:
        return userRole === 'student'
          ? 'Verify your student status to access all features.'
          : 'Verify your organization to start posting jobs.';
    }
  };

  const getRoleIcon = () => {
    if (userRole === 'student') return <School className="h-5 w-5" />;
    return <Building2 className="h-5 w-5" />;
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getRoleIcon()}
            Verification Status
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          {getStatusIcon()}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {getStatusMessage()}
            </p>
            
            {verifiedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                Verified on {formatDate(verifiedAt)}
              </p>
            )}

            {university && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">University</p>
                <p className="font-medium">{university.nameEn}</p>
                <p className="text-sm text-muted-foreground">{university.name}</p>
              </div>
            )}

            {organization && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Organization</p>
                <p className="font-medium">{organization.name}</p>
              </div>
            )}
          </div>
        </div>

        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Submitted Documents</h4>
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{doc.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted on {formatDate(doc.createdAt)}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    doc.status === 'APPROVED' ? 'default' :
                    doc.status === 'REJECTED' ? 'destructive' :
                    'secondary'
                  }
                  className="text-xs"
                >
                  {doc.status}
                </Badge>
              </div>
            ))}
            
            {documents.some(doc => doc.reviewNotes) && (
              <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Review Notes:
                </p>
                {documents
                  .filter(doc => doc.reviewNotes)
                  .map(doc => (
                    <p key={doc.id} className="text-xs text-yellow-700 dark:text-yellow-300">
                      • {doc.reviewNotes}
                    </p>
                  ))}
              </div>
            )}
          </div>
        )}

        {status === 'pending' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Review Progress</span>
              <span className="text-muted-foreground">Processing...</span>
            </div>
            <Progress value={33} className="h-2" />
          </div>
        )}

        {status === 'not_started' && onStartVerification && (
          <Button 
            onClick={onStartVerification}
            className="w-full"
          >
            Start Verification
          </Button>
        )}

        {status === 'rejected' && onRetryVerification && (
          <Button 
            onClick={onRetryVerification}
            className="w-full"
            variant="outline"
          >
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 