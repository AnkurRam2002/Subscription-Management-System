import { NextResponse } from 'next/server';
import { initializeDatabase, getCollection } from '@/lib/database';
import { createCategory } from '@/entities/Category';

export async function POST() {
  try {
    const collection = await getCollection('categories');

    // Check if categories already exist
    const existingCategories = await collection.find().toArray();
    
    if (existingCategories.length === 0) {
      // Create default categories
      const defaultCategoriesData = [
        { name: 'Streaming', description: 'Video and music streaming services', color: '#EF4444', icon: 'play' },
        { name: 'Software', description: 'Software subscriptions and licenses', color: '#3B82F6', icon: 'code' },
        { name: 'Cloud Storage', description: 'Cloud storage and backup services', color: '#06B6D4', icon: 'cloud' },
        { name: 'Productivity', description: 'Productivity and business tools', color: '#10B981', icon: 'chart' },
        { name: 'Gaming', description: 'Gaming subscriptions and services', color: '#F59E0B', icon: 'gamepad' },
        { name: 'News & Media', description: 'News, magazines, and media subscriptions', color: '#8B5CF6', icon: 'newspaper' },
        { name: 'Fitness', description: 'Fitness and health apps', color: '#EC4899', icon: 'heart' },
        { name: 'Education', description: 'Educational platforms and courses', color: '#84CC16', icon: 'book' },
        { name: 'Communication', description: 'Communication and messaging apps', color: '#6366F1', icon: 'message' },
        { name: 'Other', description: 'Other miscellaneous subscriptions', color: '#6B7280', icon: 'more' }
      ];

      const defaultCategories = defaultCategoriesData.map(data => createCategory(data.name, data.description, data.color, data.icon));
      await collection.insertMany(defaultCategories);
      
      return NextResponse.json({
        success: true,
        message: 'Database initialized with default categories',
        categories: defaultCategories
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'Database already initialized',
        categories: existingCategories
      });
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
