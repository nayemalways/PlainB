import ProductModel from './product.model.ts';
import ProductSliderModel from './product-slider.model.ts';
import ReviewModel from './review.model.ts';
import mongoose from 'mongoose';
import type { ICreateProduct, ICreateProductReview, IProductFilter } from './product.interface.ts';
import BrandModel from '../brand/brand.model.ts';
import CategoryModel from '../category/category.model.ts';
import AppError from '../../errorHelpers/appError.ts';
import { StatusCodes } from 'http-status-codes';

const ObjectId = mongoose.Types.ObjectId;

// Group: 1 -- PRODUCT BRAND, CATEGORY, SLIDER  SEARCH
const sliderListService = async () => {
  return ProductSliderModel.find();
};

// CREATE PRODUCT
const createProductService = async (payload: ICreateProduct) => {
  const [brandExists, categoryExists] = await Promise.all([
    BrandModel.exists({ _id: payload.brandId }),
    CategoryModel.exists({ _id: payload.categoryId }),
  ]);

  if (!brandExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Brand not found');
  }

  if (!categoryExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found');
  }

  return ProductModel.create({
    ...payload,
    brandId: new ObjectId(payload.brandId),
    categoryId: new ObjectId(payload.categoryId),
  });
};

// Group: 2 -- PRODUCT SEARCH BY BRAND, CATEGORY, KEYWORD, SIMILAR, REMARK
const listByBrandService = async (brandId: string) => {
  const BrandId = new ObjectId(brandId);

  //Database Query
  const MatchStage = { $match: { brandId: BrandId } };
  const JoinWithBrandStage = {
    $lookup: { from: 'brands', localField: 'brandId', foreignField: '_id', as: 'brand' },
  };
  const JoinWithCategoryStage = {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'category',
    },
  };
  const UnwindBrandStage = { $unwind: '$brand' };
  const UnwindCategoryStage = { $unwind: '$category' };

  // Database operation
  const data = await ProductModel.aggregate([
    MatchStage,
    JoinWithBrandStage,
    JoinWithBrandStage,
    JoinWithCategoryStage,
    UnwindBrandStage,
    UnwindCategoryStage,
  ]);

  return data;
};


// GET PRODUCT BY CATEGORY
const listByCategoryService = async (categoryId: string) => {
  const categoryID = new ObjectId(categoryId);

  // Query
  const match = { $match: { categoryId: categoryID } };
  const JoinWithBrandStage = {
    $lookup: { from: 'brands', localField: 'brandId', foreignField: '_id', as: 'brand' },
  };
  const JoinWithCategoryStage = {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'category',
    },
  };
  const UnwindBrandStage = { $unwind: '$brand' };
  const UnwindCategoryStage = { $unwind: '$category' };
  const projection = {
    $project: {
      categoryId: 0,
      brandId: 0,
      'brand._id': 0,
      'brand.createdAt': 0,
      'brand.updatedAt': 0,
      'category._id': 0,
      'category.createdAt': 0,
      'category.updatedAt': 0,
    },
  };

  // Data Retrieving
  const data = await ProductModel.aggregate([
    match,
    JoinWithBrandStage,
    JoinWithCategoryStage,
    UnwindBrandStage,
    UnwindCategoryStage,
    projection,
  ]);

  return data;
};

// GET PRODUCT BY REMARK
const listByRemarkService = async (remark: string) => {
  const Remark = remark;

  // Query
  const match = { $match: { remark: Remark } };
  const JoinWithBrandStage = {
    $lookup: { from: 'brands', localField: 'brandId', foreignField: '_id', as: 'brand' },
  };
  const JoinWithCategoryStage = {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'category',
    },
  };
  const UnwindBrandStage = { $unwind: '$brand' };
  const UnwindCategoryStage = { $unwind: '$category' };
  const projection = {
    $project: {
      categoryId: 0,
      brandId: 0,
      'brand._id': 0,
      'brand.createdAt': 0,
      'brand.updatedAt': 0,
      'category._id': 0,
      'category.createdAt': 0,
      'category.updatedAt': 0,
    },
  };

  // Data Retrieving
  const data = await ProductModel.aggregate([
    match,
    JoinWithBrandStage,
    JoinWithCategoryStage,
    UnwindBrandStage,
    UnwindCategoryStage,
    projection,
  ]);

  return data;
};

// GET SIMILAR PRODUCT LIST
const listBySimilarService = async (categoryId: string) => {
  const categoryID = new ObjectId(categoryId);

  // Query
  const match = { $match: { categoryId: categoryID } };
  const limit = { $limit: 20 };
  const JoinWithBrandStage = {
    $lookup: { from: 'brands', localField: 'brandId', foreignField: '_id', as: 'brand' },
  };
  const JoinWithCategoryStage = {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'category',
    },
  };
  const UnwindBrandStage = { $unwind: '$brand' };
  const UnwindCategoryStage = { $unwind: '$category' };
  const projection = {
    $project: {
      categoryId: 0,
      brandId: 0,
      'brand._id': 0,
      'brand.createdAt': 0,
      'brand.updatedAt': 0,
      'category._id': 0,
      'category.createdAt': 0,
      'category.updatedAt': 0,
    },
  };

  // Data Retrieving
  const data = await ProductModel.aggregate([
    match,
    limit,
    JoinWithBrandStage,
    JoinWithCategoryStage,
    UnwindBrandStage,
    UnwindCategoryStage,
    projection,
  ]);

  return data;
};


