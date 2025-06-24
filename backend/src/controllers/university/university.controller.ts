import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { ApiError } from '../../middleware/errorMiddleware';
import { AuthRequest } from '../../middleware/authMiddleware';

/**
 * Get all active universities
 * @route GET /api/universities
 */
export const getUniversities = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, search } = req.query;

    const where: any = {
      isActive: true
    };

    if (type && (type === 'public' || type === 'private')) {
      where.type = type;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ];
    }

    const universities = await prisma.university.findMany({
      where,
      orderBy: [
        { type: 'asc' },
        { nameEn: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        nameEn: true,
        type: true,
        city: true,
        emailDomains: true,
        website: true,
        established: true
      }
    });

    res.json({
      success: true,
      count: universities.length,
      data: universities
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get university by ID
 * @route GET /api/universities/:id
 */
export const getUniversityById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const university = await prisma.university.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            degrees: true
          }
        }
      }
    });

    if (!university) {
      throw new ApiError('University not found', 404);
    }

    res.json({
      success: true,
      data: university
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify if an email belongs to a university domain
 * @route POST /api/universities/verify-email
 */
export const verifyUniversityEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ApiError('Email is required', 400);
    }

    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) {
      throw new ApiError('Invalid email format', 400);
    }

    // Find university by email domain
    const university = await prisma.university.findFirst({
      where: {
        isActive: true,
        emailDomains: {
          has: domain
        }
      }
    });

    if (university) {
      res.json({
        success: true,
        verified: true,
        university: {
          id: university.id,
          name: university.name,
          nameEn: university.nameEn,
          type: university.type
        }
      });
    } else {
      res.json({
        success: true,
        verified: false,
        message: 'Email domain not recognized as a university email'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get university statistics (admin only)
 * @route GET /api/universities/stats
 */
export const getUniversityStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if user is admin
    if ((req as any).user?.role !== 'ADMIN') {
      throw new ApiError('Unauthorized', 403);
    }

    const [totalUniversities, publicCount, privateCount, usersByUniversity] = await Promise.all([
      prisma.university.count({ where: { isActive: true } }),
      prisma.university.count({ where: { isActive: true, type: 'public' } }),
      prisma.university.count({ where: { isActive: true, type: 'private' } }),
      prisma.university.findMany({
        where: { isActive: true },
        select: {
          id: true,
          nameEn: true,
          _count: {
            select: { users: true }
          }
        },
        orderBy: {
          users: {
            _count: 'desc'
          }
        },
        take: 10
      })
    ]);

    res.json({
      success: true,
      data: {
        total: totalUniversities,
        public: publicCount,
        private: privateCount,
        topUniversities: usersByUniversity.map(uni => ({
          id: uni.id,
          name: uni.nameEn,
          userCount: uni._count.users
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}; 