import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Update user metadata with student role
    await user.update({
      unsafeMetadata: {
        ...user.unsafeMetadata,
        role: 'student',
        dashboardCode: 'STUDENT123',
        onboardingComplete: true,
        profileCreated: true
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'User role updated successfully',
      metadata: user.unsafeMetadata
    });
    
  } catch (error) {
    console.error('Fix user role error:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
} 