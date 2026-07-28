import { z } from 'zod';
import User from '../modules/user/user.model.ts';
import { IsActiveUser, Role } from '../modules/user/user.interface.ts';
import { env } from '../config/config.ts';

const adminEmailSchema = z.string().trim().toLowerCase().email();
const adminPasswordSchema = z
  .string()
  .min(8, 'ADMIN_PASSWORD must contain at least 8 characters')
  .refine((password) => Buffer.byteLength(password, 'utf8') <= 72, {
    message: 'ADMIN_PASSWORD must not exceed 72 bytes',
  });

export const seedAdmin = async (): Promise<void> => {
  const emailResult = adminEmailSchema.safeParse(env.ADMIN_EMAIL);
  const passwordResult = adminPasswordSchema.safeParse(env.ADMIN_PASSWORD);

  if (!emailResult.success) {
    throw new Error('ADMIN_EMAIL must be set to a valid email address');
  }
  if (!passwordResult.success) {
    throw new Error(passwordResult.error.issues[0]?.message ?? 'ADMIN_PASSWORD is invalid');
  }

  const email = emailResult.data;
  const admin = await User.findOne({ email }).select('+password');

  if (!admin) {
    await User.create({
      email,
      password: passwordResult.data,
      auths: [{ provider: 'credentials', providerId: email }],
      role: Role.ADMIN,
      isActive: IsActiveUser.ACTIVE,
      isDeleted: false,
      isVerified: true,
    });
  } else {
    admin.role = Role.ADMIN;
    admin.isActive = IsActiveUser.ACTIVE;
    admin.isDeleted = false;
    admin.isVerified = true;

    if (!admin.password) {
      admin.password = passwordResult.data;
    }
    if (!admin.auths.some((auth) => auth.provider === 'credentials')) {
      admin.auths.push({ provider: 'credentials', providerId: email });
    }

    await admin.save();
  }

  console.log('Admin account is ready');
};
