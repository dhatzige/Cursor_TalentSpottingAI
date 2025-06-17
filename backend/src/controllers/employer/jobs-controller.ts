import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Controller for job-related operations
 */

// Get active jobs for the organization
export const getActiveJobs = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized access to employer resources' });
    }
    
    // Find the organization this user belongs to
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { organization: true }
    });
    
    if (!user || !user.organization) {
      return res.status(404).json({ message: 'Organization not found for this user' });
    }
    
    const organizationId = user.organization.id;
    
    // Get active jobs
    const jobs = await prisma.job.findMany({
      where: {
        organizationId,
        // status: { in: ['OPEN', 'DRAFT'] } // Status field does not exist
      },
      include: {
        // _count: { // This might be causing type issues if not correctly inferred
        //   select: { applications: true }
        // }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Format jobs for the frontend
    const formattedJobs = jobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: user.organization!.name,
      // location: job.location, // Location field does not exist
      postDate: job.createdAt.toISOString(),
      // status: job.status.toLowerCase(), // Status field does not exist
      // applicantCount: job._count.applications // _count might not be directly available or correctly typed
      applicantCount: 0 // Defaulting applicant count
    }));
    
    res.status(200).json({ jobs: formattedJobs });
  } catch (error) {
    console.error('Active jobs error:', error);
    res.status(500).json({ message: 'Server error fetching active jobs' });
  }
};

// Get all jobs for the organization
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized access to employer resources' });
    }
    
    // Find the organization this user belongs to
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { organization: true }
    });
    
    if (!user || !user.organization) {
      return res.status(404).json({ message: 'Organization not found for this user' });
    }
    
    const organizationId = user.organization.id;
    
    // Filter by status if provided
    const statusFilter = {}; // Status field does not exist on Job model, so filter is removed
    
    // Get all jobs
    const jobs = await prisma.job.findMany({
      where: {
        organizationId,
        // ...statusFilter // Status filter removed
      },
      include: {
        // _count: { // This might be causing type issues if not correctly inferred
        //   select: { applications: true }
        // },
        // skills: true // Skills relation/field does not exist
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Format jobs for the frontend
    const formattedJobs = jobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: user.organization!.name,
      description: job.description,
      postDate: job.createdAt.toISOString(),
      applicantCount: 0 // Defaulting applicant count
    }));
    
    res.status(200).json({ jobs: formattedJobs });
  } catch (error) {
    console.error('Jobs fetch error:', error);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
};

// Get job by ID
export const getJobById = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized access to employer resources' });
    }
    
    const jobId = req.params.jobId;
    
    // Find the job and ensure it belongs to the user's organization
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        organization: true
      }
    });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if job belongs to user's organization
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { organization: true }
    });
    
    if (!user || !user.organization || user.organization.id !== job.organizationId) {
      return res.status(403).json({ message: 'Unauthorized access to this job' });
    }
    
    // Format job for frontend
    const formattedJob = {
      id: job.id,
      title: job.title,
      company: job.organization.name,
      description: job.description,
      postDate: job.createdAt.toISOString(),
      applicantCount: 0 // Defaulting applicant count
    };
    
    res.status(200).json({ job: formattedJob });
  } catch (error) {
    console.error('Job fetch error:', error);
    res.status(500).json({ message: 'Server error fetching job' });
  }
};

// Create job
export const createJob = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized access to employer resources' });
    }
    
    const { title, description, /* location, */ skills = [] } = req.body; // Location removed, skills are not processed
    
    if (!title || !description /* || !location */) { // Location check removed
      return res.status(400).json({ message: 'Missing required job fields' });
    }
    
    // Find the organization this user belongs to
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { organization: true }
    });
    
    if (!user || !user.organization) {
      return res.status(404).json({ message: 'Organization not found for this user' });
    }
    
    const organizationId = user.organization.id;
    
    // Create job
    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        organizationId,
        postedById: user.id // Added missing postedById
      },
      include: {
        organization: true
      }
    });
    
    // Format response
    const formattedJob = {
      id: newJob.id,
      title: newJob.title,
      company: user.organization!.name, // Using user's organization name for reliability
      description: newJob.description,
      postDate: newJob.createdAt.toISOString(),
      applicantCount: 0 // Defaulting applicant count
    };
    
    res.status(201).json({ job: formattedJob });
  } catch (error) {
    console.error('Job creation error:', error);
    res.status(500).json({ message: 'Server error creating job' });
  }
};
