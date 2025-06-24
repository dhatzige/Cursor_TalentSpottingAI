import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../../config/cloudinary';
import { z } from 'zod';

const prisma = new PrismaClient();

// Document types for organizations
const ORGANIZATION_DOCUMENT_TYPES = {
  employer: ['business_license', 'tax_certificate', 'company_registration', 'trade_license'],
  university: ['accreditation', 'ministry_approval', 'official_letter', 'charter']
};

// Validation schemas
const organizationVerificationSchema = z.object({
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  registrationNumber: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  industry: z.string().optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional()
});

/**
 * Submit organization verification request
 */
export const submitOrganizationVerification = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!['employer', 'university'].includes(userRole as string)) {
      return res.status(403).json({ error: 'Only employers and universities can submit organization verification' });
    }

    // Validate request body
    const validationResult = organizationVerificationSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validationResult.error.errors
      });
    }

    const data = validationResult.data;

    // Check if user already has a verification request
    const existingVerification = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true }
    });

    if (!existingVerification) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update or create organization
    let organization;
    if (existingVerification.organizationId) {
      // Update existing organization
      organization = await prisma.organization.update({
        where: { id: existingVerification.organizationId },
        data: {
          name: data.organizationName,
          registrationNumber: data.registrationNumber,
          website: data.website,
          industry: data.industry,
          verificationStatus: 'PENDING'
        }
      });
    } else {
      // Create new organization
      organization = await prisma.organization.create({
        data: {
          name: data.organizationName,
          registrationNumber: data.registrationNumber,
          website: data.website,
          industry: data.industry,
          verificationStatus: 'PENDING',
          users: {
            connect: { id: userId }
          },
          members: {
            create: {
              userId: userId,
              acceptedAt: new Date()
            }
          }
        }
      });

      // Link user to organization
      await prisma.user.update({
        where: { id: userId },
        data: { organizationId: organization.id }
      });
    }

    res.status(200).json({
      message: 'Organization verification request submitted successfully',
      organization: {
        id: organization.id,
        name: organization.name,
        verificationStatus: organization.verificationStatus
      }
    });

  } catch (error) {
    console.error('Error submitting organization verification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Upload organization verification document
 */
export const uploadOrganizationDocument = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;
    const { documentType } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate document type
    const allowedTypes = ORGANIZATION_DOCUMENT_TYPES[userRole as keyof typeof ORGANIZATION_DOCUMENT_TYPES];
    if (!allowedTypes?.includes(documentType)) {
      return res.status(400).json({ 
        error: `Invalid document type for ${userRole}. Allowed types: ${allowedTypes?.join(', ')}` 
      });
    }

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true }
    });

    if (!user?.organizationId) {
      return res.status(400).json({ error: 'No organization found. Please submit organization details first.' });
    }

    // Delete existing document of the same type
    const existingDocument = await prisma.verificationDocument.findFirst({
      where: {
        userId: userId,
        type: documentType
      }
    });

    if (existingDocument) {
      try {
        const publicId = getPublicIdFromUrl(existingDocument.fileUrl);
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.error('Error deleting old document from Cloudinary:', error);
      }
      
      await prisma.verificationDocument.delete({
        where: { id: existingDocument.id }
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: `talentspotting/verification/organization/${userId}`,
      public_id: `${documentType}_${Date.now()}`,
      resource_type: 'auto'
    });

    // Save document record
    const document = await prisma.verificationDocument.create({
      data: {
        userId: userId,
        type: documentType,
        fileUrl: uploadResult.secure_url,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        status: 'PENDING'
      }
    });

    res.status(200).json({
      message: 'Document uploaded successfully',
      document: {
        id: document.id,
        type: document.type,
        fileName: document.fileName,
        status: document.status,
        createdAt: document.createdAt
      }
    });

  } catch (error) {
    console.error('Error uploading organization document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get organization verification status
 */
export const getOrganizationVerificationStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
        verificationDocuments: {
          where: {
            type: {
              in: [...ORGANIZATION_DOCUMENT_TYPES.employer, ...ORGANIZATION_DOCUMENT_TYPES.university]
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const organization = user.organization;
    const documents = user.verificationDocuments;

    res.status(200).json({
      organization: organization ? {
        id: organization.id,
        name: organization.name,
        verificationStatus: organization.verificationStatus,
        verifiedAt: organization.verifiedAt,
        registrationNumber: organization.registrationNumber,
        website: organization.website,
        industry: organization.industry
      } : null,
      documents: documents.map(doc => ({
        id: doc.id,
        type: doc.type,
        fileName: doc.fileName,
        status: doc.status,
        reviewNotes: doc.reviewNotes,
        createdAt: doc.createdAt,
        reviewedAt: doc.reviewedAt
      })),
      requiredDocuments: ORGANIZATION_DOCUMENT_TYPES[user.role as keyof typeof ORGANIZATION_DOCUMENT_TYPES] || []
    });

  } catch (error) {
    console.error('Error fetching organization verification status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get organization verification requirements based on role
 */
export const getOrganizationVerificationRequirements = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const requirements = {
      employer: {
        requiredDocuments: ORGANIZATION_DOCUMENT_TYPES.employer,
        descriptions: {
          business_license: 'Official business license or registration certificate',
          tax_certificate: 'Tax registration certificate or VAT number certificate',
          company_registration: 'Certificate of incorporation or company registration',
          trade_license: 'Industry-specific trade license (if applicable)'
        },
        additionalInfo: 'Documents must be current and clearly show your company name and registration details.'
      },
      university: {
        requiredDocuments: ORGANIZATION_DOCUMENT_TYPES.university,
        descriptions: {
          accreditation: 'Official accreditation certificate from Ministry of Education',
          ministry_approval: 'Ministry approval for degree programs',
          official_letter: 'Official letter on university letterhead confirming authorization',
          charter: 'University charter or founding document'
        },
        additionalInfo: 'Documents must verify your institution\'s official status and authorization to grant degrees.'
      }
    };

    const userRole = user.role as keyof typeof requirements;
    const roleRequirements = requirements[userRole];

    if (!roleRequirements) {
      return res.status(400).json({ error: 'Organization verification not available for your role' });
    }

    res.status(200).json(roleRequirements);

  } catch (error) {
    console.error('Error fetching verification requirements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 