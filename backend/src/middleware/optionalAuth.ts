import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';

export interface OptionalAuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Optional authentication middleware
 * Adds user info if token is present, but doesn't require authentication
 */
export const optionalAuth = async (
  req: OptionalAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      // No token provided, continue without user info
      return next();
    }

    const token = authHeader.substring(7);
    
    try {
      // Verify the Clerk token
      const payload = await clerkClient.verifyToken(token);
      
      if (payload && payload.sub) {
        // Get user details from Clerk
        const clerkUser = await clerkClient.users.getUser(payload.sub);
        
        req.user = {
          id: clerkUser.id,
          email: clerkUser.emailAddresses.find((e: any) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress || '',
          role: (clerkUser.unsafeMetadata as any)?.role || 'STUDENT'
        };
      }
    } catch (tokenError) {
      // Invalid token, but don't fail the request for optional auth
      console.warn('Invalid token in optional auth:', tokenError);
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue without authentication for optional routes
  }
}; 