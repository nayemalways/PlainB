/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';


type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;


// const getLoggerModule = (key: string) => {
//   switch (key) {
//     case LoggerModule.AUTH:
//       return authLogger;
//     case LoggerModule.USER:
//       return userLogger;
//     case LoggerModule.DEAL:
//       return dealLogger;
//     case LoggerModule.LOCATION:
//       return locationLogger;
//     case LoggerModule.NOTIFICATION:
//       return notificationLogger;
//     case LoggerModule.SHOP:
//       return shopLogger;
//     case LoggerModule.PAYMENT:
//       return paymentLogger;
//     case LoggerModule.UPLOAD:
//       return uploadLogger;
//     case LoggerModule.EMAIL:
//       return emailLogger;
//     case LoggerModule.WORKER:
//       return workerLogger;
//     case LoggerModule.SOCKET:
//       return socketLogger;
//     case LoggerModule.ADMIN:
//       return dashboardLogger;
//     default:
//       return logger;
//   }
// };

export const CatchAsync =
  (fn: AsyncHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      console.log(error?.message);
      next(error);
    }
  };
