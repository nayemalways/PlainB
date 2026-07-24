import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../errorHelpers/appError.ts';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const EXEMPT_PATHS = new Set([
  '/api/v2/auth/login',
  '/api/v2/user/register',
  '/api/v2/user/verify-email',
  '/api/v2/register',
  '/api/v2/verify-email',
]);

export const csrfProtection = (req: Request, _res: Response, next: NextFunction) => {
  const normalizedPath = req.path.replace(/\/+$/, '') || '/';
  const legacyLogout = req.method === 'GET' && normalizedPath === '/api/v2/auth/logout';
  if (
    (SAFE_METHODS.has(req.method) && !legacyLogout) ||
    EXEMPT_PATHS.has(normalizedPath)
  ) {
    next();
    return;
  }

  const cookieToken = req.cookies?.csrfToken;
  const headerToken = req.get('x-csrf-token');

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    next(new AppError(StatusCodes.FORBIDDEN, 'Invalid CSRF token.'));
    return;
  }

  next();
};
