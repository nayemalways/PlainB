import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Layout from '../components/layout/Layout';
import Brand from '../components/product/Brand';
import ProductStore from '../store/productStore';
import Details from '../components/product/Details';



const ProductDetails = () => {
    const { detailsRequest, reviewListRequest, BrandListRequest, BrandList } = ProductStore();
    const { id } = useParams();

    useEffect(() => {

        (async () => {
            await detailsRequest(id);
            await reviewListRequest(id);
            BrandList === null ?  await BrandListRequest() : null;
        })()

    }, [id])
    return (
        <Layout>
            <Details />
            <Brand />
        </Layout>
    );
};

export default ProductDetails;