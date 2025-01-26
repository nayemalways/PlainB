import React from 'react';
import Layout from '../components/layout/Layout';
import SliderSkeleton from '../skeleton/SliderSkeleton';
import HeroSlider from '../components/product/HeroSlider';
import FeturesSkeleton from '../skeleton/FeturesSkeleton';
import CategorySkeleton from '../skeleton/CategorySkeleton';
import ProductsSkeleton from '../skeleton/ProductsSkeleton';

const Home = () => {
    return (
        <Layout>              
              {/* <SliderSkeleton/> */}
              <HeroSlider/>
              <FeturesSkeleton/>
              <CategorySkeleton/>
              <ProductsSkeleton/>
        </Layout>
    );
};

export default Home;