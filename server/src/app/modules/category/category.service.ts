import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/appError.ts';
import type { ICategory } from './category.interface.ts';
import CategoryModel from './category.model.ts';

const getCategoryList = async () => CategoryModel.find();

const createCategory = async (payload: ICategory) => {
  const existingCategory = await CategoryModel.exists({
    categoryName: payload.categoryName,
  });

  if (existingCategory) {
    throw new AppError(StatusCodes.CONFLICT, 'Category already exists');
  }

  return CategoryModel.create(payload);
};

export const categoryServices = {
  getCategoryList,
  createCategory,
};
