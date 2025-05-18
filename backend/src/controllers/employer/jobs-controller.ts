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
        status: { in: ['OPEN', 'DRAFT'] }
      },
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Format jobs for the frontend
    const formattedJobs = jobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: user.organization!.name,
      location: job.location,
      postDate: job.createdAt.toISOString(),
      status: job.status.toLowerCase(),
      applicantCount: job._count.applications
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
    const statusFilter = req.query.status ? 
      { status: { equals: req.query.status.toString().toUpperCase() } } : 
      {};
    
    // Get all jobs
    const jobs = await prisma.job.findMany({
      where: {
        organizationId,
        ...statusFilter
      },
      include: {
        _count: {
          select: { applications: true }
        },
        skills: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Format jobs for the frontend
    const formattedJobs = jobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: user.organization!.name,
      location: job.location,
      description: job.description,
      postDate: job.createdAt.toISOString(),
      status: job.status.toLowerCase(),
      applicantCount: job._count.applications,
      skills: job.skills.map((s: any) => s.name)
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
        organization: true,
        skills: true,
        _count: {
          select: { applications: true }
        }
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
      location: job.location,
      description: job.description,
      postDate: job.createdAt.toISOString(),
      status: job.status.toLowerCase(),
      applicantCount: job._count.applications,
      skills: job.skills.map((s: { name: string }) => s.name)
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
    
    const { title, description, location, skills = [] } = req.body;
    
    if (!title || !description || !location) {
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
    
    // Process skills
    const skillsToConnect = [];
    for (const skillName of skills) {
      // Check if skill exists
      let skill = await prisma.skill.findFirst({
        where: { name: { equals: skillName, mode: 'insensitive' } }
      });
      
      // Create if it doesn't exist
      if (!skill) {
        skill = await prisma.skill.create({
          data: { name: skillName }
        });
      }
      
      skillsToConnect.push({ id: skill.id });
    }
    
    // Create job
    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        location,
        status: 'DRAFT',
        organizationId,
        skills: {
          connect: skillsToConnect
        }
      },
      include: {
        skills: true,
        organization: true
      }
    });
    
    // Format response
    const formattedJob = {
      id: newJob.id,
      title: newJob.title,
      company: newJob.organization.name,
      location: newJob.location,
      description: newJob.description,
      postDate: newJob.createdAt.toISOString(),
      status: newJob.status.toLowerCase(),
      applicantCount: 0,
      skills: newJob.skills.map((s: { name: string }) => s.name)
    };
    
    res.status(201).json({ job: formattedJob });
  } catch (error) {
    console.error('Job creation error:', error);
    res.status(500).json({ message: 'Server error creating job' });
  }
};
