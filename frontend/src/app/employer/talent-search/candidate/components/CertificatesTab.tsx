'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface Certificate {
  name?: string;
  issuer?: string;
  issueDate?: Date | string;
  expiryDate?: Date | string | null;
  credentialId?: string;
  credentialUrl?: string;
}

interface CertificatesTabProps {
  certificates: Certificate[];
  formatDate: (date: Date | string | undefined | null) => string;
}

export function CertificatesTab({ certificates, formatDate }: CertificatesTabProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Certificates</h2>
      {certificates.length === 0 ? (
        <p className="text-gray-500">No certificates listed</p>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert, index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{cert.name || 'Certificate'}</h3>
                {cert.issueDate && (
                  <div className="text-sm text-gray-500">
                    Issued: {formatDate(cert.issueDate)}
                    {cert.expiryDate && ` • Expires: ${formatDate(cert.expiryDate)}`}
                  </div>
                )}
              </div>
              
              {cert.issuer && (
                <div className="text-sm text-gray-600 mt-1">Issued by {cert.issuer}</div>
              )}
              
              {cert.credentialId && (
                <div className="text-sm text-gray-600 mt-1">
                  Credential ID: {cert.credentialId}
                </div>
              )}
              
              {cert.credentialUrl && (
                <a 
                  href={cert.credentialUrl || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline block mt-2"
                >
                  Verify Certificate
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
