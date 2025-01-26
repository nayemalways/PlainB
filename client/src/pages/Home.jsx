import React from 'react';
import Layout from '../components/layout/Layout';
import SliderSkeleton from '../skeleton/SliderSkeleton';
import HeroSlider from '../components/product/HeroSlider';

const Home = () => {
    return (
        <Layout>              
              {/* <SliderSkeleton/> */}
              <HeroSlider/>
        </Layout>
    );
};

export default Home;