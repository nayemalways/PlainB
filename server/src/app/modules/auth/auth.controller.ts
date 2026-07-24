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

const login = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const result = await authService.loginService(email);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Login OTP sent successfully',
    data: result,
  });
}) ;

const VerifyLoginOTP = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { otp, email } = req.body;
  const result = await authService.VerifyLoginOTP(email, otp);

  SetCookies(res, result);

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Verified',
    data: null
  })
});

const session = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Session retrieved successfully',
    data: {
      userId: user.userId,
      email: user.email,
      role: user.role,
    },
  });
});

const refresh = CatchAsync(async (req: Request, res: Response) => {
  const result = await authService.refreshSession(req.cookies?.refreshToken);
  SetCookies(res, result);
  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Session refreshed successfully',
    data: null,
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
  res.clearCookie('csrfToken', { ...shared, httpOnly: false, path: '/' });

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
    let redirectTo = req.query.state ? (req.query.state as string) : '';
    if (redirectTo.startsWith('/')) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user as JwtPayload;
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, 'User not found');
    const tokens = await authService.createOAuthSession(user);

    // Set cookies
    SetCookies(res, tokens);

    res.redirect(
        `${env.FRONTEND_URL}${redirectTo}`
      );
  }
);


export const authController = {
  login,
  VerifyLoginOTP,
  session,
  refresh,
  userLogout,
  googleRegister,
  googleCallback
};
