/*----------------PRODUCT MODEL------------------*/

import mongoose from 'mongoose';
import { IProduct } from './product.interface.ts';

const DataSchema = new mongoose.Schema<IProduct>(
  {
    title: { type: String, required: true },
    price: { type: String, required: true },
    discount: { type: Boolean, required: true },
    discountPrice: { type: String, required: true },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (images: string[]) => images.length > 0,
        message: 'At least one product image is required',
      },
    },
    des: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    star: { type: String, required: true },
    stock: { type: Boolean, required: true },
    remark: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, required: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true, versionKey: false },
);

const ProductModel = mongoose.model<IProduct>('products', DataSchema);

/*---EXPORT PRODUCT MODEL---*/
export default ProductModel;
