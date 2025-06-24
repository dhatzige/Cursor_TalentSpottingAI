import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { ApiError } from '../../middleware/errorMiddleware';
import { UserRole, VerificationStatus } from '@prisma/client';

// Extend Request interface for user data
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email?: string;
    name?: string;
  };
}

interface CreateStudentProfileRequest {
  userId: string;
  email: string;
  name: string;
  role: string;
  dashboardCode: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  studyField: string;
  studyLevel: string;
  graduationYear: number;
  skills: string[];
  universityId?: string;
  locationId?: string;
  locationName?: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: string | null;
}

/**
 * Create comprehensive student profile during onboarding
 * @route POST /api/student/create-profile
 */
export const createStudentProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      userId,
      email,
      name,
      dashboardCode,
      firstName,
      lastName,
      phone,
      bio,
      studyField,
      studyLevel,
      graduationYear,
      skills,
      universityId,
      locationId,
      locationName,
      verificationStatus,
      verifiedAt
    }: CreateStudentProfileRequest = req.body;

    // Debug: Log received data
    console.log('📝 Received profile data:', { userId, email, firstName, lastName, studyField, studyLevel });
    
    // Validate required fields
    const missingFields = [];
    if (!userId) missingFields.push('userId');
    if (!email) missingFields.push('email');
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    if (!studyField) missingFields.push('studyField');
    if (!studyLevel) missingFields.push('studyLevel');
    
    if (missingFields.length > 0) {
      throw new ApiError(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }

    // Validate university if provided
    let university = null;
    if (universityId) {
      university = await prisma.university.findUnique({
        where: { id: universityId, isActive: true }
      });
      
      if (!university) {
        throw new ApiError('Invalid university', 400);
      }

      // Verify email domain matches university if provided
      if (email && university.emailDomains.length > 0) {
        const emailDomain = email.split('@')[1]?.toLowerCase();
        const isValidDomain = university.emailDomains.some(domain => 
          emailDomain === domain || emailDomain?.endsWith(`.${domain}`)
        );
        
        if (!isValidDomain) {
          throw new ApiError('Email domain does not match selected university', 400);
        }
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true }
    });

    if (existingUser) {
      console.log('📝 User already exists, updating profile instead of creating new one');
      
      // Update existing user and profile
      const result = await prisma.$transaction(async (tx) => {
        // Update user data
        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            email,
            name,
            role: UserRole.STUDENT,
            dashboardCode,
            verificationStatus: verificationStatus as VerificationStatus,
            verifiedAt: verifiedAt ? new Date(verifiedAt) : null,
            universityId: universityId || null,
          }
        });

        // Update or create student profile
        const studentProfile = await tx.studentProfile.upsert({
          where: { userId },
          update: {
            firstName,
            lastName,
            phone: phone || null,
            bio: bio || null,
            studyField,
            studyLevel,
            graduationYear,
            skills: skills || [],
            locationId: locationId || null,
            locationName: locationName || locationId || null, // Use locationId as fallback for locationName
            updatedAt: new Date()
          },
          create: {
            userId,
            firstName,
            lastName,
            phone: phone || null,
            bio: bio || null,
            studyField,
            studyLevel,
            graduationYear,
            skills: skills || [],
            locationId: locationId || null,
            locationName: locationName || locationId || null, // Use locationId as fallback for locationName
          }
        });

        return { user: updatedUser, studentProfile };
      });

      // Fetch complete profile data
      const completeProfile = await prisma.user.findUnique({
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
              emailDomains: true
            }
          }
        }
      });

      res.status(200).json({
        success: true,
        message: 'Student profile updated successfully',
        data: {
          user: completeProfile,
          isVerified: verificationStatus === 'VERIFIED',
          university: completeProfile?.university || null
        }
      });
      return;
    }

    // Create or update user with student profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Check if user already exists by ID or email (since Clerk sync might have created them)
      const existingUser = await tx.user.findFirst({
        where: {
          OR: [
            { id: userId },
            { email: email }
          ]
        }
      });

      let user;
      if (existingUser) {
        console.log('📝 User already exists, updating profile instead of creating new one');
        // Update existing user (use existing user's ID in case it differs from Clerk userId)
        user = await tx.user.update({
          where: { id: existingUser.id },
          data: {
            email,
            name,
            role: UserRole.STUDENT,
            dashboardCode,
            verificationStatus: verificationStatus as VerificationStatus,
            verifiedAt: verifiedAt ? new Date(verifiedAt) : null,
            universityId: universityId || null,
            updatedAt: new Date()
          }
        });
      } else {
        // Create new user
        user = await tx.user.create({
          data: {
            id: userId,
            email,
            name,
            password: 'CLERK_MANAGED', // Placeholder since Clerk handles authentication
            role: UserRole.STUDENT,
            dashboardCode,
            verificationStatus: verificationStatus as VerificationStatus,
            verifiedAt: verifiedAt ? new Date(verifiedAt) : null,
            universityId: universityId || null,
          }
        });
      }

      // Create or update student profile
      const studentProfile = await tx.studentProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          firstName,
          lastName,
          phone: phone || null,
          bio: bio || null,
          studyField,
          studyLevel,
          graduationYear,
          skills: skills || [],
          locationId: locationId || null,
        },
        update: {
          firstName,
          lastName,
          phone: phone || null,
          bio: bio || null,
          studyField,
          studyLevel,
          graduationYear,
          skills: skills || [],
          locationId: locationId || null,
          updatedAt: new Date()
        }
      });

      // If university provided, update the relationship
      if (university) {
        await tx.user.update({
          where: { id: user.id },
          data: { universityId: university.id }
        });
      }

      return { user, studentProfile };
    });

    // Fetch complete profile data
    const completeProfile = await prisma.user.findUnique({
      where: { id: result.user.id },
      include: {
        studentProfile: true,
        university: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            type: true,
            city: true,
            emailDomains: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Student profile created successfully',
      data: {
        user: completeProfile,
        isVerified: verificationStatus === 'VERIFIED',
        university: completeProfile?.university || null
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Update student profile
 * @route PUT /api/student/profile
 */
export const updateStudentProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new ApiError('User not authenticated', 401);
    }

    const {
      firstName,
      lastName,
      phone,
      bio,
      studyField,
      studyLevel,
      graduationYear,
      skills,
      locationId,
      locationName,
      address
    } = req.body;

    // Check if user exists and is a student
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true }
    });

    if (!user || user.role !== UserRole.STUDENT) {
      throw new ApiError('Student profile not found', 404);
    }

    // Update student profile
    const updatedProfile = await prisma.studentProfile.update({
      where: { userId },
      data: {
        firstName: firstName || user.studentProfile?.firstName,
        lastName: lastName || user.studentProfile?.lastName,
        phone: phone !== undefined ? phone : user.studentProfile?.phone,
        bio: bio !== undefined ? bio : user.studentProfile?.bio,
        studyField: studyField || user.studentProfile?.studyField,
        studyLevel: studyLevel || user.studentProfile?.studyLevel,
        graduationYear: graduationYear || user.studentProfile?.graduationYear,
        skills: skills || user.studentProfile?.skills,
        locationId: locationId !== undefined ? locationId : user.studentProfile?.locationId,
        locationName: locationName !== undefined ? locationName : user.studentProfile?.locationName,
        address: address !== undefined ? address : user.studentProfile?.address,
        updatedAt: new Date()
      }
    });

    // Fetch complete updated profile
    const completeProfile = await prisma.user.findUnique({
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

    res.json({
      success: true,
      message: 'Student profile updated successfully',
      data: completeProfile
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get student profile completeness
 * @route GET /api/student/profile/completeness
 */
export const getProfileCompleteness = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new ApiError('User not authenticated', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        studentProfile: true,
        university: true 
      }
    });

    if (!user || user.role !== UserRole.STUDENT) {
      throw new ApiError('Student profile not found', 404);
    }

    const profile = user.studentProfile;
    if (!profile) {
      throw new ApiError('Student profile not found', 404);
    }

    // Calculate completeness score
    const fields = [
      profile.firstName,
      profile.lastName,
      profile.phone,
      profile.bio,
      profile.studyField,
      profile.studyLevel,
      profile.graduationYear,
      profile.skills.length > 0 ? 'skills' : null,
      profile.locationId,
      user.universityId
    ];

    const completedFields = fields.filter(field => field).length;
    const totalFields = fields.length;
    const completionPercentage = Math.round((completedFields / totalFields) * 100);

    res.json({
      success: true,
      data: {
        completionPercentage,
        completedFields,
        totalFields,
        missingFields: fields.map((field, index) => {
          const fieldNames = [
            'firstName', 'lastName', 'phone', 'bio', 
            'studyField', 'studyLevel', 'graduationYear', 
            'skills', 'location', 'university'
          ];
          return field ? null : fieldNames[index];
        }).filter(Boolean),
        isComplete: completionPercentage === 100
      }
    });

  } catch (error) {
    next(error);
  }
}; 