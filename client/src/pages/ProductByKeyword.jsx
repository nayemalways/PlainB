import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ProductStore from '../store/productStore';
import ProductList from '../components/product/ProductList';
import Layout from '../components/layout/Layout';



const ProductByKeyword = () => {
    const {keyword} = useParams();
    const { ProductListByKeyword } = ProductStore();

    useEffect(() => {
        (async () => {
            await ProductListByKeyword(keyword);
        })()
    }, [keyword]);


    return (
        <Layout>
            <ProductList/>
        </Layout>
    );
};

export default ProductByKeyword;