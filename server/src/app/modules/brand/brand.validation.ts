import { z } from 'zod';

const createBrandSchema = z.object({
  body: z
    .object({
      brandName: z.string().trim().min(1, 'Brand name is required').max(100),
      brandImg: z.string().trim().min(1, 'Brand image is required'),
    })
    .strict(),
});

export const brandValidation = {
  createBrandSchema,
};
