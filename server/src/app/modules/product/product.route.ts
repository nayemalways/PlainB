import express from 'express';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import * as productController from './product.controller.ts';
import { Role } from '../user/user.interface.ts';

const router = express.Router();

router.get('/ProductSliderList', productController.ProductSliderList);
router.get('/ProductListByBrand/:brandId', productController.ProductListByBrand);
router.get('/ProductListByCategory/:categoryID', productController.ProductListByCategory);
router.get('/ProductListByRemark/:Remark', productController.ProductListByRemark);
router.get('/ProductListBySimilar/:categoryID', productController.ProductListBySimilar);
router.get('/ProductDetails/:ProductID', productController.ProductDetails);
router.get('/ProductListByKeyword/:Keyword', productController.ProductListByKeyword);
router.get('/ProductReviewsList/:ProductId', productController.ProductReviewsList);
router.post('/ProductFilter', productController.ProductFilter);
router.post('/ProductReviewCreate', checkAuth(Role.USER), productController.ProductReviewCreate);

export const productRouter = router;
