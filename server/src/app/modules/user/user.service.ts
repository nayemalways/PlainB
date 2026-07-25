import { createHmac, randomInt } from 'node:crypto';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { IUser } from './user.interface.ts';
import User from './user.model.ts';
import AppError from '../../errorHelpers/appError.ts';
import { env } from '../../config/config.ts';
import { redis } from '../../config/redis.config.ts';
import { sendEmail } from '../../utility/EmailSender.ts';
import { authService } from '../auth/auth.service.ts';
import type { ICreateUserInput, IVerifyEmailInput } from './user.validation.ts';
import type {
  IChangePasswordInput,
  IUpdateProfileInput,
} from './user.validation.ts';
import { deleteImageFromCloudinary } from '../../config/cloudinary.config.ts';


const OTP_TTL_SECONDS = 10 * 60;
const otpKey = (email: string) => `plainb:email-verification:${email}`;
const hashOtp = (email: string, otp: string) =>
  createHmac('sha256', env.JWT_SECRET).update(`${email}:${otp}`).digest('hex');



// REGISTER USER
const registerUser = async (payload: ICreateUserInput, profilePhoto?: string) => {
  const existingUser = await User.exists({ email: payload.email });
  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, 'An account with this email already exists.');
  }

  let user: InstanceType<typeof User> | undefined;
  const key = otpKey(payload.email);

  // create user
  try {
    user = await User.create({
      email: payload.email,
      password: payload.password,
      profilePhoto,
      isVerified: false,
      auths: [{ provider: 'credentials', providerId: payload.email }],
      cus_address: { cus_name: payload.name },
    });

    // send profile verification otp via email
    const otp = randomInt(100000, 1000000).toString();
    await redis.set(key, hashOtp(payload.email, otp), 'EX', OTP_TTL_SECONDS);
    await sendEmail({
      to: payload.email,
      subject: 'Verify your PlainB account',
      text: `Your PlainB verification code is ${otp}. It expires in 10 minutes.`,
      template: 'otp',
      data: { otp: Number(otp) },
    });

    return { email: user.email };
  } catch (error: unknown) {
    await Promise.allSettled([
      redis.del(key),
      ...(user ? [User.deleteOne({ _id: user._id })] : []),
    ]);

    throw error;
  }
};

// VERIFY USER
const verifyEmail = async (payload: IVerifyEmailInput) => {
  const key = otpKey(payload.email);
  const submittedHash = hashOtp(payload.email, payload.otp);
  const consumed = await redis.eval(
    `local value = redis.call('GET', KEYS[1])
     if value == ARGV[1] then
       redis.call('DEL', KEYS[1])
       return 1
     end
     return 0`,
    1,
    key,
    submittedHash,
  );

  if (consumed !== 1) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Verification code is invalid or expired.');
  }

  const user = await User.findOneAndUpdate(
    { email: payload.email, isVerified: false },
    { $set: { isVerified: true } },
    { new: true },
  );
  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Verification code is invalid or expired.');
  }

  return authService.createAuthSession(user);
};

const toProfileDto = (user: IUser) => ({
  email: user.email,
  profilePhoto: user.profilePhoto ?? null,
  cus_address: user.cus_address ?? {},
  ship_address: user.ship_address ?? {},
});

// UPDATE USER PROFILE
const saveProfileService = async (
  userId: string,
  payload: IUpdateProfileInput,
  profilePhoto?: string,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');

  const previousPhoto = user.profilePhoto;
  const currentProfile = user.toObject();
  if (payload.cus_address) {
    user.set('cus_address', {
      ...(currentProfile.cus_address ?? {}),
      ...payload.cus_address,
    });
  }
  if (payload.ship_address) {
    user.set('ship_address', {
      ...(currentProfile.ship_address ?? {}),
      ...payload.ship_address,
    });
  }
  if (profilePhoto) user.profilePhoto = profilePhoto;
  await user.save();

  if (profilePhoto && previousPhoto && previousPhoto !== profilePhoto) {
    await deleteImageFromCloudinary(previousPhoto).catch(() => undefined);
  }
  return toProfileDto(user);
};

// GET USER PROFILE
const readProfileService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
  return toProfileDto(user);
};

// CHANGE PASSWORD
const changePassword = async (userId: string, payload: IChangePasswordInput) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');

  const hasCredentials = user.auths.some((auth) => auth.provider === 'credentials');
  if (!hasCredentials || !user.password) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Password changes are unavailable for this account.',
    );
  }

  const matches = await bcrypt.compare(payload.currentPassword, user.password);
  if (!matches) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Current password is incorrect.');
  }

  user.password = payload.newPassword;
  await user.save();
  await authService.revokeAllSessions(userId);
  return authService.createAuthSession(user);
};

export const userService = {
  registerUser,
  verifyEmail,
  saveProfileService,
  readProfileService,
  changePassword,
}
