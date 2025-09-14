import { ObjectId } from 'mongodb';

export const createCategory = (name, description, color, icon) => {
  return {
    _id: new ObjectId(),
    name: name || '',
    description: description || '',
    color: color || '#3B82F6',
    icon: icon || 'more',
    createdAt: new Date(),
    updatedAt: new Date()
  };
};
