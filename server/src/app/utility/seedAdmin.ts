import { z } from 'zod';
import User from '../modules/user/user.model.ts';
import { IsActiveUser, Role } from '../modules/user/user.interface.ts';
import { env } from '../config/config.ts';

const adminEmailSchema = z.string().trim().toLowerCase().email();

export const seedAdmin = async (): Promise<void> => {
  const result = adminEmailSchema.safeParse(env.ADMIN_EMAIL);

  if (!result.success) {
    throw new Error('ADMIN_EMAIL must be set to a valid email address');
  }

  const email = result.data;

  await User.updateOne(
    { email },
    {
      $set: {
        role: Role.ADMIN,
        isActive: IsActiveUser.ACTIVE,
        isDeleted: false,
      },
      $setOnInsert: {
        email,
        otp: 0,
      },
    },
    { upsert: true, runValidators: true },
  );

  console.log('Admin account is ready');
};
