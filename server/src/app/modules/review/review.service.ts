import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/appError.ts';
import ProductModel from '../product/product.model.ts';
import type { ICreateReview, IReviewListItem } from './review.interface.ts';
import ReviewModel from './review.model.ts';

const getReviewsByProduct = async (productId: string) => {
  if (!mongoose.isValidObjectId(productId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid product ID');
  }

  return ReviewModel.aggregate<IReviewListItem>([
    { $match: { productID: new mongoose.Types.ObjectId(productId) } },
    {
      $lookup: {
        from: 'profiles',
        localField: 'userID',
        foreignField: 'userID',
        as: 'profile',
      },
    },
    { $unwind: '$profile' },
    { $project: { des: 1, rating: 1, 'profile.cus_name': 1 } },
  ]);
};

const createReview = async (userId: string, payload: ICreateReview) => {
  const productExists = await ProductModel.exists({ _id: payload.productID });
  if (!productExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  return ReviewModel.create({
    ...payload,
    productID: new mongoose.Types.ObjectId(payload.productID),
    userID: new mongoose.Types.ObjectId(userId),
  });
};

export const reviewServices = {
  getReviewsByProduct,
  createReview,
};
