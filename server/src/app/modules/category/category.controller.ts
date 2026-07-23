import type { NextFunction, Request, Response } from 'express';
import { CatchAsync } from '../../utility/CatchAsync.ts';
import { SendResponse } from '../../utility/sendResponse.ts';
import type { ICategory } from './category.interface.ts';
import { categoryServices } from './category.service.ts';
import AppError from '../../errorHelpers/appError.ts';
import { StatusCodes } from 'http-status-codes';

const getCategoryList = CatchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
  const result = await categoryServices.getCategoryList();

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

const createCategory = CatchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const image = req.file?.path;
  if (!image) throw new AppError(StatusCodes.BAD_REQUEST, 'Category image is required');

  const payload = { ...req.body, categoryImg: image } as ICategory;
  const result = await categoryServices.createCategory(payload);

  SendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Category created successfully',
    data: result,
  });
});

export const categoryControllers = {
  getCategoryList,
  createCategory,
};
