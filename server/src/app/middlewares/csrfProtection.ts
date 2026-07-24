import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../errorHelpers/appError.ts';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const EXEMPT_PATHS = new Set(['/api/v2/auth/login', '/api/v2/auth/verify']);

export const csrfProtection = (req: Request, _res: Response, next: NextFunction) => {
  const legacyLogout = req.method === 'GET' && req.path === '/api/v2/auth/logout';
  if ((SAFE_METHODS.has(req.method) && !legacyLogout) || EXEMPT_PATHS.has(req.path)) {
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
