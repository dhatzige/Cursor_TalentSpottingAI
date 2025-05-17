import { PrismaClient, UserRole } from './generated/prisma';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function ensureMasterAdmin() {
  const adminEmail = process.env.MASTER_ADMIN_EMAIL || 'admin@talentspottingai.com';
  const adminPassword = process.env.MASTER_ADMIN_PASSWORD || 'changeMeNow123!';

  const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Master Admin',
        role: UserRole.ADMIN,
      },
    });
    console.log('Master admin account created:', adminEmail);
  } else {
    console.log('Master admin already exists.');
  }
  await prisma.$disconnect();
}

ensureMasterAdmin().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
