import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { calculateMatchScore } from '../../controllers/employer/utils';

const prisma = new PrismaClient();

/**
 * Controller for candidate-related operations
 */

// Get top candidates for the organization
export const getTopCandidates = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user || (req as any).user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized access to employer resources' });
    }
    
    // Find the organization this user belongs to
    const user = await prisma.user.findUnique({
      where: { id: (req as any).user.id },
      include: { organization: true }
    });
    
    if (!user || !user.organization) {
      return res.status(404).json({ message: 'Organization not found for this user' });
    }
    
    const organizationId = user.organization.id;
    
    // Get organization's job skills
    const orgJobs = await prisma.job.findMany({
      where: { organizationId }
      // include: { skills: true } // Skills relation does not exist on Job model
    });
    
    // Extract all skills used by the organization (Skills logic removed due to schema mismatch)
    // const orgSkillIds = new Set<string>();
    // orgJobs.forEach((job: any) => {
    //   job.skills?.forEach((skill: any) => {
    //     if (skill.id) orgSkillIds.add(skill.id);
    //   });
    // });
    
    // Find students (Simplified query due to schema mismatch)
    const students = await prisma.user.findMany({
      where: { 
        role: 'STUDENT', // Corrected enum casing
        // Student profile specific filtering removed as 'student' relation does not exist directly on User
        // student: {
        //   skills: {
        //     some: {
        //       id: { in: Array.from(orgSkillIds) }
        //     }
        //   }
        // }
      },
      // Include for student profile removed
      // include: {
      //   student: {
      //     include: {
      //       skills: true,
      //       education: {
      //         include: {
      //           university: true
      //         }
      //       }
      //     }
      //   }
      // },
      take: 10 // Limit to top 10 candidates
    });
    
    // Calculate match scores for each student against org jobs
    const candidates = [];
    for (const student of students) {
      // const stdWithProfile = student.student; // 'student' relation does not exist directly on User model
      
      // Find the best matching job (Match score logic simplified due to schema mismatch)
      let bestMatchScore = 0;
      // let bestMatchJob: any = null; // Not used if match score logic is removed/simplified
      
      // Original match score logic commented out:
      // for (const job of orgJobs) {
      //   const score = calculateMatchScore(stdWithProfile, job); // stdWithProfile is not available
      //   if (score > bestMatchScore) {
      //     bestMatchScore = score;
      //     bestMatchJob = job;
      //   }
      // }
      
      // if (bestMatchJob) { // Always push candidate if we are not relying on bestMatchJob
        candidates.push({
          id: student.id,
          name: student.name || 'N/A', // Use student.name, split if needed, or default
          role: 'Candidate', // Default role as student.student.title is not available
          matchScore: bestMatchScore, // Defaulted score
          university: '', // student.student.education is not available
          skills: [], // student.student.skills is not available
          applicationId: '' // No application ID yet since they haven't applied
        });
      // }
    }
    
    // Sort by match score
    candidates.sort((a, b) => b.matchScore - a.matchScore);
    
    res.status(200).json({ candidates });
  } catch (error) {
    console.error('Top candidates error:', error);
    res.status(500).json({ message: 'Server error fetching top candidates' });
  }
};
