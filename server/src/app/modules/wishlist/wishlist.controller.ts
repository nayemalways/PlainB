import { WishListService, SaveWishListService, WishListRemoveService } from './wishlist.service.ts';
import { SendResponse } from '../../utility/SendResponse.ts';

export const ReadWishListProducts = async (req, res) => {
  const result = await WishListService(req);
  return SendResponse(res, {
    success: true,

    statusCode: 200,

    message: 'Wishlist retrieved successfully',

    data: result,
  });
};

export const SaveWishList = async (req, res) => {
  const result = await SaveWishListService(req);
  return SendResponse(res, {
    success: true,

    statusCode: 200,

    message: 'Product added to wishlist',

    data: result,
  });
};

export const RemoveWishList = async (req, res) => {
  const result = await WishListRemoveService(req);
  return SendResponse(res, {
    success: true,

    statusCode: 200,

    message: 'Product removed from wishlist',

    data: result,
  });
};
