import { NextResponse } from 'next/server';
import { initializeDatabase, getCollection } from '@/lib/database';
import { ObjectId } from 'mongodb';
import { validateSubscription, validateObjectId, sanitizeInput } from '@/utils/validation';

// GET /api/subscriptions/[id] - Get a specific subscription
export async function GET(request, { params }) {
  try {
    const collection = await getCollection('subscriptions');
    
    const { id } = await params;
    
    // Validate ObjectId
    const idValidation = validateObjectId(id);
    if (!idValidation.isValid) {
      return NextResponse.json(
        { success: false, error: idValidation.error },
        { status: 400 }
      );
    }
    
    const subscription = await collection.findOne({
      _id: new ObjectId(id)
    });
    
    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

// PUT /api/subscriptions/[id] - Update a subscription
export async function PUT(request, { params }) {
  try {
    const collection = await getCollection('subscriptions');
    
    const { id } = await params;
    
    // Validate ObjectId
    const idValidation = validateObjectId(id);
    if (!idValidation.isValid) {
      return NextResponse.json(
        { success: false, error: idValidation.error },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Sanitize input
    const sanitizedData = sanitizeInput(body);
    
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
    
    sanitizedData.updatedAt = new Date();
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: sanitizedData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }
    
    const updatedSubscription = await collection.findOne({
      _id: new ObjectId(id)
    });
    
    return NextResponse.json({
      success: true,
      data: updatedSubscription
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

// DELETE /api/subscriptions/[id] - Delete a subscription
export async function DELETE(request, { params }) {
  try {
    const collection = await getCollection('subscriptions');
    
    const { id } = await params;
    
    // Validate ObjectId
    const idValidation = validateObjectId(id);
    if (!idValidation.isValid) {
      return NextResponse.json(
        { success: false, error: idValidation.error },
        { status: 400 }
      );
    }
    
    const result = await collection.deleteOne({
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Subscription deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete subscription' },
      { status: 500 }
    );
  }
}
