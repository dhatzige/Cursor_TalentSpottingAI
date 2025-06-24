import { Router, RequestHandler } from 'express';
import {
  submitStudentVerification,
  getVerificationStatus,
  uploadVerificationDocuments,
  deleteVerificationDocument
} from '../controllers/verification/verification.controller';
import {
  submitOrganizationVerification,
  uploadOrganizationDocument,
  getOrganizationVerificationStatus,
  getOrganizationVerificationRequirements
} from '../controllers/verification/organization-verification.controller';
import { authenticate } from '../middleware/authMiddleware';
import { uploadVerificationDocs } from '../config/cloudinary';

const router = Router();

// All verification routes require authentication
router.use(authenticate as RequestHandler);

// Student verification
router.post('/student', uploadVerificationDocs.array('documents', 5), submitStudentVerification as RequestHandler);

// Organization verification
router.post('/organization', submitOrganizationVerification as RequestHandler);
router.post('/organization/document', uploadVerificationDocs.single('document'), uploadOrganizationDocument as RequestHandler);
router.get('/organization/status', getOrganizationVerificationStatus as RequestHandler);
router.get('/organization/requirements', getOrganizationVerificationRequirements as RequestHandler);

// Get verification status (student)
router.get('/status', getVerificationStatus as RequestHandler);

// Document management (legacy)
router.post('/documents', uploadVerificationDocs.array('documents', 5), uploadVerificationDocuments as RequestHandler);
router.delete('/documents/:id', deleteVerificationDocument as RequestHandler);

export default router; 