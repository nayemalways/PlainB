import { create } from 'zustand';
import { api } from '../../../lib/api/client.ts';
import { getErrorMessage } from '../../../lib/utils/format.ts';
import type { ApiResponse, RequestStatus } from '../../../types/api.ts';
import type { Product } from '../../products/types/product.types.ts';

export interface WishlistItem { _id: string; productId: string; products: Product }
interface WishlistState {
  items: WishlistItem[];
  count: number;
  status: RequestStatus;
  error: string | null;
  load: () => Promise<void>;
  loadCount: () => Promise<void>;
  add: (productId: string) => Promise<void>;
  remove: (productId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  count: 0,
  status: 'idle',
  error: null,
  load: async () => {
    set({ status: 'loading', error: null });
    try {
      const { data } = await api.get<ApiResponse<WishlistItem[]>>('/wishlist');
      set({ items: data.data, count: data.data.length, status: 'success' });
    } catch (error) {
      set({ items: [], status: 'error', error: getErrorMessage(error) });
    }
  },
  loadCount: async () => {
    try {
      const { data } = await api.get<ApiResponse<number>>('/wishlist/total');
      set({ count: data.data });
    } catch {
      set({ count: 0 });
    }
  },
  add: async (productId) => {
    await api.post('/wishlist', { productId });
    await get().loadCount();
  },
  remove: async (productId) => {
    await api.delete(`/wishlist/${productId}`);
    await get().load();
  },
}));
