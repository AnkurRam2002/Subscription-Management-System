import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/database';
import { verifyRefreshToken, generateToken } from '@/utils/jwt';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Refresh token is required' 
        },
        { status: 400 }
      );
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    const usersCollection = await getCollection('users');
    const user = await usersCollection.findOne({ 
      _id: new ObjectId(decoded.userId),
      refreshToken: refreshToken
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid refresh token' 
        },
        { status: 401 }
      );
    }

    // Generate new access token - convert ObjectId to string
    const userId = user._id.toString();
    const newAccessToken = generateToken(userId);

    return NextResponse.json({
      success: true,
      data: {
        accessToken: newAccessToken
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Token refresh failed',
        details: error.message 
      },
      { status: 401 }
    );
  }
}
