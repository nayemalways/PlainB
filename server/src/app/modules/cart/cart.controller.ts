import {
  RemoveProductFromCartService,
  SaveProductToCartService,
  SelectCartListProductService,
  UpdateProductOfCartService,
} from './cart.service.ts';
import { SendResponse } from '../../utility/SendResponse.ts';

export const SaveProductToCart = async (req, res) => {
  const result = await SaveProductToCartService(req);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Product added to cart',
    data: result,
  });
};

export const UpdateProductOfCart = async (req, res) => {
  const result = await UpdateProductOfCartService(req);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Cart product updated',

    data: result,
  });
};

export const RemoveProductFromCart = async (req, res) => {
  const result = await RemoveProductFromCartService(req);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Product removed from cart',
    data: result,
  });
};

export const SelectCartListProduct = async (req, res) => {
  const result = await SelectCartListProductService(req);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Cart retrieved successfully',
    data: result,
  });
};
