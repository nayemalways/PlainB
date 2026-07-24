import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .refine(
    (password) => Buffer.byteLength(password, 'utf8') <= 72,
    'Password must not exceed 72 bytes',
  );

const createUserSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(100),
    email: z.string().trim().toLowerCase().email('Enter a valid email address'),
    password: passwordSchema,
  })
  .strict();

const verifyEmailSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('Enter a valid email address'),
    otp: z.coerce.string().regex(/^\d{6}$/, 'OTP must be a six-digit code'),
  })
  .strict();

export type ICreateUserInput = z.infer<typeof createUserSchema>;
export type IVerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const userValidation = {
  createUserSchema,
  verifyEmailSchema,
};
