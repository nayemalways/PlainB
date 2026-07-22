import type { Request, Response } from 'express';
import { SendResponse } from '../../utility/SendResponse.ts';
import { categoryServices } from './category.service.ts';

const getCategoryList = async (_req: Request, res: Response) => {
  const result = await categoryServices.getCategoryList();

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Categories retrieved successfully',
    data: result,
  });
};

export const categoryControllers = {
  getCategoryList,
};
