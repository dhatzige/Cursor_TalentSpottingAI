import api from '../axios';
import { 
  TalentSearchCriteria, 
  TalentSearchResponse, 
  SearchFilters,
  CandidateProfile
} from './types';
import { MOCK_DATA } from './mock-data';

/**
 * Service for talent search operations
 */
export const TalentSearchService = {
  /**
   * Search for talent based on criteria
   */
  searchTalent(criteria: TalentSearchCriteria): Promise<TalentSearchResponse> {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      return api.post('/api/talent/search', criteria).then(response => response.data);
    }

    // Mock implementation for development
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResults = MOCK_DATA.candidates.slice(0, 10).map(c => ({
          id: c.id,
          userId: `user-${c.id}`,
          firstName: c.name.split(' ')[0],
          lastName: c.name.split(' ')[1] || '',
          profileImage: `https://i.pravatar.cc/150?u=${c.id}`,
          lastActive: new Date(),
          city: ['London', 'New York', 'Berlin', 'Paris', 'Athens'][Math.floor(Math.random() * 5)],
          country: ['UK', 'USA', 'Germany', 'France', 'Greece'][Math.floor(Math.random() * 5)],
          education: [{
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science',
            institution: 'University of Technology',
            graduationYear: 2023
          }],
          skills: c.skills || [],
          languages: [{ name: 'English', proficiency: 'Fluent' }],
          availableFrom: new Date(),
          matchScore: c.matchScore
        }));

        // Filter by criteria if provided
        let filteredResults = [...mockResults];
        
        // Apply city filter
        if (criteria.location?.city) {
          filteredResults = filteredResults.filter(r => 
            r.city?.toLowerCase().includes(criteria.location?.city?.toLowerCase() || ''));
        }
        
        // Apply skills filter
        if (criteria.skills?.length) {
          const requiredSkills = criteria.skills.map(s => s.name.toLowerCase());
          filteredResults = filteredResults.filter(r => 
            r.skills.some(skill => requiredSkills.includes(skill.toLowerCase())));
        }

        resolve({
          results: filteredResults,
          pagination: {
            page: criteria.page || 1,
            limit: criteria.limit || 20,
            totalCount: filteredResults.length,
            totalPages: Math.ceil(filteredResults.length / (criteria.limit || 20))
          }
        });
      }, 800);
    });
  },

  /**
   * Get search filters data (universities, cities, top skills)
   */
  getSearchFilters(): Promise<SearchFilters> {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      return api.get('/api/talent/filters').then(response => response.data);
    }

    // Mock implementation for development
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          universities: [
            { id: 'uni1', name: 'University of Technology', city: 'London', country: 'UK' },
            { id: 'uni2', name: 'State Technical University', city: 'New York', country: 'USA' },
            { id: 'uni3', name: 'Technical Institute', city: 'Berlin', country: 'Germany' }
          ],
          cities: [
            { city: 'London', country: 'UK', count: 120 },
            { city: 'New York', country: 'USA', count: 95 },
            { city: 'Berlin', country: 'Germany', count: 78 }
          ],
          skills: [
            { id: 'skill1', name: 'React', count: 85 },
            { id: 'skill2', name: 'JavaScript', count: 130 },
            { id: 'skill3', name: 'Node.js', count: 65 },
            { id: 'skill4', name: 'Python', count: 72 },
            { id: 'skill5', name: 'SQL', count: 68 }
          ],
          languages: [
            { id: 'lang1', name: 'English', code: 'en' },
            { id: 'lang2', name: 'Spanish', code: 'es' },
            { id: 'lang3', name: 'French', code: 'fr' },
            { id: 'lang4', name: 'German', code: 'de' },
            { id: 'lang5', name: 'Greek', code: 'el' }
          ]
        });
      }, 600);
    });
  },

  /**
   * View a specific candidate's profile
   */
  viewCandidateProfile(candidateId: string): Promise<CandidateProfile> {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      return api.get(`/api/talent/candidates/${candidateId}`).then(response => response.data.candidate);
    }

    // Mock implementation for development
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockCandidate = MOCK_DATA.candidates.find(c => c.id === candidateId) || MOCK_DATA.candidates[0];
        
        resolve({
          id: candidateId,
          userId: `user-${candidateId}`,
          firstName: mockCandidate.name.split(' ')[0],
          lastName: mockCandidate.name.split(' ')[1] || '',
          profileImage: `https://i.pravatar.cc/150?u=${candidateId}`,
          email: `${mockCandidate.name.split(' ')[0].toLowerCase()}@example.com`,
          bio: 'Motivated graduate with a passion for technology and innovation. Seeking opportunities to apply my knowledge and skills in a dynamic environment.',
          lastActive: new Date(),
          city: ['London', 'New York', 'Berlin', 'Paris', 'Athens'][Math.floor(Math.random() * 5)],
          country: ['UK', 'USA', 'Germany', 'France', 'Greece'][Math.floor(Math.random() * 5)],
          education: [{
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science',
            institution: 'University of Technology',
            graduationYear: 2023
          }],
          skills: mockCandidate.skills || [],
          languages: [{ name: 'English', proficiency: 'Fluent' }],
          experience: [
            {
              title: 'Software Engineering Intern',
              company: 'Tech Innovators Inc.',
              location: 'London, UK',
              startDate: '2022-06-01',
              endDate: '2022-08-31',
              description: 'Collaborated on developing web applications using React and Node.js. Participated in Agile development process with daily stand-ups and sprints.'
            }
          ],
          projects: [
            {
              title: 'E-commerce Platform',
              description: 'Developed a full-stack e-commerce application with React, Node.js, and MongoDB.',
              url: 'https://github.com/example/ecommerce-project',
              imageUrl: 'https://via.placeholder.com/300x200'
            }
          ],
          certificates: [
            {
              name: 'AWS Certified Developer',
              issuer: 'Amazon Web Services',
              issueDate: '2023-01-15',
              expiryDate: '2026-01-15',
              credentialId: 'AWS-1234567',
              credentialUrl: 'https://aws.amazon.com/certification/certified-developer'
            }
          ],
          availableFrom: new Date(),
          matchScore: mockCandidate.matchScore
        });
      }, 700);
    });
  }
};
