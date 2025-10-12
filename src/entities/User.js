import bcrypt from 'bcryptjs';

export const createUser = (userData) => {
  const {
    email,
    password,
    name,
    googleId = null,
    avatar = null,
    provider = 'local' // 'local' or 'google'
  } = userData;

  const user = {
    email: email.toLowerCase().trim(),
    name: name.trim(),
    provider,
    googleId,
    avatar,
    isEmailVerified: provider === 'google', // Google users are pre-verified
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    preferences: {
      currency: 'INR',
      theme: 'light',
      notifications: {
        email: true,
        push: false
      }
    },
    subscriptionCount: 0,
    totalSpending: 0
  };

  // Only hash password for local users
  if (provider === 'local' && password) {
    user.password = bcrypt.hashSync(password, 12);
  }

  return user;
};

export const validateUser = (userData) => {
  const errors = [];

  if (!userData.email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.push('Email must be valid');
  }

  if (userData.provider === 'local') {
    if (!userData.password) {
      errors.push('Password is required');
    } else if (userData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
  }

  if (!userData.name || userData.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};
