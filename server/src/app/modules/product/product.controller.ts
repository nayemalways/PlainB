import type { NextFunction, Request, Response } from 'express';
import { SendResponse } from '../../utility/SendResponse.ts';
import { CatchAsync } from '../../utility/CatchAsync.ts';
import { productServices } from './product.service.ts';
import type { ICreateProductReview, IProductFilter } from './product.interface.ts';
import type { ICreateProduct } from './product.interface.ts';
import AppError from '../../errorHelpers/appError.ts';
import { StatusCodes } from 'http-status-codes';

const productCreate = CatchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    const images = files.map((file) => file.path);
    if (images.length === 0) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'At least one product image is required');
    }

    const payload = { ...req.body, images } as ICreateProduct;
    const result = await productServices.createProductService(payload);

    SendResponse(res, {
      success: true,
      statusCode: 201,
      message: 'Product created successfully',
      data: result,
    });
  },
);

const productSliderList = CatchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const result = await productServices.sliderListService();

    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Sliders retrieved successfully',
      data: result,
    });
  },
);

const productListByBrand = CatchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const brandId = String(req.params.brandId);
    const result = await productServices.listByBrandService(brandId);

    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Products retrieved successfully',
      data: result,
    });
  },
);

const productListByCategory = CatchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const categoryId = String(req.params.categoryId);
    const result = await productServices.listByCategoryService(categoryId);

    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Products retrieved successfully',
      data: result,
    });
  },
);

const productListByRemark = CatchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const remark = String(req.params.remark);
    const result = await productServices.listByRemarkService(remark);

    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Products retrieved successfully',
      data: result,
    });
  },
);

const productListBySimilar = CatchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const categoryId = String(req.params.categoryId);
    const result = await productServices.listBySimilarService(categoryId);

    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Similar products retrieved successfully',
      data: result,
    });
  },
);

const productListByKeyword = CatchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const keyword = String(req.params.keyword);
    const result = await productServices.listByKeywordService(keyword);

    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Products retrieved successfully',
      data: result,
    });
  },
);

const productDetails = CatchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const productId = String(req.params.productId);
    const result = await productServices.detailsService(productId);

    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Product details retrieved successfully',
      data: result,
    });
  },
);

const productFilter = CatchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const payload = req.body as IProductFilter;
    const result = await productServices.productFilterService(payload);

    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Products filtered successfully',
      data: result,
    });
  },
);

const productReviewsList = CatchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const productId = String(req.params.productId);
    const result = await productServices.reviewsListService(productId);

    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Product reviews retrieved successfully',
      data: result,
    });
  },
);

const productReviewCreate = CatchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { userId } = req.user;
    const payload = req.body as ICreateProductReview;
    const result = await productServices.productReviewCreateService(userId as string, payload);

    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Product review created successfully',
      data: result,
    });
  },
);


export const productControllers = {
  productReviewCreate,
  productReviewsList,
  productCreate,
  productDetails,
  productListByKeyword,
  productListByRemark,
  productListByBrand,
  productFilter,
  productListBySimilar,
  productSliderList,
  productListByCategory
}
