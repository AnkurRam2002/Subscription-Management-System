import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/database';
import { sanitizeUser } from '@/entities/User';
import { requireAuth } from '@/utils/auth';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { user } = authResult;

    // Get user data - convert string ID to ObjectId
    const usersCollection = await getCollection('users');
    const userData = await usersCollection.findOne({ _id: new ObjectId(user.userId) });

    if (!userData) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: sanitizeUser(userData)
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get user data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
