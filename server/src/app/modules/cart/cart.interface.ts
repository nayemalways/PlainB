import { Types } from "mongoose";

export interface ICart extends Document {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  color: string;
  qty: string;
  size: string;
}
