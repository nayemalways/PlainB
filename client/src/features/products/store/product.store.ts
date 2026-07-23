import { create } from 'zustand';
import { getErrorMessage } from '../../../lib/utils/format.ts';
import type { ProductQuery, ProductState } from '../types/product.types.ts';
import { productsApi } from '../api/products.api.ts';

const initialMeta = { page: 1, limit: 12, totalItems: 0, totalPages: 1 };
let searchController: AbortController | undefined;

export const useProductStore = create<ProductState>((set) => {
  const loadPage = async (request: () => ReturnType<typeof productsApi.byRemark>) => {
    set({ status: 'loading', error: null });
    try {
      const { items, meta } = await request();
      set({ products: items, meta, status: 'success' });
    } catch (error) {
      set({ products: [], status: 'error', error: getErrorMessage(error) });
    }
  };

  return {
    products: [],
    product: null,
    brands: [],
    categories: [],
    sliders: [],
    meta: initialMeta,
    status: 'idle',
    detailStatus: 'idle',
    error: null,
    activeRemark: 'new',

    loadHome: async () => {
      set({ status: 'loading', error: null });
      try {
        const [brands, categories, sliders, page] = await Promise.all([
          productsApi.brands(),
          productsApi.categories(),
          productsApi.sliders(),
          productsApi.byRemark('new'),
        ]);
        set({
          brands,
          categories,
          sliders,
          products: page.items,
          meta: page.meta,
          status: 'success',
        });
      } catch (error) {
        set({ status: 'error', error: getErrorMessage(error) });
      }
    },

    loadByRemark: async (remark, query) => {
      set({ activeRemark: remark });
      await loadPage(() => productsApi.byRemark(remark, query));
    },
    loadByBrand: async (id, query) => loadPage(() => productsApi.byBrand(id, query)),
    loadByCategory: async (id, query) => loadPage(() => productsApi.byCategory(id, query)),
    search: async (keyword, query: ProductQuery = {}) => {
      searchController?.abort();
      searchController = new AbortController();
      set({ status: 'loading', error: null });
      try {
        const page = await productsApi.search(keyword, query, searchController.signal);
        set({ products: page.items, meta: page.meta, status: 'success' });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        set({ products: [], status: 'error', error: getErrorMessage(error) });
      }
    },
    loadProduct: async (id) => {
      set({ product: null, detailStatus: 'loading', error: null });
      try {
        set({ product: await productsApi.details(id), detailStatus: 'success' });
      } catch (error) {
        set({ detailStatus: 'error', error: getErrorMessage(error) });
      }
    },
  };
});
