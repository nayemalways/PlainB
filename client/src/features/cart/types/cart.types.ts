import type { RequestStatus } from '../../../types/api.ts';
import type { Product } from '../../products/types/product.types.ts';

export interface CartItem {
  _id: string;
  productId: string;
  qty: string;
  color: string;
  size: string;
  product: Product;
}

export interface AddCartInput {
  productId: string;
  qty: number;
  color: string;
  size: string;
}

export interface CartState {
  items: CartItem[];
  count: number;
  status: RequestStatus;
  checkoutStatus: RequestStatus;
  error: string | null;
  load: () => Promise<void>;
  loadCount: () => Promise<void>;
  add: (input: AddCartInput) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  checkout: () => Promise<void>;
}
