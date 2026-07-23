import express from 'express';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import { Role } from '../user/user.interface.ts';
import { wishListControllers } from './wishlist.controller.ts';

const router = express.Router();

router.get('/total', checkAuth(Role.USER), wishListControllers.myTotalWishProducts);
router.get('/', checkAuth(Role.USER), wishListControllers.getWishList);
router.post('/', checkAuth(Role.USER), wishListControllers.saveToWishList);
router.delete('/:productId', checkAuth(Role.USER), wishListControllers.removeProductFromWishList);

export const wishlistRouter = router;
