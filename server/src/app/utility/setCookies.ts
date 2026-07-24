import { Response } from 'express';
import { env } from '../config/config.ts';

interface AuthTokenInfo {
  accessToken?: string;
  refreshToken?: string;
  csrfToken?: string;
}

const durationToMs = (value: string | undefined, fallback: number) => {
  const match = value?.trim().match(/^(\d+)(ms|s|m|h|d)$/i);
  if (!match) return fallback;
  const units = { ms: 1, s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return Number(match[1]) * units[match[2]!.toLowerCase() as keyof typeof units];
};

export const SetCookies = (res: Response, tokenInfo: AuthTokenInfo) => {
  const isProduction = env.NODE_ENV === 'production';

  if (tokenInfo.accessToken) {
    res.cookie('accessToken', tokenInfo.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: durationToMs(env.JWT_EXPIRATION_TIME, 60 * 60 * 1000),
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie('refreshToken', tokenInfo.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/api/v2/auth',
      maxAge: durationToMs(env.JWT_REFRESH_EXPIRATION, 7 * 24 * 60 * 60 * 1000),
    });
  }

  if (tokenInfo.csrfToken) {
    res.cookie('csrfToken', tokenInfo.csrfToken, {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: durationToMs(env.JWT_REFRESH_EXPIRATION, 7 * 24 * 60 * 60 * 1000),
    });
  }
};

