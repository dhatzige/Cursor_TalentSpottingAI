import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get university dashboard stats
export const getUniversityStats = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'university') {
      return res.status(403).json({ message: 'Unauthorized access to university resources' });
    }
    
    // Find the university this user belongs to
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { university: true }
    });
    
    if (!user || !user.university) {
      return res.status(404).json({ message: 'University not found for this user' });
    }
    
    const universityId = user.university.id;
    
    // Get total students count
    const totalStudents = await prisma.education.count({
      where: { universityId }
    });
    
    // Get active job-seeking students
    const activeStudents = await prisma.education.count({
      where: { 
        universityId,
        student: {
          user: {
            status: 'ACTIVE',
            lastActive: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Active in last 30 days
            }
          }
        }
      }
    });
    
    // Calculate placement rate
    const placedStudents = await prisma.education.count({
      where: {
        universityId,
        student: {
          placed: true
        }
      }
    });
    
    const placementRate = totalStudents > 0 
      ? Math.round((placedStudents / totalStudents) * 100)
      : 0;
    
    // Get average starting salary
    const salaryStats = await prisma.$queryRaw`
      SELECT AVG(s.salary) as averageSalary
      FROM "Student" s
      JOIN "Education" e ON s."id" = e."studentId"
      WHERE e."universityId" = ${universityId}
      AND s.placed = true
    `;
    
    const averageSalary = salaryStats[0]?.averageSalary 
      ? `$${Math.floor(salaryStats[0].averageSalary).toLocaleString()}`
      : '$0';
    
    res.status(200).json({
      metrics: {
        totalStudents,
        activeStudents,
        placementRate,
        averageSalary
      }
    });
  } catch (error) {
    console.error('University stats error:', error);
    res.status(500).json({ message: 'Server error fetching university statistics' });
  }
};

// Get student placement data by degree
export const getStudentPlacement = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'university') {
      return res.status(403).json({ message: 'Unauthorized access to university resources' });
    }
    
    // Find the university this user belongs to
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { university: true }
    });
    
    if (!user || !user.university) {
      return res.status(404).json({ message: 'University not found for this user' });
    }
    
    const universityId = user.university.id;
    
    // Get degrees offered by the university
    const degrees = await prisma.degree.findMany({
      where: { universityId },
      include: {
        education: {
          include: {
            student: true
          }
        }
      }
    });
    
    // Calculate placement data for each degree
    const placementData = degrees.map(degree => {
      const students = degree.education.length;
      const placed = degree.education.filter(ed => ed.student?.placed).length;
      
      // Calculate average salary for placed students
      const salaries = degree.education
        .filter(ed => ed.student?.placed && ed.student?.salary)
        .map(ed => ed.student!.salary!);
      
      const averageSalary = salaries.length > 0
        ? `$${Math.floor(salaries.reduce((a, b) => a + b, 0) / salaries.length).toLocaleString()}`
        : '$0';
      
      // Calculate trend compared to previous period
      const prevPlacementRate = degree.prevPlacementRate || 0;
      const currentPlacementRate = students > 0 ? (placed / students) * 100 : 0;
      
      let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
      if (currentPlacementRate > prevPlacementRate + 5) {
        trend = 'increasing';
      } else if (currentPlacementRate < prevPlacementRate - 5) {
        trend = 'decreasing';
      }
      
      return {
        degree: degree.name,
        students,
        placed,
        averageSalary,
        trend
      };
    });
    
    res.status(200).json({ placements: placementData });
  } catch (error) {
    console.error('Student placement error:', error);
    res.status(500).json({ message: 'Server error fetching student placement data' });
  }
};

// Get employer partners
export const getEmployerPartners = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'university') {
      return res.status(403).json({ message: 'Unauthorized access to university resources' });
    }
    
    // Find the university this user belongs to
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { university: true }
    });
    
    if (!user || !user.university) {
      return res.status(404).json({ message: 'University not found for this user' });
    }
    
    const universityId = user.university.id;
    
    // Get employers that have hired students from this university
    const hiredStudents = await prisma.student.findMany({
      where: {
        education: {
          some: {
            universityId
          }
        },
        placed: true,
        employer: {
          isNot: null
        }
      },
      include: {
        employer: true
      }
    });
    
    // Count students hired by each employer
    const employerCounts = hiredStudents.reduce((acc, student) => {
      const employerId = student.employer!.id;
      acc[employerId] = (acc[employerId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Get unique employers
    const uniqueEmployers = Array.from(
      new Set(hiredStudents.map(s => s.employer!.id))
    ).map(id => {
      const employer = hiredStudents.find(s => s.employer!.id === id)!.employer!;
      
      // Get open positions count
      const openPositions = employer.jobs?.filter(j => j.status === 'OPEN').length || 0;
      
      return {
        id: employer.id,
        name: employer.name,
        industry: employer.industry,
        hiringStatus: openPositions > 0 ? 'active' : 'inactive',
        openPositions,
        studentsHired: employerCounts[employer.id]
      };
    });
    
    res.status(200).json({ employers: uniqueEmployers });
  } catch (error) {
    console.error('Employer partners error:', error);
    res.status(500).json({ message: 'Server error fetching employer partners' });
  }
};
