import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/database';

// GET /api/data - Get all data (subscriptions + categories) in a single request with pagination
export async function GET(request) {
  try {
    // Get both collections
    const [subscriptionsCollection, categoriesCollection] = await Promise.all([
      getCollection('subscriptions'),
      getCollection('categories')
    ]);
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50; // Default 50 items per page
    const skip = (page - 1) * limit;

    // Build query for subscriptions
    let subscriptionsQuery = {};
    
    if (userId) {
      subscriptionsQuery.userId = userId;
    }
    
    if (status) {
      subscriptionsQuery.status = status;
    }
    
    if (categoryId) {
      subscriptionsQuery.categoryId = categoryId;
    }

    // Fetch data with pagination
    const [subscriptions, categories, totalSubscriptions] = await Promise.all([
      // Paginated subscriptions with field selection for better performance
      subscriptionsCollection
        .find(subscriptionsQuery, {
          projection: {
            name: 1,
            price: 1,
            currency: 1,
            billingCycle: 1,
            status: 1,
            categoryId: 1,
            nextBillingDate: 1,
            serviceUrl: 1,
            sharedBy: 1,
            hasFreeTrial: 1,
            createdAt: 1,
            updatedAt: 1
            // Exclude large fields like description, images, etc.
          }
        })
        .sort({ createdAt: 1 }) // Sort by oldest first
        .skip(skip)
        .limit(limit)
        .toArray(),
      
      // Categories (usually small, no pagination needed)
      categoriesCollection
        .find({}, {
          projection: {
            name: 1,
            description: 1,
            color: 1,
            icon: 1,
            createdAt: 1
          }
        })
        .toArray(),
      
      // Get total count for pagination
      subscriptionsCollection.countDocuments(subscriptionsQuery)
    ]);
    
    const totalPages = Math.ceil(totalSubscriptions / limit);
    
    return NextResponse.json({
      success: true,
      data: {
        subscriptions,
        categories
      },
      pagination: {
        page,
        limit,
        total: totalSubscriptions,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      meta: {
        timestamp: new Date().toISOString(),
        subscriptionsCount: subscriptions.length,
        categoriesCount: categories.length
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
