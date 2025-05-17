import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get admin dashboard stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access to admin dashboard' });
    }
    
    // Get counts from database
    const [
      totalUsers,
      totalOrganizations,
      totalStudents,
      totalJobs,
      totalApplications
    ] = await Promise.all([
      prisma.user.count(),
      prisma.organization.count(),
      prisma.user.count({ where: { role: 'student' } }),
      prisma.job.count(),
      prisma.application.count()
    ]);
    
    res.status(200).json({
      stats: {
        totalUsers,
        totalOrganizations,
        totalStudents,
        totalJobs,
        totalApplications
      }
    });
  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching admin statistics' });
  }
};

// Get recent activity
export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access to admin activity' });
    }
    
    // Get recent user registrations
    const newUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    // Get recent job postings
    const newJobs = await prisma.job.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        organization: {
          select: {
            name: true
          }
        }
      }
    });
    
    // Get recent applications
    const newApplications = await prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        createdAt: true,
        job: {
          select: {
            title: true,
            organization: {
              select: {
                name: true
              }
            }
          }
        },
        user: {
          select: {
            name: true
          }
        }
      }
    });
    
    // Format activities
    const activities = [
      ...newUsers.map(user => ({
        id: `user-${user.id}`,
        type: 'user_registration',
        title: `New ${user.role} registered`,
        description: `${user.name} (${user.email})`,
        timestamp: user.createdAt,
        entityType: 'user',
        entityId: user.id
      })),
      ...newJobs.map(job => ({
        id: `job-${job.id}`,
        type: 'job_posting',
        title: 'New job posted',
        description: `${job.title} at ${job.organization.name}`,
        timestamp: job.createdAt,
        entityType: 'job',
        entityId: job.id
      })),
      ...newApplications.map(app => ({
        id: `app-${app.id}`,
        type: 'application',
        title: 'New job application',
        description: `${app.user.name} applied for ${app.job.title} at ${app.job.organization.name}`,
        timestamp: app.createdAt,
        status: app.status,
        entityType: 'application',
        entityId: app.id
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
     .slice(0, 10);
    
    res.status(200).json({ activities });
  } catch (error) {
    console.error('Admin activity error:', error);
    res.status(500).json({ message: 'Server error fetching admin activity' });
  }
};
