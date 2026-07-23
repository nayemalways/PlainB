import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Layout from '../../components/layout/Layout.tsx';
import ProductStore from '../../store/productStore.ts';
import ProductList from '../../components/product/ProductList.tsx';

const ProductByCategory = () => {
  const { id } = useParams();
  const { ProductListByCategory } = ProductStore();

  useEffect(() => {
    (async () => {
      await ProductListByCategory(id);
    })();
  }, [id, ProductListByCategory]);

  return (
    <Layout>
      <ProductList />
    </Layout>
  );
};

export default ProductByCategory;
