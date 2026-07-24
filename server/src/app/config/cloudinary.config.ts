import { v2 as cloudinary } from 'cloudinary';
import { env } from './config.ts';


cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_SECRET,
});

export const deleteImageFromCloudinary = async (url: string): Promise<void> => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
  if (!match?.[1]) return;

  await cloudinary.uploader.destroy(match[1], { resource_type: 'image' });
};

export const cloudinaryUpload = cloudinary;
