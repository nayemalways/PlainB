/*------------------DEPENDENCIES------------------*/
import WishListModel from './wishlist.model.ts';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

const getWishList = async (userId: string) => {
  const user_id = new ObjectId(userId);

  /*----------------- DATABASE QUERY--------------------*/
  const matchStage = { $match: { userID: user_id } };

  const JoinWithProductStage = {
    $lookup: { from: 'products', localField: 'productID', foreignField: '_id', as: 'products' },
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

const saveToWishList = async (req) => {
  try {
    const userID = req.headers.user_id;
    /*----DATABASE QUERY----*/
    const reqBody = req.body;
    reqBody.userID = userID;

    const alreadyExist = await WishListModel.find({ productID: reqBody.productID, userID: userID });
    if (alreadyExist.length > 0) {
      throw new Error('Already in the whishlist');
    }

    /*-------SAVE PRODUCT IN THE WISH LIST DB---------*/
    await WishListModel.create(reqBody);
    return { status: 'Success', message: 'Wish list save success' };
  } catch (e) {
    return { status: 'Error', message: e._message || e.toString() };
  }
};

const removeProductFromWishList = async (req) => {
  try {
    const userID = req.headers.user_id;
    const reqBody = req.body;
    reqBody.userID = userID;

    /*-----REMOVE PRODUCT FROM THE WISHLIST DB--------*/
    await WishListModel.deleteOne(reqBody);
    return { status: 'Success', message: 'Wish list delete success' };
  } catch (e) {
    console.log(e);
    return { status: 'Error', message: 'Internal Server error..!' };
  }
};

export const wishlistServices = {
  removeProductFromWishList,
  saveToWishList,
  getWishList,
};
