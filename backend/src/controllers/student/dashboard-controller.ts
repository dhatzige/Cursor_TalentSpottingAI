import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Controller for student dashboard functionality
 */

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
