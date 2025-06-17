import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { calculateMatchScore } from './utils';

const prisma = new PrismaClient();

/**
 * Controller for application-related operations
 */

// Get applications for a specific job
export const getJobApplications = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized access to employer resources' });
    }
    
    const jobId = req.params.jobId;
    
    // Find the job and ensure it belongs to the user's organization
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { organization: true }
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
    
    // Get applications for this job
    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        // student: { // Student relation does not exist on Application model directly
        //   include: {
        //     user: true,
        //     skills: true,
        //     education: {
        //       include: {
        //         university: true
        //       }
        //     }
        //   }
        // }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Format applications for the frontend
    const formattedApplications = applications.map((app: any) => {
      // const student = app.student; // Student details not directly included
      
      return {
        id: app.id,
        jobId: app.jobId,
        studentId: app.userId, // Corrected from studentId to userId based on schema
        // studentName: `${student.user.firstName} ${student.user.lastName}`, // Requires separate fetch
        studentName: 'N/A', // Defaulting as student details are not fetched here
        status: app.status,
        createdAt: app.createdAt.toISOString(),
        // updatedAt: app.updatedAt.toISOString(), // updatedAt does not exist on Application model
        // resumeUrl: app.resumeUrl || '', // resumeUrl does not exist on Application model
        // coverLetter: app.coverLetter || '', // coverLetter does not exist on Application model
        // skills: student.skills.map((s: any) => s.name), // Requires separate fetch
        // university: student.education[0]?.university?.name || '', // Requires separate fetch
        // matchScore: calculateMatchScore(student, job) // calculateMatchScore depends on unavailable data
        matchScore: 0 // Defaulting match score
      };
    });
    
    res.status(200).json({
      applications: formattedApplications,
      job: {
        id: job.id,
        title: job.title,
        company: job.organization.name,
        // status: job.status // Status field does not exist on Job model
      }
    });
  } catch (error) {
    console.error('Job applications error:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
};

// Get application details
export const getApplicationDetails = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized access to employer resources' });
    }
    
    const applicationId = req.params.applicationId;
    
    // Find the application
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
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
    
    // Check if application's job belongs to user's organization
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { organization: true }
    });
    
    const jobForOrgCheck = await prisma.job.findUnique({ where: { id: application.jobId } });
    if (!jobForOrgCheck) return res.status(404).json({ message: 'Associated job not found for authorization check' });
    if (!user || !user.organization || user.organization.id !== jobForOrgCheck.organizationId) {
      return res.status(403).json({ message: 'Unauthorized access to this application' });
    }
    
    // Format application for frontend
    const jobDetails = application.job;
    const studentUser = await prisma.user.findUnique({ where: { id: application.userId } });

    const formattedApplication = {
      id: application.id,
      jobId: jobDetails.id,
      jobTitle: jobDetails.title,
      status: application.status,
      appliedDate: application.createdAt.toISOString(),
      
      // Candidate data (simplified)
      candidate: studentUser ? {
        id: studentUser.id, 
        userId: studentUser.id,
        firstName: studentUser.name ? studentUser.name.split(' ')[0] : '',
        lastName: studentUser.name ? studentUser.name.split(' ').slice(1).join(' ') : '',
        email: studentUser.email,
        phone: '', // studentUser.phone does not exist on User model
        profileImage: '', // studentUser.profileImage does not exist on User model
        bio: '', 
      } : null,
    };
    
    res.status(200).json({ application: formattedApplication });
  } catch (error) {
    console.error('Application details error:', error);
    res.status(500).json({ message: 'Server error fetching application details' });
  }
};

// Update application status
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized access to employer resources' });
    }
    
    const applicationId = req.params.applicationId;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    // Validate status
    const validStatuses = ['pending', 'reviewing', 'interview', 'accepted', 'rejected'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // Find the application
    const application = await prisma.application.findUniqueOrThrow({
      where: { id: applicationId },
      include: {
        job: { include: { organization: true } }
      }
    });
    
    // Check if application's job belongs to user's organization
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { organization: true }
    });
    
    const jobForOrgCheck = await prisma.job.findUnique({ where: { id: application.jobId } });
    if (!jobForOrgCheck) return res.status(404).json({ message: 'Associated job not found for authorization check' });
    if (!user || !user.organization || user.organization.id !== jobForOrgCheck.organizationId) {
      return res.status(403).json({ message: 'Unauthorized access to this application' });
    }
    
    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status: status.toUpperCase() }
    });
    
    // Notify student (Notification model does not exist)
    // const jobTitleForNotification = jobForOrgCheck?.title || 'your job application';
    // await prisma.notification.create({
    //   data: {
    //     userId: application.userId,
    //     type: 'APPLICATION_STATUS_UPDATE',
    //     title: `Application Status Update: ${jobTitleForNotification}`,
    //     content: `Your application for ${jobTitleForNotification} has been updated to ${status}`,
    //     link: `/applications/${application.id}`
    //   }
    // });
    
    res.status(200).json({
      application: {
        ...updatedApplication,
        status: updatedApplication.status
      },
      message: 'Application status updated successfully'
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error updating application status' });
  }
};

// Add note to application
export const addApplicationNote = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized access to employer resources' });
    }
    
    const applicationId = req.params.applicationId;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Note content is required' });
    }
    
    // Find the application
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true }
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if application's job belongs to user's organization
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { organization: true }
    });
    
    const jobForOrgCheck = await prisma.job.findUnique({ where: { id: application.jobId } });
    if (!jobForOrgCheck) return res.status(404).json({ message: 'Associated job not found for authorization check' });
    if (!user || !user.organization || user.organization.id !== jobForOrgCheck.organizationId) {
      return res.status(403).json({ message: 'Unauthorized access to this application' });
    }
    
    // Create note (ApplicationNote model does not exist, functionality disabled)
    // const note = await prisma.applicationNote.create({
    //   data: {
    //     applicationId,
    //     content,
    //     authorId: req.user.id
    //   }
    // });
    
    res.status(200).json({ message: 'Note functionality is currently disabled.' });
  } catch (error) {
    console.error('Add application note error:', error);
    res.status(500).json({ message: 'Server error adding note' });
  }
};
