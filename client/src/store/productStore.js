import { create } from 'zustand';
import axios from 'axios';

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
        let res = await axios.get('/api/ProductSliderList');
        if(res?.data?.status === 'Success') {
            set({SliderList: res?.data['data']});
        }
    },


    ProductList: null,
    ProductListByRemark: async (remarks) => {
        let res = await axios.get(`/api/ProductListByRemark/${remarks}`);
        if(res?.data?.status === 'Success') {
            set({ProductList: res?.data['data']});
        }
    }
}))


export default ProductStore