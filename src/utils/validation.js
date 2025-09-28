// Input validation utilities for API routes

export const validateSubscription = (data) => {
  const errors = {};

  // Required fields
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'Name is required and must be a non-empty string';
  } else if (data.name.length > 100) {
    errors.name = 'Name must be less than 100 characters';
  }

  if (!data.price || typeof data.price !== 'number' || data.price <= 0) {
    errors.price = 'Price is required and must be a positive number';
  }

  if (!data.categoryId || typeof data.categoryId !== 'string' || data.categoryId.trim().length === 0) {
    errors.categoryId = 'Category ID is required';
  }

  if (!data.nextBillingDate) {
    errors.nextBillingDate = 'Next billing date is required';
  } else {
    const date = new Date(data.nextBillingDate);
    if (isNaN(date.getTime())) {
      errors.nextBillingDate = 'Invalid date format';
    }
  }

  // Optional fields with validation
  if (data.description && (typeof data.description !== 'string' || data.description.length > 500)) {
    errors.description = 'Description must be a string with less than 500 characters';
  }

  if (data.currency && !['USD', 'EUR', 'GBP', 'INR'].includes(data.currency)) {
    errors.currency = 'Currency must be one of: USD, EUR, GBP, INR';
  }

  if (data.billingCycle && !['monthly', 'yearly', 'weekly', 'daily'].includes(data.billingCycle)) {
    errors.billingCycle = 'Billing cycle must be one of: monthly, yearly, weekly, daily';
  }

  if (data.status && !['active', 'cancelled', 'paused', 'expired'].includes(data.status)) {
    errors.status = 'Status must be one of: active, cancelled, paused, expired';
  }

  if (data.serviceUrl && typeof data.serviceUrl === 'string') {
    try {
      new URL(data.serviceUrl);
    } catch {
      errors.serviceUrl = 'Invalid URL format';
    }
  }

  if (data.sharedBy && (typeof data.sharedBy !== 'number' || data.sharedBy < 1 || data.sharedBy > 100)) {
    errors.sharedBy = 'Shared by must be a number between 1 and 100';
  }

  if (data.notes && (typeof data.notes !== 'string' || data.notes.length > 1000)) {
    errors.notes = 'Notes must be a string with less than 1000 characters';
  }

  // Free trial validation
  if (data.hasFreeTrial) {
    if (typeof data.hasFreeTrial !== 'boolean') {
      errors.hasFreeTrial = 'hasFreeTrial must be a boolean';
    } else if (data.hasFreeTrial) {
      if (!data.freeTrialMonths || typeof data.freeTrialMonths !== 'number' || data.freeTrialMonths < 1 || data.freeTrialMonths > 24) {
        errors.freeTrialMonths = 'Free trial months must be a number between 1 and 24';
      }
      if (!data.freeTrialStartDate) {
        errors.freeTrialStartDate = 'Free trial start date is required when hasFreeTrial is true';
      } else {
        const date = new Date(data.freeTrialStartDate);
        if (isNaN(date.getTime())) {
          errors.freeTrialStartDate = 'Invalid free trial start date format';
        }
      }
      if (!data.paidSubscriptionStartDate) {
        errors.paidSubscriptionStartDate = 'Paid subscription start date is required when hasFreeTrial is true';
      } else {
        const date = new Date(data.paidSubscriptionStartDate);
        if (isNaN(date.getTime())) {
          errors.paidSubscriptionStartDate = 'Invalid paid subscription start date format';
        }
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCategory = (data) => {
  const errors = {};

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'Name is required and must be a non-empty string';
  } else if (data.name.length > 50) {
    errors.name = 'Name must be less than 50 characters';
  }

  if (data.description && (typeof data.description !== 'string' || data.description.length > 200)) {
    errors.description = 'Description must be a string with less than 200 characters';
  }

  if (data.color && typeof data.color !== 'string') {
    errors.color = 'Color must be a string';
  } else if (data.color && !/^#[0-9A-F]{6}$/i.test(data.color)) {
    errors.color = 'Color must be a valid hex color (e.g., #FF0000)';
  }

  if (data.icon && typeof data.icon !== 'string') {
    errors.icon = 'Icon must be a string';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateObjectId = (id) => {
  if (!id || typeof id !== 'string') {
    return { isValid: false, error: 'ID is required and must be a string' };
  }
  
  // MongoDB ObjectId validation (24 hex characters)
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return { isValid: false, error: 'Invalid ObjectId format' };
  }
  
  return { isValid: true };
};

export const sanitizeInput = (data) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Remove potentially dangerous characters and trim whitespace
      sanitized[key] = value.trim().replace(/[<>]/g, '');
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};
