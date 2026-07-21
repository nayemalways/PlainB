import type { Response } from 'express';

interface IResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  traceId?: string;
  data: T;
}

export const SendResponse = <T>(res: Response, payload: IResponse<T>): void => {
  res.status(payload.statusCode).json({
    success: payload.success,
    statusCode: payload.statusCode,
    message: payload.message,
    traceId: payload.traceId,
    data: payload.data,
  });
};
