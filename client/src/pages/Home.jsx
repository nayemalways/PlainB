import React from 'react';
import Layout from '../components/layout/Layout';
import SliderSkeleton from '../skeleton/SliderSkeleton';
import HeroSlider from '../components/product/HeroSlider';
import FeturesSkeleton from '../skeleton/FeturesSkeleton';

const Home = () => {
    return (
        <Layout>              
              {/* <SliderSkeleton/> */}
              <HeroSlider/>
              <FeturesSkeleton/>
        </Layout>
    );
};

export default Home;