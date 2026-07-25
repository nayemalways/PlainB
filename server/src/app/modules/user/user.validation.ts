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

const optionalText = z.string().trim().max(200).optional();
const customerAddressSchema = z
  .object({
    cus_address: optionalText,
    cus_city: optionalText,
    cus_country: optionalText,
    cus_fax: optionalText,
    cus_name: z.string().trim().min(1, 'Name is required').max(100).optional(),
    cus_phone: optionalText,
    cus_postcode: optionalText,
    cus_state: optionalText,
  })
  .strict();

const shippingAddressSchema = z
  .object({
    ship_address: optionalText,
    ship_city: optionalText,
    ship_country: optionalText,
    ship_name: optionalText,
    ship_phone: optionalText,
    ship_postcode: optionalText,
    ship_state: optionalText,
  })
  .strict();

const updateProfileSchema = z
  .object({
    cus_address: customerAddressSchema.optional(),
    ship_address: shippingAddressSchema.optional(),
  })
  .strict();

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
  })
  .strict();

export type ICreateUserInput = z.infer<typeof createUserSchema>;
export type IVerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type IUpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type IChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const userValidation = {
  createUserSchema,
  verifyEmailSchema,
  updateProfileSchema,
  changePasswordSchema,
};
