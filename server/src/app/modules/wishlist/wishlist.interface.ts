import { Types } from "mongoose";


export interface IWishList {
    productId: Types.ObjectId;
    userId: Types.ObjectId;
}