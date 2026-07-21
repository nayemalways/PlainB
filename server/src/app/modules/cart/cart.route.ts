import express from 'express';
import { UserAuthentication } from '../../middlewares/AuthMiddleware.ts';
import * as cartController from './cart.controller.ts';

const router = express.Router();

router.post('/SaveProductToCart', UserAuthentication, cartController.SaveProductToCart);
router.post('/UpdateProductOfCart/:CartID', UserAuthentication, cartController.UpdateProductOfCart);
router.post('/RemoveProductFromCart', UserAuthentication, cartController.RemoveProductFromCart);
router.get('/SelectCartListProduct', UserAuthentication, cartController.SelectCartListProduct);

export const cartRouter = router;
