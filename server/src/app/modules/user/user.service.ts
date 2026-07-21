import User from './user.model.ts';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

export const SaveProfileService = async (req) => {
  try {
    const user_id = req.headers['user_id'];
    const reqBody = req.body;

    /*----SET USER ID IN THE PROFILE-----*/
    reqBody.userID = user_id;

    /*-------CREATE OR UPDATE USER INFO WHETHER ALREADY USER CREATED OR NOT--------*/
    await User.updateOne({ userID: user_id }, { $set: reqBody }, { upsert: true });
    return { status: 'Success', message: 'Profile save success' };
  } catch (e) {
    console.log(e.toString());
    return { status: 'Error', message: 'Internal server error..!' };
  }
};

export const ReadProfileService = async (req) => {
  try {
    const user_id = new ObjectId(req.headers['user_id']);

    /*-------READ USER PROFILE'S---------*/
    const data = await User.aggregate([{ $match: { userID: user_id } }]);

    /*-------RETURN STATUS---------*/
    return { status: 'Success', data: data[0] };
  } catch (e) {
    console.log(e.toString());
    return { status: 'Error', message: 'Internal server error..!' };
  }
};
