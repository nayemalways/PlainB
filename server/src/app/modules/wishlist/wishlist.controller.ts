/* eslint-disable @typescript-eslint/no-unused-vars */
import { wishlistServices } from './wishlist.service.ts';
import { SendResponse } from '../../utility/SendResponse.ts';
import { NextFunction, Request, Response } from 'express';
import { CatchAsync } from '../../utility/CatchAsync.ts';
import { JwtPayload } from 'jsonwebtoken';

const getWishList = CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.user as JwtPayload;
  const result = await wishlistServices.getWishList(userId as string);
  return SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Wishlist retrieved successfully',
    data: result,
  });
});

const saveToWishList = async (req: Request, res: Response, next: NextFunction) => {
  const result = await wishlistServices.saveToWishList(req);
  return SendResponse(res, {
    success: true,

    statusCode: 200,

    message: 'Product added to wishlist',

    data: result,
  });
};

const removeProductFromWishList = async (req: Request, res: Response, next: NextFunction) => {
  const result = await wishlistServices.removeProductFromWishList(req);
  return SendResponse(res, {
    success: true,

    statusCode: 200,

    message: 'Product removed from wishlist',

    data: result,
  });
};


export const wishListControllers = {
  getWishList,
  saveToWishList,
  removeProductFromWishList
}
