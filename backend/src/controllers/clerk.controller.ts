import { Request, Response } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

interface SyncBody {
  userId: string;
  email: string;
  name: string;
  role: string;
  dashboardCode: string;
}

export const syncClerkUser = async (req: Request, res: Response): Promise<void> => {
  const { userId, email, name, role, dashboardCode } = req.body as SyncBody;

  if (!userId || !email || !role) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const roleEnum = role.toUpperCase() as keyof typeof UserRole;

  try {
    // First check if user exists by email or id
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { email: email }
        ]
      }
    });

    let user;
    if (existingUser) {
      console.log('📝 User already exists, checking for ID mismatch...');
      
      // Handle ID mismatch (Clerk generated new ID for existing user)
      if (existingUser.id !== userId) {
        console.log(`🔄 ID mismatch detected: ${existingUser.id} → ${userId}`);
        console.log('🔧 Updating user ID to match current Clerk session...');
        
        // Check if the new ID already exists (conflict resolution)
        const conflictUser = await prisma.user.findUnique({
          where: { id: userId }
        });
        
        if (conflictUser && conflictUser.email !== email) {
          console.log('⚠️ ID conflict with different user, keeping existing ID');
          // Update existing user data but keep the ID
          user = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              role: UserRole[roleEnum] ?? UserRole.STUDENT,
              dashboardCode,
              email,
              name,
              lastActive: new Date(),
              updatedAt: new Date()
            },
          });
        } else {
          // Safe to update the ID
          if (conflictUser) {
            // Delete the conflicting record first
            await prisma.user.delete({ where: { id: userId } });
          }
          
          // Update the ID to match Clerk
          user = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              id: userId,
              role: UserRole[roleEnum] ?? UserRole.STUDENT,
              dashboardCode,
              email,
              name,
              lastActive: new Date(),
              updatedAt: new Date()
            },
          });
        }
      } else {
        // No ID mismatch, just update data
        user = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            role: UserRole[roleEnum] ?? UserRole.STUDENT,
            dashboardCode,
            email,
            name,
            lastActive: new Date(),
            updatedAt: new Date()
          },
        });
      }
    } else {
      // Create new user
      console.log('🆕 Creating new user with ID:', userId);
      user = await prisma.user.create({
        data: {
          id: userId,
          email,
          name,
          password: 'CLERK_MANAGED', // not used, but satisfies schema
          role: UserRole[roleEnum] ?? UserRole.STUDENT,
          dashboardCode,
        },
      });
    }

    res.json({ ok: true, user });
  } catch (err) {
    console.error('Clerk sync error', err);
    res.status(500).json({ message: 'Failed to sync user' });
  }
};
