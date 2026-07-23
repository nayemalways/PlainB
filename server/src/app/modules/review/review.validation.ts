import { z } from 'zod';

const objectId = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId');

const createReviewSchema = z.object({
  productID: objectId,
  des: z.string().trim().min(1, 'Review description is required').max(2000),
  rating: z.coerce
    .number({ error: 'Rating must be a number' })
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5')
    .transform(String),
});

export const reviewValidation = {
  createReviewSchema,
};
