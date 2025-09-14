import { MongoClient } from 'mongodb';

let client = null;
let db = null;

export const initializeDatabase = async () => {
  if (!client || !db) {
    try {
      const uri = 'mongodb://localhost:27017/subscription-management';
      console.log('Connecting to MongoDB...');
      client = new MongoClient(uri);
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
