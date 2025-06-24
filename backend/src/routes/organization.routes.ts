import { Router } from 'express';
import { RequestHandler } from 'express';
import { clerkAuth } from '../middleware/clerkAuth';
import {
  inviteTeamMembers,
  acceptInvitation,
  getTeamMembers,
  removeMember,
  getInvitations
} from '../controllers/organization/team.controller';

const router = Router();

// Apply authentication middleware to all routes
router.use(clerkAuth);

// Team management routes
router.post('/invite', inviteTeamMembers as RequestHandler);
router.post('/invite/accept', acceptInvitation as RequestHandler);
router.get('/members', getTeamMembers as RequestHandler);
router.get('/invitations', getInvitations as RequestHandler);
router.delete('/members/:memberId', removeMember as RequestHandler);

export default router; 