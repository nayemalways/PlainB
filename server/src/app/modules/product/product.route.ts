import express from 'express';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import { Role } from '../user/user.interface.ts';
import { validateRequest } from '../../middlewares/validateRequest.ts';
import { productValidation } from './product.validation.ts';
import { cleanupCloudinaryUploadsOnError, productImageUpload } from '../../config/multer.config.ts';
import { productControllers } from './product.controller.ts';

const router = express.Router();

router.post(
  '/',
  checkAuth(Role.ADMIN),
  productImageUpload.array('images', 6),
  validateRequest(productValidation.createProductSchema),
  productControllers.productCreate,
  cleanupCloudinaryUploadsOnError,
);
router.get('/slider', productControllers.productSliderList);
router.post(
  '/slider',
  checkAuth(Role.ADMIN),
  validateRequest(productValidation.createProductSliderSchema),
  productControllers.productSliderCreate,
);
router.post('/filter', productControllers.productFilter);
router.post('/review', checkAuth(Role.USER), productControllers.productReviewCreate);
router.get(
  '/review/:productId',
  validateRequest(productValidation.productIdParamSchema),
  productControllers.productReviewsList,
);
router.get(
  '/brand/:brandId',
  validateRequest(productValidation.brandIdParamSchema),
  productControllers.productListByBrand,
);
router.get(
  '/category/:categoryId',
  validateRequest(productValidation.categoryIdParamSchema),
  productControllers.productListByCategory,
);
router.get('/remark/:remark', productControllers.productListByRemark);
router.get(
  '/similar/:categoryId',
  validateRequest(productValidation.categoryIdParamSchema),
  productControllers.productListBySimilar,
);
router.get(
  '/details/:productId',
  validateRequest(productValidation.productIdParamSchema),
  productControllers.productDetails,
);
router.get('/search/:keyword', productControllers.productListByKeyword);

export const productRouter = router;
