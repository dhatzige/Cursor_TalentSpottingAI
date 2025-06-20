import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/clerk-sdk-node';

/**
 * Middleware that validates a Clerk JWT (from the `Authorization: Bearer <token>` header).
 * If the token is valid, the decoded claims are attached to `req.auth`.
 */
export function clerkAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Missing Authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');

    verifyToken(token, process.env.CLERK_SECRET_KEY as string)
      .then(({ payload }) => {
        (req as any).auth = payload;
        next();
      })
      .catch((err) => {
        console.error('clerkAuth error', err);
        res.status(401).json({ message: 'Invalid or expired token' });
      });
  } catch (err) {
    console.error('clerkAuth error', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
