import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get student profile data
 */
export const getStudentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from Clerk auth
    const userId = (req as any).clerkUserId || (req as any).auth?.sub;
    
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    console.log('🔍 Profile request for user:', userId);
    
    // Get user with complete profile data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        university: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            type: true,
            city: true,
            website: true
          }
        }
      }
    });
    
    if (!user) {
      console.log(`❌ User not found with ID: ${userId}`);
      res.status(404).json({ 
        message: 'User profile not found',
        code: 'USER_NOT_FOUND'
      });
      return;
    }
    
    console.log('✅ Profile data retrieved successfully for:', user.name);
    
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
        studentProfile: user.studentProfile,
        university: user.university
      }
    });
  } catch (error) {
    console.error('❌ Student profile error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      message: 'Server error fetching student profile',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}; 