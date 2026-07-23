import type { NextFunction, Request, Response } from 'express';
import { SendResponse } from '../../utility/sendResponse.ts';
import { CatchAsync } from '../../utility/CatchAsync.ts';
import AppError from '../../errorHelpers/appError.ts';
import { StatusCodes } from 'http-status-codes';
import type { IFeature } from './features.interface.ts';
import { featuresService } from './features.service.ts';

const createFeature = CatchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const image = req.file?.path;
    if (!image) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Feature image is required');
    }

    const payload = { ...req.body, img: image } as IFeature;
    const result = await featuresService.createFeatureService(payload);

    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Feature created successful',
      data: result,
    });
  },
);

// Features list
const featuresList = CatchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await featuresService.featuresListService();
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Features retrieved successful',
    data: result,
  });
});

// Legal Details
const legalDetails = CatchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await featuresService.legalDetailsService(req);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Legal details retrieved successfully',
    data: result,
  });
}) ;


export const featuresControllers = {
  createFeature,
  featuresList,
  legalDetails
}
