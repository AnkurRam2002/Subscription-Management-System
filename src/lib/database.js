import { MongoClient } from 'mongodb';

console.log('=== DATABASE MODULE LOADED ===');
console.log('Module loaded at:', new Date().toISOString());
console.log('Environment check on load:');
console.log('MONGODB_URI on module load:', process.env.MONGODB_URI);
console.log('JWT_SECRET on module load:', process.env.JWT_SECRET);
console.log('TEST on module load:', process.env.TEST_VAR);
console.log('================================');

let client = null;
let db = null;

export const initializeDatabase = async () => {
  if (!client || !db) {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/subscription-management';
      console.log('MongoDB URI:', uri);
      console.log('Connecting to MongoDB...');
      
      // Connection pooling configuration for better performance
      client = new MongoClient(uri, {
        maxPoolSize: 10, 
        serverSelectionTimeoutMS: 5000, 
        socketTimeoutMS: 45000, 
        connectTimeoutMS: 10000, 
        maxIdleTimeMS: 30000, 
        retryWrites: true, 
        retryReads: true, 
      });
      
      await client.connect();
      db = client.db('subscription-management');
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Error during database initialization:', error);
      // Reset variables on error
      client = null;
      db = null;
      throw error;
    }
  }
  
  if (!db) {
    throw new Error('Database connection failed - db is null');
  }
  
  return db;
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
};

export const getCollection = async (collectionName) => {
  try {
    const database = await initializeDatabase();
    if (!database) {
      throw new Error('Database is null after initialization');
    }
    return database.collection(collectionName);
  } catch (error) {
    console.error('Error getting collection:', collectionName, error);
    throw error;
  }
};

export const closeDatabase = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};
