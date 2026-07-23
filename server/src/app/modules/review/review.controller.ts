import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CatchAsync } from '../../utility/CatchAsync.ts';
import { SendResponse } from '../../utility/sendResponse.ts';
import type { ICreateReview } from './review.interface.ts';
import { reviewServices } from './review.service.ts';

const getReviewsByProduct = CatchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await reviewServices.getReviewsByProduct(String(req.params.productId));

    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product reviews retrieved successfully',
      data: result,
    });
  },
);

const createReview = CatchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await reviewServices.createReview(
      req.user.userId,
      req.body as ICreateReview,
    );

    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Product review created successfully',
      data: result,
    });
  },
);

export const reviewControllers = {
  getReviewsByProduct,
  createReview,
};
