import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Layout from '../../components/layout/Layout.tsx';
import Brand from '../../components/product/Brand.tsx';
import ProductStore from '../../store/productStore.ts';
import ReviewStore from '../../store/reviewStore.ts';
import Details from '../../components/product/Details.tsx';

const ProductDetails = () => {
  const { detailsRequest, BrandListRequest, BrandList } = ProductStore();
  const { reviewListRequest } = ReviewStore();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    (async () => {
      await detailsRequest(id);
      await reviewListRequest(id);
      if (BrandList === null) await BrandListRequest();
    })();
  }, [BrandList, BrandListRequest, detailsRequest, id, reviewListRequest]);
  return (
    <Layout>
      <Details />
      <Brand />
    </Layout>
  );
};

export default ProductDetails;
