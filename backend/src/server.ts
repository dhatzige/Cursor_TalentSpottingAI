import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import app from './app';

dotenv.config();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown helper
const shutdown = async () => {
  await prisma.$disconnect();
  console.log('Database connection closed');
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
