import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/database';
import { authenticateToken } from '@/middleware/auth';

export async function POST(request) {
  try {
    // Verify user is authenticated
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No authorization header' 
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { verifyToken } = await import('@/utils/jwt');
    const decoded = verifyToken(token);

    // Remove refresh token from database
    const usersCollection = await getCollection('users');
    await usersCollection.updateOne(
      { _id: decoded.userId },
      { $unset: { refreshToken: 1 } }
    );

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Logout failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
