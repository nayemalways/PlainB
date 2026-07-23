/*-----------------DEPENDENCIES------------*/
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/appError.ts';
import { ICart } from './cart.interface.ts';
import CartModel from './cart.model.ts';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

// SAVE TO CART
const saveProductToCartService = async (userId: string, payload: ICart) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  payload.userId = userObjectId;

  const alreadyExist = await CartModel.exists({
    userId: userObjectId,
    productId: payload.productId,
  });
  if (alreadyExist) {
    throw new AppError(StatusCodes.CONFLICT, 'Already in the cart');
  }

  await CartModel.create(payload);
  return null;
};

// UPDATE CART LIST
const updateProductOfCartService = async (
  userId: string,
  cartId: string,
  payload: Partial<ICart>,
) => {
  await CartModel.updateOne({ _id: cartId, userId }, { $set: payload });
  return null;
};

// REMOVE CART LIST
const removeProductFromCartService = async (_userId: string, _productId: string) => {
  const userId = new ObjectId(_userId);
  const productId = new ObjectId(_productId);

  /*---REMOVE CART LIST PRODUCT----*/
  const res = await CartModel.deleteOne({ productId, userId });
  if (res.deletedCount === 0) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to remove');
  return null;
};

// READ CART LIST
const selectCartListProductService = async (_userId: string) => {
  const userId = new ObjectId(_userId);
  /*----------------- DATABASE QUERY--------------------*/
  const matchStage = { $match: { userId } };

  const JoinWithProductStage = {
    $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' },
  };
  const UnwindProductStage = { $unwind: '$product' };

  const JoinWithBrandStage = {
    $lookup: { from: 'brands', localField: 'product.brandId', foreignField: '_id', as: 'brand' },
  };
  const UnwindBrandStage = { $unwind: '$brand' };

  const JoinWithCategoryStage = {
    $lookup: {
      from: 'categories',
      localField: 'product.categoryId',
      foreignField: '_id',
      as: 'Category',
    },
  };
  const UnwindCategoryStage = { $unwind: '$Category' };

  const projectionStage = {
    $project: {
      'product.createdAt': 0,
      'product.updatedAt': 0,
      'product.brandId': 0,
      'product.categoryId': 0,
      'brand.updatedAt': 0,
      'brand.createdAt': 0,
      'brand._id': 0,
      'Category._id': 0,
      'Category.createdAt': 0,
      'Category.updatedAt': 0,
    },
  };

  /*--------JOIN PRODUCT WITH WISH LIST MODEL AND SELECT DATA----------*/
  const data = await CartModel.aggregate([
    matchStage,
    JoinWithProductStage,
    UnwindProductStage,
    JoinWithBrandStage,
    UnwindBrandStage,
    JoinWithCategoryStage,
    UnwindCategoryStage,
    projectionStage,
  ]);

  /*----------RETURN DATA-----------*/
  return data;
};

export const cartService = {
  saveProductToCartService,
  updateProductOfCartService,
  removeProductFromCartService,
  selectCartListProductService,
};
