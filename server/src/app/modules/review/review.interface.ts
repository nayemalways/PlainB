import type { Types } from 'mongoose';

export interface IReview {
  productID: Types.ObjectId;
  userID: Types.ObjectId;
  des: string;
  rating: string;
}

export interface ICreateReview {
  productID: string;
  des: string;
  rating: string;
}

export interface IReviewListItem {
  _id: Types.ObjectId;
  des: string;
  rating: string;
  profile: {
    cus_name: string;
  };
}
