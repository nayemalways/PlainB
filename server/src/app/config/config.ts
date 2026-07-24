import dotenv from 'dotenv';
dotenv.config();

export interface IEnvironmentVariables {
  DATABASE_URL: string;
  NODE_ENV: string;
  PORT: number;

  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRATION: string;

  CLOUDINARY_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_SECRET: string;

  FRONTEND_URL: string;

  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_CURRENCY: string;

  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_PASSWORD: string;
  EMAIL_USER: string;
  EMAIL_FROM: string;
  EMAIL_SECURITY: boolean;

  ADMIN_EMAIL: string;

  REQUEST_LIMIT_TIME: number;
  REQUEST_LIMIT_NUMBER: number;

  WEB_CACHE: boolean;
  URL_ENCODED: boolean;
  MAX_JSON_SIZE: string;

  GOOGLE_OAUTH_ID: string;
  GOOGLE_OAUTH_SECRET: string;
  GOOGLE_CALLBACK_URL: string;

  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_USERNAME?: string;
  REDIS_PASSWORD?: string;
}

const ENVIRONMENT_KEYS: (keyof IEnvironmentVariables)[] = [
  'DATABASE_URL',
  'NODE_ENV',
  'PORT',

  'JWT_SECRET',
  'JWT_EXPIRATION_TIME',
  'JWT_REFRESH_SECRET',
  'JWT_REFRESH_EXPIRATION',

  'CLOUDINARY_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_SECRET',

  'FRONTEND_URL',

  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_CURRENCY',

  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_PASSWORD',
  'EMAIL_USER',
  'EMAIL_FROM',
  'EMAIL_SECURITY',

  'ADMIN_EMAIL',

  'REQUEST_LIMIT_TIME',
  'REQUEST_LIMIT_NUMBER',

  'WEB_CACHE',
  'URL_ENCODED',
  'MAX_JSON_SIZE',

  'GOOGLE_OAUTH_ID',
  'GOOGLE_OAUTH_SECRET',
  'GOOGLE_CALLBACK_URL',

  'REDIS_HOST',
  'REDIS_PORT',
];

const parsePositiveNumber = (value: string, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseDuration = (value: string, fallback: number): number => {
  const match = value.trim().match(/^(\d+)(ms|s|m|h)?$/i);
  if (!match) return fallback;

  const multipliers = { ms: 1, s: 1000, m: 60_000, h: 3_600_000 };
  const unit = (match[2]?.toLowerCase() ?? 'ms') as keyof typeof multipliers;
  return Number(match[1]) * multipliers[unit];
};

export default function loadEnvironmentVariables(): IEnvironmentVariables {
  const environment = {} as Record<keyof IEnvironmentVariables, string>;

  for (const key of ENVIRONMENT_KEYS) {
    const value = process.env[key];

    if (!value) {
      throw new Error(`${key} is missing`);
    }

    environment[key] = value;
  }

  return {
    ...environment,
    PORT: parsePositiveNumber(environment.PORT, 3000),
    STRIPE_CURRENCY: environment.STRIPE_CURRENCY.toLowerCase(),
    FRONTEND_URL: environment.FRONTEND_URL
      .replace(/^https:\/\/(localhost|127\.0\.0\.1)(?=[:/]|$)/i, 'http://$1')
      .replace(/\/+$/, ''),
    EMAIL_SECURITY: environment.EMAIL_SECURITY === 'true',
    REQUEST_LIMIT_TIME: parseDuration(environment.REQUEST_LIMIT_TIME, 60_000),
    REQUEST_LIMIT_NUMBER: parsePositiveNumber(environment.REQUEST_LIMIT_NUMBER, 100),
    WEB_CACHE: environment.WEB_CACHE === 'true',
    URL_ENCODED: environment.URL_ENCODED === 'true',
    REDIS_PORT: parsePositiveNumber(environment.REDIS_PORT, 6379),
    REDIS_USERNAME: process.env.REDIS_USERNAME || undefined,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || undefined,
  };
}

export const env = loadEnvironmentVariables();
