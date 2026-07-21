import { authRouter } from '../modules/auth/auth.route.ts';
import { userRouter } from '../modules/user/user.route.ts';
import { productRouter } from '../modules/product/product.route.ts';
import { cartRouter } from '../modules/cart/cart.route.ts';
import { wishlistRouter } from '../modules/wishlist/wishlist.route.ts';
import { invoiceRouter } from '../modules/invoice/invoice.route.ts';
import { featuresRouter } from '../modules/features/features.route.ts';
import express from 'express';

const router = express.Router();

const modules = [
  {
    path: '/user',
    module: userRouter,
  },
  {
    path: '/auth',
    module: authRouter,
  },
  {
    path: '/product',
    module: productRouter,
  },
  {
    path: '/cart',
    module: cartRouter,
  },
  {
    path: '/wishlist',
    module: wishlistRouter,
  },
  {
    path: '/invoice',
    module: invoiceRouter,
  },
  {
    path: '/features',
    module: featuresRouter,
  },
];

// Preserve the original endpoint URLs while clients migrate to module-prefixed routes.
const legacyModules = [
  userRouter,
  productRouter,
  cartRouter,
  wishlistRouter,
  invoiceRouter,
  featuresRouter,
];

modules.forEach((m) => {
  router.use(m.path, m.module);
});

legacyModules.forEach((moduleRouter) => {
  router.use('/', moduleRouter);
});

export const globalRouter = router;
