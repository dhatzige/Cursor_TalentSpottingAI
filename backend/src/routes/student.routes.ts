import { Router, Request, Response } from 'express';
import { clerkAuth } from '../middleware/clerkAuth';
import {
  getRecommendedJobs,
  getApplicationStatus,
  applyForJob,
  getApplicationDetails,
  getStudentStats
} from '../controllers/student';
import { 
  createStudentProfile, 
  updateStudentProfile, 
  getProfileCompleteness 
} from '../controllers/student/create-profile.controller';
import { getStudentProfile } from '../controllers/student/profile.controller';
import { quickSetupStudentProfile } from '../controllers/student/quick-setup.controller';
import { uploadResume, upload } from '../controllers/student/upload-resume.controller';

const router = Router();

// Removed temporary profile endpoint - using real controller now

// Public routes (no authentication required)
router.post('/create-profile', createStudentProfile);

// Protected routes (authentication required)
router.use(clerkAuth);

// Quick setup route for development
router.post('/quick-setup', quickSetupStudentProfile);

// Profile routes
router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.get('/profile/completeness', getProfileCompleteness);

// Resume upload route
router.post('/upload-resume', upload.single('resume'), uploadResume);

// Dashboard routes - matching frontend API calls
router.get('/dashboard/stats', getStudentStats);
router.get('/recommended-jobs', getRecommendedJobs);
router.get('/applications', getApplicationStatus);

// Application routes
router.post('/apply', applyForJob);
router.get('/applications/:id', getApplicationDetails);

export default router;
