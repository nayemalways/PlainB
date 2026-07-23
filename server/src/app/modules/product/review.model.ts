import mongoose from 'mongoose';
import type { IReview } from './product.interface.ts';

const DataSchema = new mongoose.Schema<IReview>(
  {
    productID: { type: mongoose.Schema.Types.ObjectId, required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },
    des: { type: String, required: true },
    rating: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

const ReviewModel = mongoose.model<IReview>('reviews', DataSchema);

// Export Data Model
export default ReviewModel;
