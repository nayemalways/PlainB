import { randomUUID } from 'node:crypto';
import type { JwtPayload } from 'jsonwebtoken';
import { generateToken } from './TokenHelper.ts';
import { env } from '../config/config.ts';


export const createUserTokens = async (
  user: JwtPayload,
  options?: { familyId?: string; jti?: string },
) => {
  const familyId = options?.familyId ?? randomUUID();
  const jti = options?.jti ?? randomUUID();
  const jwtPayload = {
    userId: user?._id,
    email: user?.email,
    role: user?.role,
  };

  const accessToken = generateToken(jwtPayload, env.JWT_SECRET, env.JWT_EXPIRATION_TIME);
  const refreshToken = generateToken(
    { ...jwtPayload, familyId },
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRATION,
    { jwtid: jti },
  );

  return {
    accessToken,
    refreshToken,
    familyId,
    jti,
  };
};
