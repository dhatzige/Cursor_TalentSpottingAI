import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const formattedJobs = jobs.map(job => ({
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

// Get top candidates for the organization
export const getTopCandidates = async (req: Request, res: Response) => {
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
    
    // Get organization's job skills
    const orgJobs = await prisma.job.findMany({
      where: { organizationId },
      include: { skills: true }
    });
    
    // Extract all skills used by the organization
    const orgSkillIds = new Set<string>();
    orgJobs.forEach(job => {
      job.skills.forEach(skill => {
        orgSkillIds.add(skill.id);
      });
    });
    
    // Find students with matching skills
    const students = await prisma.user.findMany({
      where: { 
        role: 'student',
        student: {
          skills: {
            some: {
              id: { in: Array.from(orgSkillIds) }
            }
          }
        }
      },
      include: {
        student: {
          include: {
            skills: true,
            education: {
              include: {
                university: true
              }
            }
          }
        }
      }
    });
    
    // Calculate match scores and format candidates
    const candidates = students.map(student => {
      // Calculate skill match percentage
      const studentSkills = student.student?.skills || [];
      const matchingSkills = studentSkills.filter(skill => orgSkillIds.has(skill.id));
      const matchScore = orgSkillIds.size > 0 
        ? Math.round((matchingSkills.length / orgSkillIds.size) * 100)
        : 0;
      
      // Get university if available
      const university = student.student?.education[0]?.university?.name;
      
      // Get top skills (by name)
      const skills = studentSkills.map(skill => skill.name);
      
      return {
        id: student.id,
        name: student.name,
        role: student.student?.title || 'Student',
        matchScore,
        university,
        skills
      };
    });
    
    // Sort by match score (highest first)
    candidates.sort((a, b) => b.matchScore - a.matchScore);
    
    res.status(200).json({ candidates });
  } catch (error) {
    console.error('Top candidates error:', error);
    res.status(500).json({ message: 'Server error fetching top candidates' });
  }
};
