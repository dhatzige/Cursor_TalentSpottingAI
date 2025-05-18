'use client';

// Simple authentication utility for TalentSpottingAI
import { useRouter } from 'next/navigation';

// Define user types
export type UserRole = 'student' | 'employer' | 'university' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Mock login function - in a real app, this would call an API
export async function loginUser(email: string, password: string): Promise<User> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  // For demo purposes, create a mock user based on the email
  const user: User = {
    id: '123456',
    name: email.split('@')[0], // Use part before @ as name
    email,
    role: determineRole(email),
  };
  
  // Store in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('talentSpottingUser', JSON.stringify(user));
  }
  
  return user;
}

// Mock register function
export async function registerUser(data: {
  fullName: string;
  email: string;
  password: string;
  role: string;
}): Promise<User> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (!data.email || !data.password || !data.fullName) {
    throw new Error('All fields are required');
  }
  
  // For demo purposes, create a mock user
  const user: User = {
    id: '123456',
    name: data.fullName,
    email: data.email,
    role: (data.role || 'student') as UserRole,
  };
  
  // Store in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('talentSpottingUser', JSON.stringify(user));
  }
  
  return user;
}

// Mock logout function
export async function logoutUser(): Promise<void> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Remove from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('talentSpottingUser');
  }
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('talentSpottingUser');
    if (userData) {
      try {
        return JSON.parse(userData) as User;
      } catch (error) {
        console.error('Error parsing user data', error);
      }
    }
  }
  return null;
}

// Redirect to appropriate dashboard based on role
export function redirectToDashboard(user: User, router: ReturnType<typeof useRouter>): void {
  if (user.role === 'student') {
    router.push('/student-dashboard');
  } else if (user.role === 'employer') {
    router.push('/organization-dashboard');
  } else if (user.role === 'university') {
    router.push('/university-dashboard');
  } else {
    router.push('/admin-dashboard');
  }
}

// Helper to determine role from email (for demo purposes)
function determineRole(email: string): UserRole {
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (domain?.includes('edu') || domain?.includes('university') || domain?.includes('school')) {
    return 'university';
  } else if (domain?.includes('company') || domain?.includes('corp') || domain?.includes('org')) {
    return 'employer';
  } else {
    return 'student';
  }
}
