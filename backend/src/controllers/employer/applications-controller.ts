import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Controller for application-related operations for employers
 */

// Get all applications for jobs in the organization
export const getApplications = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user || (req as any).user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized access to employer resources' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const jobId = req.query.jobId as string;

    const skip = (page - 1) * limit;

    // Find the organization this user belongs to
    const user = await prisma.user.findUnique({
      where: { id: (req as any).user.id },
      include: { organization: true }
    });

    if (!user || !user.organization) {
      return res.status(404).json({ message: 'Organization not found for this user' });
    }

    const organizationId = user.organization.id;

    // Build filter
    const filter: any = {
      job: {
        organizationId
      }
    };

    if (status) {
      filter.status = status.toUpperCase();
    }

    if (jobId) {
      filter.jobId = jobId;
    }

    // Get applications
    const applications = await prisma.application.findMany({
      where: filter,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        job: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    // Get total count
    const totalCount = await prisma.application.count({
      where: filter
    });

    // Format applications for frontend
    const formattedApplications = applications.map((app: any) => ({
      id: app.id,
      jobTitle: app.job.title,
      applicantName: app.user.name,
      applicantEmail: app.user.email,
      status: app.status.toLowerCase(),
      appliedDate: app.createdAt.toISOString(),
      resumePath: app.resumePath,
      coverLetter: app.coverLetter,
      additionalInfo: app.additionalInfo
    }));

    res.status(200).json({
      applications: formattedApplications,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Applications fetch error:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
};

// Get application by ID
export const getApplicationById = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user || (req as any).user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized access to employer resources' });
    }

    const applicationId = req.params.applicationId;

    // Find the application and ensure it belongs to a job in the user's organization
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        job: {
          include: {
            organization: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if application belongs to user's organization
    const user = await prisma.user.findUnique({
      where: { id: (req as any).user.id },
      include: { organization: true }
    });

    if (!user || !user.organization || user.organization.id !== application.job.organizationId) {
      return res.status(403).json({ message: 'Unauthorized access to this application' });
    }

    // Format application for frontend
    const formattedApplication = {
      id: application.id,
      jobTitle: application.job.title,
      applicantName: application.user.name,
      applicantEmail: application.user.email,
      status: application.status.toLowerCase(),
      appliedDate: application.createdAt.toISOString(),
      resumePath: application.resumePath,
      coverLetter: application.coverLetter,
      additionalInfo: application.additionalInfo
    };

    res.status(200).json({ application: formattedApplication });
  } catch (error) {
    console.error('Application fetch error:', error);
    res.status(500).json({ message: 'Server error fetching application' });
  }
};

// Update application status
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user || (req as any).user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized access to employer resources' });
    }

    const applicationId = req.params.applicationId;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['PENDING', 'REVIEWING', 'INTERVIEW', 'ACCEPTED', 'REJECTED'];
    if (!validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the application and ensure it belongs to a job in the user's organization
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true
      }
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if application belongs to user's organization
    const user = await prisma.user.findUnique({
      where: { id: (req as any).user.id },
      include: { organization: true }
    });

    if (!user || !user.organization || user.organization.id !== application.job.organizationId) {
      return res.status(403).json({ message: 'Unauthorized access to this application' });
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status: status.toUpperCase() },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        job: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    // Format application for frontend
    const formattedApplication = {
      id: updatedApplication.id,
      jobTitle: updatedApplication.job.title,
      applicantName: updatedApplication.user.name,
      applicantEmail: updatedApplication.user.email,
      status: updatedApplication.status.toLowerCase(),
      appliedDate: updatedApplication.createdAt.toISOString(),
      resumePath: updatedApplication.resumePath,
      coverLetter: updatedApplication.coverLetter,
      additionalInfo: updatedApplication.additionalInfo
    };

    res.status(200).json({ application: formattedApplication });
  } catch (error) {
    console.error('Application update error:', error);
    res.status(500).json({ message: 'Server error updating application' });
  }
};

// Get application analytics/stats
export const getApplicationStats = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user || (req as any).user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized access to employer resources' });
    }

    const jobId = req.query.jobId as string;

    // Find the organization this user belongs to
    const user = await prisma.user.findUnique({
      where: { id: (req as any).user.id },
      include: { organization: true }
    });

    if (!user || !user.organization) {
      return res.status(404).json({ message: 'Organization not found for this user' });
    }

    const organizationId = user.organization.id;

    // Build filter for applications
    const filter: any = {
      job: {
        organizationId
      }
    };

    if (jobId) {
      filter.jobId = jobId;
    }

    // Get status counts
    const statusCounts = await prisma.application.groupBy({
      by: ['status'],
      where: filter,
      _count: {
        status: true
      }
    });

    // Format status counts
    const stats = {
      totalApplications: 0,
      pending: 0,
      reviewing: 0,
      interview: 0,
      accepted: 0,
      rejected: 0
    };

    statusCounts.forEach((item: any) => {
      const status = item.status.toLowerCase();
      const count = item._count.status;
      stats.totalApplications += count;
      
      if (status in stats) {
        (stats as any)[status] = count;
      }
    });

    res.status(200).json({ stats });
  } catch (error) {
    console.error('Application stats error:', error);
    res.status(500).json({ message: 'Server error fetching application statistics' });
  }
};
