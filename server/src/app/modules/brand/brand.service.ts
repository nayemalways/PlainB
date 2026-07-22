import BrandModel from './brand.model.ts';
import type { IBrand } from './brand.interface.ts';
import AppError from '../../errorHelpers/appError.ts';
import { StatusCodes } from 'http-status-codes';



// GET BRAN LIST
const getBrandList = async () => {
  const data = await BrandModel.find();
  return data;
};

// CREATE BRAND
const createBrand = async (payload: IBrand) => {
  const brandName = payload.brandName?.trim();
  const brandImg = payload.brandImg?.trim();

  if (!brandName || !brandImg) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Brand name and image are required');
  }

  const existingBrand = await BrandModel.exists({ brandName });
  if (existingBrand) {
    throw new AppError(StatusCodes.CONFLICT, 'Brand already exists');
  }

  try {
    return await BrandModel.create({ brandName, brandImg });
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError(StatusCodes.CONFLICT, 'Brand already exists');
    }

    throw error;
  }
};

export const brandServices = {
  getBrandList,
  createBrand,
};
