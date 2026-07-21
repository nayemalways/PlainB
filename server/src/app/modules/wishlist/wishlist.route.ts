import express from 'express';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import * as wishlistController from './wishlist.controller.ts';
import { Role } from '../user/user.interface.ts';

const router = express.Router();

router.get('/ReadWishListProducts', checkAuth(Role.USER), wishlistController.ReadWishListProducts);
router.post('/SaveWishList', checkAuth(Role.USER), wishlistController.SaveWishList);
router.post('/RemoveWishList', checkAuth(Role.USER), wishlistController.RemoveWishList);

export const wishlistRouter = router;
