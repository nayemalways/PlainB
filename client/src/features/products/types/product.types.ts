import type { PaginationMeta, RequestStatus } from '../../../types/api.ts';

export interface Brand { _id: string; brandName: string; brandImg?: string }
export interface Category { _id: string; categoryName: string; categoryImg?: string }
export interface Product {
  _id: string;
  title: string;
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
  categoryId?: string;
  brandId?: string;
  category?: Category;
  brand?: Brand;
}
export interface ProductSlider {
  _id: string;
  productId: string;
  title: string;
  des: string;
  image: string;
}
export type ProductSort = 'newest' | 'price-asc' | 'price-desc' | 'rating';
export interface ProductQuery {
  page?: number;
  limit?: number;
  sort?: ProductSort;
  priceMin?: number;
  priceMax?: number;
}
export interface ProductState {
  products: Product[];
  product: Product | null;
  brands: Brand[];
  categories: Category[];
  sliders: ProductSlider[];
  meta: PaginationMeta;
  status: RequestStatus;
  detailStatus: RequestStatus;
  error: string | null;
  activeRemark: string;
  loadHome: () => Promise<void>;
  loadByRemark: (remark: string, query?: ProductQuery) => Promise<void>;
  loadByBrand: (id: string, query?: ProductQuery) => Promise<void>;
  loadByCategory: (id: string, query?: ProductQuery) => Promise<void>;
  search: (keyword: string, query?: ProductQuery) => Promise<void>;
  loadProduct: (id: string) => Promise<void>;
}
