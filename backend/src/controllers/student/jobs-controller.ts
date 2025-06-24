import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Controller for student job functionality
 */

// Simple match score calculation (placeholder)
const calculateMatchScore = (student: any, job: any): number => {
  // Simple scoring based on available data
  let score = 50; // Base score
  
  // Add more scoring logic here based on student education, job requirements, etc.
  // For now, return a random score between 1-100
  return Math.floor(Math.random() * 100) + 1;
};

// Get recommended jobs for a student
export const getRecommendedJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from Clerk auth middleware
    const userId = (req as any).clerkUserId;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized access' });
      return;
    }
    
    console.log('🔍 Fetching jobs for user:', userId);
    
    // Get student profile using the correct schema
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: userId },
    });
    
    console.log('📝 Student profile found:', !!studentProfile);
    
    // If no student profile, return empty jobs but don't error
    // This allows the frontend to handle the case gracefully
    
    // Get all active jobs
    const allJobs = await prisma.job.findMany({
      where: { 
        status: 'OPEN'
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          }
        },
        applications: {
          where: {
            userId: userId
          }
        }
      }
    });
    
    console.log('📝 Found jobs:', allJobs.length);
    console.log('📝 Job details:', allJobs.map(j => ({ id: j.id, title: j.title, status: j.status, org: j.organization.name })));
    
    // If no jobs exist, return empty array
    if (allJobs.length === 0) {
      console.log('❌ No jobs found in database');
      res.status(200).json({ jobs: [] });
      return;
    }
    
    const jobsWithScores = await Promise.all(allJobs.map(async (job) => {
      const hasApplied = job.applications.length > 0;
      const matchScore = calculateMatchScore(studentProfile, job);
      
      return {
        id: job.id,
        title: job.title,
        company: job.organization.name,
        location: 'Remote', // Default location since it's not in our schema
        postDate: job.createdAt.toISOString(), // Map createdAt to postDate
        status: job.status?.toLowerCase(),
        matchScore,
        applied: hasApplied
      };
    }));
    
    // Sort by match score (highest first)
    jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
    
    res.status(200).json({ jobs: jobsWithScores });
  } catch (error) {
    console.error('Recommended jobs error:', error);
    res.status(500).json({ message: 'Server error fetching recommended jobs' });
  }
};
