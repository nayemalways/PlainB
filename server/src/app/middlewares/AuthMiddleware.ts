import { NextFunction, Request, Response } from 'express';
import AppError from '../errorHelpers/appError.ts';
import { StatusCodes } from 'http-status-codes';
import User from '../modules/user/user.model.ts';
import { verifyToken } from '../utility/TokenHelper.ts';
import { IsActiveUser, IUser, Role } from '../modules/user/user.interface.ts';
import { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/config.ts';


export const checkAuth =
  (...restRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization as string | undefined;
      const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
      const accessToken = req.cookies?.accessToken ?? bearerToken;
      if (!accessToken) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Token not provided!');
      }

      // VERIFY USER
      const verifyUser = verifyToken( accessToken as string, env.JWT_SECRET ) as JwtPayload;

      // CHECK VERIFIED
      if (!verifyUser) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'You are unauthorized');
      };

      const isUser = await User.findById(verifyUser.userId) as IUser;
      if (!isUser) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
      }


       if (
        isUser.isActive === IsActiveUser.INACTIVE ||
        isUser.isActive === IsActiveUser.BLOCKED
      ) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          'User is Blocked or Inactive!'
        );
      }

      if (isUser.isDeleted) {
        throw new AppError(StatusCodes.FORBIDDEN, 'The user was deleted!');
      }


      const roleFromDb = isUser.role ?? Role.USER;

      // Authorization decision must come from DB role, not token claim role.
      if (restRole.length && !restRole.includes(roleFromDb)) {
        throw new AppError( StatusCodes.FORBIDDEN, 'You are not permitted to access this route')
      };

      // Attach trusted user payload (role/id from DB)
      req.user = {
        ...verifyUser,
        userId: isUser._id.toString(),
        role: roleFromDb,
        email: isUser.email,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
