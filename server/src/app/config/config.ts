import dotenv from 'dotenv';
dotenv.config();

const parsePositiveNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseDuration = (value: string | undefined, fallback: number): number => {
  const match = value?.trim().match(/^(\d+)(ms|s|m|h)?$/i);
  if (!match) return fallback;

  const multipliers = { ms: 1, s: 1000, m: 60_000, h: 3_600_000 };
  const unit = (match[2]?.toLowerCase() ?? 'ms') as keyof typeof multipliers;
  return Number(match[1]) * multipliers[unit];
};

// DATABASE INFO
export const DATABASE_URL = process.env.DATABASE_URL;
export const NODE_ENV = process.env.NODE_ENV;

//  JWT CONFIG
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRATIONS_TIME = process.env.JWT_EXPIRATION_TIME;

export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION;

export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;

export const FRONTEND_URL = process.env.FRONTEND_URL;

// EMAIL CONFIG
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_SECURITY = false;

// ADMIN CONFIG
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// RATE LIMITING
export const REQUEST_LIMIT_TIME = parseDuration(process.env.REQUEST_LIMIT_TIME, 60_000);
export const REQUEST_LIMIT_NUMBER = parsePositiveNumber(process.env.REQUEST_LIMIT_NUMBER, 100);

// WEB CACHE
export const WEB_CACHE = false;

// URL ENCODE
export const URL_ENCODED = process.env.URL_ENCODED === 'true';

// MAXIMUM JSON SIZE
export const MAX_JSON_SIZE = process.env.MAX_JSON_SIZE;

// PORT
export const PORT = Number(process.env.PORT) || 3000;
