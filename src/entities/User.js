import { ObjectId } from 'mongodb';

export const createUser = (email, password, name) => {
  return {
    _id: new ObjectId(),
    email: email || '',
    password: password || '',
    name: name || '',
    avatar: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };
};
