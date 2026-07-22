import { z } from 'zod';

const createCategorySchema = z.object({
  body: z
    .object({
      categoryName: z.string().trim().min(1, 'Category name is required').max(100),
    })
    .strict(),
});

export const categoryValidation = {
  createCategorySchema,
};
