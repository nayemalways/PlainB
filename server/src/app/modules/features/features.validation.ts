import { z } from 'zod';

const createFeatureSchema = z
  .object({
    name: z.string().trim().min(1, 'Feature name is required').max(100),
    description: z.string().trim().min(1, 'Feature description is required').max(500),
  })
  .strict();

export const featuresValidation = {
  createFeatureSchema,
};
