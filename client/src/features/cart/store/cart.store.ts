import { create } from 'zustand';
import { api } from '../../../lib/api/client.ts';
import { getErrorMessage } from '../../../lib/utils/format.ts';
import type { ApiResponse } from '../../../types/api.ts';
import type { AddCartInput, CartItem, CartState } from '../types/cart.types.ts';

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  count: 0,
  status: 'idle',
  checkoutStatus: 'idle',
  error: null,
  load: async () => {
    set({ status: 'loading', error: null });
    try {
      const { data } = await api.get<ApiResponse<CartItem[]>>('/cart');
      set({ items: data.data, count: data.data.length, status: 'success' });
    } catch (error) {
      set({ items: [], status: 'error', error: getErrorMessage(error) });
    }
  },
  loadCount: async () => {
    try {
      const { data } = await api.get<ApiResponse<number>>('/cart/total');
      set({ count: data.data });
    } catch {
      set({ count: 0 });
    }
  },
  add: async (input: AddCartInput) => {
    await api.post('/cart', input);
    await get().loadCount();
  },
  remove: async (productId) => {
    await api.delete(`/cart/${productId}`);
    await get().load();
  },
  checkout: async () => {
    set({ checkoutStatus: 'loading', error: null });
    try {
      const { data } = await api.post<ApiResponse<{ checkoutUrl: string }>>('/payment/checkout');
      window.location.assign(data.data.checkoutUrl);
    } catch (error) {
      set({ checkoutStatus: 'error', error: getErrorMessage(error, 'Checkout could not start.') });
    }
  },
}));
