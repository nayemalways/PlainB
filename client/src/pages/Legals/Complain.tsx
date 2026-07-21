import React, { useEffect } from 'react';
import LegalContents from '../../components/features/LegalContents.tsx';
import FeaturesStore from '../../store/feautresStore.ts';
import Layout from '../../components/layout/Layout.tsx';

const Complain = () => {
  const { LegalRequest } = FeaturesStore();

  // Api Call
  useEffect(() => {
    (async () => {
      await LegalRequest('complain');
    })();
  }, []);

  return (
    <Layout>
      <LegalContents />
    </Layout>
  );
};

export default Complain;
