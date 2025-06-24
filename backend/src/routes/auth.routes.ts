import express from 'express';
import { clerkAuth } from '../middleware/clerkAuth';
import { getUserProfile } from '../controllers/auth.controller';

const router = express.Router();

// Authentication routes
router.post('/login', (req, res) => {
  res.status(410).json({ 
    message: 'Legacy JWT login deprecated. Please use Clerk authentication.' 
  });
});

router.post('/register', (req, res) => {
  res.status(410).json({ 
    message: 'Legacy JWT registration deprecated. Please use Clerk authentication.' 
  });
});

// Protected profile route
router.get('/profile', clerkAuth, getUserProfile);

export default router;
