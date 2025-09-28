import { MongoClient } from 'mongodb';

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
        maxPoolSize: 10, // Maximum number of connections in the pool
        serverSelectionTimeoutMS: 5000, // How long to try selecting a server
        socketTimeoutMS: 45000, // How long to wait for a response
        connectTimeoutMS: 10000, // How long to wait for initial connection
        maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
        retryWrites: true, // Retry failed writes
        retryReads: true, // Retry failed reads
      });
      
      await client.connect();
      db = client.db('subscription-management');
      console.log('Database connection established successfully with connection pooling');
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
