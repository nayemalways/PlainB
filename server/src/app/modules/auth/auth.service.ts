import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/appError.ts';
import { sendEmail } from '../../utility/EmailSender.ts';
import { createUserTokens } from '../../utility/generateAuthTokens.ts';
import User from '../user/user.model.ts';

const loginService = async (email: string) => {
  const code = Math.floor(100000 + Math.random() * 900000);

  try {
    await sendEmail({
      to: email,
      subject: 'Your PlainB login code',
      text: `Your PlainB login code is ${code}. Never share this code with anyone.`,
      template: 'otp',
      data: { otp: code },
    });
  } catch {
    throw new AppError(StatusCodes.BAD_REQUEST, 'OTP could not be sent.');
  }

  await User.updateOne({ email }, { $set: { otp: code } }, { upsert: true });
  return null;
};

const VerifyLoginOTP = async (email: string, otp: string) => {
  if (!email || !otp) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email and OTP are required.');
  }

  const data = await User.findOne({ email, otp });
  if (!data) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials.');
  }

  const userTokens = await createUserTokens(data);
  await User.updateOne({ email }, { otp: 0 });
  return userTokens;
};

export const authService = {
  loginService,
  VerifyLoginOTP,
};
