import React, { useEffect } from 'react';
import Layout from '../../components/layout/Layout.tsx';
import FeaturesStore from '../../store/feautresStore.ts';
import LegalContents from '../../components/features/LegalContents.tsx';

const Privacy = () => {
  const { LegalRequest } = FeaturesStore();

  // Api Call
  useEffect(() => {
    (async () => {
      await LegalRequest('privacy');
    })();
  }, []);
  return (
    <Layout>
      <LegalContents />
    </Layout>
  );
};

export default Privacy;
