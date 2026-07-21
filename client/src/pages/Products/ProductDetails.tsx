import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Layout from '../../components/layout/Layout.tsx';
import Brand from '../../components/product/Brand.tsx';
import ProductStore from '../../store/productStore.ts';
import Details from '../../components/product/Details.tsx';

const ProductDetails = () => {
  const { detailsRequest, reviewListRequest, BrandListRequest, BrandList } = ProductStore();
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      await detailsRequest(id);
      await reviewListRequest(id);
      if (BrandList === null) await BrandListRequest();
    })();
  }, [id]);
  return (
    <Layout>
      <Details />
      <Brand />
    </Layout>
  );
};

export default ProductDetails;
