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
        student: {
          include: {
            user: true,
            skills: true,
            education: {
              include: {
                university: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Format applications for the frontend
    const formattedApplications = applications.map((app: any) => {
      const student = app.student;
      
      return {
        id: app.id,
        jobId: app.jobId,
        studentId: app.studentId,
        studentName: `${student.user.firstName} ${student.user.lastName}`,
        status: app.status,
        createdAt: app.createdAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
        resumeUrl: app.resumeUrl || '',
        coverLetter: app.coverLetter || '',
        skills: student.skills.map((s: any) => s.name),
        university: student.education[0]?.university?.name || '',
        matchScore: calculateMatchScore(student, job)
      };
    });
    
    res.status(200).json({
      applications: formattedApplications,
      job: {
        id: job.id,
        title: job.title,
        company: job.organization.name,
        status: job.status
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
            organization: true,
            skills: true
          }
        },
        student: {
          include: {
            user: true,
            skills: true,
            education: {
              include: {
                university: true
              }
            },
            experience: true,
            projects: true,
            certificates: true
          }
        },
        notes: {
          orderBy: { createdAt: 'desc' }
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
    
    if (!user || !user.organization || user.organization.id !== application.job.organizationId) {
      return res.status(403).json({ message: 'Unauthorized access to this application' });
    }
    
    // Format application for frontend
    const student = application.student;
    const job = application.job;
    
    const formattedApplication = {
      id: application.id,
      jobId: job.id,
      jobTitle: job.title,
      status: application.status,
      appliedDate: application.createdAt.toISOString(),
      updatedDate: application.updatedAt.toISOString(),
      resumeUrl: application.resumeUrl || '',
      coverLetter: application.coverLetter || '',
      feedback: application.feedback || '',
      notes: application.notes.map((note: any) => ({
        id: note.id,
        content: note.content,
        createdAt: note.createdAt.toISOString()
      })),
      
      // Candidate data
      candidate: {
        id: student.id,
        userId: student.userId,
        firstName: student.user.firstName,
        lastName: student.user.lastName,
        email: student.user.email,
        phone: student.user.phone || '',
        profileImage: student.user.profileImage || '',
        bio: student.bio || '',
        
        skills: student.skills.map((skill: any) => skill.name),
        
        education: student.education.map((edu: any) => ({
          id: edu.id,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          institution: edu.university?.name || edu.schoolName || '',
          startDate: edu.startDate?.toISOString() || '',
          endDate: edu.endDate?.toISOString() || '',
          description: edu.description || ''
        })),
        
        experience: student.experience.map((exp: any) => ({
          id: exp.id,
          title: exp.title,
          company: exp.company,
          location: exp.location || '',
          startDate: exp.startDate?.toISOString() || '',
          endDate: exp.endDate?.toISOString() || '',
          description: exp.description || ''
        })),
        
        projects: student.projects.map((proj: any) => ({
          id: proj.id,
          title: proj.title,
          description: proj.description || '',
          url: proj.url || '',
          imageUrl: proj.imageUrl || ''
        })),
        
        certificates: student.certificates.map((cert: any) => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer || '',
          issueDate: cert.issueDate?.toISOString() || '',
          expiryDate: cert.expiryDate?.toISOString() || '',
          credentialId: cert.credentialId || '',
          credentialUrl: cert.credentialUrl || ''
        }))
      },
      
      // Match information
      matchScore: calculateMatchScore(student, job),
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
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
        student: {
          include: { user: true }
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
    
    if (!user || !user.organization || user.organization.id !== application.job.organizationId) {
      return res.status(403).json({ message: 'Unauthorized access to this application' });
    }
    
    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status: status.toUpperCase() }
    });
    
    // Create notification for student
    await prisma.notification.create({
      data: {
        userId: application.student.userId,
        type: 'APPLICATION_STATUS',
        title: `Application Status Update: ${application.job.title}`,
        content: `Your application for ${application.job.title} has been updated to ${status}`,
        isRead: false
      }
    });
    
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
    
    if (!user || !user.organization || user.organization.id !== application.job.organizationId) {
      return res.status(403).json({ message: 'Unauthorized access to this application' });
    }
    
    // Add note
    const note = await prisma.applicationNote.create({
      data: {
        applicationId,
        content,
        userId: req.user.id
      }
    });
    
    res.status(201).json({
      note: {
        id: note.id,
        content: note.content,
        createdAt: note.createdAt.toISOString()
      },
      message: 'Note added successfully'
    });
  } catch (error) {
    console.error('Add application note error:', error);
    res.status(500).json({ message: 'Server error adding note' });
  }
};
