import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Layout from '../components/layout/Layout';
import ProductStore from '../store/productStore';
import ProductList from '../components/product/ProductList';



const ProductByCategory = () => {
    const {id} = useParams();
    const { ProductListByCategory } = ProductStore();

    useEffect(() => {
        (async () => {
            await ProductListByCategory(id);
        })()
    }, []);


    return (
        <Layout>
            <ProductList/>
        </Layout>
    );
};

export default ProductByCategory;