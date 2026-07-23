import express from 'express';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import { Role } from '../user/user.interface.ts';
import { paymentControllers } from './payment.controller.ts';

const router = express.Router();

router.post('/checkout', checkAuth(Role.USER), paymentControllers.checkout);
router.get('/status/:sessionId', checkAuth(Role.USER), paymentControllers.status);
router.patch('/cancel/:invoiceId', checkAuth(Role.USER), paymentControllers.cancel);

export const paymentRouter = router;
export const stripeWebhookHandler = paymentControllers.webhook;
