import multer from 'multer';
import type { ErrorRequestHandler } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUpload, deleteImageFromCloudinary } from './cloudinary.config.ts';

const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

const createImageUpload = (folder: string) => {
  const params = {
    folder,
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    public_id: (_req: Express.Request, file: Express.Multer.File) => {
      const name =
        file.originalname
          .replace(/\.[^/.]+$/, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') || 'image';

      return `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    },
  } as NonNullable<ConstructorParameters<typeof CloudinaryStorage>[0]['params']>;

  const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params,
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
      if (!allowedImageTypes.has(file.mimetype)) {
        callback(new Error('Only JPEG, PNG, WebP, and AVIF images are allowed'));
        return;
      }

      callback(null, true);
    },
  });
};

export const productImageUpload = createImageUpload('plainb/products');
export const brandImageUpload = createImageUpload('plainb/brands');
export const categoryImageUpload = createImageUpload('plainb/categories');

export const cleanupCloudinaryUploadsOnError: ErrorRequestHandler = async (
  error,
  req,
  _res,
  next,
) => {
  const files = ((req.files as Express.Multer.File[] | undefined) ?? []).map((file) => file.path);
  if (req.file?.path) files.push(req.file.path);

  await Promise.allSettled(files.map(deleteImageFromCloudinary));
  next(error);
};
