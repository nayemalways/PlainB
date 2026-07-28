import { api } from '../../lib/api/client.ts';
import type { ApiResponse, PaginatedResponse } from '../../types/api.ts';
import type { Brand, Category, Product } from '../products/types/product.types.ts';
import type { ProductInput } from './types.ts';

export const adminApi = {
  catalog: async () => {
    const [products, brands, categories] = await Promise.all([
      api.post<ApiResponse<PaginatedResponse<Product>>>('/product/filter?page=1&limit=48', {}),
      api.get<ApiResponse<Brand[]>>('/brand'),
      api.get<ApiResponse<Category[]>>('/category'),
    ]);
    return { page: products.data.data, brands: brands.data.data, categories: categories.data.data };
  },
  createProduct: async (input: ProductInput) => {
    const body = new FormData();
    Object.entries(input).forEach(([key, value]) => {
      if (key === 'images') input.images.forEach((file) => body.append('images', file));
      else body.set(key, String(value));
    });
    return (await api.post<ApiResponse<Product>>('/product', body)).data.data;
  },
  createBrand: async (brandName: string, file: File) => {
    const body = new FormData();
    body.set('data', JSON.stringify({ brandName }));
    body.set('file', file);
    return (await api.post<ApiResponse<Brand>>('/brand', body)).data.data;
  },
  createCategory: async (categoryName: string, file: File) => {
    const body = new FormData();
    body.set('data', JSON.stringify({ categoryName }));
    body.set('file', file);
    return (await api.post<ApiResponse<Category>>('/category', body)).data.data;
  },
};
