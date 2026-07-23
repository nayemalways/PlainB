import mongoose from 'mongoose';
import { IWishList } from './wishlist.interface.ts';

const DataSchema = new mongoose.Schema<IWishList>(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true, versionKey: false },
);

const WishModel = mongoose.model<IWishList>('wishes', DataSchema);

// Export Data Model
export default WishModel;
