import mongoose from 'mongoose';
import { IAuthProvider, IsActiveUser, IUser, Role } from './user.interface.ts';


const authProviderSchema = new mongoose.Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    _id: false,
    versionKey: false
});

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: {},
    otp: { type: Number, default: 0 },
    isActive: { type: String, enum: IsActiveUser, default: IsActiveUser.ACTIVE },
    role: { type: String, enum: Role, default: Role.USER },
    isDeleted: {type: Boolean, default: false},
    auths: [authProviderSchema],

    cus_address: {
      cus_address: { type: String },
      cus_city: { type: String },
      cus_country: { type: String },
      cus_fax: { type: String },
      cus_name: { type: String },
      cus_phone: { type: String },
      cus_postcode: { type: String },
      cus_state: { type: String },
    },

    ship_address: {
      ship_address: { type: String },
      ship_city: { type: String },
      ship_country: { type: String },
      ship_name: { type: String },
      ship_phone: { type: String },
      ship_postcode: { type: String },
      ship_state: { type: String },
    },
  },

  { timestamps: true, versionKey: false },
);

const User = mongoose.model<IUser>('user', userSchema);

// Export Data Model
export default User;
