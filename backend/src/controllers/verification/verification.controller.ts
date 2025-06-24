import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { ApiError } from '../../middleware/errorMiddleware';
import { AuthRequest } from '../../middleware/authMiddleware';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../../config/cloudinary';
import { VerificationStatus } from '@prisma/client';

/**
 * Submit student verification
 * @route POST /api/verification/student
 */
export const submitStudentVerification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { universityId, studentId } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new ApiError('User not authenticated', 401);
    }

    if (!universityId) {
      throw new ApiError('University selection is required', 400);
    }

    // Check if user is a student
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { university: true }
    });

    if (!user || user.role !== 'STUDENT') {
      throw new ApiError('Only students can submit verification', 403);
    }

    // Check if already verified
    if (user.verificationStatus === 'VERIFIED') {
      throw new ApiError('User is already verified', 400);
    }

    // Verify university exists
    const university = await prisma.university.findUnique({
      where: { id: universityId }
    });

    if (!university) {
      throw new ApiError('Invalid university', 400);
    }

    // Check if email domain matches university
    const emailDomain = user.email.split('@')[1]?.toLowerCase();
    const isUniversityEmail = university.emailDomains.includes(emailDomain);

    // Handle file uploads if provided
    const uploadedDocuments = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const timestamp = Date.now();
        const uploadResult = await uploadToCloudinary(file.buffer, {
          folder: `talentspotting/verifications/${userId}`,
          public_id: `${file.fieldname}_${timestamp}`,
          resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image'
        });

        const document = await prisma.verificationDocument.create({
          data: {
            userId,
            type: file.fieldname,
            fileUrl: uploadResult.secure_url,
            fileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            status: 'PENDING'
          }
        });

        uploadedDocuments.push(document);
      }
    }

    // Update user with university and verification status
    const updateData: any = {
      universityId,
      verificationStatus: isUniversityEmail ? 'VERIFIED' : 'PENDING',
      verifiedAt: isUniversityEmail ? new Date() : null
    };

    if (studentId) {
      // Store student ID in metadata or create student record
      await prisma.student.upsert({
        where: { userId },
        update: {},
        create: { userId }
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    res.json({
      success: true,
      verificationId: userId,
      status: updatedUser.verificationStatus,
      message: isUniversityEmail 
        ? 'Your university email has been verified automatically!'
        : 'Your verification request has been submitted for review.',
      documents: uploadedDocuments.map(doc => ({
        id: doc.id,
        type: doc.type,
        fileName: doc.fileName,
        status: doc.status
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Organization verification is now handled by organization-verification.controller.ts

/**
 * Get verification status
 * @route GET /api/verification/status
 */
export const getVerificationStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new ApiError('User not authenticated', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            nameEn: true
          }
        },
        organization: {
          select: {
            id: true,
            name: true,
            verificationStatus: true
          }
        },
        verificationDocuments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    res.json({
      success: true,
      status: user.verificationStatus,
      verifiedAt: user.verifiedAt,
      university: user.university,
      organization: user.organization,
      documents: user.verificationDocuments.map(doc => ({
        id: doc.id,
        type: doc.type,
        fileName: doc.fileName,
        status: doc.status,
        reviewNotes: doc.reviewNotes,
        createdAt: doc.createdAt,
        reviewedAt: doc.reviewedAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload verification documents
 * @route POST /api/verification/documents
 */
export const uploadVerificationDocuments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new ApiError('User not authenticated', 401);
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new ApiError('No files uploaded', 400);
    }

    const uploadedDocuments = [];
    for (const file of req.files) {
      const timestamp = Date.now();
      const uploadResult = await uploadToCloudinary(file.buffer, {
        folder: `talentspotting/verifications/${userId}`,
        public_id: `${file.fieldname}_${timestamp}`,
        resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image'
      });

      const document = await prisma.verificationDocument.create({
        data: {
          userId,
          type: file.fieldname,
          fileUrl: uploadResult.secure_url,
          fileName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          status: 'PENDING'
        }
      });

      uploadedDocuments.push(document);
    }

    res.json({
      success: true,
      documentIds: uploadedDocuments.map(doc => doc.id),
      uploadedFiles: uploadedDocuments.map(doc => ({
        id: doc.id,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        type: doc.type,
        status: doc.status
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete verification document
 * @route DELETE /api/verification/documents/:id
 */
export const deleteVerificationDocument = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new ApiError('User not authenticated', 401);
    }

    const document = await prisma.verificationDocument.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!document) {
      throw new ApiError('Document not found', 404);
    }

    // Delete from Cloudinary
    const publicId = getPublicIdFromUrl(document.fileUrl);
    await deleteFromCloudinary(publicId);

    // Delete from database
    await prisma.verificationDocument.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 