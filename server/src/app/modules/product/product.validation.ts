import { z } from 'zod';

const objectId = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId');

const numericString = (field: string, minimum = 0) =>
  z.coerce
    .number({ error: `${field} must be a number` })
    .min(minimum, `${field} must be at least ${minimum}`)
    .transform(String);

const booleanField = z.union([
  z.boolean(),
  z.enum(['true', 'false']).transform((value) => value === 'true'),
]);

const createProductSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  price: numericString('Price', 0.01),
  discount: booleanField,
  discountPrice: numericString('Discount price'),
  des: z.string().trim().min(1, 'Product description is required').max(10000),
  color: z.string().trim().min(1, 'Color is required').max(200),
  size: z.string().trim().min(1, 'Size is required').max(200),
  star: numericString('Star rating').refine((value) => Number(value) <= 5, {
    message: 'Star rating cannot exceed 5',
  }),
  stock: booleanField,
  remark: z.string().trim().min(1, 'Remark is required').max(50),
  categoryId: objectId,
  brandId: objectId,
});

const brandIdParamSchema = z.object({
  params: z.object({ brandId: objectId }),
});

const categoryIdParamSchema = z.object({
  params: z.object({ categoryId: objectId }),
});

const productIdParamSchema = z.object({
  params: z.object({ productId: objectId }),
});

export const productValidation = {
  createProductSchema,
  brandIdParamSchema,
  categoryIdParamSchema,
  productIdParamSchema,
};
