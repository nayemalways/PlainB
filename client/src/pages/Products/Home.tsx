import { useEffect } from 'react';

import Layout from '../../components/layout/Layout.tsx';
import HeroSlider from '../../components/product/HeroSlider.tsx';
import ProductStore from '../../store/productStore.ts';
import FeaturesStore from '../../store/featuresStore.ts';
import Brand from '../../components/product/Brand.tsx';
import Categories from '../../components/product/Categories.tsx';
import Features from '../../components/product/Features.tsx';
import Products from '../../components/product/Products.tsx';

const Home = () => {
  const { BrandListRequest, CategoryListRequest, SliderListRequest, ProductListByRemark } =
    ProductStore();
  const { FeaturesListRequest } = FeaturesStore();

  useEffect(() => {
    (async () => {
      await SliderListRequest();
      await BrandListRequest();
      await FeaturesListRequest();
      await CategoryListRequest();
      await ProductListByRemark('new');
    })();
  }, [
    BrandListRequest,
    CategoryListRequest,
    FeaturesListRequest,
    ProductListByRemark,
    SliderListRequest,
  ]);

  return (
    <Layout>
      <HeroSlider />
      <Products />
      <Categories />
      <Features />
      <Brand />
    </Layout>
  );
};

export default Home;
