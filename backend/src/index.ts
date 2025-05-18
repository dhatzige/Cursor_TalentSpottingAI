import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import studentRoutes from './routes/student.routes';
import employerRoutes from './routes/employer.routes';
import universityRoutes from './routes/university.routes';
import talentSearchRoutes from './routes/talent-search.routes';

// Initialize environment and database
dotenv.config();
const prisma = new PrismaClient();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'TalentSpottingAI backend is running.' });
});

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/university', universityRoutes);
app.use('/api/talent', talentSearchRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
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
