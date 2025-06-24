import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as Sentry from "@sentry/node";
import { initSentry } from './sentry';

// Import route modules
import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';
import employerRoutes from './routes/employer.routes';
import adminRoutes from './routes/admin.routes';
// import postRoutes from './routes/post.routes'; // Commented out - missing controller functions
import clerkRoutes from './routes/clerk.routes';
import universityRoutes from './routes/university.routes';
import verificationRoutes from './routes/verification.routes';
import organizationRoutes from './routes/organization.routes';
// import talentSearchRoutes from './routes/talent-search.routes'; // Commented out - missing controller functions

dotenv.config();

// Initialize Sentry
initSentry();

const app = express();

// Request isolation is now automatic in Sentry v8+
// No explicit request handler needed anymore

// Global middleware
app.use(cors());
app.use(express.json());

// Health-check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'TalentSpottingAI backend is running.' });
});

// Route registration
// Mount route handlers
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/posts', postRoutes); // Commented out - missing controller functions
app.use('/api/clerk', clerkRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/organization', organizationRoutes);
// app.use('/api/talent-search', talentSearchRoutes); // Commented out - missing controller functions

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Sentry error handler must be registered before any other error middleware
Sentry.setupExpressErrorHandler(app);

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;
