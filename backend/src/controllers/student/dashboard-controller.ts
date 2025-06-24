import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Controller for student dashboard functionality
 */

// Calculate profile completion percentage based on actual data
const calculateProfileCompletion = (user: any, studentProfile: any): number => {
  let completion = 0;
  
  // Basic account info (20 points)
  if (user.email && user.name) completion += 20;
  
  // Student profile basic info (30 points)
  if (studentProfile) {
    if (studentProfile.firstName && studentProfile.lastName) completion += 10;
    if (studentProfile.studyField && studentProfile.studyLevel) completion += 10;
    if (studentProfile.graduationYear) completion += 10;
  }
  
  // Profile details (30 points)
  if (studentProfile) {
    if (studentProfile.phone) completion += 5;
    if (studentProfile.bio && studentProfile.bio.length > 50) completion += 10;
    if (studentProfile.skills && studentProfile.skills.length >= 3) completion += 15;
  }
  
  // University verification (20 points)
  if (user.universityId) completion += 10;
  if (user.verificationStatus === 'VERIFIED') completion += 10;
  
  return Math.min(completion, 100);
};

// Get student dashboard stats
export const getStudentStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from Clerk auth
    const userId = (req as any).clerkUserId || (req as any).auth?.sub;
    
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    console.log('🔍 Dashboard stats request for user:', userId);
    
    // Get user with correct student profile relation
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
            city: true
          }
        }
      }
    });
    
    if (!user) {
      // Check if user exists with different ID (Clerk ID mismatch)
      const userByEmail = await prisma.user.findFirst({
        where: { 
          // Try to find by common patterns if we can extract email from token
          // This is a fallback for ID mismatches
          role: 'STUDENT'
        },
        include: { studentProfile: true }
      });
      
      console.log(`❌ User not found with ID: ${userId}`);
      if (userByEmail) {
        console.log('💡 Found student users in database, possible ID mismatch');
        console.log('🔧 Suggestion: Run Clerk sync to update user IDs');
      }
      
      res.status(404).json({ 
        message: 'User profile not found. Please complete onboarding or contact support.',
        code: 'USER_NOT_FOUND',
        userId: userId
      });
      return;
    }
    
    // Calculate profile completion
    const profileCompletion = calculateProfileCompletion(user, user.studentProfile);
    
    // Get application count
    const applicationCount = await prisma.application.count({
      where: { userId: userId }
    });
    
    // For now, set jobs viewed to a default value (can be enhanced later)
    const jobsViewedCount = 0;
    
    const stats = {
      profileCompletion,
      applicationsSubmitted: applicationCount,
      jobsViewed: jobsViewedCount,
      interviews: 0, // Will be calculated from applications later
      offersReceived: 0 // Will be calculated from applications later
    };
    
    console.log('✅ Dashboard stats calculated successfully:', stats);
    console.log('📊 Profile completion breakdown for user:', user.name);
    console.log('  - Basic account info:', user.email && user.name ? '✅ 20 points' : '❌ 0 points');
    console.log('  - Student profile basic:', user.studentProfile ? 
      `✅ ${(user.studentProfile.firstName && user.studentProfile.lastName ? 10 : 0) + 
           (user.studentProfile.studyField && user.studentProfile.studyLevel ? 10 : 0) + 
           (user.studentProfile.graduationYear ? 10 : 0)} points` : '❌ 0 points');
    console.log('  - Profile details:', user.studentProfile ? 
      `${user.studentProfile.phone ? '✅ phone(5)' : '❌ phone(0)'} + ${user.studentProfile.bio && user.studentProfile.bio.length > 50 ? '✅ bio(10)' : '❌ bio(0)'} + ${user.studentProfile.skills && user.studentProfile.skills.length >= 3 ? '✅ skills(15)' : '❌ skills(0)'}` : '❌ 0 points');
    console.log('  - Verification:', `${user.universityId ? '✅ university(10)' : '❌ university(0)'} + ${user.verificationStatus === 'VERIFIED' ? '✅ verified(10)' : '❌ verified(0)'}`);
    console.log('  - TOTAL:', profileCompletion, '%');
    
    res.status(200).json({
      stats
    });
  } catch (error) {
    console.error('❌ Student stats error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      userId: (req as any).clerkUserId || (req as any).auth?.sub
    });
    res.status(500).json({ 
      message: 'Server error fetching student statistics',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};
