/* eslint-disable @typescript-eslint/no-unused-vars */
import { SendResponse } from '../../utility/sendResponse.ts';
import { NextFunction, Request, Response } from 'express';
import { userService } from './user.service.ts';
import { JwtPayload } from 'jsonwebtoken';
import { CatchAsync } from '../../utility/CatchAsync.ts';
import { StatusCodes } from 'http-status-codes';
import { SetCookies } from '../../utility/setCookies.ts';
import type { IUserListQuery } from './user.interface.ts';

const registerUser = CatchAsync(async (req: Request, res: Response) => {
  const result = await userService.registerUser(req.body, req.file?.path);
  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Account created. Check your email for the verification code.',
    data: result,
  });
});

const verifyEmail = CatchAsync(async (req: Request, res: Response) => {
  const tokens = await userService.verifyEmail(req.body);
  SetCookies(res, tokens);
  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Email verified successfully.',
    data: { csrfToken: tokens.csrfToken },
  });
});

const saveProfile = CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.user;
  const payload  = req.body;
  const result = await userService.saveProfileService(userId, payload, req.file?.path);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Profile saved',
    data: result,
  });
});

const changePassword = CatchAsync(async (req: Request, res: Response) => {
  const tokens = await userService.changePassword(req.user.userId, req.body);
  SetCookies(res, tokens);
  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Password changed successfully.',
    data: { csrfToken: tokens.csrfToken },
  });
});

const readProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.user as JwtPayload;
  const result = await userService.readProfileService(userId as string);
  return SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Profile retrieved',
    data: result,
  });
};

const listUsersForAdmin = CatchAsync(async (req: Request, res: Response) => {
  const query = req.query as IUserListQuery;
  const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit ?? '10', 10) || 10));
  const result = await userService.listUsersForAdmin(page, limit, query.search);

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Users retrieved successfully.',
    data: result,
  });
});

export const userControllers = {
  registerUser,
  verifyEmail,
  saveProfile,
  readProfile,
  listUsersForAdmin,
  changePassword,
}
