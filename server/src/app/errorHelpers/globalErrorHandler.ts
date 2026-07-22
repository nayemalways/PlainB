/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { handleDuplicateError } from '../helper/duplicate.error.ts';
import { zodErrorHandler } from '../helper/zod.error.ts';
import { handleCastError } from '../helper/cast.error.ts';
import { validationError } from '../helper/validation.error.ts';
import AppError from './appError.ts';
import { NODE_ENV } from '../config/config.ts';
import { TErrorSources } from '../types/errorTypes.ts';

// Error Handler
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Something went wrong ${err.message}`;
  let errorSources: TErrorSources[] = [];

  // Duplicate error
  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Zod Error
  else if (err.name === 'ZodError') {
    const simplifiedError = zodErrorHandler(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.errorSources?.[0]?.message as string; // Always send first error message
    errorSources = simplifiedError.errorSources as TErrorSources[];
  }
  // Cast Error
  else if (err.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Validation Error
  else if (err.name === 'ValidationError') {
    const simplifiedError = validationError(err);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources as TErrorSources[];
    message = simplifiedError.message;
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Uploaded file exceeds the allowed size'
        : err.message;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // trace_id: req.id,
    errorSources,
    err: NODE_ENV === 'development' ? err : null,
    stack: NODE_ENV === 'development' ? err.stack : null,
  });
};
