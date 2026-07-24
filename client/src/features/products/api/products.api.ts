import { api } from '../../../lib/api/client.ts';
import type { ApiResponse, PaginatedResponse, PaginationMeta } from '../../../types/api.ts';
import type { Brand, Category, Product, ProductQuery, ProductSlider } from '../types/product.types.ts';

const defaultMeta: PaginationMeta = { page: 1, limit: 12, totalItems: 0, totalPages: 1 };

const queryParams = (query: ProductQuery = {}) => ({
  page: query.page ?? 1,
  limit: query.limit ?? 12,
  sort: query.sort ?? 'newest',
  priceMin: query.priceMin,
  priceMax: query.priceMax,
});

const normalizePage = (data: Product[] | PaginatedResponse<Product>) =>
  Array.isArray(data)
    ? { items: data, meta: { ...defaultMeta, totalItems: data.length } }
    : data;

export const productsApi = {
  brands: async () => (await api.get<ApiResponse<Brand[]>>('/brand')).data.data,
  categories: async () => (await api.get<ApiResponse<Category[]>>('/category')).data.data,
  sliders: async () => (await api.get<ApiResponse<ProductSlider[]>>('/product/slider')).data.data,
  byRemark: async (remark: string, query?: ProductQuery) => {
    const response = await api.get<ApiResponse<Product[] | PaginatedResponse<Product>>>(
      `/product/remark/${encodeURIComponent(remark)}`,
      { params: queryParams(query) },
    );
    return normalizePage(response.data.data);
  },
  byBrand: async (id: string, query?: ProductQuery) => {
    const response = await api.get<ApiResponse<Product[] | PaginatedResponse<Product>>>(
      `/product/brand/${id}`,
      { params: queryParams(query) },
    );
    return normalizePage(response.data.data);
  },
  byCategory: async (id: string, query?: ProductQuery) => {
    const response = await api.get<ApiResponse<Product[] | PaginatedResponse<Product>>>(
      `/product/category/${id}`,
      { params: queryParams(query) },
    );
    return normalizePage(response.data.data);
  },
  search: async (keyword: string, query?: ProductQuery, signal?: AbortSignal) => {
    const response = await api.get<ApiResponse<Product[] | PaginatedResponse<Product>>>(
      `/product/search/${encodeURIComponent(keyword)}`,
      { params: queryParams(query), signal },
    );
    return normalizePage(response.data.data);
  },
  details: async (id: string) =>
    (await api.get<ApiResponse<Product>>(`/product/details/${id}`)).data.data,
};
