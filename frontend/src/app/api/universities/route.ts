import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    
    const response = await fetch(`${backend}/api/universities`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data.data || []
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch universities'
    }, { status: 500 });
  }
} 