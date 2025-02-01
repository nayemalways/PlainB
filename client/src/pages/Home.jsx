import React, { useEffect } from 'react';

import Layout from '../components/layout/Layout';
import HeroSlider from '../components/product/HeroSlider';
import ProductStore  from './../store/productStore';
import FeaturesStore from '../store/feautresStore';
 

const Home = () => {

    let {BrandListRequest, CategoryListRequest, SliderListRequest, ProductListByRemark} = ProductStore();
    let {FeaturesListRequest} = FeaturesStore();


    useEffect( () => {

        (async () => {
            await SliderListRequest();
            await FeaturesListRequest();
            await CategoryListRequest();
            await ProductListByRemark("new");
        })()

    }, [])
    

    return (
        <Layout>              
              <HeroSlider/>
               
        </Layout>
    );
};

export default Home;