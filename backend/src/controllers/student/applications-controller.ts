import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { parseCV, ExtractedCV } from '../../services/cv-parser.service';
import * as path from 'path';

const prisma = new PrismaClient();

/**
 * Controller for student application functionality
 */

// Get application status for a student
export const getApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from Clerk auth middleware
    const userId = (req as any).clerkUserId;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized access' });
      return;
    }
    
    console.log('🔍 Fetching applications for user:', userId);
    
    // Get student applications with job details
    const applications = await prisma.application.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        job: {
          include: {
            organization: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    });
    
    console.log('📝 Found applications:', applications.length);
    
    // Format applications for the UI
    const formattedApplications = applications.map((app: any) => ({
      id: app.id,
      title: app.job.title,
      company: app.job.organization.name,
      status: app.status.toLowerCase(),
      timestamp: app.createdAt.toISOString()
    }));
    
    res.status(200).json({ applications: formattedApplications });
  } catch (error) {
    console.error('Application status error:', error);
    res.status(500).json({ message: 'Server error fetching application status' });
  }
};

// Apply for a job
export const applyForJob = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!(req as any).user || (req as any).user.role !== 'STUDENT') {
      res.status(403).json({ message: 'Unauthorized access to student resources' });
      return;
    }
    
    const { jobId } = req.params;
    const coverLetter: string = (req.body.coverLetter || '').trim();
    const additionalInfo: string = (req.body.additionalInfo || '').trim();
    
    // Validate resume file is uploaded
    if (!req.file) {
      res.status(400).json({ message: 'Resume file is required' });
      return;
    }

    // Validate cover-letter length (50 – 4000 chars)
    if (coverLetter.length < 50 || coverLetter.length > 4000) {
      res.status(400).json({ message: 'Cover letter must be between 50 and 4000 characters' });
      return;
    }
    
    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });
    
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    
    // Check if user already applied for this job
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: (req as any).user.id,
        jobId: jobId
      }
    });
    
    if (existingApplication) {
      res.status(409).json({ 
        message: 'You have already applied for this job',
        applicationId: existingApplication.id
      });
      return;
    }
    
    // Save the application
    const application = await prisma.application.create({
      data: {
        status: 'PENDING',
        resumePath: req.file.path,
        coverLetter,
        additionalInfo,
        user: {
          connect: { id: (req as any).user.id }
        },
        job: {
          connect: { id: jobId }
        }
      }
    });
    
    res.status(201).json({ 
      message: 'Application submitted successfully', 
      applicationId: application.id 
    });
  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({ message: 'Server error submitting job application' });
  }
};

// Get single application details
export const getApplicationDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!(req as any).user || (req as any).user.role !== 'STUDENT') {
      res.status(403).json({ message: 'Unauthorized access to student resources' });
      return;
    }
    
    const { id } = req.params;
    
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            organization: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    });
    
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }
    
    // Verify application belongs to the current user
    if (application.userId !== (req as any).user.id) {
      res.status(403).json({ message: 'You do not have permission to view this application' });
      return;
    }
    
    // Format application data for the frontend
    const formattedApplication = {
      id: application.id,
      status: application.status.toLowerCase(),
      lastUpdated: application.updatedAt,
      coverLetter: application.coverLetter,
      resumePath: application.resumePath,
      additionalInfo: application.additionalInfo,
      job: {
        id: application.job.id,
        title: application.job.title,
        description: application.job.description,
        company: application.job.organization.name,
      },
    };
    
    res.status(200).json({ application: formattedApplication });
  } catch (error) {
    console.error('Application details error:', error);
    res.status(500).json({ message: 'Server error fetching application details' });
  }
};
