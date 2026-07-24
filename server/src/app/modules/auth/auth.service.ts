import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/appError.ts';
import { sendEmail } from '../../utility/EmailSender.ts';
import { createUserTokens } from '../../utility/generateAuthTokens.ts';
import { verifyToken } from '../../utility/TokenHelper.ts';
import User from '../user/user.model.ts';
import RefreshSession from './refresh-session.model.ts';
import { env } from '../../config/config.ts';

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
const createCsrfToken = () => randomBytes(32).toString('hex');

const saveRefreshSession = async (
  userId: string,
  refreshToken: string,
  jti: string,
  familyId: string,
) => {
  const compromisedFamily = await RefreshSession.exists({
    familyId,
    reuseDetectedAt: { $exists: true },
  });
  if (compromisedFamily) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Refresh session has been revoked.');
  }

  const payload = verifyToken(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
  await RefreshSession.create({
    userId,
    jti,
    familyId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date((payload.exp ?? 0) * 1000),
  });
};

const loginService = async (email: string) => {
  const code = Math.floor(100000 + Math.random() * 900000);

    await sendEmail({
      to: email,
      subject: 'Your PlainB login code',
      text: `Your PlainB login code is ${code}. Never share this code with anyone.`,
      template: 'otp',
      data: { otp: code },
    });

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
  await saveRefreshSession(
    data._id.toString(),
    userTokens.refreshToken,
    userTokens.jti,
    userTokens.familyId,
  );
  await User.updateOne({ email }, { otp: 0 });
  return { ...userTokens, csrfToken: createCsrfToken() };
};

const refreshSession = async (refreshToken?: string) => {
  if (!refreshToken) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Refresh token is required.');
  }

  let payload: JwtPayload;
  try {
    payload = verifyToken(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
  } catch {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Refresh token is invalid or expired.');
  }

  const jti = payload.jti;
  const familyId = payload.familyId as string | undefined;
  const userId = payload.userId as string | undefined;
  if (!jti || !familyId || !userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Refresh token is invalid.');
  }

  const existing = await RefreshSession.findOne({ jti });
  if (!existing || existing.revokedAt || existing.tokenHash !== hashToken(refreshToken)) {
    await RefreshSession.updateMany(
      { familyId, revokedAt: { $exists: false } },
      { $set: { revokedAt: new Date(), reuseDetectedAt: new Date() } },
    );
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Refresh token reuse detected.');
  }

  const user = await User.findById(userId);
  if (!user || user.isDeleted || user.isActive === 'INACTIVE' || user.isActive === 'BLOCKED') {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Session is no longer valid.');
  }

  const nextJti = randomUUID();
  const tokens = await createUserTokens(user, { familyId, jti: nextJti });
  const rotated = await RefreshSession.findOneAndUpdate(
    { _id: existing._id, revokedAt: { $exists: false } },
    { $set: { revokedAt: new Date(), rotatedTo: nextJti } },
  );
  if (!rotated) {
    await RefreshSession.updateMany(
      { familyId, revokedAt: { $exists: false } },
      { $set: { revokedAt: new Date(), reuseDetectedAt: new Date() } },
    );
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Refresh token reuse detected.');
  }

  await saveRefreshSession(userId, tokens.refreshToken, nextJti, familyId);
  return { ...tokens, csrfToken: createCsrfToken() };
};

const revokeSession = async (refreshToken?: string) => {
  if (!refreshToken) return;
  try {
    const payload = verifyToken(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
    if (payload.familyId) {
      await RefreshSession.updateMany(
        { familyId: payload.familyId, revokedAt: { $exists: false } },
        { $set: { revokedAt: new Date() } },
      );
    }
  } catch {
    // Cookies are still cleared when an already-invalid token is supplied.
  }
};

export const authService = {
  loginService,
  VerifyLoginOTP,
  refreshSession,
  revokeSession,
};
