import { NextResponse } from 'next/server';
import { generateToken, generateRefreshToken } from '@/utils/jwt';
import { getCollection } from '@/lib/database';
import { createUser, sanitizeUser } from '@/entities/User';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Google OAuth error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3010';
      return NextResponse.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Authorization code not provided' },
        { status: 400 }
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.FRONTEND_URL || 'http://localhost:3010'}/api/auth/google/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Get user profile from Google
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const profile = await profileResponse.json();

    // Simple user processing logic
    const usersCollection = await getCollection('users');
    
    // Check if user already exists with this Google ID
    let user = await usersCollection.findOne({ googleId: profile.id });
    
    if (user) {
      // Update last login and avatar
      await usersCollection.updateOne(
        { _id: user._id },
        { 
          $set: { 
            avatar: profile.picture,
            lastLoginAt: new Date()
          } 
        }
      );
    } else {
      // Check if user exists with same email
      user = await usersCollection.findOne({ email: profile.email });
      
      if (user) {
        // Link Google account to existing user
        await usersCollection.updateOne(
          { _id: user._id },
          { 
            $set: { 
              googleId: profile.id,
              avatar: profile.picture,
              lastLoginAt: new Date()
            }
          }
        );
      } else {
        // Create new user
        const newUserData = {
          googleId: profile.id,
          email: profile.email,
          name: profile.name,
          avatar: profile.picture,
          provider: 'google'
        };
        
        const newUser = createUser(newUserData);
        const result = await usersCollection.insertOne(newUser);
        user = { ...newUser, _id: result.insertedId };
      }
    }

    // Generate tokens - convert ObjectId to string
    const userId = user._id.toString();
    const accessToken = generateToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Store refresh token
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { refreshToken } }
    );

    // Redirect to frontend with tokens
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3010';
    const redirectUrl = `${frontendUrl}/auth/callback?token=${accessToken}&refresh=${refreshToken}`;
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Google callback error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3010';
    return NextResponse.redirect(`${frontendUrl}/login?error=auth_failed`);
  }
}
