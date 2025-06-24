import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Quick setup endpoint to create a real student profile
 * This bypasses the complex verification flow for development
 */
export const quickSetupStudentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from Clerk auth
    const userId = (req as any).clerkUserId || (req as any).auth?.sub;
    
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    console.log('🚀 Quick setup for user:', userId);
    
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true, university: true }
    });
    
    if (user && user.studentProfile) {
      console.log('✅ User already has a complete profile');
      res.status(200).json({ 
        message: 'Profile already exists',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentProfile: user.studentProfile,
          university: user.university
        }
      });
      return;
    }
    
    // Get American College of Thessaloniki (ACT) from database
    const university = await prisma.university.findFirst({
      where: {
        OR: [
          { nameEn: { contains: 'American College of Thessaloniki' } },
          { name: { contains: 'American College of Thessaloniki' } }
        ]
      }
    });
    
    if (!university) {
      res.status(404).json({ message: 'University not found in database' });
      return;
    }
    
    // Create or update user record
    user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        name: 'Dimitris Chatzigeorgiou',
        email: 'dhatzige@act.edu',
        role: 'STUDENT',
        verificationStatus: 'VERIFIED',
        universityId: university.id
      },
      create: {
        id: userId,
        name: 'Dimitris Chatzigeorgiou',
        email: 'dhatzige@act.edu',
        password: 'CLERK_MANAGED',
        role: 'STUDENT',
        verificationStatus: 'VERIFIED',
        universityId: university.id
      },
      include: {
        studentProfile: true,
        university: true
      }
    });
    
    // Create student profile
    const studentProfile = await prisma.studentProfile.upsert({
      where: { userId: userId },
      update: {
        firstName: 'Dimitris',
        lastName: 'Chatzigeorgiou',
        studyField: 'Computer Science',
        studyLevel: 'bachelor',
        graduationYear: 2025,
        locationName: 'Thessaloniki',
        skills: ['Problem Solving', 'Data Structures', 'Teamwork', 'JavaScript', 'Python'],
        bio: 'Computer Science student passionate about technology and innovation.'
      },
      create: {
        userId: userId,
        firstName: 'Dimitris',
        lastName: 'Chatzigeorgiou',
        studyField: 'Computer Science',
        studyLevel: 'bachelor',
        graduationYear: 2025,
        locationName: 'Thessaloniki',
        skills: ['Problem Solving', 'Data Structures', 'Teamwork', 'JavaScript', 'Python'],
        bio: 'Computer Science student passionate about technology and innovation.'
      }
    });
    
    console.log('✅ Created student profile successfully');
    
    // Return the complete user data
    const completeUser = await prisma.user.findUnique({
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
    
    res.status(201).json({
      success: true,
      message: 'Student profile created successfully',
      user: completeUser
    });
    
  } catch (error) {
    console.error('❌ Quick setup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      message: 'Server error during quick setup',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}; 