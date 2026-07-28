import { create } from 'zustand';
import { getErrorMessage } from '../../lib/utils/format.ts';
import { adminApi } from './admin.api.ts';
import { demoPayments, demoSettings, demoUsers } from './demo-data.ts';
import type { AdminState } from './types.ts';

let loadPromise: Promise<void> | null = null;
export const useAdminStore = create<AdminState>((set, get) => ({
  products: [],
  brands: [],
  categories: [],
  inventory: [],
  payments: demoPayments,
  users: demoUsers,
  settings: demoSettings,
  meta: { page: 1, limit: 48, totalItems: 0, totalPages: 1 },
  status: 'idle',
  error: null,
  loaded: false,
  load: async () => {
    if (get().loaded) return;
    if (loadPromise) return loadPromise;
    set({ status: 'loading', error: null });
    loadPromise = adminApi
      .catalog()
      .then(({ page, brands, categories }) => {
        set({
          products: page.items,
          brands,
          categories,
          meta: page.meta,
          inventory: page.items.map((product, index) => ({
            productId: product._id,
            quantity: product.stock ? 4 + ((index * 7) % 38) : 0,
            available: product.stock,
          })),
          status: 'success',
          loaded: true,
        });
      })
      .catch((error) => set({ status: 'error', error: getErrorMessage(error) }))
      .finally(() => {
        loadPromise = null;
      });
    return loadPromise;
  },
  createProduct: async (input) => {
    set({ status: 'loading', error: null });
    try {
      const product = await adminApi.createProduct(input);
      set((state) => ({
        products: [product, ...state.products],
        inventory: [
          { productId: product._id, quantity: product.stock ? 12 : 0, available: product.stock },
          ...state.inventory,
        ],
        meta: { ...state.meta, totalItems: state.meta.totalItems + 1 },
        status: 'success',
      }));
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error) });
      throw error;
    }
  },
  createBrand: async (name, file) => {
    const brand = await adminApi.createBrand(name, file);
    set((state) => ({ brands: [brand, ...state.brands] }));
  },
  createCategory: async (name, file) => {
    const category = await adminApi.createCategory(name, file);
    set((state) => ({ categories: [category, ...state.categories] }));
  },
  removeDemoProduct: (id) =>
    set((state) => ({
      products: state.products.filter((item) => item._id !== id),
      inventory: state.inventory.filter((item) => item.productId !== id),
    })),
  updateInventory: (id, quantity, available) =>
    set((state) => ({
      inventory: state.inventory.map((item) =>
        item.productId === id ? { ...item, quantity, available } : item,
      ),
    })),
  updateSettings: (settings) => set((state) => ({ settings: { ...state.settings, ...settings } })),
}));
