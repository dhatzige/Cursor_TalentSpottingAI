import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import route modules
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import studentRoutes from './routes/student.routes';
import employerRoutes from './routes/employer.routes';
import universityRoutes from './routes/university.routes';
import talentSearchRoutes from './routes/talent-search.routes';
import postRoutes from './routes/post.routes';

dotenv.config();

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Health-check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'TalentSpottingAI backend is running.' });
});

// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/university', universityRoutes);
app.use('/api/talent', talentSearchRoutes);
app.use('/api/posts', postRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;
