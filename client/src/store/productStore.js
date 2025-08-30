import { create } from 'zustand';
import axios from 'axios';

const ProductStore = create((set) => ({
    BrandList: null,
    BrandListRequest: async () => {
        try {
            const res = await axios.get('/api/ProductBrandList');
            if (res?.data?.status === 'Success') {
                set(state => ({ BrandList: res.data.data }));
            }
        } catch (error) {
            console.error('Error fetching BrandList:', error);
        }
    },

    CategoryList: null,
    CategoryListRequest: async () => {
        try {
            const res = await axios.get('/api/ProductCategoryList');
            if (res?.data?.status === 'Success') {
                set(state => ({ CategoryList: res.data.data }));
            }
        } catch (error) {
            console.error('Error fetching CategoryList:', error);
        }
    },

    SliderList: null,
    SliderListRequest: async () => {
        try {
            set(state => ({ SliderList: null }));  // Reset before fetching
            const res = await axios.get('https://plainb.onrender.com/api/ProductSliderList');
            if (res?.data?.status === 'Success') {
                set(state => ({ SliderList: res.data.data }));
            }
        } catch (error) {
            console.error('Error fetching SliderList:', error);
        }
    },

    ProductList: null,
    ProductListByRemark: async (remarks) => {
        try {
            set(state => ({ ProductList: null }));  // Reset before fetching
            const res = await axios.get(`/api/ProductListByRemark/${remarks}`);
            if (res?.data?.status === 'Success') {
                set(state => ({ ProductList: res.data.data }));
            }
        } catch (error) {
            console.error('Error fetching ProductListByRemark:', error);
        }
    },

    ProductListByBrand: async (brandId) => {
        try {
            set(state => ({ ProductList: null }));
            const res = await axios.get(`/api/ProductListByBrand/${brandId}`);
            if (res?.data?.status === 'Success') {
                set(state => ({ ProductList: res.data.data }));
            }
        } catch (error) {
            console.error('Error fetching ProductListByBrand:', error);
        }
    },

    ProductListByCategory: async (categoryId) => {
        try {
            set(state => ({ ProductList: null }));
            const res = await axios.get(`/api/ProductListByCategory/${categoryId}`);
            if (res?.data?.status === 'Success') {
                set(state => ({ ProductList: res.data.data }));
            }
        } catch (error) {
            console.error('Error fetching ProductListByCategory:', error);
        }
    },

    ProductListByKeyword: async (keyword) => {
        try {
            set(state => ({ ProductList: null }));
            const res = await axios.get(`/api/ProductListByKeyword/${keyword}`);
            if (res?.data?.status === 'Success') {
                set(state => ({ ProductList: res.data.data }));
            }
        } catch (error) {
            console.error('Error fetching ProductListByKeyword:', error);
        }
    },

    ProductFilter: async (postBody) => {
        try {
            set(state => ({ ProductList: null }));
            const res = await axios.post("/api/ProductFilter", postBody);
            if (res?.data?.status === 'Success') {
                set(state => ({ ProductList: res.data.data }));
            }
        } catch (error) {
            console.error('Error filtering products:', error);
        }
    },

    searchKeyword: "",
    setSearchKeyword: (keyword) => {
        set(state => ({ searchKeyword: keyword }));
    },

    productDetails: null,
    detailsRequest: async (id) => {
        try {
            set(state => ({ productDetails: null }));
            const res = await axios.get(`/api/ProductDetails/${id}`);
            if (res?.data?.status === 'Success') {
                set(state => ({ productDetails: res.data.data }));
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    },

    reviewList: null,
    reviewListRequest: async (id) => {
        try {
            set(state => ({ reviewList: null }));
            const res = await axios.get(`/api/ProductReviewsList/${id}`);
            if (res?.data?.status === 'Success') {
                set(state => ({ reviewList: res.data.data }));
            }
        } catch (error) {
            console.error('Error fetching review list:', error);
        }
    }
}));

export default ProductStore;
