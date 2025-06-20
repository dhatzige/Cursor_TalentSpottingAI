import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import app from './app';

// Initialize environment variables and Prisma
dotenv.config();
const prisma = new PrismaClient();

// --- server start ---
app.use(cors());
app.use(express.json());

// Health check route
, (_req, res) => {
  res.json({ status: 'ok', message: 'TalentSpottingAI backend is running.' });
});


, authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/university', universityRoutes);
app.use('/api/talent', talentSearchRoutes);
app.use('/api/posts', postRoutes);


, res) => {
  res.status(404).json({ message: 'Route not found' });
});


 Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});


const PORT = process.env.PORT || 4000;
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Database connection closed');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  console.log('Database connection closed');
  process.exit(0);
});
