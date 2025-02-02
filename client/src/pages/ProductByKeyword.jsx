import React from 'react';
import { useParams } from 'react-router-dom';

import ProductStore from '../store/productStore';



const ProductByKeyword = () => {
    const {keyword} = useParams();
    const { ProductListByKeyword } = ProductStore();

    useEffect(() => {
        (async () => {
            await ProductListByKeyword(keyword);
        })()
    }, []);


    return (
        <Layout>
            <ProductList/>
        </Layout>
    );
};

export default ProductByKeyword;