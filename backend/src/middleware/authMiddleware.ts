import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { ApiError } from './errorMiddleware';
import { clerkAuth } from './clerkAuth';

// Extend Request interface to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Development bypass - check for dev_bypass header or query param
    const isDevelopment = process.env.NODE_ENV === 'development';
    const devBypass = req.headers['x-dev-bypass'] === 'true' || req.query.dev_bypass === 'true';
    
    if (isDevelopment && devBypass) {
      // Look up the real student user from our seed data
      const studentUser = await prisma.user.findUnique({
        where: { email: 'student@uoa.gr' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true
        }
      });
      
      if (studentUser) {
        req.user = studentUser;
      } else {
        // Fallback to mock user if database user not found
        req.user = {
          id: 'dev-student-fallback',
          email: 'student@uoa.gr',
          name: 'Maria Papadopoulos',
          role: 'STUDENT'
        };
      }
      
      next();
      return;
    }

    // First use Clerk auth to get the clerk user ID
    await new Promise<void>((resolve, reject) => {
      clerkAuth(req, res, (error?: any) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Get Clerk user ID from request
    const clerkUserId = (req as any).clerkUserId;
    
    if (!clerkUserId) {
      throw new ApiError('Authentication required', 401);
    }

    // Find user in our database
    const user = await prisma.user.findFirst({
      where: { email: (req as any).clerkUser?.email || clerkUserId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      throw new ApiError('User not found in database', 404);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ 
        success: false, 
        message: error.message 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication failed' 
      });
    }
  }
};

// Middleware to check specific roles
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Middleware for admin-only routes
export const requireAdmin = requireRole(['ADMIN']);

// Middleware for verified users only
export const requireVerified = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError('Authentication required', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { verificationStatus: true }
    });

    if (!user || user.verificationStatus !== 'VERIFIED') {
      throw new ApiError('Verification required', 403);
    }

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ 
        success: false, 
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
}; 