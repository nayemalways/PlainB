import express from 'express';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import * as cartController from './cart.controller.ts';
import { Role } from '../user/user.interface.ts';

const router = express.Router();

router.post('/SaveProductToCart', checkAuth(Role.USER), cartController.SaveProductToCart);
router.post('/UpdateProductOfCart/:CartID', checkAuth(Role.USER), cartController.UpdateProductOfCart);
router.post('/RemoveProductFromCart', checkAuth(Role.USER), cartController.RemoveProductFromCart);
router.get('/SelectCartListProduct', checkAuth(Role.USER), cartController.SelectCartListProduct);

export const cartRouter = router;
