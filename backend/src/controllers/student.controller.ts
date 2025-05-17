import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get recommended jobs for a student
export const getRecommendedJobs = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ message: 'Unauthorized access to student resources' });
    }
    
    // Get student profile data to use for matching
    const student = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        student: {
          include: {
            skills: true,
            education: true,
          }
        }
      }
    });
    
    if (!student || !student.student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    // Get all active jobs
    const allJobs = await prisma.job.findMany({
      where: { 
        status: 'OPEN',
        // No need to filter applications here as we'll calculate for all
      },
      include: {
        skills: true,
        organization: {
          select: {
            id: true,
            name: true,
          }
        },
        applications: {
          where: {
            userId: req.user.id
          }
        }
      }
    });
    
    // Calculate match score based on skills
    const studentSkillIds = student.student.skills.map(skill => skill.id);
    
    const recommendedJobs = allJobs.map(job => {
      // Calculate skill match percentage
      const jobSkillIds = job.skills.map(skill => skill.id);
      const matchingSkills = jobSkillIds.filter(id => studentSkillIds.includes(id));
      const matchScore = jobSkillIds.length > 0 
        ? Math.floor((matchingSkills.length / jobSkillIds.length) * 100)
        : 0;
      
      // Check if student has already applied
      const hasApplied = job.applications.length > 0;
      
      return {
        id: job.id,
        title: job.title,
        company: job.organization.name,
        location: job.location,
        postDate: job.createdAt,
        status: job.status,
        matchScore,
        applied: hasApplied,
      };
    });
    
    // Sort by match score (highest first)
    recommendedJobs.sort((a, b) => b.matchScore - a.matchScore);
    
    res.status(200).json({ jobs: recommendedJobs });
  } catch (error) {
    console.error('Recommended jobs error:', error);
    res.status(500).json({ message: 'Server error fetching recommended jobs' });
  }
};

// Get application status for a student
export const getApplicationStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ message: 'Unauthorized access to student resources' });
    }
    
    // Get student applications with job details
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
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
    const formattedApplications = applications.map(app => ({
      id: app.id,
      title: app.job.title,
      company: app.job.organization.name,
      status: app.status.toLowerCase(),
      timestamp: app.updatedAt
    }));
    
    res.status(200).json({ applications: formattedApplications });
  } catch (error) {
    console.error('Application status error:', error);
    res.status(500).json({ message: 'Server error fetching application status' });
  }
};

// Get student dashboard stats
export const getStudentStats = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ message: 'Unauthorized access to student resources' });
    }
    
    // Get profile completion percentage
    const student = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        student: {
          include: {
            skills: true,
            education: true,
            experience: true
          }
        }
      }
    });
    
    if (!student || !student.student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    // Calculate profile completion (basic algorithm)
    const totalSections = 5; // Basic info, about, skills, education, experience
    let completedSections = 1; // Basic info is always there
    
    if (student.student.about && student.student.about.length > 10) completedSections++;
    if (student.student.skills.length > 0) completedSections++;
    if (student.student.education.length > 0) completedSections++;
    if (student.student.experience.length > 0) completedSections++;
    
    const profileCompletion = Math.floor((completedSections / totalSections) * 100);
    
    // Get application count
    const applicationCount = await prisma.application.count({
      where: { userId: req.user.id }
    });
    
    // Get jobs viewed count (from analytics)
    const jobsViewedCount = await prisma.userActivity.count({
      where: { 
        userId: req.user.id,
        activityType: 'JOB_VIEW'
      }
    });
    
    res.status(200).json({
      stats: {
        profileCompletion,
        applicationsSubmitted: applicationCount,
        jobsViewed: jobsViewedCount
      }
    });
  } catch (error) {
    console.error('Student stats error:', error);
    res.status(500).json({ message: 'Server error fetching student statistics' });
  }
};
