'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Shield, FileCheck } from 'lucide-react';
import { OrganizationVerificationForm } from '@/components/verification';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';

export const dynamic = 'force-dynamic';

const UniversityVerificationPage: React.FC = () => {
  const { user, loading } = useProtectedRoute(['university']);

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
              University Verification
            </h1>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Verify your institution to access student data, placement analytics, and premium university features.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                University Benefits
              </CardTitle>
              <CardDescription className="text-gray-400">
                Exclusive features for verified universities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  'Access to detailed placement analytics',
                  'Student career progression tracking',
                  'Employer partnership management',
                  'University event management tools',
                  'Graduate outcome reporting',
                  'Industry collaboration dashboard',
                  'Alumni network integration',
                  'Customizable career center portal'
                ].map((benefit, index) => (
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
              <CardTitle className="text-gray-100">Required Documents</CardTitle>
              <CardDescription className="text-gray-400">
                Documents needed for university verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1 border-blue-500 text-blue-400">1</Badge>
                  <div>
                    <h4 className="font-medium text-gray-200">Accreditation Certificate</h4>
                    <p className="text-sm text-gray-400">
                      Official accreditation from Ministry of Education
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1 border-blue-500 text-blue-400">2</Badge>
                  <div>
                    <h4 className="font-medium text-gray-200">Ministry Approval</h4>
                    <p className="text-sm text-gray-400">
                      Government approval for degree programs
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1 border-blue-500 text-blue-400">3</Badge>
                  <div>
                    <h4 className="font-medium text-gray-200">Official Letter</h4>
                    <p className="text-sm text-gray-400">
                      Letter on university letterhead confirming authorization
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1 border-blue-500 text-blue-400">4</Badge>
                  <div>
                    <h4 className="font-medium text-gray-200">University Charter</h4>
                    <p className="text-sm text-gray-400">
                      Founding document or institutional charter (optional)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-200 mb-2">Secure Process</h3>
                <p className="text-sm text-gray-400">
                  All documents are encrypted and reviewed by our verification team
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-200 mb-2">Fast Review</h3>
                <p className="text-sm text-gray-400">
                  Most verification requests are processed within 2-3 business days
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-200 mb-2">Premium Access</h3>
                <p className="text-sm text-gray-400">
                  Unlock advanced analytics and university management tools
                </p>
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

export default UniversityVerificationPage; 