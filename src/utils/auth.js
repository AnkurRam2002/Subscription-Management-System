import { NextResponse } from 'next/server';
import { verifyToken } from './jwt';

/**
 * Authenticates a user from the request headers
 * @param {Request} request - The incoming request
 * @returns {Object} - { success: boolean, user: Object|null, error: string|null }
 */
export async function authenticateUser(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return {
        success: false,
        user: null,
        error: 'No authorization header provided'
      };
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return {
        success: false,
        user: null,
        error: 'No token provided'
      };
    }

    // Verify the token
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      return {
        success: false,
        user: null,
        error: 'Invalid token'
      };
    }

    return {
      success: true,
      user: { userId: decoded.userId },
      error: null
    };

  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return {
        success: false,
        user: null,
        error: 'Invalid or expired token'
      };
    }

    return {
      success: false,
      user: null,
      error: 'Authentication failed'
    };
  }
}

/**
 * Middleware function that returns a 401 response if authentication fails
 * @param {Request} request - The incoming request
 * @returns {Object} - { success: boolean, user: Object|null, response: NextResponse|null }
 */
export async function requireAuth(request) {
  const authResult = await authenticateUser(request);
  
  if (!authResult.success) {
    return {
      success: false,
      user: null,
      response: NextResponse.json(
        { 
          success: false, 
          error: authResult.error || 'Authentication required' 
        },
        { status: 401 }
      )
    };
  }

  return {
    success: true,
    user: authResult.user,
    response: null
  };
}
