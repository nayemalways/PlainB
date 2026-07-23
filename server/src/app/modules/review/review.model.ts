import mongoose from 'mongoose';
import type { IReview } from './review.interface.ts';

const reviewSchema = new mongoose.Schema<IReview>(
  {
    productID: { type: mongoose.Schema.Types.ObjectId, required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },
    des: { type: String, required: true },
    rating: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

reviewSchema.index({ productID: 1 });

const ReviewModel = mongoose.model<IReview>('reviews', reviewSchema);

export default ReviewModel;
