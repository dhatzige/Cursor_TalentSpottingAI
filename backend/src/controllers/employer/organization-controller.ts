import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Controller for organization-related operations
 */

// Get employer/organization dashboard stats
export const getOrganizationStats = async (req: Request, res: Response) => {
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
    
    // Get count of active jobs
    const activeJobsCount = await prisma.job.count({
      where: { 
        organizationId,
        status: 'OPEN'
      }
    });
    
    // Get total applicants
    const totalApplicants = await prisma.application.count({
      where: {
        job: {
          organizationId
        }
      }
    });
    
    // Get positions filled
    const positionsFilled = await prisma.job.count({
      where: {
        organizationId,
        status: 'FILLED'
      }
    });
    
    // Get monthly trend data
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    
    const previousMonthApplicants = await prisma.application.count({
      where: {
        job: {
          organizationId
        },
        createdAt: {
          gte: previousMonth
        }
      }
    });
    
    const currentMonthApplicants = await prisma.application.count({
      where: {
        job: {
          organizationId
        },
        createdAt: {
          gte: new Date(new Date().setDate(1)) // First day of current month
        }
      }
    });
    
    // Calculate change percentage
    const applicantChange = previousMonthApplicants > 0 
      ? Math.round(((currentMonthApplicants - previousMonthApplicants) / previousMonthApplicants) * 100)
      : 0;
    
    res.status(200).json({
      stats: {
        activeJobs: activeJobsCount,
        totalApplicants,
        positionsFilled,
        trends: {
          applicantChange
        }
      }
    });
  } catch (error) {
    console.error('Organization stats error:', error);
    res.status(500).json({ message: 'Server error fetching organization statistics' });
  }
};
