import { IUser } from './user.interface.ts';
import User from './user.model.ts';

const saveProfileService = async (userId: string, payload: Partial<IUser>) => {
   await User.updateOne({ userID: userId }, { $set: payload }, { upsert: true });
   return null;
};

const readProfileService = async (userId: string) => {
   const data = await User.findById(userId);
   return data;
};


export const userService = {
  saveProfileService,
  readProfileService
}