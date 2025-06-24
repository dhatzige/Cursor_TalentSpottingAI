'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface VerificationBannerProps {
  userRole: 'student' | 'employer' | 'university';
  status: 'pending' | 'rejected' | 'not_started';
  className?: string;
}

export function VerificationBanner({ 
  userRole, 
  status,
  className 
}: VerificationBannerProps) {
  const getVerificationLink = () => {
    switch (userRole) {
      case 'student':
        return '/student/verification';
      case 'employer':
        return '/employer/verification';
      case 'university':
        return '/university/verification';
      default:
        return '/verification';
    }
  };

  const getMessage = () => {
    if (status === 'pending') {
      return {
        title: 'Verification Pending',
        description: 'Your verification is being reviewed. This usually takes 1-2 business days.',
        showButton: false
      };
    }

    if (status === 'rejected') {
      return {
        title: 'Verification Required',
        description: 'Your previous verification was not approved. Please review the feedback and try again.',
        showButton: true,
        buttonText: 'Retry Verification'
      };
    }

    // not_started
    const messages = {
      student: {
        title: 'Complete Your Student Verification',
        description: 'Verify your student status to access all job opportunities and features.',
        buttonText: 'Verify Now'
      },
      employer: {
        title: 'Verify Your Organization',
        description: 'Complete organization verification to start posting jobs and accessing talent.',
        buttonText: 'Verify Organization'
      },
      university: {
        title: 'Verify Your Institution',
        description: 'Complete verification to manage your university presence on the platform.',
        buttonText: 'Verify Institution'
      }
    };

    return {
      ...messages[userRole],
      showButton: true
    };
  };

  const { title, description, showButton, buttonText } = getMessage();

  return (
    <Alert className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span className="flex-1">{description}</span>
        {showButton && (
          <Link href={getVerificationLink()}>
            <Button size="sm" className="ml-4">
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </AlertDescription>
    </Alert>
  );
} 