import React, { useEffect } from 'react';
import Layout from '../../components/layout/Layout.tsx';
import FeaturesStore from '../../store/feautresStore.ts';

const Refund = () => {
    const { LegalRequest } = FeaturesStore();

    // Api Call
    useEffect(() => {

        (async () => {
            await LegalRequest('refund');
        })()

    }, [])
    return (
        <Layout>
            
        </Layout>
    );
};

export default Refund;