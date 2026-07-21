import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Layout from '../../components/layout/Layout.tsx';
import ProductStore from '../../store/productStore.ts';
import ProductList from '../../components/product/ProductList.tsx';

const ProductByBrand = () => {
  const { brandId } = useParams();
  const { ProductListByBrand } = ProductStore();

  useEffect(() => {
    (async () => {
      await ProductListByBrand(brandId);
    })();
  }, [brandId]);

  return (
    <Layout>
      <ProductList />
    </Layout>
  );
};

export default ProductByBrand;
