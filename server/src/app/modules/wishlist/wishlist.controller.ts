/* eslint-disable @typescript-eslint/no-unused-vars */
import { wishlistServices } from './wishlist.service.ts';
import { SendResponse } from '../../utility/sendResponse.ts';
import { NextFunction, Request, Response } from 'express';
import { CatchAsync } from '../../utility/CatchAsync.ts';
import { JwtPayload } from 'jsonwebtoken';

// WISH LIST
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

// SAVE TO WISHLIST
const saveToWishList = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const { userId } = req.user as JwtPayload;
  const result = await wishlistServices.saveToWishList(userId as string, payload);
  return SendResponse(res, {
    success: true,

    statusCode: 200,

    message: 'Product added to wishlist',

    data: result,
  });
});

// REMOVE FROM WISH LIST
const removeProductFromWishList = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { userId } = req.user as JwtPayload;
  const result = await wishlistServices.removeProductFromWishList(userId as string, productId as string);
  return SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Product removed from wishlist',
    data: result,
  });
};

// REMOVE FROM WISH LIST
const myTotalWishProducts = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.user as JwtPayload;
  const result = await wishlistServices.myTotalWishProducts(userId as string);
  return SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Total wishlist count fetched',
    data: result,
  });
};


export const wishListControllers = {
  getWishList,
  saveToWishList,
  removeProductFromWishList,
  myTotalWishProducts
}
