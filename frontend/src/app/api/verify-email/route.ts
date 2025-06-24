import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { isUniversityEmail } from '@/lib/university-domains';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await (await clerkClient()).users.getUser(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const primaryEmailAddress = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    );

    if (!primaryEmailAddress) {
      return NextResponse.json({ isValid: false, error: 'No primary email address found.' }, { status: 200 });
    }

    const isValid = isUniversityEmail(primaryEmailAddress.emailAddress);

    return NextResponse.json({ isValid });

  } catch (error) {
    console.error('Error verifying student email:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
