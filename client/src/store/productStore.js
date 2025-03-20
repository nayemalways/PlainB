import { create } from 'zustand';
import axios from 'axios';
import ProductList from '../components/product/ProductList';

const ProductStore = create((set) => ({
    BrandList: null,
    BrandListRequest: async () => {
        let res = await axios.get('/api/ProductBrandList');
        if(res?.data?.status === 'Success') {
            set({BrandList: res?.data['data']});
        }
    },


    CategoryList: null,
    CategoryListRequest: async () => {
        let res = await axios.get('/api/ProductCategoryList');
        if(res?.data?.status === 'Success') {
            set({CategoryList: res?.data['data']});
        }
    },


    SliderList: null,
    SliderListRequest: async () => {
        set({SliderList: null});
        let res = await axios.get('/api/ProductSliderList');
        if(res?.data?.status === 'Success') {
            set({SliderList: res?.data['data']});
        }
    },


    ProductList: null,
    ProductListByRemark: async (remarks) => {
        set({ProductList: null });
        let res = await axios.get(`/api/ProductListByRemark/${remarks}`);
        if(res?.data?.status === 'Success') {
            set({ProductList: res?.data['data']});
        }
    },


   
    ProductListByBrand: async (brandId) => {
        set({ProductList: null });
        let res = await axios.get(`/api/ProductListByBrand/${brandId}`);
        if(res?.data?.status === 'Success') {
            set({ProductList: res?.data['data']});
        }
    },



 
    ProductListByCategory: async (categoryId) => {
        set({ProductList: null });
        let res = await axios.get(`/api/ProductListByCategory/${categoryId}`);
        if(res?.data?.status === 'Success') {
            set({ProductList: res?.data['data']});
        }
    },



 
    ProductListByKeyword: async (keyword) => {
        set({ProductList: null });
        let res = await axios.get(`/api/ProductListByKeyword/${keyword}`);
        if(res?.data?.status === 'Success') {
            set({ProductList: res?.data['data']});
        }
    },

    ProductFilter: async (postBody) => {
        set({ProductList: null});
        let res = await axios.post("/api/ProductFilter", postBody);
        console.log(res);
        if(res?.data?.status === 'Success') {
            set({ProductList: res?.data['data']});
        }
    },

    searchKeyword: "",
    setSearchKeyword: async (keyword) => {
        set({searchKeyword: keyword});
    },


    productDetails: null,
    detailsRequest: async (id) => {
        set({productDetails: null});
        let res = await axios.get(`/api/ProductDetails/${id}`);
        if(res?.data?.status === 'Success') {
            set({productDetails: res?.data['data']});
        }},


    reviewList: null,
    reviewListRequest: async (id) => {
        set({productDetails: null});
        let res = await axios.get(`/api/ProductReviewsList/${id}`);
        if(res?.data?.status === 'Success') {
            set({productDetails: res?.data['data']});
        }}
}))


export default ProductStore