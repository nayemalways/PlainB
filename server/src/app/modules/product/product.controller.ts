/*--------------------------DEPENDENCIE-------------------------*/
import {
  SliderListService,
  ListByBrandService,
  ListByCategoryService,
  ListBySimilarService,
  ListByKeywordService,
  ListByRemarkService,
  DetailsService,
  ReviewsListService,
  ProductReviewCreateService,
  ProductFilterService,
} from './product.service.ts';
import { SendResponse } from '../../utility/SendResponse.ts';

export const ProductSliderList = async (req, res) => {
  const result = await SliderListService();
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Sliders retrieved successfully',
    data: result,
  });
};

// Group: 2 -- PRODUCT SEARCH BY BRAND, CATEGORY, KEYWORD, SIMILAR, REMARK
export const ProductListByBrand = async (req, res) => {
  const result = await ListByBrandService(req);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Products retrieved successfully',
    data: result,
  });
};

export const ProductListByCategory = async (req, res) => {
  const result = await ListByCategoryService(req);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Products retrieved successfully',
    data: result,
  });
};

export const ProductListByRemark = async (req, res) => {
  const result = await ListByRemarkService(req);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Products retrieved successfully',
    data: result,
  });
};

export const ProductListBySimilar = async (req, res) => {
  const result = await ListBySimilarService(req);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Similar products retrieved successfully',
    data: result,
  });
};

export const ProductListByKeyword = async (req, res) => {
  const result = await ListByKeywordService(req);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Products retrieved successfully',
    data: result,
  });
};

export const ProductDetails = async (req, res) => {
  const result = await DetailsService(req);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Product details retrieved successfully',
    data: result,
  });
};

export const ProductFilter = async (req, res) => {
  const result = await ProductFilterService(req);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Products filtered successfully',
    data: result,
  });
};

export const ProductReviewsList = async (req, res) => {
  const result = await ReviewsListService(req);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Product reviews retrieved successfully',
    data: result,
  });
};

export const ProductReviewCreate = async (req, res) => {
  const result = await ProductReviewCreateService(req);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Product review created successfully',
    data: result,
  });
};
