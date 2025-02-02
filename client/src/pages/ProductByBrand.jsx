import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Layout from '../components/layout/Layout';
import ProductStore from '../store/productStore';
import ProductList from '../components/product/ProductList';

const ProductByBrand = () => {

    const {brandId} = useParams();
    const { ProductListByBrand } = ProductStore();

    useEffect(() => {
        (async () => {
            await ProductListByBrand(brandId);
        })()
    }, []);


    return (
        <Layout>
            <ProductList/>
        </Layout>
    );
};

export default ProductByBrand;