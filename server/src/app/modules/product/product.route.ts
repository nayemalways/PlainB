import express from 'express';
import { UserAuthentication } from '../../middlewares/AuthMiddleware.ts';
import * as productController from './product.controller.ts';

const router = express.Router();

router.get('/ProductBrandList', productController.ProductBrandList);
router.get('/ProductCategoryList', productController.ProductCategoryList);
router.get('/ProductSliderList', productController.ProductSliderList);
router.get('/ProductListByBrand/:brandId', productController.ProductListByBrand);
router.get('/ProductListByCategory/:categoryID', productController.ProductListByCategory);
router.get('/ProductListByRemark/:Remark', productController.ProductListByRemark);
router.get('/ProductListBySimilar/:categoryID', productController.ProductListBySimilar);
router.get('/ProductDetails/:ProductID', productController.ProductDetails);
router.get('/ProductListByKeyword/:Keyword', productController.ProductListByKeyword);
router.get('/ProductReviewsList/:ProductId', productController.ProductReviewsList);
router.post('/ProductFilter', productController.ProductFilter);
router.post('/ProductReviewCreate', UserAuthentication, productController.ProductReviewCreate);

export const productRouter = router;
