import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/database';
import { createUser, validateUser, sanitizeUser } from '@/entities/User';
import { generateToken, generateRefreshToken } from '@/utils/jwt';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate input
    const validation = validateUser({ email, password, name, provider: 'local' });
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    const usersCollection = await getCollection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User with this email already exists' 
        },
        { status: 409 }
      );
    }

    // Create new user
    const userData = { email, password, name, provider: 'local' };
    const newUser = createUser(userData);
    
    const result = await usersCollection.insertOne(newUser);
    const createdUser = { ...newUser, _id: result.insertedId };

    // Generate tokens - convert ObjectId to string
    const userId = createdUser._id.toString();
    const accessToken = generateToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Store refresh token
    await usersCollection.updateOne(
      { _id: createdUser._id },
      { $set: { refreshToken } }
    );

    return NextResponse.json({
      success: true,
      data: {
        user: sanitizeUser(createdUser),
        accessToken,
        refreshToken
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Registration failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
