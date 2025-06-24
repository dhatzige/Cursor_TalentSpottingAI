import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../../config/cloudinary';

const prisma = new PrismaClient();

// Configure multer for memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();

// File filter to accept only PDFs and Word documents
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

/**
 * Upload student resume to Cloudinary
 */
export const uploadResume = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from Clerk auth
    const userId = (req as any).clerkUserId || (req as any).auth?.sub;
    
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
    
    console.log('📄 Resume upload for user:', userId);
    console.log('📄 File details:', {
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
    
    // Check if student profile exists
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId }
    });
    
    if (!studentProfile) {
      res.status(404).json({ message: 'Student profile not found' });
      return;
    }
    
    // Delete existing resume if it exists
    if (studentProfile.resumeUrl) {
      try {
        const publicId = getPublicIdFromUrl(studentProfile.resumeUrl);
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.error('Error deleting old resume from Cloudinary:', error);
      }
    }
    
    // Upload to Cloudinary
    const timestamp = Date.now();
    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: `talentspotting/resumes/${userId}`,
      public_id: `resume_${timestamp}`,
      resource_type: 'raw' // For PDF/Word documents
    });
    
    // Update student profile with resume URL
    const updatedProfile = await prisma.studentProfile.update({
      where: { userId },
      data: {
        resumeUrl: uploadResult.secure_url,
        resumeFileName: req.file.originalname,
        updatedAt: new Date()
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      file: {
        url: uploadResult.secure_url,
        originalname: req.file.originalname,
        size: req.file.size
      }
    });
    
  } catch (error) {
    console.error('❌ Resume upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      message: 'Server error uploading resume',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}; 