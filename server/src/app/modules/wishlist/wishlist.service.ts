/*------------------DEPENDENCIES------------------*/
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/appError.ts';
import { IWishList } from './wishlist.interface.ts';
import WishListModel from './wishlist.model.ts';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

// GET WISH LIST
const getWishList = async (userId: string) => {
  const user_id = new ObjectId(userId);

  /*----------------- DATABASE QUERY--------------------*/
  const matchStage = { $match: { userId: user_id } };
  const JoinWithProductStage = {
    $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'products' },
  };
  const UnwindProductStage = { $unwind: '$products' };
  const JoinWithBrandStage = {
    $lookup: { from: 'brands', localField: 'products.brandId', foreignField: '_id', as: 'brand' },
  };
  const UnwindBrandStage = { $unwind: '$brand' };
  const JoinWithCategoryStage = {
    $lookup: {
      from: 'categories',
      localField: 'products.categoryId',
      foreignField: '_id',
      as: 'category',
    },
  };
  const UnwindCategoryStage = { $unwind: '$category' };
  const projectionStage = {
    $project: {
      'products.createdAt': 0,
      'products.updatedAt': 0,
      'products.brandId': 0,
      'products.categoryId': 0,

      'brand._id': 0,
      'brand.updatedAt': 0,
      'brand.createdAt': 0,

      'category._id': 0,
      'category.updatedAt': 0,
      'category.createdAt': 0,
    },
  };

  /*--------JOIN PRODUCT WITH WISH LIST MODEL AND SELECT DATA----------*/
  const data = await WishListModel.aggregate([
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

const myTotalWishProducts = async (userId: string) => {
  return await WishListModel.countDocuments({ userId: userId });
};

// SAVE TO WISH LIST
const saveToWishList = async (userId: string, payload: IWishList) => {
  const wishPayload = {
    ...payload,
    userId,
  };

  console.log(wishPayload);

  const alreadyExist = await WishListModel.find({
    productId: wishPayload.productId,
    userId: userId,
  });
  if (alreadyExist.length > 0) {
    throw new Error('Already in the whish list');
  }

  /*-------SAVE PRODUCT IN THE WISH LIST DB---------*/
  const saveToWish = await WishListModel.create(wishPayload);
  console.log(saveToWish);
  return null;
};

// REMOVE FROM WISH LIST
const removeProductFromWishList = async (userId: string, productId: string) => {
  const product = await WishListModel.findOne({ productId });
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not exist');
  }

  /*-----REMOVE PRODUCT FROM THE WISHLIST DB--------*/
  await WishListModel.deleteOne({ productId });

  return null;
};

export const wishlistServices = {
  removeProductFromWishList,
  saveToWishList,
  getWishList,
  myTotalWishProducts
};
