/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';
import { SendResponse } from '../../utility/SendResponse.ts';
import { brandServices } from './brand.service.ts';
import { CatchAsync } from '../../utility/CatchAsync.ts';
import AppError from '../../errorHelpers/appError.ts';
import { StatusCodes } from 'http-status-codes';

const getBrandList = CatchAsync(async (_req: Request, res: Response, next: NextFunction) => {
  const result = await brandServices.getBrandList();

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Brands retrieved successfully',
    data: result,
  });
});

const createBrand = CatchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const image = req.file?.path;
  if (!image) throw new AppError(StatusCodes.BAD_REQUEST, 'Brand image is required');

  const result = await brandServices.createBrand({ ...req.body, brandImg: image });

  SendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Brand created successfully',
    data: result,
  });
});

export const brandControllers = {
  getBrandList,
  createBrand,
};
