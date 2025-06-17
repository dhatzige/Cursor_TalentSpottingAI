import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Controller for student job functionality
 */

// Get recommended jobs for a student
export const getRecommendedJobs = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ message: 'Unauthorized access to student resources' });
    }
    
    // Get student profile data to use for matching
    const student = await prisma.user.findUnique({
      where: { id: req.user.id },
      // Removed include for student skills and education as 'student' relation is not defined on User model
      // include: {
      //   student: {
      //     include: {
      //       skills: true,
      //       education: true,
      //     }
      //   }
      // }
    });
    
    if (!student) { // Simplified check as student.student relation does not exist
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    // Get all active jobs
    const allJobs = await prisma.job.findMany({
      where: { 
        // status: 'OPEN', // Job model does not have a 'status' field
        // No need to filter applications here as we'll calculate for all
      },
      include: {
        // skills: true, // Job model does not have a direct 'skills' relation
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
    
    // Calculate match score based on skills - Temporarily removed due to schema mismatch
    // const studentSkillIds = []; // student.student.skills.map((skill: { id: string }) => skill.id);
    
    const recommendedJobs = allJobs.map((job: any) => {
      // Calculate skill match percentage - Temporarily removed
      // const jobSkillIds = []; // job.skills.map((skill: { id: string }) => skill.id);
      // const matchingSkills = jobSkillIds.filter((id: string) => studentSkillIds.includes(id));
      const matchScore = 0; // Default matchScore as skill matching is removed
      
      // Check if student has already applied
      const hasApplied = job.applications.length > 0;
      
      return {
        id: job.id,
        title: job.title,
        company: job.organization.name,
        // location: job.location, // Job model does not have 'location'
        postDate: job.createdAt,
        // status: job.status, // Job model does not have 'status',
        matchScore,
        applied: hasApplied,
      };
    });
    
    // Sort by match score (highest first) - Match score is currently disabled
    // recommendedJobs.sort((a: { matchScore: number }, b: { matchScore: number }) => b.matchScore - a.matchScore);
    // Sort by creation date instead for now
    recommendedJobs.sort((a: { postDate: Date }, b: { postDate: Date }) => b.postDate.getTime() - a.postDate.getTime());
    
    res.status(200).json({ jobs: recommendedJobs });
  } catch (error) {
    console.error('Recommended jobs error:', error);
    res.status(500).json({ message: 'Server error fetching recommended jobs' });
  }
};
