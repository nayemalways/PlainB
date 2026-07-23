import express from 'express';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import { Role } from '../user/user.interface.ts';
import { cartControllers } from './cart.controller.ts';

const router = express.Router();

router.get('/total', checkAuth(Role.USER), cartControllers.getTotalCartCount);
router.get('/', checkAuth(Role.USER), cartControllers.getCartListService);
router.post('/', checkAuth(Role.USER), cartControllers.saveProductToCart);
router.patch('/:cartId', checkAuth(Role.USER), cartControllers.updateProductOfCart);
router.delete('/:productId', checkAuth(Role.USER), cartControllers.removeProductFromCart);

export const cartRouter = router;
