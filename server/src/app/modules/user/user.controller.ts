/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SaveProfileService,
  ReadProfileService,
} from './user.service.ts';
import { SendResponse } from '../../utility/SendResponse.ts';
import { NextFunction, Request, Response } from 'express';



const saveProfile = async (req: Request, res: Response, next: NextFunction) => {
  const result = await SaveProfileService(req);
  SendResponse(res, {
    success: true,

    statusCode: 200,

    message: 'Profile saved',

    data: result,
  });
};

const readProfile = async (req: Request, res: Response, next: NextFunction) => {
  const result = await ReadProfileService(req);
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
