import { Types } from 'mongoose';

export interface IProductSlider {
  title: string;
  des: string;
  color: string;
  size: string;
  productId: Types.ObjectId;
  required: true;
}

export interface IProduct {
  categoryId: Types.ObjectId;
  brandId: Types.ObjectId;
  title: string;
  shortDes: string;
  price: string;
  discount: boolean;
  discountPrice: string;
  images: string[];
  des: string;
  color: string;
  size: string;
  star: string;
  stock: boolean;
  remark: string;
}

export interface ICreateProduct extends Omit<IProduct, 'categoryId' | 'brandId'> {
  categoryId: string;
  brandId: string;
}

export interface IProductFilter {
  categoryID?: string;
  brandID?: string;
  priceMin?: string | number;
  priceMax?: string | number;
}

export interface ICreateProductReview {
  productID: string;
  des: string;
  rating: string | number;
}
