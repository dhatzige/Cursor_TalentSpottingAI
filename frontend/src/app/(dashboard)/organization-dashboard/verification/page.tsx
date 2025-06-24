'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Shield, FileCheck } from 'lucide-react';
import { OrganizationVerificationForm } from '@/components/verification';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';

export const dynamic = 'force-dynamic';

const OrganizationVerificationPage: React.FC = () => {
  const { user, loading } = useProtectedRoute(['employer', 'university']);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // useProtectedRoute handles redirect
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'employer':
        return 'Employer';
      case 'university':
        return 'University';
      default:
        return 'Organization';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'employer':
        return 'Verify your company to access premium features and post job opportunities.';
      case 'university':
        return 'Verify your institution to access student data and placement analytics.';
      default:
        return 'Complete verification to access all platform features.';
    }
  };

  const getVerificationBenefits = (role: string) => {
    switch (role) {
      case 'employer':
        return [
          'Post unlimited job listings',
          'Access to verified student profiles',
          'Advanced candidate filtering',
          'Priority listing in job searches',
          'Detailed application analytics',
          'Direct messaging with candidates'
        ];
      case 'university':
        return [
          'Access to placement analytics',
          'Student career tracking',
          'Employer partnership dashboard',
          'Event management tools',
          'Graduate outcome reports',
          'Industry collaboration features'
        ];
      default:
        return [
          'Access to premium features',
          'Enhanced profile visibility',
          'Priority support',
          'Advanced analytics'
        ];
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-100">
              {getRoleDisplayName(user.role)} Verification
            </h1>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {getRoleDescription(user.role)}
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <Building2 className="w-5 h-5 text-blue-400" />
                Verification Benefits
              </CardTitle>
              <CardDescription className="text-gray-400">
                What you'll get access to after verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {getVerificationBenefits(user.role).map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <FileCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-200">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Verification Process</CardTitle>
              <CardDescription className="text-gray-400">
                Simple 3-step verification process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">1</Badge>
                  <div>
                    <h4 className="font-medium text-gray-200">Organization Details</h4>
                    <p className="text-sm text-gray-400">
                      Provide basic information about your organization
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">2</Badge>
                  <div>
                    <h4 className="font-medium text-gray-200">Document Upload</h4>
                    <p className="text-sm text-gray-400">
                      Upload required verification documents
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">3</Badge>
                  <div>
                    <h4 className="font-medium text-gray-200">Review Process</h4>
                    <p className="text-sm text-gray-400">
                      Our team reviews your submission (2-3 business days)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Form */}
        <OrganizationVerificationForm />
      </div>
    </div>
  );
};

export default OrganizationVerificationPage; 