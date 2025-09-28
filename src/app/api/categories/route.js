import { NextResponse } from 'next/server';
import { initializeDatabase, getCollection } from '@/lib/database';
import { createCategory } from '@/entities/Category';
import { validateCategory, sanitizeInput } from '@/utils/validation';

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const collection = await getCollection('categories');
    
    const categories = await collection.find().toArray();
    
    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request) {
  try {
    const collection = await getCollection('categories');
    
    const body = await request.json();
    
    // Sanitize input
    const sanitizedData = sanitizeInput(body);
    
    // Validate input
    const validation = validateCategory(sanitizedData);
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
    
    const category = createCategory(sanitizedData.name, sanitizedData.description, sanitizedData.color, sanitizedData.icon);
    
    const result = await collection.insertOne(category);
    const savedCategory = { ...category, _id: result.insertedId };
    
    return NextResponse.json({
      success: true,
      data: savedCategory
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
