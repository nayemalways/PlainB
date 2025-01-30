import React, { useEffect } from 'react';

import Layout from '../components/layout/Layout';
import SliderSkeleton from '../skeleton/SliderSkeleton';
import HeroSlider from '../components/product/HeroSlider';
import FeturesSkeleton from '../skeleton/FeturesSkeleton';
import CategorySkeleton from '../skeleton/CategorySkeleton';
import ProductsSkeleton from '../skeleton/ProductsSkeleton';
import BrandsSkeleton from '../skeleton/BrandsSkeleton';
import ProductStore from '../store/productStore';

const Home = () => {

    const {BrandListRequest, CategoryListRequest, SliderListRequest, ProductListByProductRequest} = ProductStore();
    const {FeaturesListRequest} = FeaturesStore();


    useEffect( () => {

        (async () => {
            
        })()

    })


    return (
        <Layout>              
              <HeroSlider/>
               
        </Layout>
    );
};

export default Home;