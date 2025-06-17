import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { parseCV, ExtractedCV } from '../../services/cv-parser.service';
import path from 'path';

const prisma = new PrismaClient();

/**
 * Controller for student application functionality
 */

// Get application status for a student
export const getApplicationStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ message: 'Unauthorized access to student resources' });
    }
    
    // Get student applications with job details
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }, // Changed from updatedAt
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
    
    // Format applications for the UI
    const formattedApplications = applications.map((app: any) => ({
      id: app.id,
      title: app.job.title,
      company: app.job.organization.name,
      status: app.status.toLowerCase(),
      timestamp: app.createdAt // Changed from updatedAt
    }));
    
    res.status(200).json({ applications: formattedApplications });
  } catch (error) {
    console.error('Application status error:', error);
    res.status(500).json({ message: 'Server error fetching application status' });
  }
};

// Apply for a job
export const applyForJob = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ message: 'Unauthorized access to student resources' });
    }
    
    const { jobId } = req.params;
    // const coverLetter = req.body.coverLetter || ''; // Field does not exist on Application model
    // const additionalInfo = req.body.additionalInfo || ''; // Field does not exist on Application model
    
    // Validate resume file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }
    
    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if user already applied for this job
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: req.user.id,
        jobId: jobId
      }
    });
    
    if (existingApplication) {
      return res.status(409).json({ 
        message: 'You have already applied for this job',
        applicationId: existingApplication.id
      });
    }
    
    // Save the application
    const application = await prisma.application.create({
      data: {
        status: 'PENDING',
        user: {
          connect: { id: req.user.id }
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
export const getApplicationDetails = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ message: 'Unauthorized access to student resources' });
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
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Verify application belongs to the current user
    if (application.userId !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to view this application' });
    }
    
    // Format application data for the frontend
    const formattedApplication = {
      id: application.id,
      status: application.status.toLowerCase(),
      lastUpdated: application.createdAt,
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
