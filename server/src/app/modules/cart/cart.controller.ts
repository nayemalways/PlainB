/* eslint-disable @typescript-eslint/no-unused-vars */

import { JwtPayload } from 'jsonwebtoken';
import { SendResponse } from '../../utility/sendResponse.ts';
import { cartService } from './cart.service.ts';
import { NextFunction, Request, Response } from 'express';
import { CatchAsync } from '../../utility/CatchAsync.ts';
import { ICart } from './cart.interface.ts';

const saveProductToCart = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.user as JwtPayload;
  const result = await cartService.saveProductToCartService(userId, req.body);

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Product added to cart',
    data: result,
  });
});

const updateProductOfCart = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.user as JwtPayload;
  const { cartId } = req.params;
  const payload = req.body;
  const result = await cartService.updateProductOfCartService(userId as string, cartId as string, payload as Partial<ICart>);

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Cart product updated',
    data: result,
  });
});

const removeProductFromCart = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user as JwtPayload;
    const { productId } = req.params;
    const result = await cartService.removeProductFromCartService(userId as string, productId as string);

    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Product removed from cart',
      data: result,
    });
  },
);

const getCartListService = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user as JwtPayload;
    const result = await cartService.getCartListService(userId as string);

    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Cart retrieved successful',
      data: result,
    });
  },
);

const getTotalCartCount = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user as JwtPayload;
    const result = await cartService.getTotalCartCountService(userId as string);

    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Total cart count fetched',
      data: result,
    });
  },
);

export const cartControllers = {
  saveProductToCart,
  updateProductOfCart,
  removeProductFromCart,
  getCartListService,
  getTotalCartCount,
};
