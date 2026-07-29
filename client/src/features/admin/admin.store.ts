import { create } from 'zustand';
import { getErrorMessage } from '../../lib/utils/format.ts';
import { adminApi } from './admin.api.ts';
import { demoPayments, demoSettings } from './demo-data.ts';
import type { AdminState } from './types.ts';
import { api } from '@/lib/api/client.ts';

const dashboardOverview = {
  totalProducts: 0,
  payment: {
    _id: null,
    totalRevenue: 0,
    totalPaidTransactions: 0,
  },
  totalUser: 0,
};

const defaultTransactionData = {
  items: [],
  meta: { page: 1, limit: 40, totalItems: 0, totalPages: 1 },
};

export const useAdminStore = create<AdminState>((set, _get) => ({
  products: [],
  brands: [],
  categories: [],
  inventory: [],
  transactions: defaultTransactionData,
  payments: demoPayments,
  dashboardOverview: dashboardOverview,
  revenueSeries: [],
  settings: demoSettings,
  meta: { page: 1, limit: 48, totalItems: 0, totalPages: 1 },
  status: 'idle',
  error: null,
  loaded: false,

  dashboardAnalytics: async () => {
    set({ status: 'loading', error: null });
    try {
      const { data } = await api.get('/dashboard');
      set({ dashboardOverview: data?.data });
    } catch (error) {
      set({ dashboardOverview: dashboardOverview, status: 'error', error: getErrorMessage(error) });
    }
  },

  revenueTrends: async () => {
    set({ status: 'loading', error: null });
    try {
      const { data } = await api.get('/dashboard/revenue-trends');
      set({ revenueSeries: data?.data });
    } catch (error) {
      set({ revenueSeries: [], status: 'error', error: getErrorMessage(error) });
    }
  },

  transactionsHistory: async (page = 1, limit = 10, status = 'all') => {
    set({ status: 'loading', error: null });
    try {
      const queryString = new URLSearchParams({
        status,
        limit: String(limit),
        page: String(page),
      }).toString();
      const { data } = await api.get(`/dashboard/transactions?${queryString}`);
      set({ transactions: data?.data, status: 'success' });
    } catch (error) {
      set({ transactions: defaultTransactionData, status: 'error', error: getErrorMessage(error) });
    }
  },

  loadCatalog: async () => {
    const { page, brands, categories } = await adminApi.catalog();

    set({
      products: page.items,
      inventory: page.items.map((product) => ({
        productId: product._id,
        quantity: product.stock ? 12 : 0,
        available: product.stock,
      })),
      meta: page.meta,
      brands,
      categories,
      loaded: true,
    });
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
