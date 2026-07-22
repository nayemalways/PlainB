import mongoose from 'mongoose';
import { IBrand } from './brand.interface.ts';

const brandSchema = new mongoose.Schema<IBrand>(
  {
    brandName: { type: String, required: true, unique: true },
    brandImg: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

const BrandModel = mongoose.model<IBrand>('brands', brandSchema);

export default BrandModel;
