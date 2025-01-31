 import { create } from 'zustand';
import axios from 'axios';
import API from '../utility/instance.js';


const ProductStore = create((set) => ({
    BrandList: null,
    BrandListRequest: async () => {
        let res = await API.get('/ProductBrandList');
        if(res.status === 'success') {
            set({BrandList: res.data['data']});
        }
    },


    CategoryList: null,
    CategoryListRequest: async () => {
        let res = await API.get('/ProductCategoryList');
        if(res.status === 'success') {
            set({CategoryList: res.data['data']});
        }
    },


    SliderList: null,
    SliderListRequest: async () => {
        let res = await API.get('/ProductSliderList');
        if(res.status === 'success') {
            set({SliderList: res.data['data']});
        }
    },


    ProductListByProduct: null,
    ProductListByRemark: async (remarks) => {
        let res = await API.get(`/ProductListByRemark/${remarks}`);
        if(res.status === 'success') {
            set({ProductListByProduct: res.data['data']});
        }
    }
}))


export default ProductStore