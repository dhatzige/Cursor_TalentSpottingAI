import { School, AlertCircle, Upload, FileText, CheckCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UniversitySelector } from '@/components/verification/UniversitySelector';
import { DocumentUploader } from '@/components/verification/DocumentUploader';
import { University } from '@/lib/data/greek-universities';

interface UniversityStepProps {
  selectedUniversityId: string;
  onUniversitySelect: (universityId: string) => void;
  userEmail?: string;
  detectedUniversity: University | null;
  needsManualVerification: boolean;
  verificationDocuments: File[];
  onDocumentUpload: (files: File[]) => void;
  emailUniversityValidation: { type: 'error' | 'info'; message: string } | null;
}

export function UniversityStep({
  selectedUniversityId,
  onUniversitySelect,
  userEmail,
  detectedUniversity,
  needsManualVerification,
  verificationDocuments,
  onDocumentUpload,
  emailUniversityValidation
}: UniversityStepProps) {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <School className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
          Select Your University
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
          {detectedUniversity 
            ? "We detected your university from your email. You can confirm or change it below."
            : "Please select your university to continue with verification and complete your profile."
          }
        </p>
      </div>

      <UniversitySelector
        value={selectedUniversityId}
        onChange={onUniversitySelect}
        userEmail={userEmail}
      />
      
      {/* Email-University Match Validation */}
      {emailUniversityValidation && (
        <Alert className={`border-2 shadow-sm ${
          emailUniversityValidation.type === 'error' 
            ? 'border-red-200/60 bg-gradient-to-r from-red-50 to-rose-50 dark:border-red-800/60 dark:from-red-950/30 dark:to-rose-950/30' 
            : 'border-blue-200/60 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-blue-800/60 dark:from-blue-950/30 dark:to-indigo-950/30'
        }`}>
          <div className={`p-2 rounded-lg ${
            emailUniversityValidation.type === 'error' ? 'bg-red-100 dark:bg-red-900/50' : 'bg-blue-100 dark:bg-blue-900/50'
          }`}>
            <AlertCircle className={`h-5 w-5 ${
              emailUniversityValidation.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
            }`} />
          </div>
          <AlertDescription className={`font-medium ${
            emailUniversityValidation.type === 'error' 
              ? 'text-red-800 dark:text-red-200' 
              : 'text-blue-800 dark:text-blue-200'
          }`}>
            {emailUniversityValidation.message}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Verification Status Info */}
      {selectedUniversityId && (
        <div className={`p-6 rounded-2xl border-2 shadow-sm transition-all duration-300 ${
          detectedUniversity && selectedUniversityId === detectedUniversity.id
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200/60 dark:border-green-800/60'
            : 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-200/60 dark:border-yellow-800/60'
        }`}>
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-xl shadow-sm ${
              detectedUniversity && selectedUniversityId === detectedUniversity.id
                ? 'bg-green-100 dark:bg-green-900/50' : 'bg-yellow-100 dark:bg-yellow-900/50'
            }`}>
              {detectedUniversity && selectedUniversityId === detectedUniversity.id ? (
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              ) : (
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className={`text-lg font-bold ${
                  detectedUniversity && selectedUniversityId === detectedUniversity.id
                    ? 'text-green-900 dark:text-green-100' : 'text-yellow-900 dark:text-yellow-100'
                }`}>
                  {detectedUniversity && selectedUniversityId === detectedUniversity.id
                    ? "✅ Automatic Verification" : "⏳ Manual Verification Required"
                  }
                </h4>
              </div>
              <p className={`leading-relaxed ${
                detectedUniversity && selectedUniversityId === detectedUniversity.id
                  ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'
              }`}>
                {detectedUniversity && selectedUniversityId === detectedUniversity.id
                  ? "Your university email will be automatically verified. You'll have instant access to all features."
                  : "Manual verification may take 1-2 business days. You can upload documents below to speed up the process and get priority review."
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Section for Manual Verification */}
      {needsManualVerification && selectedUniversityId && (
        <Card className="border-2 border-blue-200/60 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:border-blue-800/60 dark:from-blue-950/40 dark:to-indigo-950/40 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-blue-900 dark:text-blue-100 text-lg">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              Upload Verification Documents
              <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                Optional
              </div>
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300 leading-relaxed">
              Upload documents to verify your student status for faster verification and priority processing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-0">
            <div className="grid gap-4">
              <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-blue-200/30 dark:border-blue-700/30">
                <DocumentUploader
                  title="📱 Student ID Card"
                  description="Upload a clear photo of your current student ID card (front and back if needed)"
                  onUpload={onDocumentUpload}
                  maxFiles={2}
                  acceptedTypes={['image/*', 'application/pdf']}
                />
              </div>
              
              <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-blue-200/30 dark:border-blue-700/30">
                <DocumentUploader
                  title="📄 Enrollment Certificate"
                  description="Upload an official enrollment certificate or transcript from your university (optional but recommended)"
                  onUpload={onDocumentUpload}
                  maxFiles={1}
                  acceptedTypes={['image/*', 'application/pdf']}
                />
              </div>
            </div>

            {verificationDocuments.length > 0 && (
              <Alert className="bg-white/80 dark:bg-gray-900/80 border-2 border-blue-200/60 dark:border-blue-800/60 shadow-sm">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <AlertDescription className="text-blue-900 dark:text-blue-100 font-medium">
                  <div className="flex items-center gap-2">
                    <span>✅ {verificationDocuments.length} document(s) ready for upload</span>
                    <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                      Priority Review
                    </div>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Your verification will be processed within 24 hours with uploaded documents.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {/* Benefits of Document Upload */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50">
              <h5 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2 flex items-center gap-2">
                <span>🚀</span> Benefits of Document Upload
              </h5>
              <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                  Verification within 24 hours (vs 1-2 days)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                  Priority processing queue
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                  Higher approval success rate
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 