// DEAL DETAILS
const detailsService = async (productId: string) => {
  const productID = new ObjectId(productId);

  // Database Query Writing
  const match = { $match: { _id: productID } };

  const JoinWithBrandStage = {
    $lookup: { from: 'brands', localField: 'brandId', foreignField: '_id', as: 'brand' },
  };
  const JoinWithCategoryStage = {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'category',
    },
  };
  const UnwindBrandStage = { $unwind: '$brand' };
  const UnwindCategoryStage = { $unwind: '$category' };

  const projection = {
    $project: {
      'category._id': 0,
      'brand._id': 0,
      'brand.createdAt': 0,
      'brand.updatedAt': 0,
      'category.updatedAt': 0,
      'category.createdAt': 0,
    },
  };

  // Data retrieve
  const data = await ProductModel.aggregate([
    match,
    JoinWithBrandStage,
    JoinWithCategoryStage,
    UnwindBrandStage,
    UnwindCategoryStage,
    projection,
  ]);

  // Return Data
  return data;
};

// GET PRODUCT BY KEYWORD
const listByKeywordService = async (keyword: string) => {
  const SearchRegex = { $regex: keyword, $options: 'i' };
  const SearchParams = [{ title: SearchRegex }, { shortDes: SearchRegex }];
  const SearchQuery = { $or: SearchParams };

  const match = { $match: SearchQuery };

  const JoinWithBrandStage = {
    $lookup: { from: 'brands', localField: 'brandId', foreignField: '_id', as: 'brand' },
  };
  const JoinWithCategoryStage = {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'category',
    },
  };

  const UnwindBrandStage = { $unwind: '$brand' };
  const UnwindCategoryStage = { $unwind: '$category' };

  const projection = {
    $project: {
      categoryId: 0,
      brandId: 0,
      'brand._id': 0,
      'brand.createdAt': 0,
      'brand.updatedAt': 0,
      'category._id': 0,
      'category.createdAt': 0,
      'category.updatedAt': 0,
    },
  };

  // Data retrieving
  const data = await ProductModel.aggregate([
    match,
    JoinWithBrandStage,
    JoinWithCategoryStage,
    UnwindBrandStage,
    UnwindCategoryStage,
    projection,
  ]);

  // Return Data
  return data;
};


// FILTER PRODUCT
const productFilterService = async (payload: IProductFilter) => {
  // Brand and Category matching conditions
  const matchConditions: Record<string, mongoose.Types.ObjectId> = {};
  if (payload.categoryID) {
    matchConditions.categoryId = new ObjectId(payload.categoryID);
  }
  if (payload.brandID) {
    matchConditions.brandId = new ObjectId(payload.brandID);
  }
  const MatchStage = { $match: matchConditions };

  /* 
            Add new field named "numericPrice" for comparing with "price" field.
            The "numericPrice" value is price field. Which is converted string to Integer
        */
  const AddFieldsStage = {
    $addFields: { numericPrice: { $toInt: '$price' } }, // String type Number to Number
  };

  // Price matching conditions
  const priceMin = Number.parseInt(String(payload.priceMin));
  const priceMax = Number.parseInt(String(payload.priceMax));
  const PriceMatchConditions = {};
  if (!isNaN(priceMin)) {
    PriceMatchConditions['numericPrice'] = { $gte: priceMin };
  }
  if (!isNaN(priceMax)) {
    PriceMatchConditions['numericPrice'] = {
      ...(PriceMatchConditions['numericPrice'] || {}),
      $lte: priceMax,
    };
  }
  const PriceMatchStage = { $match: PriceMatchConditions };

  // Join with "brands", "categories" fields. And unwind the unnecessary Array sign for a single brand data
  const JoinWithBrandStage = {
    $lookup: { from: 'brands', localField: 'brandId', foreignField: '_id', as: 'brand' },
  };
  const JoinWithCategoryStage = {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'category',
    },
  };
  const UnwindBrandStage = { $unwind: '$brand' };
  const UnwindCategoryStage = { $unwind: '$category' };
  const projectionStage = { $project: { 'brand._id': 0, 'category._id': 0, brandId: 0 } };

  // Aggregation pipeline
  const data = await ProductModel.aggregate([
    MatchStage,
    AddFieldsStage,
    PriceMatchStage,
    JoinWithBrandStage,
    JoinWithCategoryStage,
    UnwindBrandStage,
    UnwindCategoryStage,
    projectionStage,
  ]);

  return data;
};


// READ PRODUCT REVIEW
const reviewsListService = async (productID: string) => {
  const productId = new ObjectId(productID);

  const matchStage = { $match: { productID: productId } };
  const JoinWithUserProfilesStage = {
    $lookup: { from: 'profiles', localField: 'userID', foreignField: 'userID', as: 'profile' },
  };
  const UnwindProfileStage = { $unwind: '$profile' };
  const projectionStage = { $project: { des: 1, rating: 1, 'profile.cus_name': 1 } };

  // Data retrieve
  const data = await ReviewModel.aggregate([
    matchStage,
    JoinWithUserProfilesStage,
    UnwindProfileStage,
    projectionStage,
  ]);

  return data;
};


// CREATE PRODUCT REVIEW
const productReviewCreateService = async (userId: string, payload: ICreateProductReview) => {
  const userID = new ObjectId(userId);
  const { productID, des, rating } = payload;

  // Create Review
  return ReviewModel.create({ productID, userID, des, rating });
};

export const productServices = {
  createProductService,
  sliderListService,
  listByBrandService,
  listByCategoryService,
  listByRemarkService,
  listBySimilarService,
  detailsService,
  listByKeywordService,
  productFilterService,
  reviewsListService,
  productReviewCreateService,
};
