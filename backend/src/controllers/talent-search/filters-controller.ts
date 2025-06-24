// @ts-nocheck - Temporarily disable type checking for this file
// This is needed until the IDE recognizes the updated Prisma schema
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Controller for talent search filters functionality
 */

/**
 * Get search filters data (universities, cities, popular skills)
 */
export const getSearchFilters = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user || (req as any).user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized access to employer resources' });
    }

    // Get top universities
    const universities = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        city: true,
        country: true
      },
      orderBy: {
        students: {
          _count: 'desc'
        }
      },
      take: 50
    });

    // Get top cities where students are located
    const cities = await prisma.student.groupBy({
      by: ['city', 'country'],
      _count: {
        city: true
      },
      orderBy: {
        _count: {
          city: 'desc'
        }
      },
      take: 30
    }) as Array<{ city: string; country: string; _count: { city: number } }>

    // Get top skills
    const skills = await prisma.skill.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            students: true
          }
        }
      },
      orderBy: {
        students: {
          _count: 'desc'
        }
      },
      take: 50
    });

    // Get languages
    const languages = await prisma.language.findMany({
      select: {
        id: true,
        name: true,
        code: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.status(200).json({
      universities: universities,
      cities: cities.map(c => ({ 
        city: c.city, 
        country: c.country, 
        count: c._count.city 
      })),
      skills: skills.map((s: any) => ({ 
        id: s.id, 
        name: s.name, 
        count: s._count.students 
      })),
      languages
    });
  } catch (error) {
    console.error('Get search filters error:', error);
    res.status(500).json({ message: 'Server error fetching search filters' });
  }
};
