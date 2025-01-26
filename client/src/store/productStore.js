import create from 'zustand';
import axios from 'axios';


const ProductStore = create((set) => ({
    BrandList: null,
    BrandListRequest: async () => {
        let res = await axios.get('api/ProductBrandList');
        if(res.status === 'success') {
            set({BrandList: res.data['data']});
        }
    },


    CategoryList: null,
    CategoryListRequest: async () => {
        let res = await axios.get('api/ProductCategoryList');
        if(res.status === 'success') {
            set({CategoryList: res.data['data']});
        }
    },


    SliderList: null,
    SliderListRequest: async () => {
        let res = await axios.get('api/ProductSliderList');
        if(res.status === 'success') {
            set({SliderList: res.data['data']});
        }
    },


    ProductListByProduct: null,
    ProductListByProductRequest: async () => {
        let res = await axios.get(`api/ProductListByRemark/${remarks}`);
        if(res.status === 'success') {
            set({ProductListByProduct: res.data['data']});
        }
    }
}))


export default ProductStore;