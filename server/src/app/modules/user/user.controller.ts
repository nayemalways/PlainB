/* eslint-disable @typescript-eslint/no-unused-vars */
import { SendResponse } from '../../utility/sendResponse.ts';
import { NextFunction, Request, Response } from 'express';
import { userService } from './user.service.ts';
import { JwtPayload } from 'jsonwebtoken';
import { CatchAsync } from '../../utility/CatchAsync.ts';



const saveProfile = CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.user;
  const payload  = req.body;
  const result = await userService.saveProfileService(userId, payload);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Profile saved',
    data: result,
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

export const userControllers = {
  saveProfile,
  readProfile
}
