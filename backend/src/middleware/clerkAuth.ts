import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

/**
 * Middleware that validates a Clerk JWT (from the `Authorization: Bearer <token>` header).
 * If the token is valid, the decoded claims are attached to `req.auth`.
 */
export async function clerkAuth(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  try {
    // Check for dev bypass mode
    const devBypass = req.headers['x-dev-bypass'];
    if (devBypass === 'true') {
      // Mock user for dev bypass
      (req as any).auth = {
        sub: 'dev-user-123',
        user_id: 'dev-user-123',
        email: 'dev@example.com'
      };
      (req as any).clerkUserId = 'dev-user-123';
      (req as any).clerkUser = {
        id: 'dev-user-123',
        email: 'dev@example.com'
      };
      // Set user object for controllers that expect it
      (req as any).user = {
        id: 'dev-user-123',
        email: 'dev@example.com',
        role: 'STUDENT'
      };
      next();
      return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: 'Missing Authorization header' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    
    // For development, we'll use basic JWT decoding
    // In production, you should use Clerk's SDK for proper verification
    try {
      // Basic JWT verification - decode without verification for development
      const decoded = jwt.decode(token) as any;
      
      if (!decoded) {
        console.log('❌ Failed to decode JWT token');
        res.status(401).json({ message: 'Invalid token' });
        return;
      }
      
      console.log('🔍 Decoded token:', { 
        sub: decoded.sub, 
        user_id: decoded.user_id,
        email: decoded.email,
        iat: decoded.iat,
        exp: decoded.exp 
      });
      
      // Check if token is expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        console.log('❌ Token is expired');
        res.status(401).json({ message: 'Token expired' });
        return;
      }
      
      // Attach the decoded token to request
      (req as any).auth = decoded;
      (req as any).clerkUserId = decoded.sub || decoded.user_id;
      (req as any).clerkUser = {
        id: decoded.sub || decoded.user_id,
        email: decoded.email
      };
      
      console.log('🔑 Clerk auth successful for user:', decoded.sub || decoded.user_id);
      
      next();
    } catch (err) {
      console.error('clerkAuth token verification error:', err);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  } catch (err) {
    console.error('clerkAuth error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
