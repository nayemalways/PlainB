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
            set({ProductListByProduct: res?.data['data']});
        }
    }
}))

async function api() {
    const res = await axios.get("http://localhost:5000/api/ProductListByRemark/new");
    console.log(res.data.status);
}
api()

export default ProductStore