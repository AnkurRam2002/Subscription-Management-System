import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/database';
import { comparePassword, sanitizeUser } from '@/entities/User';
import { generateToken, generateRefreshToken } from '@/utils/jwt';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email and password are required' 
        },
        { status: 400 }
      );
    }

    const usersCollection = await getCollection('users');

    // Find user by email
    const user = await usersCollection.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email or password' 
        },
        { status: 401 }
      );
    }

    // Check if user has a password (local user)
    if (!user.password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please use Google sign-in for this account' 
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email or password' 
        },
        { status: 401 }
      );
    }

    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date() } }
    );

    // Generate tokens - convert ObjectId to string
    const userId = user._id.toString();
    const accessToken = generateToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Store refresh token
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { refreshToken } }
    );

    return NextResponse.json({
      success: true,
      data: {
        user: sanitizeUser(user),
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Login failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
