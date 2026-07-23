import express from 'express';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import { validateRequest } from '../../middlewares/validateRequest.ts';
import { Role } from '../user/user.interface.ts';
import { reviewControllers } from './review.controller.ts';
import { reviewValidation } from './review.validation.ts';

const router = express.Router();

router.get('/:productId', reviewControllers.getReviewsByProduct);
router.post(
  '/',
  checkAuth(Role.USER),
  validateRequest(reviewValidation.createReviewSchema),
  reviewControllers.createReview,
);

export const reviewRouter = router;
