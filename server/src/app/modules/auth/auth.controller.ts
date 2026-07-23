/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { SendResponse } from '../../utility/sendResponse.ts';
import { authService } from './auth.service.ts';
import { CatchAsync } from '../../utility/CatchAsync.ts';
import { SetCookies } from '../../utility/setCookies.ts';
import { StatusCodes } from 'http-status-codes';

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
})

// LOGOUT
const userLogout = CatchAsync(async (req, res) => {
  const cookieOptions = { expires: new Date(Date.now() - 24 * 60 * 60 * 1000), httpOnly: false };
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Logout successful',
    data: null,
  });
}) ;

export const authController = {
  login,
  VerifyLoginOTP,
  userLogout
};
