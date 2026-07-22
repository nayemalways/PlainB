import mongoose from 'mongoose';
import { IProductSlider } from './product.interface.ts';

const DataSchema = new mongoose.Schema<IProductSlider>(
  {
    title: { type: String, required: true },
    des: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    image: { type: String, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true,
    },
  },

  { timestamps: true, versionKey: false },
);

const ProductSlider = mongoose.model<IProductSlider>('productslider', DataSchema);

// Export Data Model
export default ProductSlider;
