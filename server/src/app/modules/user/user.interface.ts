import { Types } from 'mongoose';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum IsActiveUser {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

export interface IAuthProvider {
    provider: "credentials" | "google" | "apple",
    providerId: string;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  otp?: number;
  password?: string;
  auths: IAuthProvider[];
  isActive?: IsActiveUser;
  isDeleted?: boolean;
  role?: Role;

  cus_address: {
    cus_address: string;
    cus_city: string;
    cus_country: string;
    cus_fax?: string;
    cus_name: string;
    cus_phone: string;
    cus_postcode: string;
    cus_state: string;
  };

  ship_address: {
    ship_address: string;
    ship_city: string;
    ship_country: string;
    ship_name: string;
    ship_phone: string;
    ship_postcode: string;
    ship_state: string;
  };
}
