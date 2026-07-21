import mongoose from 'mongoose';
import { ICart } from './cart.interface.ts';

const DataSchema = new mongoose.Schema<ICart>(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    color: { type: String, required: true },
    qty: { type: String, required: true },
    size: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

const CartModel = mongoose.model<ICart>('carts', DataSchema);

// Export Data Model
export default CartModel;
