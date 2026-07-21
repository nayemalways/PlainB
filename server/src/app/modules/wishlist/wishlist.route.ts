import express from 'express';
import { UserAuthentication } from '../../middlewares/AuthMiddleware.ts';
import * as wishlistController from './wishlist.controller.ts';

const router = express.Router();

router.get('/ReadWishListProducts', UserAuthentication, wishlistController.ReadWishListProducts);
router.post('/SaveWishList', UserAuthentication, wishlistController.SaveWishList);
router.post('/RemoveWishList', UserAuthentication, wishlistController.RemoveWishList);

export const wishlistRouter = router;
