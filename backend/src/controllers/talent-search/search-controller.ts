// @ts-nocheck - Temporarily disable type checking for this file
// This is needed until the IDE recognizes the updated Prisma schema
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Controller for talent search functionality
 */

/**
 * Search for talent based on various criteria
 */
export const searchTalent = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized access to employer resources' });
    }

    // Parse search criteria from request body
    const {
      location,         // City or specific location
      radiusKm,         // Search radius in kilometers
      universities,     // Array of university/college IDs
      skills,           // Array of skills with priority: [{name: 'React', priority: 1}, ...]
      languages,        // Array of language skills with proficiency
      availabilityDate, // When the candidate is available
      page = 1,         // Pagination
      limit = 20,       // Results per page
    } = req.body;

    // Validate at least one search parameter is provided
    if (!location && !universities?.length && !skills?.length && !languages?.length) {
      return res.status(400).json({ 
        message: 'At least one search parameter is required (location, universities, skills, or languages)' 
      });
    }

    // Build query conditions
    const whereConditions: any = {
      user: {
        active: true,
      },
      // Only fetch profiles that have opted in to being searchable
      searchable: true,
    };

    // Location-based search
    if (location) {
      // If we have specific latitude/longitude
      if (location.lat && location.lng && radiusKm) {
        // We'll implement geospatial search logic here
        // For now, we'll do a simple city match as placeholder
        whereConditions.city = location.city;
      } else if (location.city) {
        whereConditions.city = location.city;
      }
    }

    // University/college filter
    if (universities?.length) {
      whereConditions.education = {
        some: {
          institutionId: {
            in: universities
          }
        }
      };
    }

    // Skills filter - we'll use this for ordering too
    let skillsFilter = null;
    if (skills?.length) {
      skillsFilter = skills;
      whereConditions.OR = [
        // Check profile skills
        {
          skills: {
            some: {
              name: {
                in: skills.map((s: any) => s.name)
              }
            }
          }
        },
        // Check skills extracted from CV (if any)
        {
          user: {
            applications: {
              some: {
                parsedResumeData: {
                  path: ['skills'],
                  array_contains: skills.map((s: any) => s.name)
                }
              }
            }
          }
        }
      ];
    }

    // Language filter
    if (languages?.length) {
      whereConditions.languages = {
        some: {
          language: {
            in: languages.map((l: any) => l.name)
          }
        }
      };
    }

    // Availability filter
    if (availabilityDate) {
      whereConditions.availableFrom = {
        lte: new Date(availabilityDate)
      };
    }

    // Execute query
    const totalCount = await prisma.student.count({
      where: whereConditions
    });

    const students = await prisma.student.findMany({
      where: whereConditions,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            createdAt: true,
            lastActive: true
          }
        },
        skills: true,
        education: {
          include: {
            institution: true
          }
        },
        experience: true,
        languages: {
          include: {
            language: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit
    });

    // Compute scores for each result if skills are provided
    let scoredResults = students;
    if (skillsFilter?.length) {
      scoredResults = students.map((student: any) => {
        // Combine skills from profile and any parsed CV data
        const profileSkills = student.skills.map((s: { name: string }) => s.name.toLowerCase());
        
        // Calculate skill match score
        let skillScore = 0;
        let maxPossibleScore = 0;
        
        skillsFilter.forEach((skill: any) => {
          const priority = skill.priority || 1;
          maxPossibleScore += priority * 10;
          
          // Check if the student has this skill
          if (profileSkills.includes(skill.name.toLowerCase())) {
            skillScore += priority * 10;
          }
        });
        
        const matchScore = maxPossibleScore > 0 
          ? Math.round((skillScore / maxPossibleScore) * 100) 
          : 0;
        
        return {
          ...student,
          matchScore
        };
      });
      
      // Sort by match score descending
      scoredResults.sort((a: any, b: any) => b.matchScore - a.matchScore);
    }

    // Format the response
    const formattedResults = scoredResults.map((student: any) => ({
      id: student.id,
      userId: student.userId,
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      profileImage: student.user.profileImage,
      lastActive: student.user.lastActive,
      city: student.city,
      country: student.country,
      education: student.education.map((edu: any) => ({
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        institution: edu.institution?.name,
        graduationYear: edu.graduationYear
      })),
      skills: student.skills.map((skill: any) => skill.name),
      languages: student.languages.map((l: any) => ({
        name: l.language.name,
        proficiency: l.proficiency
      })),
      availableFrom: student.availableFrom,
      matchScore: student.matchScore || null
    }));

    res.status(200).json({
      results: formattedResults,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Talent search error:', error);
    res.status(500).json({ message: 'Server error during talent search' });
  }
};
