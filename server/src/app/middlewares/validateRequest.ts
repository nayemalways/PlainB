import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import AppError from '../errorHelpers/appError.ts';
import { StatusCodes } from 'http-status-codes';

export const validateRequest = (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');

      return next(new AppError(StatusCodes.BAD_REQUEST, message));
    }

    const validatedRequest = result.data as { body?: unknown };
    if (validatedRequest.body !== undefined) {
      req.body = validatedRequest.body;
    }

    next();
  };
