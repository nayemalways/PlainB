/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { SendResponse } from '../../utility/sendResponse.ts';
import { authService } from './auth.service.ts';
import { CatchAsync } from '../../utility/CatchAsync.ts';
import { SetCookies } from '../../utility/setCookies.ts';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/appError.ts';
import { JwtPayload } from 'jsonwebtoken';
import { env } from '../../config/config.ts';
import passport from 'passport';
import User from '../user/user.model.ts';

// GET CSRF TOKEN
const csrfToken = CatchAsync(async (req: Request, res: Response) => {
  res.header('Cache-Control', 'no-cache');
  
  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'CSRF token retrieved.',
    data: { csrfToken: req.cookies?.csrfToken ?? null },
  });
});

// SESSION MANAGEMENT
const session = CatchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user.userId).select('+password');
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Session retrieved successfully',
    data: {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.cus_address?.cus_name ?? '',
      profilePhoto: user.profilePhoto ?? null,
      canChangePassword:
        Boolean(user.password) && user.auths.some((auth) => auth.provider === 'credentials'),
      csrfToken: req.cookies?.csrfToken ?? null,
    },
  });
});

// GENERATE REFRESH
const refresh = CatchAsync(async (req: Request, res: Response) => {
  const result = await authService.refreshSession(req.cookies?.refreshToken);
  SetCookies(res, result);
  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Session refreshed successfully',
    data: { csrfToken: result.csrfToken },
  });
});

// LOGOUT
const userLogout = CatchAsync(async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const shared = { secure: isProduction, sameSite: isProduction ? 'none' : 'lax' } as const;
  await authService.revokeSession(req.cookies?.refreshToken);
  res.clearCookie('accessToken', { ...shared, httpOnly: true, path: '/' });
  res.clearCookie('refreshToken', {
    ...shared,
    httpOnly: true,
    path: '/api/v2/auth',
  });
  res.clearCookie('csrfToken', { ...shared, httpOnly: true, path: '/' });

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Logout successful',
    data: null,
  });
}) ;

// REGISTER WITH GOOGLE
const googleRegister = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = (req.query?.redirectTo as string) || '/';

    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: redirect,
      prompt: 'consent select_account',
      session: false,
    })(req, res, next);
  }
);

//  GOOGLE CALLBACK
const googleCallback = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const redirectTo = req.query.state ? (req.query.state as string) : '/';

    const user = req.user as JwtPayload;
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, 'User not found');
    const tokens = await authService.createAuthSession(user);

    // Set cookies
    SetCookies(res, tokens);

    const safePath = redirectTo.startsWith('/') && !redirectTo.startsWith('//')
      ? redirectTo
      : '/';
    res.redirect(new URL(safePath, `${env.FRONTEND_URL}/`).toString());
  }
);

// CREDENTIALS LOGIN
const credentialsLogin = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', async (err: any, user: any, info: any) => {
      try {
        if (err) return next(err);
        if (!user) {
          return next(
            new AppError(StatusCodes.UNAUTHORIZED, info?.message ?? 'Invalid email or password.'),
          );
        }

        const tokens = await authService.createAuthSession(user);
        SetCookies(res, tokens);

        SendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Login successful',
          data: { csrfToken: tokens.csrfToken },
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  }
);


export const authController = {
  csrfToken,
  session,
  refresh,
  userLogout,
  googleRegister,
  googleCallback,
  credentialsLogin
};
