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

export const syncClerkUser = async (req: Request, res: Response) => {
  const { userId, email, name, role, dashboardCode } = req.body as SyncBody;

  if (!userId || !email || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const roleEnum = role.toUpperCase() as keyof typeof UserRole;

  try {
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        role: UserRole[roleEnum] ?? UserRole.STUDENT,
        dashboardCode,
        email,
        name,
        lastActive: new Date(),
      },
      create: {
        id: userId,
        email,
        name,
        password: '', // not used, but satisfies schema
        role: UserRole[roleEnum] ?? UserRole.STUDENT,
        dashboardCode,
      },
    });

    return res.json({ ok: true, user });
  } catch (err) {
    console.error('Clerk sync error', err);
    return res.status(500).json({ message: 'Failed to sync user' });
  }
};
