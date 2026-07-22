/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import axios from 'axios';
import { BaseServerV2Url } from '../utility/utility.ts';

interface ProductState {
  isBrandLoading: boolean;
  isCategoryLoading: boolean;
  isSliderLoading: boolean;
  isProductLoading: boolean;
  BrandList: any[] | null;
  BrandListRequest: () => Promise<void>;
  CategoryList: any[] | null;
  CategoryListRequest: () => Promise<void>;
  SliderList: any[] | null;
  SliderListRequest: () => Promise<void>;
  ProductList: any[] | null;
  ProductListByRemark: (remarks: string) => Promise<void>;
  ProductListByBrand: (brandId: string) => Promise<void>;
  ProductListByCategory: (categoryId: string) => Promise<void>;
  ProductListByKeyword: (keyword: string) => Promise<void>;
  ProductFilter: (postBody: Record<string, unknown>) => Promise<void>;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  productDetails: any;
  detailsRequest: (id: string) => Promise<void>;
  reviewList: any[] | null;
  reviewListRequest: (id: string) => Promise<void>;
}

const ProductStore = create<ProductState>()((set) => ({
  BrandList: [],
  isBrandLoading: false,
  isCategoryLoading: false,
  isSliderLoading: false,
  isProductLoading: false,
  BrandListRequest: async () => {
    set({ isBrandLoading: true });

    try {
      const res = await axios.get(`${BaseServerV2Url}/brand`);
      if (res.data.success) {
        set({ BrandList: res.data.data });
      }
    } catch (error) {
      set({ BrandList: [] });
      console.error('Error fetching BrandList:', error);
    } finally {
      set({ isBrandLoading: false });
    }
  },

  CategoryList: null,
  CategoryListRequest: async () => {
    set({ isCategoryLoading: true });

    try {
      const res = await axios.get(`${BaseServerV2Url}/ProductCategoryList`);
      const result = res.data.success ? res.data.data : res.data;
      if (result.status === 'Success') {
        set({ CategoryList: result.data });
      } else {
        set({ CategoryList: [] });
      }
    } catch (error) {
      set({ CategoryList: [] });
      console.error('Error fetching CategoryList:', error);
    } finally {
      set({ isCategoryLoading: false });
    }
  },

  SliderList: null,
  SliderListRequest: async () => {
    set({ isSliderLoading: true });

    try {
      const res = await axios.get(`${BaseServerV2Url}/ProductSliderList`);
      const result = res.data.success ? res.data.data : res.data;
      if (result.status === 'Success') {
        set({ SliderList: result.data });
      } else {
        set({ SliderList: [] });
      }
    } catch (error) {
      set({ SliderList: [] });
      console.error('Error fetching SliderList:', error);
    } finally {
      set({ isSliderLoading: false });
    }
  },

  ProductList: null,
  ProductListByRemark: async (remarks) => {
    set({ isProductLoading: true });

    try {
      const res = await axios.get(`${BaseServerV2Url}/ProductListByRemark/${remarks}`);
      const result = res.data.success ? res.data.data : res.data;
      if (result.status === 'Success') {
        set({ ProductList: result.data });
      } else {
        set({ ProductList: [] });
      }
    } catch (error) {
      set({ ProductList: [] });
      console.error('Error fetching ProductListByRemark:', error);
    } finally {
      set({ isProductLoading: false });
    }
  },

  ProductListByBrand: async (brandId) => {
    try {
      set({ ProductList: null });
      const res = await axios.get(`${BaseServerV2Url}/ProductListByBrand/${brandId}`);
      if (res?.data?.status === 'Success') {
        set({ ProductList: res.data.data });
      }
    } catch (error) {
      console.error('Error fetching ProductListByBrand:', error);
    }
  },

  ProductListByCategory: async (categoryId) => {
    try {
      set({ ProductList: null });
      const res = await axios.get(`${BaseServerV2Url}/ProductListByCategory/${categoryId}`);
      if (res?.data?.status === 'Success') {
        set({ ProductList: res.data.data });
      }
    } catch (error) {
      console.error('Error fetching ProductListByCategory:', error);
    }
  },

  ProductListByKeyword: async (keyword) => {
    try {
      set({ ProductList: null });
      const res = await axios.get(`${BaseServerV2Url}/ProductListByKeyword/${keyword}`);
      if (res?.data?.status === 'Success') {
        set({ ProductList: res.data.data });
      }
    } catch (error) {
      console.error('Error fetching ProductListByKeyword:', error);
    }
  },

  ProductFilter: async (postBody) => {
    try {
      set({ ProductList: null });
      const res = await axios.post(`${BaseServerV2Url}/ProductFilter`, postBody);
      if (res?.data?.status === 'Success') {
        set({ ProductList: res.data.data });
      }
    } catch (error) {
      console.error('Error filtering products:', error);
    }
  },

  searchKeyword: '',
  setSearchKeyword: (keyword) => {
    set({ searchKeyword: keyword });
  },

  productDetails: null,
  detailsRequest: async (id) => {
    try {
      set({ productDetails: null });
      const res = await axios.get(`${BaseServerV2Url}/ProductDetails/${id}`);
      if (res?.data?.status === 'Success') {
        set({ productDetails: res.data.data });
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  },

  reviewList: null,
  reviewListRequest: async (id) => {
    try {
      set({ reviewList: null });
      const res = await axios.get(`${BaseServerV2Url}/ProductReviewsList/${id}`);
      if (res?.data?.status === 'Success') {
        set({ reviewList: res.data.data });
      }
    } catch (error) {
      console.error('Error fetching review list:', error);
    }
  },
}));

export default ProductStore;
