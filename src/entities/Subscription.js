import { ObjectId } from 'mongodb';

export const createSubscription = (data = {}) => {
  return {
    _id: new ObjectId(),
    name: data.name || '',
    description: data.description || '',
    price: data.price || 0,
    currency: data.currency || 'USD',
    billingCycle: data.billingCycle || 'monthly',
    nextBillingDate: data.nextBillingDate || new Date(),
    status: data.status || 'active',
    categoryId: data.categoryId || '',
    userId: data.userId || '',
    serviceUrl: data.serviceUrl || '',
    logo: data.logo || '',
    notes: data.notes || '',
    autoRenew: data.autoRenew !== undefined ? data.autoRenew : true,
    // Shared subscription fields
    sharedBy: data.sharedBy || 1, // Number of people sharing this subscription
    // Free trial fields
    hasFreeTrial: data.hasFreeTrial || false,
    freeTrialMonths: data.freeTrialMonths || 0,
    freeTrialStartDate: data.freeTrialStartDate || null,
    paidSubscriptionStartDate: data.paidSubscriptionStartDate || null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};
