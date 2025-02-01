import React, { useEffect } from 'react';

import Layout from '../components/layout/Layout';
import HeroSlider from '../components/product/HeroSlider';
import ProductStore  from './../store/productStore';
import FeaturesStore from '../store/feautresStore';
import Brand from '../components/product/Brand';
import Categories from './../components/product/Categories';
import Features from './../components/product/Features';
import Products from '../components/product/Products';
 

const Home = () => {

    let {BrandListRequest, CategoryListRequest, SliderListRequest, ProductListByRemark} = ProductStore();
    let {FeaturesListRequest} = FeaturesStore();


    useEffect( () => {

        (async () => {
            await SliderListRequest();
            await BrandListRequest()
            await FeaturesListRequest();
            await CategoryListRequest();
            await ProductListByRemark("new");
        })()

    }, [])
    

    return (
        <Layout>              
            <HeroSlider/>
            <Categories/>
            <Features/>
            <Products/>
            <Brand/>
        </Layout>
    );
};

export default Home;