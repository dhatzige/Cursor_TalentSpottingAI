import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email?: string;
        name?: string;
      };
      userId?: string;
      clerkUserId?: string;
      clerkUser?: {
        id: string;
        email?: string;
      };
    }
  }
}

export {}; 