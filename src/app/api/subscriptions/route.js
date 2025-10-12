import { NextResponse } from 'next/server';
import { initializeDatabase, getCollection } from '@/lib/database';
import { createSubscription } from '@/entities/Subscription';
import { validateSubscription, sanitizeInput } from '@/utils/validation';
import { requireAuth } from '@/utils/auth';
import { ObjectId } from 'mongodb';

// GET /api/subscriptions - Get all subscriptions
export async function GET(request) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { user } = authResult;

    const collection = await getCollection('subscriptions');
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');

    let query = {
      userId: user.userId
    };
    
    if (status) {
      query.status = status;
    }
    
    if (categoryId) {
      query.categoryId = categoryId;
    }

    const subscriptions = await collection.find(query).toArray();
    
    return NextResponse.json({
      success: true,
      data: subscriptions
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

// POST /api/subscriptions - Create a new subscription
export async function POST(request) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { user } = authResult;
    const collection = await getCollection('subscriptions');
    
    const body = await request.json();
    
    // Sanitize input
    const sanitizedData = sanitizeInput(body);
    
    // Add user ID to subscription data
    sanitizedData.userId = user.userId;
    
    // Validate input
    const validation = validateSubscription(sanitizedData);
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
    
    const subscription = createSubscription(sanitizedData);
    
    const result = await collection.insertOne(subscription);
    const savedSubscription = { ...subscription, _id: result.insertedId };
    
    return NextResponse.json({
      success: true,
      data: savedSubscription
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
