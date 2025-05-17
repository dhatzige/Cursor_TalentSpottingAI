import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DecodedToken {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret') as DecodedToken;
    
    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }
    
    // Add user to request object for use in route handlers
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

// Role-based authorization middleware
export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}.` 
      });
    }
    
    next();
  };
};

// Extending Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}
