import { verifyToken } from '../utils/jwt.js';
import { getCollection } from '../lib/database.js';
import { ObjectId } from 'mongodb';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    const decoded = verifyToken(token);
    const usersCollection = await getCollection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    // Add user to request object
    req.user = {
      _id: user._id,
      email: user.email,
      name: user.name,
      provider: user.provider,
      avatar: user.avatar,
      preferences: user.preferences
    };

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      const usersCollection = await getCollection('users');
      const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });

      if (user) {
        req.user = {
          _id: user._id,
          email: user.email,
          name: user.name,
          provider: user.provider,
          avatar: user.avatar,
          preferences: user.preferences
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};
