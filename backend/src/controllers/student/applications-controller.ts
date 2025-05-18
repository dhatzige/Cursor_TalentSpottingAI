import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { parseCV, ExtractedCV } from '../../services/cv-parser.service';
import path from 'path';

const prisma = new PrismaClient();

/**
 * Controller for student application functionality
 */

// Get application status for a student
export const getApplicationStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ message: 'Unauthorized access to student resources' });
    }
    
    // Get student applications with job details
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        job: {
          include: {
            organization: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    });
    
    // Format applications for the UI
    const formattedApplications = applications.map((app: any) => ({
      id: app.id,
      title: app.job.title,
      company: app.job.organization.name,
      status: app.status.toLowerCase(),
      timestamp: app.updatedAt
    }));
    
    res.status(200).json({ applications: formattedApplications });
  } catch (error) {
    console.error('Application status error:', error);
    res.status(500).json({ message: 'Server error fetching application status' });
  }
};

// Apply for a job
export const applyForJob = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ message: 'Unauthorized access to student resources' });
    }
    
    const { jobId } = req.params;
    const coverLetter = req.body.coverLetter || '';
    const additionalInfo = req.body.additionalInfo || '';
    
    // Validate resume file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }
    
    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if user already applied for this job
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: req.user.id,
        jobId: jobId
      }
    });
    
    if (existingApplication) {
      return res.status(409).json({ 
        message: 'You have already applied for this job',
        applicationId: existingApplication.id
      });
    }
    
    // Parse the uploaded CV to extract structured data
    let extractedCvData: ExtractedCV | null = null;
    let parsedResumeData = {};
    
    try {
      extractedCvData = await parseCV(req.file.path);
      console.log('Successfully parsed CV data');
      
      // Format the extracted data for storage
      parsedResumeData = {
        skills: extractedCvData.skills || [],
        extractedExperience: extractedCvData.experience || [],
        extractedEducation: extractedCvData.education || [],
        fullText: extractedCvData.fullText,
        parsedAt: new Date()
      };
    } catch (parseError) {
      console.error('Error parsing resume:', parseError);
      // Continue with application process even if parsing fails
    }
    
    // Save the application with resume file path and parsed data
    const application = await prisma.application.create({
      data: {
        status: 'PENDING',
        coverLetter: coverLetter,
        additionalInfo: additionalInfo,
        resumePath: req.file.path,
        parsedResumeData: parsedResumeData as any, // Store extracted data as JSON
        user: {
          connect: { id: req.user.id }
        },
        job: {
          connect: { id: jobId }
        }
      }
    });
    
    // If CV data was successfully extracted, update student profile with skills
    // This way we build the profile automatically as they apply to jobs
    if (extractedCvData && extractedCvData.skills.length > 0) {
      // Get current student profile
      const student = await prisma.student.findUnique({
        where: { userId: req.user.id },
        include: { skills: true }
      });
      
      if (student) {
        // Get existing skill names to avoid duplicates
        const existingSkillNames = student.skills.map((skill: any) => skill.name.toLowerCase());
        
        // Add skills from CV that aren't already in profile
        for (const skillName of extractedCvData.skills) {
          if (!existingSkillNames.includes(skillName.toLowerCase())) {
            await prisma.skill.create({
              data: {
                name: skillName,
                students: {
                  connect: { id: student.id }
                }
              }
            });
          }
        }
      }
    }
    
    // Record activity
    await prisma.userActivity.create({
      data: {
        userId: req.user.id,
        activityType: 'JOB_APPLICATION',
        details: `Applied for job: ${job.title}`,
        entityId: job.id
      }
    });
    
    res.status(201).json({ 
      message: 'Application submitted successfully', 
      applicationId: application.id 
    });
  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({ message: 'Server error submitting job application' });
  }
};

// Get single application details
export const getApplicationDetails = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ message: 'Unauthorized access to student resources' });
    }
    
    const { id } = req.params;
    
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            organization: {
              select: {
                name: true,
                logo: true,
              }
            },
            skills: true
          }
        },
        notes: true,
        interviews: {
          orderBy: { scheduledAt: 'asc' }
        }
      }
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Verify application belongs to the current user
    if (application.userId !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to view this application' });
    }
    
    // Format application data for the frontend
    const formattedApplication = {
      id: application.id,
      status: application.status,
      submittedAt: application.createdAt,
      lastUpdated: application.updatedAt,
      coverLetter: application.coverLetter,
      additionalInfo: application.additionalInfo,
      resumePath: application.resumePath,
      job: {
        id: application.job.id,
        title: application.job.title,
        description: application.job.description,
        location: application.job.location,
        company: application.job.organization.name,
        companyLogo: application.job.organization.logo,
        skills: application.job.skills.map((skill: { name: string }) => skill.name)
      },
      feedback: application.feedback,
      interviews: application.interviews.map((interview: any) => ({
        id: interview.id,
        type: interview.type,
        scheduledAt: interview.scheduledAt,
        status: interview.status,
        notes: interview.notes
      })),
      notes: application.notes.map((note: any) => ({
        id: note.id,
        content: note.content,
        createdAt: note.createdAt,
        isPublic: note.isPublic
      })).filter((note: any) => note.isPublic)
    };
    
    res.status(200).json({ application: formattedApplication });
  } catch (error) {
    console.error('Application details error:', error);
    res.status(500).json({ message: 'Server error fetching application details' });
  }
};
