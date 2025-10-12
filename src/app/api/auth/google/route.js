import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get the base URL for the callback
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3010';
    const callbackUrl = `${baseUrl}/api/auth/google/callback`;
    
    // Google OAuth URL parameters
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: callbackUrl,
      scope: 'profile email',
      response_type: 'code',
      access_type: 'offline',
      //prompt: 'consent'
    });

    // Redirect to Google OAuth
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    
    return NextResponse.redirect(googleAuthUrl);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.json(
      { success: false, error: 'Google authentication failed' },
      { status: 500 }
    );
  }
}
