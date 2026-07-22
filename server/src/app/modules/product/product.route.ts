import express from 'express';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import * as productController from './product.controller.ts';
import { Role } from '../user/user.interface.ts';
import { validateRequest } from '../../middlewares/validateRequest.ts';
import { productValidation } from './product.validation.ts';
import { cleanupCloudinaryUploadsOnError, productImageUpload } from '../../config/multer.config.ts';

const router = express.Router();

router.post(
  '/',
  checkAuth(Role.ADMIN),
  productImageUpload.array('images', 6),
  validateRequest(productValidation.createProductSchema),
  productController.ProductCreate,
  cleanupCloudinaryUploadsOnError,
);
router.get('/slider', productController.ProductSliderList);
router.post('/filter', productController.ProductFilter);
router.post('/review', checkAuth(Role.USER), productController.ProductReviewCreate);
router.get(
  '/review/:productId',
  validateRequest(productValidation.productIdParamSchema),
  productController.ProductReviewsList,
);
router.get(
  '/brand/:brandId',
  validateRequest(productValidation.brandIdParamSchema),
  productController.ProductListByBrand,
);
router.get(
  '/category/:categoryId',
  validateRequest(productValidation.categoryIdParamSchema),
  productController.ProductListByCategory,
);
router.get('/remark/:remark', productController.ProductListByRemark);
router.get(
  '/similar/:categoryId',
  validateRequest(productValidation.categoryIdParamSchema),
  productController.ProductListBySimilar,
);
router.get(
  '/details/:productId',
  validateRequest(productValidation.productIdParamSchema),
  productController.ProductDetails,
);
router.get('/search/:keyword', productController.ProductListByKeyword);

export const productRouter = router;
