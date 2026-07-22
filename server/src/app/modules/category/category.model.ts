import mongoose from 'mongoose';
import type { ICategory } from './category.interface.ts';

const categorySchema = new mongoose.Schema<ICategory>(
  {
    categoryName: { type: String, required: true, unique: true },
    categoryImg: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

const CategoryModel = mongoose.model<ICategory>('categories', categorySchema);

export default CategoryModel;
